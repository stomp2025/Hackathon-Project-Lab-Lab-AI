import { Redirect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function TabsIndex() {
  const { userRole } = useAuth();
  
  if (!userRole) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return <Redirect href={`/(tabs)/${userRole}/dashboard`} />;
} 