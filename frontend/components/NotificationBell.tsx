// components/NotificationBell.tsx
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import NotificationSystem from './NotificationSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NotificationBellProps = {
  color?: string;
};

export default function NotificationBell({ color = '#FFFFFF' }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadUnreadCount();
    
    // Check for new notifications every minute
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use AsyncStorage
      const storedNotifications = await AsyncStorage.getItem(`notifications_${user?.id}`);
      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        const count = notifications.filter((notification: any) => !notification.read).length;
        setUnreadCount(count);
      } else {
        // Default to 3 unread notifications for demo purposes
        setUnreadCount(3);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNotificationPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    // Refresh unread count when modal closes
    loadUnreadCount();
  };

  return (
    <>
      <TouchableOpacity onPress={handleNotificationPress} style={styles.container}>
        <Ionicons name="notifications-outline" size={24} color={color} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={handleModalClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.notificationSystemContainer}>
              <NotificationSystem 
                onNotificationPress={() => {
                  // This will be called when a notification is pressed
                  // We could close the modal here if needed
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationSystemContainer: {
    flex: 1,
  },
});