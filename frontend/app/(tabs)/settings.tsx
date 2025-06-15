// app/(tabs)/settings.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Modal, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Import API URL from constants
import { API_EMERGENCY_CONTACTS_URL } from '../../constants/Config';

const API_URL = API_EMERGENCY_CONTACTS_URL; // Using centralized config

interface EmergencyContact {
  id: number;
  name: string;
  phone_number: string;
  relationship: string;
  user_id: number;
}

export default function SettingsPage() {
  const { token, logout, userRole, userId } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch contacts');
      }
      const data: EmergencyContact[] = await response.json();
      setContacts(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not fetch contacts.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (userRole === 'athlete') {
        fetchContacts();
    }
  }, [fetchContacts, userRole]);

  const openModal = (contact: EmergencyContact | null = null) => {
    if (contact) {
      setEditingContact(contact);
      setName(contact.name);
      setPhoneNumber(contact.phone_number);
      setRelationship(contact.relationship);
    } else {
      setEditingContact(null);
      setName('');
      setPhoneNumber('');
      setRelationship('');
    }
    setIsModalVisible(true);
  };

  const handleSaveContact = async () => {
    if (!name || !phoneNumber || !relationship) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
    }

    const contactData = { name, phone_number: phoneNumber, relationship };
    const url = editingContact ? `${API_URL}/${editingContact.id}` : API_URL;
    const method = editingContact ? 'PUT' : 'POST';

    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to ${editingContact ? 'update' : 'add'} contact`);
      }
      fetchContacts(); // Refresh list
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message || `Could not ${editingContact ? 'update' : 'add'} contact.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!token) return;
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await fetch(`${API_URL}/${contactId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete contact');
              }
              fetchContacts(); // Refresh list
            } catch (error) {
              Alert.alert('Error', error.message || 'Could not delete contact.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderContactItem = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone_number}</Text>
        <Text style={styles.contactRelationship}>{item.relationship}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteContact(item.id)} style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (userRole !== 'athlete') {
    return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                <Ionicons name="settings-outline" size={60} color="#9CA3AF" style={styles.settingsIcon} />
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>
                    Emergency contact management is only available for Athlete accounts.
                </Text>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Emergency Contacts</Text>
      
      {isLoading && contacts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyText}>No emergency contacts found</Text>
          <Text style={styles.emptySubtext}>Add your first contact below</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openModal()}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add New Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Relationship (e.g., Parent, Spouse)"
              value={relationship}
              onChangeText={setRelationship}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleSaveContact}
              disabled={isLoading}
            >
              {isLoading && isModalVisible ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.modalSaveText}>{editingContact ? 'Save Changes' : 'Add Contact'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D1D5DB',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  contactsList: {
    flex: 1,
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 2,
  },
  contactRelationship: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    backgroundColor: '#4B5563',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  modalSaveButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelButton: {
    backgroundColor: '#6B7280',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});