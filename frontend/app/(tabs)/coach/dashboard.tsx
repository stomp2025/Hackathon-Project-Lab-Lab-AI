// app/(tabs)/coach/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../../../constants/Config';
import OnboardingTutorial from '../../../components/OnboardingTutorial';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AthleteStatus = {
  id: number;
  name: string;
  status: string;
  last_updated: string;
  heart_rate: number;
  location: string;
};

type TeamOverview = {
  total_athletes: number;
  status_summary: {
    normal: number;
    elevated: number;
    warning: number;
  };
};

type CoachDashboardData = {
  team_overview: TeamOverview;
  athletes: AthleteStatus[];
};

export default function CoachDashboardScreen() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<CoachDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/dashboard/coach`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching coach dashboard data:', err);
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

  const navigateToAthleteDetails = (athleteId: number) => {
    router.push(`/coach/athlete/${athleteId}`);
  };

  const getStatusColorHex = (status: string) => {
    switch (status) {
      case 'normal':
        return '#10B981';
      case 'elevated':
        return '#F59E0B';
      case 'warning':
        return '#EF4444';
      default:
        return '#6B7280';
    }
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
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coach Dashboard</Text>
        
        {/* Team Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Team Overview</Text>
          </View>
          <Text style={styles.totalAthletes}>
            Total Athletes: <Text style={styles.boldText}>{dashboardData?.team_overview.total_athletes}</Text>
          </Text>
          
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>Normal: {dashboardData?.team_overview.status_summary.normal}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.statusText}>Elevated: {dashboardData?.team_overview.status_summary.elevated}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.statusText}>Warning: {dashboardData?.team_overview.status_summary.warning}</Text>
            </View>
          </View>
        </View>
        
        {/* Emergency CPR Guide Button */}
        <Pressable 
          style={styles.emergencyButton}
          onPress={() => router.push('/emergency')}
        >
          <Ionicons name="medical" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>Emergency CPR Guide</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>
        
        {/* Athletes List Header */}
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={20} color="#2563EB" />
          <Text style={styles.sectionTitle}>Athletes</Text>
        </View>
      </View>
      
      <FlatList
        data={dashboardData?.athletes}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.athletesList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.athleteCard}
            onPress={() => navigateToAthleteDetails(item.id)}
          >
            <View style={styles.athleteInfo}>
              <View style={styles.athleteHeader}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColorHex(item.status) }]} />
                <Text style={styles.athleteName}>{item.name}</Text>
              </View>
              <Text style={styles.athleteDetail}>HR: {item.heart_rate} bpm</Text>
              <Text style={styles.athleteDetail}>{item.location}</Text>
              <Text style={styles.updateTime}>
                Updated: {new Date(item.last_updated).toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.detailsButton}>
              <Ionicons name="chevron-forward" size={20} color="#2563EB" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
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
  overviewCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  totalAthletes: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 12,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  athletesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  athleteCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  athleteInfo: {
    flex: 1,
  },
  athleteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  athleteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  athleteDetail: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  detailsButton: {
    marginLeft: 12,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
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