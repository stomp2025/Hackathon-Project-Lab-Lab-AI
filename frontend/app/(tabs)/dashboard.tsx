// app/(tabs)/dashboard.tsx
import React, { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { userRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userRole) {
      // Redirect to role-specific dashboard
      switch (userRole) {
        case 'athlete':
          router.replace('/(tabs)/athlete/dashboard');
          break;
        case 'coach':
          router.replace('/(tabs)/coach/dashboard');
          break;
        case 'teammate':
          router.replace('/(tabs)/teammate/dashboard');
          break;
        case 'referee':
          router.replace('/(tabs)/referee/dashboard');
          break;
        default:
          // If role is unknown, stay on this page
          console.warn(`Unknown user role: ${userRole}`);
      }
    }
  }, [userRole, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0066cc" />
        <Text className="mt-4 text-lg">Loading your dashboard...</Text>
      </View>
    );
  }

  // This will only show briefly before redirect happens
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg">Redirecting to your dashboard...</Text>
    </View>
  );
}