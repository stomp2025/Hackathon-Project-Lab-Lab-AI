// app/(tabs)/coach/simulations.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput, Switch, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../../constants/Config';

type Athlete = {
  id: number;
  name: string;
  team: string;
  selected: boolean;
};

type Simulation = {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'completed' | 'scheduled';
  duration_seconds: number;
  athletes_involved: number;
  response_time_seconds: number | null;
};

export default function SimulationsScreen() {
  const { token } = useAuth();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [simulationName, setSimulationName] = useState('');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<number[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [creatingSimulation, setCreatingSimulation] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<Simulation | null>(null);
  const [simulationTimer, setSimulationTimer] = useState(0);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchSimulations();
    fetchAthletes();
  }, [token]);

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/emergency-simulations/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSimulations(response.data.simulations);
      
      // Check if there's an active simulation
      const active = response.data.simulations.find((sim: Simulation) => sim.status === 'active');
      if (active) {
        setActiveSimulation(active);
        startSimulationTimer();
      }
    } catch (err) {
      console.error('Error fetching simulations:', err);
      setError('Failed to load simulations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAthletes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/athletes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const athletesWithSelection = response.data.athletes.map((athlete: any) => ({
        ...athlete,
        selected: false
      }));
      
      setAthletes(athletesWithSelection);
    } catch (err) {
      console.error('Error fetching athletes:', err);
    }
  };

  const toggleAthleteSelection = (athleteId: number) => {
    setAthletes(athletes.map(athlete => {
      if (athlete.id === athleteId) {
        return { ...athlete, selected: !athlete.selected };
      }
      return athlete;
    }));
  };

  const handleCreateSimulation = async () => {
    if (!simulationName.trim()) {
      Alert.alert('Error', 'Please enter a simulation name');
      return;
    }

    const selectedAthleteIds = athletes
      .filter(athlete => athlete.selected)
      .map(athlete => athlete.id);

    if (selectedAthleteIds.length === 0) {
      Alert.alert('Error', 'Please select at least one athlete');
      return;
    }

    try {
      setCreatingSimulation(true);
      
      const payload = {
        name: simulationName,
        athlete_ids: selectedAthleteIds,
        scheduled: isScheduled,
        scheduled_time: isScheduled ? scheduledDate.toISOString() : null
      };
      
      const response = await axios.post(`${API_URL}/api/emergency-simulations/create`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reset form
      setModalVisible(false);
      setSimulationName('');
      setAthletes(athletes.map(athlete => ({ ...athlete, selected: false })));
      setIsScheduled(false);
      
      // Refresh simulations list
      fetchSimulations();
      
      // If simulation was started immediately, set it as active
      if (!isScheduled) {
        setActiveSimulation(response.data.simulation);
        startSimulationTimer();
        
        Alert.alert(
          'Simulation Started',
          'The emergency simulation has been started. Team members will receive alerts.'
        );
      } else {
        Alert.alert(
          'Simulation Scheduled',
          `The emergency simulation has been scheduled for ${scheduledDate.toLocaleString()}.`
        );
      }
    } catch (err) {
      console.error('Error creating simulation:', err);
      Alert.alert('Error', 'Failed to create simulation. Please try again.');
    } finally {
      setCreatingSimulation(false);
    }
  };

  const startSimulationTimer = () => {
    // Clear any existing interval
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    
    setSimulationTimer(0);
    
    // Start a new interval
    const interval = setInterval(() => {
      setSimulationTimer(prev => prev + 1);
    }, 1000);
    
    setSimulationInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSimulation = async () => {
    Alert.alert(
      'End Simulation',
      'Are you sure you want to end this simulation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Simulation',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!activeSimulation) return;
              
              await axios.post(`${API_URL}/api/emergency-simulations/${activeSimulation.id}/end`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              // Clear the timer
              if (simulationInterval) {
                clearInterval(simulationInterval);
                setSimulationInterval(null);
              }
              
              setActiveSimulation(null);
              fetchSimulations();
              
              Alert.alert(
                'Simulation Ended',
                'The emergency simulation has been ended. You can view the results in the simulations list.'
              );
            } catch (err) {
              console.error('Error ending simulation:', err);
              Alert.alert('Error', 'Failed to end simulation. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderSimulationItem = ({ item }: { item: Simulation }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return '#10B981'; // green
        case 'completed': return '#6B7280'; // gray
        case 'scheduled': return '#F59E0B'; // amber
        default: return '#6B7280';
      }
    };

    return (
      <View style={styles.simulationCard}>
        <View style={styles.simulationHeader}>
          <Text style={styles.simulationName}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.simulationDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.athletes_involved} athletes</Text>
          </View>
          
          {item.status === 'completed' && item.response_time_seconds !== null && (
            <View style={styles.detailRow}>
              <Ionicons name="timer-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>Response time: {formatTime(item.response_time_seconds)}</Text>
            </View>
          )}
          
          {item.status === 'completed' && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.detailText}>Duration: {formatTime(item.duration_seconds)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {activeSimulation ? (
        <View style={styles.activeSimulationContainer}>
          <View style={styles.activeSimulationHeader}>
            <Text style={styles.activeSimulationTitle}>Active Simulation</Text>
            <View style={styles.activeStatusBadge}>
              <Text style={styles.activeStatusText}>LIVE</Text>
            </View>
          </View>
          
          <Text style={styles.activeSimulationName}>{activeSimulation.name}</Text>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Elapsed Time</Text>
            <Text style={styles.timerValue}>{formatTime(simulationTimer)}</Text>
          </View>
          
          <View style={styles.simulationInfoBox}>
            <Text style={styles.infoBoxTitle}>Simulation in Progress</Text>
            <Text style={styles.infoBoxText}>
              Your team members are receiving emergency alerts and should be responding according to protocol.
              Monitor their response times and actions.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.endSimulationButton}
            onPress={handleEndSimulation}
          >
            <Ionicons name="stop-circle" size={20} color="white" />
            <Text style={styles.endSimulationText}>End Simulation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Emergency Simulations</Text>
            <Text style={styles.subtitle}>Create and manage emergency response drills</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.createButtonText}>Create New Simulation</Text>
          </TouchableOpacity>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0284C7" />
              <Text style={styles.loadingText}>Loading simulations...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchSimulations}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : simulations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness-outline" size={60} color="#9CA3AF" />
              <Text style={styles.emptyText}>No simulations yet</Text>
              <Text style={styles.emptySubtext}>Create a simulation to test your team's emergency response</Text>
            </View>
          ) : (
            <FlatList
              data={simulations}
              keyExtractor={(item) => item.id}
              renderItem={renderSimulationItem}
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      )}
      
      {/* Create Simulation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Emergency Simulation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Simulation Name</Text>
              <TextInput
                style={styles.textInput}
                value={simulationName}
                onChangeText={setSimulationName}
                placeholder="e.g., Field Practice Drill"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Select Athletes</Text>
              <Text style={styles.formSubLabel}>Choose which athletes will receive the simulation alert</Text>
              
              <View style={styles.athletesList}>
                {athletes.map(athlete => (
                  <TouchableOpacity 
                    key={athlete.id}
                    style={[styles.athleteItem, athlete.selected && styles.athleteItemSelected]}
                    onPress={() => toggleAthleteSelection(athlete.id)}
                  >
                    <Text style={[styles.athleteName, athlete.selected && styles.athleteNameSelected]}>
                      {athlete.name}
                    </Text>
                    <Text style={[styles.athleteTeam, athlete.selected && styles.athleteTeamSelected]}>
                      {athlete.team}
                    </Text>
                    {athlete.selected && (
                      <Ionicons name="checkmark-circle" size={20} color="white" style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Schedule for later</Text>
                <Switch
                  value={isScheduled}
                  onValueChange={setIsScheduled}
                  trackColor={{ false: '#D1D5DB', true: '#0284C7' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              {isScheduled && (
                <Text style={styles.scheduledText}>
                  Scheduled for: {scheduledDate.toLocaleString()}
                </Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.createSimulationButton}
              onPress={handleCreateSimulation}
              disabled={creatingSimulation}
            >
              {creatingSimulation ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="play-circle" size={20} color="white" />
                  <Text style={styles.createSimulationText}>
                    {isScheduled ? 'Schedule Simulation' : 'Start Simulation Now'}
                  </Text>
                </>
              )}
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
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    marginBottom: 16,
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
  },
  createButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
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
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  simulationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  simulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  simulationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  simulationDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
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
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formSubLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  athletesList: {
    marginTop: 8,
  },
  athleteItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  athleteItemSelected: {
    backgroundColor: '#0284C7',
  },
  athleteName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  athleteNameSelected: {
    color: 'white',
  },
  athleteTeam: {
    fontSize: 14,
    color: '#6B7280',
  },
  athleteTeamSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkIcon: {
    position: 'absolute',
    right: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  scheduledText: {
    marginTop: 8,
    fontSize: 14,
    color: '#0284C7',
    fontWeight: '500',
  },
  createSimulationButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createSimulationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeSimulationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  activeSimulationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeSimulationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  activeStatusBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  activeSimulationName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  simulationInfoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: '100%',
  },
  infoBoxTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  endSimulationButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSimulationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});