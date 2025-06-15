// app/(tabs)/athlete/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Text, View } from 'react-native';

export default function AthleteLayout() {
  const { userRole } = useAuth();
  
  // Only allow athletes to access this route group
  if (userRole !== 'athlete') {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-500">Access denied. Athlete role required.</Text>
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