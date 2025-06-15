"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Vibration } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

const { width } = Dimensions.get("window")

// Compression rate: 100-120 compressions per minute (1 compression every 0.5-0.6 seconds)
const COMPRESSION_INTERVAL = 600 // milliseconds
const TOTAL_COMPRESSIONS = 30
const RESCUE_BREATHS = 2
const BREATH_DURATION = 1000 // 1 second per breath

export default function AutomatedCPRScreen() {
  const insets = useSafeAreaInsets()
  const [isActive, setIsActive] = useState(false)
  const [currentCompression, setCurrentCompression] = useState(0)
  const [currentPhase, setCurrentPhase] = useState<"compressions" | "breaths">("compressions")
  const [currentBreath, setCurrentBreath] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null)

  const pulseScale = useSharedValue(1)
  const breathScale = useSharedValue(1)

  useEffect(() => {
    if (isActive) {
      // Start the elapsed time counter
      elapsedTimerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current)
      }
    }

    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current)
      }
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      if (currentPhase === "compressions") {
        // Start compression sequence
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.3, { duration: COMPRESSION_INTERVAL * 0.5, easing: Easing.out(Easing.quad) }),
            withTiming(1, { duration: COMPRESSION_INTERVAL * 0.5, easing: Easing.in(Easing.quad) }),
          ),
          -1,
        )

        // Vibrate with each compression
        timerRef.current = setInterval(() => {
          Vibration.vibrate(100)
          setCurrentCompression((prev) => {
            const next = prev + 1
            if (next > TOTAL_COMPRESSIONS) {
              // Switch to breaths phase
              clearInterval(timerRef.current!)
              setCurrentPhase("breaths")
              setCurrentCompression(0)
              return 0
            }
            return next
          })
        }, COMPRESSION_INTERVAL)
      } else if (currentPhase === "breaths") {
        // Start breath sequence
        breathScale.value = 1

        const handleBreath = () => {
          breathScale.value = withSequence(
            withTiming(1.5, { duration: BREATH_DURATION * 0.5 }),
            withTiming(1, { duration: BREATH_DURATION * 0.5 }),
          )

          setCurrentBreath((prev) => {
            const next = prev + 1
            if (next > RESCUE_BREATHS) {
              // Switch back to compressions and increment cycle
              setCurrentPhase("compressions")
              setCurrentBreath(0)
              setCycles((prev) => prev + 1)
              return 0
            }
            return next
          })
        }

        // Schedule the breaths
        timerRef.current = setTimeout(() => {
          handleBreath()

          // Schedule the second breath
          timerRef.current = setTimeout(() => {
            handleBreath()

            // After both breaths, go back to compressions
            timerRef.current = setTimeout(() => {
              setCurrentPhase("compressions")
              setCurrentBreath(0)
              setCycles((prev) => prev + 1)
            }, BREATH_DURATION)
          }, BREATH_DURATION * 2)
        }, 1000) // Small delay before first breath
      }
    } else {
      // Reset animation when stopped
      pulseScale.value = 1
      breathScale.value = 1

      // Clear any running timers
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        clearInterval(timerRef.current)
      }
    }
  }, [isActive, currentPhase])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    }
  })

  const breathStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: breathScale.value }],
    }
  })

  const handleToggleActive = () => {
    setIsActive(!isActive)
    if (!isActive) {
      // Starting a new session
      setCurrentCompression(0)
      setCurrentBreath(0)
      setCurrentPhase("compressions")
      setCycles(0)
      setElapsedTime(0)
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#121826"]} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Automated CPR Assistant</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Elapsed Time</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
          </View>

          <View style={styles.cycleContainer}>
            <BlurView intensity={30} tint="dark" style={styles.cycleCard}>
              <Text style={styles.cycleLabel}>Cycles Completed</Text>
              <Text style={styles.cycleValue}>{cycles}</Text>
            </BlurView>
          </View>

          <View style={styles.visualGuideContainer}>
            {currentPhase === "compressions" ? (
              <Animated.View style={[styles.compressionGuide, pulseStyle]}>
                <LinearGradient
                  colors={["rgba(255, 58, 94, 0.8)", "rgba(255, 58, 94, 0.2)"]}
                  style={styles.compressionGradient}
                >
                  <Ionicons name="heart" size={80} color="#fff" />
                  <Text style={styles.compressionCount}>{currentCompression}</Text>
                  <Text style={styles.compressionTotal}>of {TOTAL_COMPRESSIONS}</Text>
                </LinearGradient>
              </Animated.View>
            ) : (
              <Animated.View style={[styles.breathGuide, breathStyle]}>
                <LinearGradient
                  colors={["rgba(62, 100, 255, 0.8)", "rgba(62, 100, 255, 0.2)"]}
                  style={styles.breathGradient}
                >
                  <Ionicons name="medical" size={80} color="#fff" />
                  <Text style={styles.breathText}>
                    Breath {currentBreath} of {RESCUE_BREATHS}
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}
          </View>

          <View style={styles.instructionContainer}>
            {currentPhase === "compressions" ? (
              <Animated.View entering={FadeIn} exiting={FadeOut} key="compression-instructions">
                <Text style={styles.instructionTitle}>Perform Chest Compressions</Text>
                <Text style={styles.instructionText}>
                  Push hard and fast in the center of the chest, allowing complete recoil between compressions.
                </Text>
                <View style={styles.tipContainer}>
                  <Ionicons name="information-circle" size={20} color="#3E64FF" />
                  <Text style={styles.tipText}>Aim for a depth of 2 inches (5 cm) for adults</Text>
                </View>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn} exiting={FadeOut} key="breath-instructions">
                <Text style={styles.instructionTitle}>Give Rescue Breaths</Text>
                <Text style={styles.instructionText}>
                  Tilt the head back, lift the chin, pinch the nose, and give a breath lasting about 1 second.
                </Text>
                <View style={styles.tipContainer}>
                  <Ionicons name="information-circle" size={20} color="#3E64FF" />
                  <Text style={styles.tipText}>Watch for the chest to rise with each breath</Text>
                </View>
              </Animated.View>
            )}
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleToggleActive}>
            <LinearGradient
              colors={isActive ? ["#FF5757", "#FF3A5E"] : ["#3E64FF", "#5A7FFF"]}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>{isActive ? "Pause Assistant" : "Start Assistant"}</Text>
              <Ionicons name={isActive ? "pause" : "play"} size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1E",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  timerLabel: {
    color: "#B0B7C3",
    fontSize: 16,
  },
  timerValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "600",
  },
  cycleContainer: {
    marginBottom: 24,
  },
  cycleCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cycleLabel: {
    color: "#B0B7C3",
    fontSize: 16,
  },
  cycleValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
  },
  visualGuideContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginBottom: 24,
  },
  compressionGuide: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  compressionGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  compressionCount: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "700",
  },
  compressionTotal: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  breathGuide: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  breathGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  breathText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
  },
  instructionContainer: {
    marginBottom: 32,
    minHeight: 120,
  },
  instructionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  instructionText: {
    color: "#B0B7C3",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(62, 100, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
  },
  tipText: {
    color: "#B0B7C3",
    fontSize: 14,
    marginLeft: 8,
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
})
