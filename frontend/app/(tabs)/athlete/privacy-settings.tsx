// app/(tabs)/athlete/privacy-settings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../../constants/Config';

type PrivacySettings = {
  shareHealthData: boolean;
  shareLocationData: boolean;
  shareEmergencyContacts: boolean;
  allowNotifications: boolean;
  allowDataAnalytics: boolean;
  allowDataResearch: boolean;
};

export default function PrivacySettingsScreen() {
  const { token, user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    shareHealthData: true,
    shareLocationData: true,
    shareEmergencyContacts: true,
    allowNotifications: true,
    allowDataAnalytics: false,
    allowDataResearch: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrivacySettings();
  }, [token]);

  const fetchPrivacySettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would fetch from the backend
      // For now, we'll simulate a delay and use default values
      setTimeout(() => {
        // Mock data - in a real app, this would come from the API
        setSettings({
          shareHealthData: true,
          shareLocationData: true,
          shareEmergencyContacts: true,
          allowNotifications: true,
          allowDataAnalytics: false,
          allowDataResearch: false,
        });
        setLoading(false);
      }, 1000);
      
      // Actual API call would look like this:
      /*
      const response = await axios.get(`${API_URL}/api/privacy-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data.settings);
      setLoading(false);
      */
    } catch (err) {
      console.error('Error fetching privacy settings:', err);
      setError('Failed to load privacy settings. Please try again.');
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // In a real app, this would save to the backend
      // For now, we'll simulate a delay
      setTimeout(() => {
        setSaving(false);
        Alert.alert(
          'Settings Saved',
          'Your privacy preferences have been updated successfully.',
          [{ text: 'OK' }]
        );
      }, 1000);
      
      // Actual API call would look like this:
      /*
      await axios.post(`${API_URL}/api/privacy-settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaving(false);
      Alert.alert(
        'Settings Saved',
        'Your privacy preferences have been updated successfully.',
        [{ text: 'OK' }]
      );
      */
    } catch (err) {
      console.error('Error saving privacy settings:', err);
      setError('Failed to save privacy settings. Please try again.');
      setSaving(false);
    }
  };

  const toggleSetting = (setting: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Loading privacy settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data & Privacy</Text>
        <Text style={styles.subtitle}>Manage how your data is used and shared</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Data Sharing</Text>
        <Text style={styles.sectionDescription}>
          Control how your health data is shared with coaches and medical staff
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Share Health Data</Text>
            <Text style={styles.settingDescription}>
              Allow coaches and medical staff to view your vital signs and health metrics
            </Text>
          </View>
          <Switch
            value={settings.shareHealthData}
            onValueChange={() => toggleSetting('shareHealthData')}
            trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Share Location Data</Text>
            <Text style={styles.settingDescription}>
              Allow tracking your location during practice and games for emergency response
            </Text>
          </View>
          <Switch
            value={settings.shareLocationData}
            onValueChange={() => toggleSetting('shareLocationData')}
            trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Share Emergency Contacts</Text>
            <Text style={styles.settingDescription}>
              Allow coaches and medical staff to access your emergency contacts
            </Text>
          </View>
          <Switch
            value={settings.shareEmergencyContacts}
            onValueChange={() => toggleSetting('shareEmergencyContacts')}
            trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications & Communications</Text>
        <Text style={styles.sectionDescription}>
          Control how and when you receive notifications
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Allow Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive important alerts, reminders, and updates about your health and team activities
            </Text>
          </View>
          <Switch
            value={settings.allowNotifications}
            onValueChange={() => toggleSetting('allowNotifications')}
            trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Usage & Research</Text>
        <Text style={styles.sectionDescription}>
          Control how your anonymized data may be used for system improvements and research
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Allow Data Analytics</Text>
            <Text style={styles.settingDescription}>
              Allow your anonymized data to be used for improving the STOMP system
            </Text>
          </View>
          <Switch
            value={settings.allowDataAnalytics}
            onValueChange={() => toggleSetting('allowDataAnalytics')}
            trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Allow Research Usage</Text>
            <Text style={styles.settingDescription}>
              Allow your anonymized data to be used for medical research to improve athlete safety
            </Text>
          </View>
          <Switch
            value={settings.allowDataResearch}
            onValueChange={() => toggleSetting('allowDataResearch')}
            trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.encryptionInfoContainer}>
        <Ionicons name="lock-closed" size={24} color="#0284C7" />
        <Text style={styles.encryptionInfoText}>
          Your data is protected with end-to-end encryption. Only authorized personnel can access your information.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={savePrivacySettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.dataRequestContainer}>
        <TouchableOpacity style={styles.dataRequestButton}>
          <Text style={styles.dataRequestText}>Request My Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dataRequestButton}>
          <Text style={styles.dataRequestText}>Delete My Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  encryptionInfoContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  encryptionInfoText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dataRequestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  dataRequestButton: {
    paddingVertical: 8,
  },
  dataRequestText: {
    color: '#0284C7',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});