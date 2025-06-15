// app/(tabs)/coach/reports.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../../constants/Config';

type IncidentReport = {
  id: string;
  emergency_id: string;
  athlete_name: string;
  incident_date: string;
  status: string;
};

type ReportDetailType = {
  id: string;
  emergency_id: string;
  generated_by: number;
  generated_at: string;
  athlete_data: {
    id: number;
    name: string;
    age: number;
    team: string;
  };
  incident_details: {
    timestamp: string;
    location: string;
    initial_heart_rate: number;
    detected_anomaly: string;
    alert_triggered_at: string;
  };
  response_details: {
    first_responder: string;
    response_time_seconds: number;
    cpr_initiated: boolean;
    aed_used: boolean;
    emergency_services_called: boolean;
    emergency_services_arrival_time: number;
  };
  outcome: {
    status: string;
    notes: string;
  };
  follow_up_actions: string[];
};

export default function ReportsScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/incident-reports/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReports(response.data.reports);
    } catch (err) {
      console.error('Error fetching incident reports:', err);
      setError('Failed to load incident reports. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchReportDetail = async (reportId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/incident-reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSelectedReport(response.data);
    } catch (err) {
      console.error('Error fetching report details:', err);
      setError('Failed to load report details. Please try again.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const handleReportSelect = (reportId: string) => {
    fetchReportDetail(reportId);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recovered':
        return '#10B981'; // green
      case 'hospitalized':
        return '#F59E0B'; // amber
      case 'critical':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  if (loading && !reports.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Loading incident reports...</Text>
      </View>
    );
  }

  if (error && !reports.length) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchReports}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedReport) {
    // Render detailed report view
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
          <Ionicons name="arrow-back" size={24} color="#0284C7" />
          <Text style={styles.backButtonText}>Back to Reports</Text>
        </TouchableOpacity>
        
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>Incident Report</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedReport.outcome.status) }]}>
            <Text style={styles.statusText}>{selectedReport.outcome.status}</Text>
          </View>
        </View>
        
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Athlete Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{selectedReport.athlete_data.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{selectedReport.athlete_data.age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Team:</Text>
            <Text style={styles.infoValue}>{selectedReport.athlete_data.team}</Text>
          </View>
        </View>
        
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Incident Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date & Time:</Text>
            <Text style={styles.infoValue}>{formatDate(selectedReport.incident_details.timestamp)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{selectedReport.incident_details.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Heart Rate:</Text>
            <Text style={styles.infoValue}>{selectedReport.incident_details.initial_heart_rate} BPM</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Anomaly:</Text>
            <Text style={styles.infoValue}>{selectedReport.incident_details.detected_anomaly}</Text>
          </View>
        </View>
        
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Response Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>First Responder:</Text>
            <Text style={styles.infoValue}>{selectedReport.response_details.first_responder}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Response Time:</Text>
            <Text style={styles.infoValue}>{formatDuration(selectedReport.response_details.response_time_seconds)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CPR Initiated:</Text>
            <Text style={styles.infoValue}>{selectedReport.response_details.cpr_initiated ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>AED Used:</Text>
            <Text style={styles.infoValue}>{selectedReport.response_details.aed_used ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EMS Called:</Text>
            <Text style={styles.infoValue}>{selectedReport.response_details.emergency_services_called ? 'Yes' : 'No'}</Text>
          </View>
          {selectedReport.response_details.emergency_services_called && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>EMS Arrival:</Text>
              <Text style={styles.infoValue}>{formatDuration(selectedReport.response_details.emergency_services_arrival_time)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Outcome & Follow-up</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, { color: getStatusColor(selectedReport.outcome.status) }]}>
              {selectedReport.outcome.status}
            </Text>
          </View>
          <View style={styles.notesContainer}>
            <Text style={styles.infoLabel}>Notes:</Text>
            <Text style={styles.notesText}>{selectedReport.outcome.notes}</Text>
          </View>
          
          <Text style={styles.followUpTitle}>Follow-up Actions:</Text>
          {selectedReport.follow_up_actions.map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="checkmark-circle" size={18} color="#0284C7" />
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incident Reports</Text>
      <Text style={styles.subtitle}>Review past emergency incidents</Text>
      
      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyText}>No incident reports available</Text>
          <Text style={styles.emptySubtext}>Reports will appear here after emergency incidents</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.reportCard}
              onPress={() => handleReportSelect(item.id)}
            >
              <View style={styles.reportCardHeader}>
                <Text style={styles.athleteName}>{item.athlete_name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.reportCardDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{formatDate(item.incident_date)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Report #{item.id.substring(0, 8)}</Text>
                </View>
              </View>
              <View style={styles.viewDetailsContainer}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="#0284C7" />
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0284C7']}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
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
  reportCard: {
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
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  athleteName: {
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
  },
  reportCardDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 4,
  },
  viewDetailsText: {
    color: '#0284C7',
    fontWeight: '600',
    marginRight: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#0284C7',
    fontSize: 16,
    fontWeight: '500',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  reportSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '400',
  },
  notesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 4,
    lineHeight: 20,
  },
  followUpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
});