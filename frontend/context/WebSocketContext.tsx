import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { WS_EMERGENCY_ALERTS_URL } from '../constants/Config';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX
  }),
});

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

type EmergencyData = {
  id: string;
  athlete_id: string;
  athlete_name: string;
  timestamp: string;
  location: LocationData;
  vital_signs: {
    heart_rate: number;
    heart_rhythm?: string;
    blood_pressure: string;
    oxygen_saturation: number;
    anomaly_type?: string;
    confidence?: number;
  };
  status?: string;
};

type WebSocketContextType = {
  connected: boolean;
  activeEmergency: EmergencyData | null;
  location: LocationData | null;
  sendMessage: (message: any) => void;
  respondToEmergency: (emergencyId: string, status: string, eta?: number) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  activeEmergency: null,
  location: null,
  sendMessage: () => {},
  respondToEmergency: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const pingInterval = useRef<NodeJS.Timeout>();
  
  // Request notification permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.log('Failed to get notification permissions!');
          return;
        }
      }
    })();
  }, []);
  
  // Request location permissions and start tracking
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }
        
        // Get initial location
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            accuracy: currentLocation.coords.accuracy,
          });
          
          // Subscribe to location updates
          Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, distanceInterval: 10 },
            (newLocation) => {
              setLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                accuracy: newLocation.coords.accuracy,
              });
            }
          );
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }
    })();
  }, []);
  
  // Handle emergency notifications
  const handleEmergencyNotification = async (emergency: EmergencyData) => {
    // Show notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 EMERGENCY ALERT',
        body: `Medical emergency detected for ${emergency.athlete_name}!`,
        data: { emergency },
        sound: true,
      },
      trigger: null, // Show immediately
    });
    
    // Store the active emergency
    setActiveEmergency(emergency);
    
    // Navigate to emergency screen
    if (emergency.athlete_id === user?.id) {
      // This is the athlete experiencing the emergency
      router.push('/app/emergency');
    } else if (user?.role === 'coach' || user?.role === 'medical' || user?.role === 'referee') {
      // This is staff that needs to respond
      router.push(`/app/emergency?athlete=${emergency.athlete_id}`);
    }
  };
  
  // Connect to WebSocket
  const connectWebSocket = () => {
    if (!user || !user.id || !user.role) return;
    
    try {
      const wsUrl = `${WS_EMERGENCY_ALERTS_URL}/${user.id}/${user.role}`;
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        
        // Start ping interval to keep connection alive
        pingInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
          }
        }, 30000); // Send ping every 30 seconds
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data.type);
          
          switch (data.type) {
            case 'emergency_alert':
              handleEmergencyNotification(data.data || data);
              break;
            case 'emergency_update':
              // Handle updates to an ongoing emergency
              if (activeEmergency && data.emergency_id === activeEmergency.id) {
                // Update the emergency with responder information
                setActiveEmergency(prev => prev ? { ...prev, responders: [...(prev.responders || []), data.responder] } : null);
              }
              break;
            case 'emergency_resolved':
              // Clear the emergency if it's resolved
              if (activeEmergency && data.emergency_id === activeEmergency.id) {
                setActiveEmergency(null);
                // Navigate back if on emergency screen
                if (router.pathname.includes('/emergency')) {
                  router.back();
                }
              }
              break;
            case 'pong':
              // Handle ping response
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        clearInterval(pingInterval.current);
        
        // Attempt to reconnect after a delay
        reconnectTimeout.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };
  
  // Connect WebSocket when user is authenticated
  useEffect(() => {
    if (user && user.id && user.role) {
      connectWebSocket();
    }
    
    return () => {
      // Clean up on unmount
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
      }
    };
  }, [user]);
  
  // Send a message through the WebSocket
  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };
  
  // Respond to an emergency
  const respondToEmergency = (emergencyId: string, status: string, eta?: number) => {
    if (!user) return;
    
    sendMessage({
      type: 'emergency_response',
      emergency_id: emergencyId,
      user_id: user.id,
      role: user.role,
      status,
      eta,
      timestamp: new Date().toISOString(),
    });
  };
  
  return (
    <WebSocketContext.Provider
      value={{
        connected,
        activeEmergency,
        location,
        sendMessage,
        respondToEmergency,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};