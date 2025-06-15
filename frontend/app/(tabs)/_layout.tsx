// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../../contexts/AuthContext';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { userRole } = useAuth();

  // Get role-specific icon
  const getDashboardIcon = () => {
    switch (userRole) {
      case 'athlete': return 'heartbeat';
      case 'coach': return 'users';
      case 'referee': return 'flag';
      case 'teammate': return 'users';
      default: return 'home';
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
        },
        headerShown: false,
      }}>
      
      {/* Role-specific dashboards (visibility controlled via href) */}
      <Tabs.Screen
        name="athlete"
        options={
          userRole === 'athlete'
            ? {
                title: 'Dashboard',
                tabBarIcon: ({ color }) => <TabBarIcon name="heartbeat" color={color} />,
              }
            : { href: null }
        }
      />

      <Tabs.Screen
        name="coach"
        options={
          userRole === 'coach'
            ? {
                title: 'Dashboard',
                tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
              }
            : { href: null }
        }
      />

      <Tabs.Screen
        name="referee"
        options={
          userRole === 'referee'
            ? {
                title: 'Dashboard',
                tabBarIcon: ({ color }) => <TabBarIcon name="flag" color={color} />,
              }
            : { href: null }
        }
      />

      <Tabs.Screen
        name="teammate"
        options={
          userRole === 'teammate'
            ? {
                title: 'Dashboard',
                tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
              }
            : { href: null }
        }
      />

      {/* Common tabs */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
      
      {/* Hide unused fallback routes */}
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}