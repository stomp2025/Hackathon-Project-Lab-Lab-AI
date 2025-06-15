// app/index.tsx
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function HomePage() {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && userRole) {
        router.replace(`/(tabs)/${userRole}/dashboard`);
      } else {
        router.replace('/get-started');
      }
    }
  }, [isAuthenticated, isLoading, userRole, router]);

  // Show loading while determining auth state
  return (
    <>
      <StatusBar hidden={true} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1F2937' }}>
        <Text style={{ fontSize: 24, color: '#FFFFFF' }}>Loading STOMP...</Text>
      </View>
    </>
  );
}