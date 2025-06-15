// components/OnboardingTutorial.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingStep = {
  title: string;
  description: string;
  image: any; // In a real app, we would use proper image imports
  icon: string;
};

type OnboardingTutorialProps = {
  onComplete: () => void;
};

export default function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);

  useEffect(() => {
    // Check if user has completed onboarding before
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(`onboarding_completed_${user?.id}`);
        if (onboardingCompleted === 'true') {
          setVisible(false);
          onComplete();
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
    loadRoleSpecificSteps();
  }, [user]);

  const loadRoleSpecificSteps = () => {
    // Define steps based on user role
    if (user?.role === 'athlete') {
      setSteps(athleteSteps);
    } else if (user?.role === 'coach') {
      setSteps(coachSteps);
    } else if (user?.role === 'referee') {
      setSteps(refereeSteps);
    } else {
      setSteps(teamMemberSteps);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Mark onboarding as completed for this user
      await AsyncStorage.setItem(`onboarding_completed_${user?.id}`, 'true');
      setVisible(false);
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalContainer}>
        <View style={styles.tutorialContainer}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to STOMP</Text>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressIndicator}>
            {steps.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.progressDot,
                  currentStep === index ? styles.activeDot : {}
                ]}
              />
            ))}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name={steps[currentStep]?.icon as any} size={60} color="#0284C7" />
            </View>
            
            <Text style={styles.stepTitle}>{steps[currentStep]?.title}</Text>
            
            <ScrollView style={styles.descriptionScroll}>
              <Text style={styles.stepDescription}>{steps[currentStep]?.description}</Text>
            </ScrollView>
          </View>

          <View style={styles.navigationContainer}>
            {currentStep > 0 ? (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#0284C7" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            ) : <View style={styles.placeholderButton} />}

            <TouchableOpacity 
              onPress={handleNext} 
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              {currentStep < steps.length - 1 && (
                <Ionicons name="arrow-forward" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Role-specific onboarding steps
const athleteSteps: OnboardingStep[] = [
  {
    title: 'Welcome to STOMP',
    description: 'STOMP is designed to keep you safe during sports activities. The app monitors your vital signs and can alert your team if there\'s an emergency.',
    image: null,
    icon: 'heart-outline',
  },
  {
    title: 'Your Health Dashboard',
    description: 'Your dashboard shows your real-time health metrics. You can view your heart rate, activity level, and other important health indicators at a glance.',
    image: null,
    icon: 'stats-chart-outline',
  },
  {
    title: 'Emergency Alerts',
    description: 'If the system detects a potential cardiac issue, it will automatically alert your coach and nearby team members who can provide immediate assistance.',
    image: null,
    icon: 'warning-outline',
  },
  {
    title: 'Privacy Controls',
    description: 'You have full control over your data. Visit the Privacy Settings to manage who can see your health information and how it\'s used.',
    image: null,
    icon: 'lock-closed-outline',
  },
];

const coachSteps: OnboardingStep[] = [
  {
    title: 'Welcome to STOMP',
    description: 'STOMP helps you keep your athletes safe by monitoring their vital signs and alerting you to potential emergencies.',
    image: null,
    icon: 'people-outline',
  },
  {
    title: 'Team Dashboard',
    description: 'Your dashboard gives you an overview of all your athletes. You can see their status at a glance and receive alerts if any athlete needs attention.',
    image: null,
    icon: 'grid-outline',
  },
  {
    title: 'Emergency Response',
    description: 'If an athlete experiences a cardiac event, you\'ll receive an immediate alert with their location and vital signs. The app will guide you through the emergency response protocol.',
    image: null,
    icon: 'medkit-outline',
  },
  {
    title: 'Simulation Training',
    description: 'You can run emergency simulations to practice your team\'s response. Use this feature to ensure everyone knows what to do in a real emergency.',
    image: null,
    icon: 'fitness-outline',
  },
  {
    title: 'Incident Reports',
    description: 'After an emergency, you can access detailed incident reports. These reports help you understand what happened and improve future responses.',
    image: null,
    icon: 'document-text-outline',
  },
];

const refereeSteps: OnboardingStep[] = [
  {
    title: 'Welcome to STOMP',
    description: 'STOMP helps ensure athlete safety during games and matches by monitoring vital signs and enabling quick emergency response.',
    image: null,
    icon: 'flag-outline',
  },
  {
    title: 'Game Monitoring',
    description: 'During games, you can see the status of all athletes on the field. This helps you make informed decisions about player safety.',
    image: null,
    icon: 'eye-outline',
  },
  {
    title: 'Emergency Alerts',
    description: 'If an athlete experiences a cardiac event, you\'ll receive an immediate alert. The app will guide you through the appropriate actions to take.',
    image: null,
    icon: 'alert-circle-outline',
  },
  {
    title: 'Incident Documentation',
    description: 'After an emergency, you can contribute to incident reports. Your perspective is valuable for understanding what happened and improving future responses.',
    image: null,
    icon: 'create-outline',
  },
];

const teamMemberSteps: OnboardingStep[] = [
  {
    title: 'Welcome to STOMP',
    description: 'STOMP helps keep your teammates safe by enabling quick response to potential cardiac emergencies.',
    image: null,
    icon: 'people-outline',
  },
  {
    title: 'Team View',
    description: 'You can see the status of your teammates during practice and games. This helps you stay aware of everyone\'s condition.',
    image: null,
    icon: 'list-outline',
  },
  {
    title: 'Emergency Response',
    description: 'If a teammate experiences a cardiac event, you\'ll receive an alert with their location. The app will guide you through how to help, including CPR instructions if needed.',
    image: null,
    icon: 'medkit-outline',
  },
  {
    title: 'CPR Guide',
    description: 'STOMP includes a step-by-step CPR guide that you can access at any time. Familiarize yourself with these instructions so you\'re prepared in an emergency.',
    image: null,
    icon: 'pulse-outline',
  },
];

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialContainer: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0284C7',
    width: 16,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionScroll: {
    maxHeight: 150,
    width: '100%',
  },
  stepDescription: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#0284C7',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  placeholderButton: {
    width: 80,
  },
  nextButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});