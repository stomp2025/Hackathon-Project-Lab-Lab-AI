// app/(tabs)/referee/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Text, View } from 'react-native';

export default function RefereeLayout() {
  const { userRole } = useAuth();
  
  // Only allow referees to access this route group
  if (userRole !== 'referee') {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-500">Access denied. Referee role required.</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}