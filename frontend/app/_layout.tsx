// app/_layout.tsx
import '../global.css'; // Import global styles for NativeWind
import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; // Adjusted path
import { WebSocketProvider } from '../context/WebSocketContext'; // Fixed import path from contexts to context
import { ActivityIndicator, View } from 'react-native';
import NotificationBell from '../components/NotificationBell';

// This component will be rendered by AuthProvider
function Layout() {
  const { isLoading, token } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0284C7',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // Add notification bell to header right
        headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <NotificationBell />
          </View>
        ),
      }} 
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="get-started" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="emergency" options={{ headerShown: false }} />
      {/* Add other global screens here if needed, e.g., a modal */}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Layout />
      </WebSocketProvider>
    </AuthProvider>
  );
}