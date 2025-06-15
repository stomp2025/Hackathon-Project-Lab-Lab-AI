// app/(tabs)/teammate/dashboard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../../../constants/Config';
import OnboardingTutorial from '../../../components/OnboardingTutorial';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TeamAnnouncement = {
  title: string;
  content: string;
  date: string;
};

type PracticeSchedule = {
  today: string;
  tomorrow: string;
  day_after: string;
};

type TeamStatus = {
  alerts: string[];
  practice_schedule: PracticeSchedule;
  team_announcements: TeamAnnouncement[];
};

type TeammateDashboardData = {
  team_status: TeamStatus;
};

export default function TeammateDashboardScreen() {
  const { token, user } = useAuth();
  const [dashboardData, setDashboardData] = useState<TeammateDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/dashboard/teammate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching teammate dashboard data:', err);
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

  const hasAlerts = dashboardData?.team_status.alerts && dashboardData.team_status.alerts.length > 0;

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
        <Text style={styles.title}>Teammate Dashboard</Text>
        
        {/* Alerts Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning" size={24} color="#EF4444" />
            <Text style={styles.cardTitle}>Alerts</Text>
          </View>
          {hasAlerts ? (
            dashboardData?.team_status.alerts.map((alert, index) => (
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
        
        {/* Practice Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>Practice Schedule</Text>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleDay}>
              <Ionicons name="today" size={16} color="#10B981" />
              <Text style={styles.dayLabel}>Today:</Text>
            </View>
            <Text style={styles.scheduleTime}>{dashboardData?.team_status.practice_schedule.today}</Text>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleDay}>
              <Ionicons name="calendar-outline" size={16} color="#F59E0B" />
              <Text style={styles.dayLabel}>Tomorrow:</Text>
            </View>
            <Text style={styles.scheduleTime}>{dashboardData?.team_status.practice_schedule.tomorrow}</Text>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleDay}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.dayLabel}>Day After:</Text>
            </View>
            <Text style={styles.scheduleTime}>{dashboardData?.team_status.practice_schedule.day_after}</Text>
          </View>
        </View>
        
        {/* Team Announcements */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="megaphone" size={24} color="#7C3AED" />
            <Text style={styles.cardTitle}>Team Announcements</Text>
          </View>
          {dashboardData?.team_status.team_announcements.map((announcement, index) => (
            <View key={index} style={styles.announcementItem}>
              <View style={styles.announcementHeader}>
                <Ionicons name="information-circle" size={16} color="#7C3AED" />
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
              </View>
              <Text style={styles.announcementContent}>{announcement.content}</Text>
              <Text style={styles.announcementDate}>{announcement.date}</Text>
            </View>
          ))}
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
  scheduleItem: {
    marginBottom: 12,
  },
  scheduleDay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  scheduleTime: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 22,
  },
  announcementItem: {
    backgroundColor: '#4B5563',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
    flex: 1,
  },
  announcementContent: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
    lineHeight: 20,
  },
  announcementDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});