// app/(tabs)/profile.tsx
import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { userId, userRole, logout } = useAuth();

  const getRoleIcon = () => {
    switch (userRole) {
      case 'athlete': return 'fitness';
      case 'coach': return 'people';
      case 'referee': return 'flag';
      case 'teammate': return 'person-add';
      default: return 'person';
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'athlete': return '#DC2626';
      case 'coach': return '#2563EB';
      case 'referee': return '#7C3AED';
      case 'teammate': return '#059669';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: getRoleColor() }]}>
          <Ionicons name={getRoleIcon()} size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.roleTitle}>{userRole?.toUpperCase()}</Text>
        <Text style={styles.userId}>ID: {userId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{userRole}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="id-card-outline" size={20} color="#9CA3AF" />
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{userId}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#9CA3AF" />
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, styles.activeStatus]}>Active</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={20} color="#D1D5DB" />
          <Text style={styles.actionText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={20} color="#D1D5DB" />
          <Text style={styles.actionText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="information-circle-outline" size={20} color="#D1D5DB" />
          <Text style={styles.actionText}>About STOMP</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: '#D1D5DB',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeStatus: {
    color: '#10B981',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#D1D5DB',
    marginLeft: 12,
  },
});