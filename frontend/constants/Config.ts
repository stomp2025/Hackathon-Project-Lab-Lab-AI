// constants/Config.ts
import { Platform } from 'react-native';

// API Configuration - Use IP address for mobile, localhost for web
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  } else {
    // Replace with your computer's IP address
    return 'http://192.168.5.247:8000';
  }
};

// WebSocket Configuration
const getWebSocketUrl = () => {
  if (Platform.OS === 'web') {
    return 'ws://localhost:8000';
  } else {
    // Replace with your computer's IP address
    return 'ws://192.168.5.247:8000';
  }
};

export const API_BASE_URL = getBaseUrl();
export const API_URL = API_BASE_URL; // Added for consistency with dashboard components
export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
export const API_EMERGENCY_CONTACTS_URL = `${API_BASE_URL}/api/emergency-contacts`;
export const API_DASHBOARD_URL = `${API_BASE_URL}/api/dashboard`;
export const API_EMERGENCY_ALERTS_URL = `${API_BASE_URL}/api/emergency-alerts`;

// WebSocket URLs
export const WS_BASE_URL = getWebSocketUrl();
export const WS_EMERGENCY_ALERTS_URL = `${WS_BASE_URL}/api/emergency-alerts/ws`;

// Other configuration constants can be added here