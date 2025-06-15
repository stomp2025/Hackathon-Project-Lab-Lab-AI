import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

type CPRGuideProps = {
  onComplete?: () => void;
};

const CPR_STEPS = [
  {
    title: 'Check Responsiveness',
    instructions: 'Tap the person and shout "Are you OK?"',
    duration: 5, // seconds
  },
  {
    title: 'Call for Help',
    instructions: 'Ask someone to call emergency services (911/112/999)',
    duration: 5,
  },
  {
    title: 'Check Breathing',
    instructions: 'Look, listen, and feel for breathing for 10 seconds',
    duration: 10,
  },
  {
    title: 'Begin Chest Compressions',
    instructions: 'Place hands on center of chest. Push hard and fast at a rate of 100-120 compressions per minute.',
    duration: 30,
  },
  {
    title: 'Give Rescue Breaths',
    instructions: 'Tilt head back, pinch nose, and give 2 breaths. Each breath should take 1 second.',
    duration: 5,
  },
  {
    title: 'Continue CPR',
    instructions: 'Alternate 30 chest compressions with 2 rescue breaths',
    duration: 30,
  },
  {
    title: 'Use AED if Available',
    instructions: 'Turn on the AED and follow the voice prompts',
    duration: 15,
  },
  {
    title: 'Continue Until Help Arrives',
    instructions: 'Continue CPR until emergency services arrive or the person shows signs of life',
    duration: 30,
  },
];

export const CPRGuide: React.FC<CPRGuideProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(CPR_STEPS[0].duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Load metronome sound
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/metronome.mp3'),
          { isLooping: true }
        );
        setSound(sound);
      } catch (error) {
        console.error('Error loading sound', error);
      }
    };
    
    loadSound();
    
    return () => {
      if (sound) {
        sound.getStatusAsync().then(
          status => {
            if (status.isLoaded) {
              sound.unloadAsync().catch(error => 
                console.error('Error unloading sound:', error)
              );
            }
          }
        ).catch(error => console.error('Error getting sound status during cleanup:', error));
      }
    };
  }, []);
  
  // Handle step timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (isPlaying && timeRemaining === 0) {
      // Move to next step
      if (currentStepIndex < CPR_STEPS.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setTimeRemaining(CPR_STEPS[currentStepIndex + 1].duration);
        // Vibrate to indicate step change
        Vibration.vibrate(500);
      } else {
        // End of guide
        setIsPlaying(false);
        if (onComplete) onComplete();
      }
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, timeRemaining, currentStepIndex, onComplete]);
  
  // Pulse animation for compression rhythm
  useEffect(() => {
    if (isPlaying && currentStepIndex === 3) { // During chest compressions
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 300, // 100-120 BPM is about 500-600ms per cycle
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Play metronome sound
      if (sound) {
        sound.playAsync().catch(error => console.error('Error playing sound:', error));
      }
      
      // Vibrate in rhythm with compressions
      const vibrationPattern = [];
      for (let i = 0; i < 15; i++) { // 15 vibrations (30 seconds at 2 seconds per cycle)
        vibrationPattern.push(100, 500); // 100ms vibration, 500ms pause
      }
      Vibration.vibrate(vibrationPattern, true);
    } else {
      // Stop animation and sound for other steps
      pulseAnim.setValue(1);
      if (sound) {
        sound.getStatusAsync().then(
          status => {
            if (status.isLoaded) {
              sound.stopAsync().catch(error => console.error('Error stopping sound:', error));
            }
          }
        ).catch(error => console.error('Error getting sound status:', error));
      }
      Vibration.cancel();
    }
    
    return () => {
      if (sound) {
        sound.getStatusAsync().then(
          status => {
            if (status.isLoaded) {
              sound.stopAsync().catch(error => console.error('Error stopping sound in cleanup:', error));
            }
          }
        ).catch(error => console.error('Error getting sound status in cleanup:', error));
      }
      Vibration.cancel();
    };
  }, [isPlaying, currentStepIndex, sound, pulseAnim]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const resetGuide = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setTimeRemaining(CPR_STEPS[0].duration);
  };
  
  const currentStep = CPR_STEPS[currentStepIndex];
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ff4b4b', '#ff6b6b']}
        style={styles.header}
      >
        <Text style={styles.title}>CPR Guide</Text>
        <Text style={styles.subtitle}>Follow these steps carefully</Text>
      </LinearGradient>
      
      <View style={styles.stepContainer}>
        <Text style={styles.stepCounter}>
          Step {currentStepIndex + 1} of {CPR_STEPS.length}
        </Text>
        
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        
        <Animated.View 
          style={[styles.instructionBox, 
            currentStepIndex === 3 && { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Text style={styles.instructions}>{currentStep.instructions}</Text>
        </Animated.View>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {timeRemaining} seconds
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { 
                width: `${(timeRemaining / currentStep.duration) * 100}%` 
              }]}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.controls}>
        <Pressable 
          style={[styles.button, styles.resetButton]} 
          onPress={resetGuide}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, isPlaying ? styles.pauseButton : styles.playButton]} 
          onPress={togglePlayPause}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? 'Pause' : 'Start'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  header: {
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  stepContainer: {
    padding: 20,
  },
  stepCounter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  instructionBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#eaeaea',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff4b4b',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#f0f0f0',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFA000',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CPRGuide;