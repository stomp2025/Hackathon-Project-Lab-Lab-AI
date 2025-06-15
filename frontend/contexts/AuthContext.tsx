// frontend/app/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';
import { Platform } from 'react-native';

const TOKEN_KEY = 'stomp_token';
const USER_ROLE_KEY = 'stomp_user_role';
const USER_ID_KEY = 'stomp_user_id';

// Storage helpers that work on both web and native
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

interface User {
  id: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  userId: string | null;
  userRole: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (newToken: string, newUserId: string, newUserRole: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function loadAuthData() {
      try {
        const storedToken = await storage.getItem(TOKEN_KEY);
        const storedUserId = await storage.getItem(USER_ID_KEY);
        const storedUserRole = await storage.getItem(USER_ROLE_KEY);

        if (storedToken && storedUserId && storedUserRole) {
          setToken(storedToken);
          setUserId(storedUserId);
          setUserRole(storedUserRole);
          setUser({ id: storedUserId, role: storedUserRole });
        }
      } catch (e) {
        console.error('Failed to load auth data from storage', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthData();
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't redirect until loading is complete

    const inAuthGroup = segments[0] === '(auth)';
    const onGetStarted = segments[0] === 'get-started';

    if (token && userRole && (inAuthGroup || onGetStarted)) {
      // User is authenticated but on an auth screen or get-started, redirect to role-specific dashboard
      router.replace(`/(tabs)/${userRole}/dashboard`);
    } else if (!token && !inAuthGroup && !onGetStarted) {
      // User is not authenticated and not on an auth screen or get-started, redirect to get-started
      router.replace('/get-started');
    }
  }, [token, userRole, segments, isLoading, router]);

  const login = async (newToken: string, newUserId: string, newUserRole: string) => {
    await storage.setItem(TOKEN_KEY, newToken);
    await storage.setItem(USER_ID_KEY, newUserId);
    await storage.setItem(USER_ROLE_KEY, newUserRole);
    setToken(newToken);
    setUserId(newUserId);
    setUserRole(newUserRole);
    setUser({ id: newUserId, role: newUserRole });
    router.replace(`/(tabs)/${newUserRole}/dashboard`); // Navigate to role-specific dashboard
  };

  const logout = async () => {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_ID_KEY);
    await storage.removeItem(USER_ROLE_KEY);
    setToken(null);
    setUserId(null);
    setUserRole(null);
    setUser(null);
    router.replace('/get-started'); // Navigate to get-started screen
  };

  return (
    <AuthContext.Provider value={{ token, userId, userRole, user, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}