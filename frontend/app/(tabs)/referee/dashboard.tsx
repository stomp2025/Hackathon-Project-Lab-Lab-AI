// app/(tabs)/referee/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../../../constants/Config';
import OnboardingTutorial from '../../../components/OnboardingTutorial';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EmergencyContact = {
  role: string;
  name: string;
  phone: string;
};

type EmergencyProtocol = {
  medical_staff_location: string;
  emergency_exits: string[];
  emergency_contacts: EmergencyContact[];
};

type MatchInfo = {
  current_match: {
    teams: string;
    location: string;
    time: string;
    status: string;
  };
  alerts: string[];
  emergency_protocol: EmergencyProtocol;
};

type RefereeDashboardData = {
  match_info: MatchInfo;
};

export default function RefereeDashboardScreen() {
  const { token, user } = useAuth();
  const [dashboardData, setDashboardData] = useState<RefereeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/dashboard/referee`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching referee dashboard data:', err);
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
    
    // Refresh data every minute
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 60000);
    
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

  const hasAlerts = dashboardData?.match_info.alerts && dashboardData.match_info.alerts.length > 0;

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
        <Text style={styles.title}>Referee Dashboard</Text>
        
        {/* Current Match */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="football" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Current Match</Text>
          </View>
          <Text style={styles.matchTeams}>{dashboardData?.match_info.current_match.teams}</Text>
          <View style={styles.matchDetail}>
            <Ionicons name="location" size={16} color="#9CA3AF" />
            <Text style={styles.matchDetailText}>Location: {dashboardData?.match_info.current_match.location}</Text>
          </View>
          <View style={styles.matchDetail}>
            <Ionicons name="time" size={16} color="#9CA3AF" />
            <Text style={styles.matchDetailText}>Time: {dashboardData?.match_info.current_match.time}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: dashboardData?.match_info.current_match.status === 'Upcoming' ? '#DBEAFE' : '#D1FAE5' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: dashboardData?.match_info.current_match.status === 'Upcoming' ? '#1D4ED8' : '#059669' }
              ]}>
                {dashboardData?.match_info.current_match.status}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Alerts Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning" size={24} color="#EF4444" />
            <Text style={styles.cardTitle}>Alerts</Text>
          </View>
          {hasAlerts ? (
            dashboardData?.match_info.alerts.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.alertText}>{alert}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noAlertItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.noAlertText}>No active alerts at this time.</Text>
            </View>
          )}
        </View>
        
        {/* Emergency Protocol */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="medical" size={24} color="#DC2626" />
            <Text style={styles.cardTitle}>Emergency Protocol</Text>
          </View>
          
          <View style={styles.protocolSection}>
            <Text style={styles.protocolLabel}>Medical Staff Location:</Text>
            <Text style={styles.protocolValue}>{dashboardData?.match_info.emergency_protocol.medical_staff_location}</Text>
          </View>
          
          <View style={styles.protocolSection}>
            <Text style={styles.protocolLabel}>Emergency Exits:</Text>
            {dashboardData?.match_info.emergency_protocol.emergency_exits.map((exit, index) => (
              <View key={index} style={styles.exitItem}>
                <Ionicons name="exit" size={16} color="#9CA3AF" />
                <Text style={styles.protocolValue}>{exit}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.protocolSection}>
            <Text style={styles.protocolLabel}>Emergency Contacts:</Text>
            {dashboardData?.match_info.emergency_protocol.emergency_contacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactRole}>{contact.role}: {contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Ionicons name="call" size={16} color="#2563EB" />
              </View>
            ))}
          </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
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
  card: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  matchTeams: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  matchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchDetailText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  noAlertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
  },
  noAlertText: {
    fontSize: 14,
    color: '#059669',
    marginLeft: 8,
  },
  protocolSection: {
    marginBottom: 16,
  },
  protocolLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  protocolValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  exitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactRole: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 14,
    color: '#60A5FA',
    marginTop: 2,
  },
});