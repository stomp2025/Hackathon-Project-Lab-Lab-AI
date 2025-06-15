// app/(tabs)/coach/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Text, View } from 'react-native';

export default function CoachLayout() {
  const { userRole } = useAuth();
  
  // Only allow coaches to access this route group
  if (userRole !== 'coach') {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-500">Access denied. Coach role required.</Text>
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
      <Stack.Screen 
        name="athlete/[id]" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}