// app/emergency.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import CPRGuide from '../components/CPRGuide';

export default function EmergencyScreen() {
  const { user } = useAuth();
  const { activeEmergency, location, respondToEmergency } = useWebSocket();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [respondStatus, setRespondStatus] = useState<string | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null);
  
  // Get athlete ID from params if this is a responder view
  const athleteId = params.athlete as string | undefined;
  
  // Determine if this is the athlete experiencing the emergency
  const isAffectedAthlete = activeEmergency?.athlete_id === user?.id;
  
  // If no active emergency and not the affected athlete, redirect back
  useEffect(() => {
    if (!activeEmergency && !isAffectedAthlete) {
      router.replace('/(tabs)/dashboard');
    }
  }, [activeEmergency, isAffectedAthlete, router]);
  
  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Back Button */}
        <View style={styles.topBar}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.screenTitle}>Emergency</Text>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Emergency Call Section */}
          <View style={styles.emergencyCallSection}>
            <View style={styles.emergencyHeader}>
              <View style={styles.emergencyIcon}>
                <Ionicons name="medical" size={32} color="#DC2626" />
              </View>
              <Text style={styles.title}>EMERGENCY</Text>
              <Text style={styles.subtitle}>Medical Response Required</Text>
            </View>
            
            <Pressable 
              style={styles.emergencyCallButton}
              onPress={callEmergencyServices}
            >
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.callButtonGradient}
              >
                <Ionicons name="call" size={28} color="white" />
                <Text style={styles.emergencyCallText}>CALL 911</Text>
                <Text style={styles.emergencyCallSubtext}>Emergency Services</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {activeEmergency && (
            <View style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Ionicons name="warning" size={24} color="#F59E0B" />
                <Text style={styles.alertTitle}>Active Emergency</Text>
              </View>
              <Text style={styles.athleteName}>{activeEmergency.athlete_name}</Text>
              <Text style={styles.alertTime}>
                Alert Time: {new Date().toLocaleTimeString()}
              </Text>
            </View>
          )}
          
          {/* CPR Guide Section */}
          <View style={styles.cprSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={24} color="#DC2626" />
              <Text style={styles.sectionTitle}>CPR Emergency Guide</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Follow these life-saving steps if the person is unresponsive
            </Text>
            <CPRGuide onComplete={() => console.log('CPR Guide completed')} />
          </View>

          {/* Response Section */}
          {!isAffectedAthlete && activeEmergency && (
            <View style={styles.responseSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people" size={24} color="#2563EB" />
                <Text style={styles.sectionTitle}>Team Response</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Let your team know your availability to respond
              </Text>
              
              <View style={styles.responseButtons}>
                <Pressable 
                  style={[
                    styles.responseButton, 
                    styles.respondingButton,
                    respondStatus === 'responding' && styles.activeResponseButton
                  ]}
                  onPress={() => handleRespond('responding')}
                >
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.responseButtonText}>I'm Responding</Text>
                  {respondStatus === 'responding' && estimatedArrival && (
                    <Text style={styles.etaText}>ETA: {estimatedArrival} min</Text>
                  )}
                </Pressable>
                
                <Pressable 
                  style={[
                    styles.responseButton, 
                    styles.unavailableButton,
                    respondStatus === 'unavailable' && styles.activeResponseButton
                  ]}
                  onPress={() => handleRespond('unavailable')}
                >
                  <Ionicons name="close-circle" size={24} color="white" />
                  <Text style={styles.responseButtonText}>Can't Respond</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Emergency Tips */}
          <View style={styles.tipsSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color="#059669" />
              <Text style={styles.sectionTitle}>Emergency Tips</Text>
            </View>
            
            <View style={styles.tipCard}>
              <Ionicons name="shield-checkmark" size={20} color="#059669" />
              <Text style={styles.tipText}>Stay calm and assess the situation</Text>
            </View>
            
            <View style={styles.tipCard}>
              <Ionicons name="location" size={20} color="#059669" />
              <Text style={styles.tipText}>Note the exact location for emergency services</Text>
            </View>
            
            <View style={styles.tipCard}>
              <Ionicons name="time" size={20} color="#059669" />
              <Text style={styles.tipText}>Continue CPR until help arrives</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
  
  // Handle response to emergency
  function handleRespond(status: string) {
    if (!activeEmergency) return;
    
    setRespondStatus(status);
    
    // Calculate estimated arrival time (mock - would be based on actual location in real app)
    const eta = status === 'responding' ? Math.floor(Math.random() * 5) + 1 : null;
    setEstimatedArrival(eta);
    
    // Send response through WebSocket
    respondToEmergency(activeEmergency.id, status, eta || undefined);
  }
  
  // Handle calling emergency services
  function callEmergencyServices() {
    const emergencyNumber = Platform.OS === 'android' ? 'tel:911' : 'telprompt:911';
    Linking.openURL(emergencyNumber).catch(err => console.error('Error opening phone app:', err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingTop: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#1F2937',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  emergencyCallSection: {
    padding: 20,
    alignItems: 'center',
  },
  emergencyHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emergencyCallButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  callButtonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyCallText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    letterSpacing: 1,
  },
  emergencyCallSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  alertCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 8,
  },
  athleteName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cprSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  responseSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  tipsSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  responseButtons: {
    gap: 12,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  respondingButton: {
    backgroundColor: '#059669',
  },
  unavailableButton: {
    backgroundColor: '#6B7280',
  },
  activeResponseButton: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  responseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  etaText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 12,
    flex: 1,
  },
});