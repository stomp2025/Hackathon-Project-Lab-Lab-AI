// app/(auth)/register.tsx
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext'; // Adjusted path
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import API URL from constants
import { API_AUTH_URL } from '../../constants/Config';

// API service for registration
async function apiRegister(email, password, role) {
  try {
    const response = await fetch(`${API_AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Registration failed');
    }
    return data; // Returns the created user object
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
}

// API service for login (to auto-login after registration)
async function apiLogin(email, password) {
    try {
      const response = await fetch(`${API_AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed after registration');
      }
      return data; // { access_token, token_type, user_id, role }
    } catch (error) {
      console.error('Login API error (post-registration):', error);
      throw error;
    }
  }

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('athlete'); // Default role, can be expanded
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await apiRegister(email, password, role);
      // After successful registration, automatically log the user in
      const loginData = await apiLogin(email, password);
      await login(loginData.access_token, loginData.user_id.toString(), loginData.role);
      // Navigation to '/(tabs)' is handled by AuthContext's useEffect
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'athlete', name: 'Athlete', icon: 'person' },
    { id: 'coach', name: 'Coach', icon: 'shield' },
    { id: 'referee', name: 'Referee', icon: 'flag' },
    { id: 'teammate', name: 'Teammate', icon: 'people' },
  ];

  return (
    <>
      <StatusBar hidden={true} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Sign Up</Text>
        
        {/* Role Selection */}
        <Text style={styles.sectionTitle}>Register as</Text>
        <View style={styles.roleContainer}>
          {roles.map((roleOption) => (
            <TouchableOpacity
              key={roleOption.id}
              style={[
                styles.roleButton,
                role === roleOption.id && styles.roleButtonSelected
              ]}
              onPress={() => setRole(roleOption.id)}
            >
              <Ionicons 
                name={roleOption.icon} 
                size={24} 
                color={role === roleOption.id ? '#FFFFFF' : '#9CA3AF'} 
              />
              <Text style={[
                styles.roleText,
                role === roleOption.id && styles.roleTextSelected
              ]}>
                {roleOption.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email Input */}
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#6B7280"
        />

        {/* Password Input */}
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#6B7280"
        />

        {/* Confirm Password Input */}
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#6B7280"
        />

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.registerButtonText}>Sign Up</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleButton: {
    width: '48%',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleButtonSelected: {
    backgroundColor: '#DC2626',
    borderColor: '#EF4444',
  },
  roleText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  roleTextSelected: {
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  registerButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  registerButtonDisabled: {
    backgroundColor: '#7F1D1D',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginLinkText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});