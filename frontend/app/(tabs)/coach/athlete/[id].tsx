// app/(tabs)/coach/athlete/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../../../constants/Config';
import { FontAwesome } from '@expo/vector-icons';

type AthleteInfo = {
  id: number;
  name: string;
  age: number;
  position: string;
  jersey_number: number;
};

type VitalSigns = {
  heart_rate: number;
  blood_pressure: string;
  body_temperature: number;
  respiratory_rate: number;
  oxygen_saturation: number;
  timestamp: string;
};

type CPRSystem = {
  device_status: string;
  battery_level: number;
  last_checked: string;
  firmware_version: string;
};

type TrainingLoad = {
  today: number;
  weekly_average: number;
  status: string;
};

type HistoryEntry = {
  date: string;
  status: string;
  notes: string;
};

type AthleteDetailsData = {
  athlete_info: AthleteInfo;
  vital_signs: VitalSigns;
  cpr_system: CPRSystem;
  training_load: TrainingLoad;
  recent_history: HistoryEntry[];
};

export default function AthleteDetailsScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [athleteData, setAthleteData] = useState<AthleteDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAthleteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/dashboard/coach/athlete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAthleteData(response.data);
    } catch (err) {
      console.error('Error fetching athlete details:', err);
      setError('Failed to load athlete data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAthleteData();
    }
    
    // Refresh data every 30 seconds for real-time monitoring
    const intervalId = setInterval(() => {
      if (id) {
        fetchAthleteData();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [id, token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAthleteData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'elevated':
        return 'bg-yellow-500';
      case 'warning':
      case 'high':
        return 'bg-red-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-500';
      case 'elevated':
        return 'text-yellow-500';
      case 'warning':
      case 'high':
        return 'text-red-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading && !athleteData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg">Loading athlete data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with back button */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome name="arrow-left" size={24} color="#0066cc" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{athleteData?.athlete_info.name}</Text>
      </View>
      
      <View className="p-4">
        {/* Athlete Info */}
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold mb-2 text-blue-700">Athlete Information</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-lg">Age:</Text>
            <Text className="text-lg font-medium">{athleteData?.athlete_info.age}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-lg">Position:</Text>
            <Text className="text-lg font-medium">{athleteData?.athlete_info.position}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-lg">Jersey Number:</Text>
            <Text className="text-lg font-medium">#{athleteData?.athlete_info.jersey_number}</Text>
          </View>
        </View>
        
        {/* Vital Signs Section */}
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold mb-2 text-blue-700">Vital Signs</Text>
          <Text className="text-lg mb-1">Heart Rate: <Text className="font-bold">{athleteData?.vital_signs.heart_rate} bpm</Text></Text>
          <Text className="text-lg mb-1">Blood Pressure: <Text className="font-bold">{athleteData?.vital_signs.blood_pressure} mmHg</Text></Text>
          <Text className="text-lg mb-1">Body Temperature: <Text className="font-bold">{athleteData?.vital_signs.body_temperature}°C</Text></Text>
          <Text className="text-lg mb-1">Respiratory Rate: <Text className="font-bold">{athleteData?.vital_signs.respiratory_rate} breaths/min</Text></Text>
          <Text className="text-lg mb-1">Oxygen Saturation: <Text className="font-bold">{athleteData?.vital_signs.oxygen_saturation}%</Text></Text>
          <Text className="text-sm text-gray-500 mt-2">Last updated: {new Date(athleteData?.vital_signs.timestamp || '').toLocaleString()}</Text>
        </View>
        
        {/* CPR System Status */}
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold mb-2 text-blue-700">CPR System Status</Text>
          <View className="flex-row items-center mb-1">
            <Text className="text-lg">Device Status: </Text>
            <View className={`h-3 w-3 rounded-full mr-1 ${athleteData?.cpr_system.device_status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <Text className="text-lg font-bold">{athleteData?.cpr_system.device_status === 'active' ? 'Active' : 'Standby'}</Text>
          </View>
          <Text className="text-lg mb-1">Battery Level: <Text className="font-bold">{athleteData?.cpr_system.battery_level}%</Text></Text>
          <Text className="text-lg mb-1">Firmware Version: <Text className="font-bold">{athleteData?.cpr_system.firmware_version}</Text></Text>
          <Text className="text-sm text-gray-500 mt-2">Last checked: {new Date(athleteData?.cpr_system.last_checked || '').toLocaleString()}</Text>
        </View>
        
        {/* Training Load */}
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold mb-2 text-blue-700">Training Load</Text>
          <Text className="text-lg mb-1">Today: <Text className="font-bold">{athleteData?.training_load.today} units</Text></Text>
          <Text className="text-lg mb-1">Weekly Average: <Text className="font-bold">{athleteData?.training_load.weekly_average} units</Text></Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-lg">Status: </Text>
            <Text className={`text-lg font-bold ${getStatusTextColor(athleteData?.training_load.status || '')}`}>
              {athleteData?.training_load.status.charAt(0).toUpperCase() + athleteData?.training_load.status.slice(1)}
            </Text>
          </View>
        </View>
        
        {/* Recent History */}
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold mb-2 text-blue-700">Recent History</Text>
          {athleteData?.recent_history.map((entry, index) => (
            <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <Text className="text-gray-700">{entry.date}</Text>
              <View className="flex-row items-center">
                <View className={`h-3 w-3 rounded-full mr-2 ${getStatusColor(entry.status)}`} />
                <Text className={getStatusTextColor(entry.status)}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}