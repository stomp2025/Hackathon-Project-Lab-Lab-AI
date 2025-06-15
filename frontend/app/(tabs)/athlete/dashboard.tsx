// app/(tabs)/athlete/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../../constants/Config';
import OnboardingTutorial from '../../../components/OnboardingTutorial';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VitalSigns = {
  heart_rate: number;
  blood_pressure: string;
  body_temperature: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  timestamp: string;
};

type CPRSystem = {
  device_status: string;
  battery_level: number;
  last_checked: string;
  firmware_version: string;
};

type EmergencyContact = {
  id: number;
  name: string;
  phone: string;
  relationship: string;
};

type AthleteDashboardData = {
  vital_signs: VitalSigns;
  cpr_system: CPRSystem;
  emergency_contacts: EmergencyContact[];
};

export default function AthleteDashboardScreen() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<AthleteDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for demonstration (replace with real API call later)
      const mockData: AthleteDashboardData = {
        vital_signs: {
          heart_rate: 97,
          blood_pressure: "116/90",
          body_temperature: 37.2,
          respiratory_rate: 19,
          oxygen_saturation: 97,
          timestamp: new Date().toISOString()
        },
        cpr_system: {
          device_status: "active",
          battery_level: 83,
          last_checked: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
          firmware_version: "v2.1.3"
        },
        emergency_contacts: [
          {
            id: 1,
            name: "Team Doctor",
            phone: "555-123-4567",
            relationship: "Medical Staff"
          },
          {
            id: 2,
            name: "Head Coach",
            phone: "555-987-6543",
            relationship: "Coach"
          },
          {
            id: 3,
            name: "Emergency Contact",
            phone: "555-456-7890",
            relationship: "Family"
          }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockData);
      
      // Uncomment this when you have the real API endpoint:
      // const response = await axios.get(`${API_URL}/api/dashboard/athlete`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setDashboardData(response.data);
      
    } catch (err) {
      console.error('Error fetching athlete dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Check if user needs to see onboarding tutorial
    const checkOnboardingStatus = async () => {
      if (user?.id) {
        try {
          const onboardingCompleted = await AsyncStorage.getItem(`onboarding_completed_${user.id}`);
          if (onboardingCompleted !== 'true') {
            setShowOnboarding(true);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // If error, show onboarding to be safe
          setShowOnboarding(true);
        }
      }
    };

    checkOnboardingStatus();
    
    // Refresh data every 30 seconds for real-time monitoring
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [token, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading && !dashboardData) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="hourglass-outline" size={40} color="#9CA3AF" />
        <Text style={styles.loadingText}>Loading dashboard data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden={true} />
      {showOnboarding && (
        <OnboardingTutorial onComplete={handleOnboardingComplete} />
      )}
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={styles.content}>
        <Text style={styles.title}>Athlete Dashboard</Text>
        
        {/* Vital Signs Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={24} color="#DC2626" />
            <Text style={styles.cardTitle}>Vital Signs</Text>
          </View>
          
          <View style={styles.vitalGrid}>
            <View style={styles.vitalItem}>
              <View style={styles.vitalIcon}>
                <Ionicons name="pulse" size={20} color="#DC2626" />
              </View>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <Text style={styles.vitalValue}>{dashboardData?.vital_signs.heart_rate} bpm</Text>
            </View>
            
            <View style={styles.vitalItem}>
              <View style={styles.vitalIcon}>
                <Ionicons name="fitness" size={20} color="#DC2626" />
              </View>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{dashboardData?.vital_signs.blood_pressure}</Text>
            </View>
            
            <View style={styles.vitalItem}>
              <View style={styles.vitalIcon}>
                <Ionicons name="thermometer" size={20} color="#DC2626" />
              </View>
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>{dashboardData?.vital_signs.body_temperature}°C</Text>
            </View>
            
            <View style={styles.vitalItem}>
              <View style={styles.vitalIcon}>
                <Ionicons name="leaf" size={20} color="#DC2626" />
              </View>
              <Text style={styles.vitalLabel}>Respiratory</Text>
              <Text style={styles.vitalValue}>{dashboardData?.vital_signs.respiratory_rate}/min</Text>
            </View>
            
            <View style={styles.vitalItem}>
              <View style={styles.vitalIcon}>
                <Ionicons name="water" size={20} color="#DC2626" />
              </View>
              <Text style={styles.vitalLabel}>Oxygen Sat</Text>
              <Text style={styles.vitalValue}>{dashboardData?.vital_signs.oxygen_saturation}%</Text>
            </View>
          </View>
          
          <Text style={styles.timestamp}>
            <Ionicons name="time" size={14} color="#9CA3AF" />
            {' '}Last updated: {new Date(dashboardData?.vital_signs.timestamp || '').toLocaleString()}
          </Text>
        </View>
        
        {/* CPR System Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={styles.cardTitle}>CPR System Status</Text>
          </View>
          
          <View style={styles.systemStatus}>
            <View style={styles.statusItem}>
              <View style={styles.statusRow}>
                <Ionicons name="radio-button-on" size={16} color={dashboardData?.cpr_system.device_status === 'active' ? '#10B981' : '#F59E0B'} />
                <Text style={styles.statusLabel}>Device Status</Text>
              </View>
              <Text style={[styles.statusValue, { color: dashboardData?.cpr_system.device_status === 'active' ? '#10B981' : '#F59E0B' }]}>
                {dashboardData?.cpr_system.device_status === 'active' ? 'Active' : 'Standby'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={styles.statusRow}>
                <Ionicons name="battery-half" size={16} color="#60A5FA" />
                <Text style={styles.statusLabel}>Battery Level</Text>
              </View>
              <Text style={styles.statusValue}>{dashboardData?.cpr_system.battery_level}%</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={styles.statusRow}>
                <Ionicons name="code-working" size={16} color="#A78BFA" />
                <Text style={styles.statusLabel}>Firmware</Text>
              </View>
              <Text style={styles.statusValue}>{dashboardData?.cpr_system.firmware_version}</Text>
            </View>
          </View>
          
          <Text style={styles.timestamp}>
            <Ionicons name="checkmark-circle" size={14} color="#9CA3AF" />
            {' '}Last checked: {new Date(dashboardData?.cpr_system.last_checked || '').toLocaleString()}
          </Text>
        </View>
        
        {/* Emergency Contacts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="call" size={24} color="#EF4444" />
            <Text style={styles.cardTitle}>Emergency Contacts</Text>
          </View>
          
          {dashboardData?.emergency_contacts.map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactHeader}>
                <View style={styles.contactIcon}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relationship}</Text>
                </View>
              </View>
              <View style={styles.contactPhone}>
                <Ionicons name="call" size={16} color="#60A5FA" />
                <Text style={styles.phoneNumber}>{contact.phone}</Text>
              </View>
            </View>
          ))}
          
          {/* Emergency CPR Guide Button */}
          <Pressable 
            style={styles.emergencyButton}
            onPress={() => router.push('/emergency')}
          >
            <Ionicons name="medical" size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Emergency CPR Guide</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  loadingText: {
    fontSize: 16,
    color: '#D1D5DB',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  vitalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  vitalItem: {
    width: '48%',
    backgroundColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  vitalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  systemStatus: {
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 8,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactItem: {
    backgroundColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  contactPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 6,
    padding: 8,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#60A5FA',
    fontWeight: '500',
    marginLeft: 6,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
});