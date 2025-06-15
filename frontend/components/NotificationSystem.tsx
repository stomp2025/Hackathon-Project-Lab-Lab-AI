// components/NotificationSystem.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'update' | 'alert';
  date: string;
  read: boolean;
};

type NotificationPreferences = {
  monthlyReminders: boolean;
  protocolUpdates: boolean;
  trainingAlerts: boolean;
  emergencyDrills: boolean;
};

type NotificationSystemProps = {
  onNotificationPress?: (notification: Notification) => void;
};

export default function NotificationSystem({ onNotificationPress }: NotificationSystemProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    monthlyReminders: true,
    protocolUpdates: true,
    trainingAlerts: true,
    emergencyDrills: true,
  });

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, [user]);

  const loadNotifications = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Monthly CPR Protocol Review',
          message: 'It\'s time for your monthly review of CPR protocols. Please complete the review by the end of the week.',
          type: 'reminder',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          read: false,
        },
        {
          id: '2',
          title: 'Protocol Update: AED Usage',
          message: 'The AED usage protocol has been updated. Please review the changes in the training section.',
          type: 'update',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          read: true,
        },
        {
          id: '3',
          title: 'Emergency Drill Scheduled',
          message: 'An emergency response drill has been scheduled for next Tuesday at 2:00 PM. Please be prepared to participate.',
          type: 'alert',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read: false,
        },
      ];

      // In a real app, we would store read status in backend
      // For now, we'll use AsyncStorage to persist read status
      const storedNotifications = await AsyncStorage.getItem(`notifications_${user?.id}`);
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        // Merge mock notifications with stored read status
        const mergedNotifications = mockNotifications.map(notification => {
          const stored = parsedNotifications.find((n: Notification) => n.id === notification.id);
          return stored ? { ...notification, read: stored.read } : notification;
        });
        setNotifications(mergedNotifications);
      } else {
        setNotifications(mockNotifications);
      }

      updateUnreadCount(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem(`notification_preferences_${user?.id}`);
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const updateUnreadCount = (notificationsList: Notification[]) => {
    const count = notificationsList.filter(notification => !notification.read).length;
    setUnreadCount(count);
  };

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      updateUnreadCount(updatedNotifications);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      
      setNotifications(updatedNotifications);
      updateUnreadCount(updatedNotifications);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const togglePreference = async (key: keyof NotificationPreferences) => {
    try {
      const updatedPreferences = {
        ...preferences,
        [key]: !preferences[key],
      };
      
      setPreferences(updatedPreferences);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(`notification_preferences_${user?.id}`, JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return 'calendar-outline';
      case 'update': return 'refresh-outline';
      case 'alert': return 'warning-outline';
      default: return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return '#0284C7'; // blue
      case 'update': return '#10B981'; // green
      case 'alert': return '#F59E0B'; // amber
      default: return '#6B7280'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) }]}>
        <Ionicons name={getNotificationIcon(item.type) as any} size={20} color="white" />
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationPreview} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>{formatDate(item.date)}</Text>
      </View>
      
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setPreferencesModalVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
          
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markReadButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markReadText}>Mark all as read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {/* Notification Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {selectedNotification && (
              <View style={styles.notificationDetail}>
                <View style={[styles.detailIconContainer, { backgroundColor: getNotificationColor(selectedNotification.type) }]}>
                  <Ionicons 
                    name={getNotificationIcon(selectedNotification.type) as any} 
                    size={32} 
                    color="white" 
                  />
                </View>
                
                <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
                <Text style={styles.detailDate}>{formatDate(selectedNotification.date)}</Text>
                
                <Text style={styles.detailMessage}>{selectedNotification.message}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Preferences Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={preferencesModalVisible}
        onRequestClose={() => setPreferencesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
              <TouchableOpacity onPress={() => setPreferencesModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.preferencesContainer}>
              <View style={styles.preferenceItem}>
                <View>
                  <Text style={styles.preferenceTitle}>Monthly Reminders</Text>
                  <Text style={styles.preferenceDescription}>Receive monthly protocol review reminders</Text>
                </View>
                <Switch
                  value={preferences.monthlyReminders}
                  onValueChange={() => togglePreference('monthlyReminders')}
                  trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View>
                  <Text style={styles.preferenceTitle}>Protocol Updates</Text>
                  <Text style={styles.preferenceDescription}>Get notified when protocols are updated</Text>
                </View>
                <Switch
                  value={preferences.protocolUpdates}
                  onValueChange={() => togglePreference('protocolUpdates')}
                  trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View>
                  <Text style={styles.preferenceTitle}>Training Alerts</Text>
                  <Text style={styles.preferenceDescription}>Receive alerts about new training opportunities</Text>
                </View>
                <Switch
                  value={preferences.trainingAlerts}
                  onValueChange={() => togglePreference('trainingAlerts')}
                  trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View>
                  <Text style={styles.preferenceTitle}>Emergency Drills</Text>
                  <Text style={styles.preferenceDescription}>Get notified about upcoming emergency drills</Text>
                </View>
                <Switch
                  value={preferences.emergencyDrills}
                  onValueChange={() => togglePreference('emergencyDrills')}
                  trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  markReadButton: {
    marginLeft: 8,
  },
  markReadText: {
    color: '#0284C7',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationPreview: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0284C7',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationDetail: {
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  detailMessage: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
  },
  preferencesContainer: {
    marginTop: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#6B7280',
    maxWidth: '80%',
  },
});