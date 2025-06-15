"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

const { width } = Dimensions.get("window")

export default function CPRGuideScreen() {
  const insets = useSafeAreaInsets()
  const [selectedMode, setSelectedMode] = useState<"manual" | "automated" | null>(null)

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#121826"]} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CPR Emergency Guide</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(300).duration(800)}>
            <View style={styles.emergencyNotice}>
              <View style={styles.emergencyIcon}>
                <Ionicons name="warning-outline" size={24} color="#FF3A5E" />
              </View>
              <Text style={styles.emergencyText}>
                In case of cardiac emergency, call emergency services immediately (911/112/999) before starting CPR.
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(800)}>
            <Text style={styles.sectionTitle}>Select CPR Guide Mode</Text>

            <TouchableOpacity
              style={[styles.modeCard, selectedMode === "manual" && styles.selectedCard]}
              onPress={() => setSelectedMode("manual")}
            >
              <BlurView intensity={30} tint="dark" style={styles.modeCardContent}>
                <View style={styles.modeIconContainer}>
                  <Ionicons name="document-text" size={32} color="#FF3A5E" />
                </View>
                <View style={styles.modeTextContainer}>
                  <Text style={styles.modeTitle}>Manual Guide</Text>
                  <Text style={styles.modeDescription}>
                    Step-by-step instructions for performing CPR with detailed explanations.
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, selectedMode === "automated" && styles.selectedCard]}
              onPress={() => setSelectedMode("automated")}
            >
              <BlurView intensity={30} tint="dark" style={styles.modeCardContent}>
                <View style={styles.modeIconContainer}>
                  <Ionicons name="play-circle" size={32} color="#FF3A5E" />
                </View>
                <View style={styles.modeTextContainer}>
                  <Text style={styles.modeTitle}>Automated Assistant</Text>
                  <Text style={styles.modeDescription}>
                    Interactive guide with real-time instructions, timing, and feedback.
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {selectedMode && (
            <Animated.View entering={FadeIn.duration(800)} style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push(`/(emergency)/${selectedMode}-cpr`)}
              >
                <LinearGradient
                  colors={["#FF3A5E", "#FF5757"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Start Guide</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(700).duration(800)}>
            <Text style={styles.sectionTitle}>CPR Basics</Text>

            <BlurView intensity={30} tint="dark" style={styles.infoCard}>
              <Text style={styles.infoTitle}>When to Perform CPR</Text>
              <Text style={styles.infoText}>
                Perform CPR when someone is unresponsive and not breathing or only gasping. CPR helps maintain blood
                flow to vital organs until advanced medical help arrives.
              </Text>
            </BlurView>

            <BlurView intensity={30} tint="dark" style={styles.infoCard}>
              <Text style={styles.infoTitle}>CPR Steps Overview</Text>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepText}>Check for responsiveness and call for emergency help</Text>
              </View>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepText}>Ensure the person is on a firm, flat surface</Text>
              </View>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>3</Text>
                </View>
                <Text style={styles.stepText}>Begin chest compressions (100-120 per minute)</Text>
              </View>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>4</Text>
                </View>
                <Text style={styles.stepText}>Give rescue breaths if trained and willing</Text>
              </View>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>5</Text>
                </View>
                <Text style={styles.stepText}>Continue until help arrives or the person shows signs of life</Text>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
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
  emergencyNotice: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 58, 94, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 58, 94, 0.3)",
  },
  emergencyIcon: {
    marginRight: 12,
  },
  emergencyText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  modeCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedCard: {
    borderColor: "#FF3A5E",
    borderWidth: 2,
  },
  modeCardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  modeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 58, 94, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  modeDescription: {
    color: "#B0B7C3",
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    marginVertical: 24,
  },
  startButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoText: {
    color: "#B0B7C3",
    fontSize: 14,
    lineHeight: 20,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 58, 94, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: {
    color: "#FF3A5E",
    fontSize: 14,
    fontWeight: "600",
  },
  stepText: {
    color: "#B0B7C3",
    fontSize: 14,
    flex: 1,
  },
})
