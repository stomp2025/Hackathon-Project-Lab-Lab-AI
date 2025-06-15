// app/(tabs)/teammate/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Text, View } from 'react-native';

export default function TeammateLayout() {
  const { userRole } = useAuth();
  
  // Only allow teammates to access this route group
  if (userRole !== 'teammate') {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-500">Access denied. Teammate role required.</Text>
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