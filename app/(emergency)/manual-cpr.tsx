"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

const { width } = Dimensions.get("window")

interface CPRStep {
  id: number
  title: string
  description: string
  imageUrl: string
  tips: string[]
}

const cprSteps: CPRStep[] = [
  {
    id: 1,
    title: "Check Responsiveness",
    description:
      "Tap the person's shoulder and shout 'Are you OK?' to check if they're responsive. If there's no response, proceed to the next step.",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
    tips: ["Make sure the scene is safe before approaching", "Look for signs of breathing or movement"],
  },
  {
    id: 2,
    title: "Call Emergency Services",
    description:
      "Call your local emergency number (911, 112, or 999) immediately or ask someone else to call while you begin CPR.",
    imageUrl: "https://images.unsplash.com/photo-1521790361543-f645cf042ec4?auto=format&fit=crop&w=800&q=80",
    tips: ["Stay on the line with emergency services", "Put your phone on speaker if you're alone"],
  },
  {
    id: 3,
    title: "Position the Person",
    description:
      "Place the person on their back on a firm, flat surface. Kneel beside their chest and position yourself for compressions.",
    imageUrl: "https://images.unsplash.com/photo-1584516194859-4e02f0f3f4a4?auto=format&fit=crop&w=800&q=80",
    tips: ["Remove bulky clothing from the chest", "Ensure there's enough space around you to perform CPR"],
  },
  {
    id: 4,
    title: "Begin Chest Compressions",
    description:
      "Place the heel of one hand on the center of the chest, place your other hand on top, and interlock your fingers. Push hard and fast at a rate of 100-120 compressions per minute.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d99971?auto=format&fit=crop&w=800&q=80",
    tips: [
      "Push at least 2 inches (5 cm) deep for adults",
      "Allow the chest to fully recoil between compressions",
      "Try to minimize interruptions to compressions",
    ],
  },
  {
    id: 5,
    title: "Give Rescue Breaths (if trained)",
    description:
      "After 30 compressions, give 2 rescue breaths. Tilt the head back, lift the chin, pinch the nose, and create a seal over their mouth with yours. Each breath should last about 1 second and make the chest rise.",
    imageUrl: "https://images.unsplash.com/photo-1584516194924-7ff1c9f94df1?auto=format&fit=crop&w=800&q=80",
    tips: [
      "If you're not trained or uncomfortable, continue with hands-only CPR (compressions only)",
      "Use a barrier device if available",
      "If the chest doesn't rise, reposition the head and try again",
    ],
  },
  {
    id: 6,
    title: "Continue CPR",
    description:
      "Continue the cycle of 30 compressions followed by 2 rescue breaths until emergency services arrive or the person shows signs of life.",
    imageUrl: "https://images.unsplash.com/photo-1584516194977-5f697c8d91dc?auto=format&fit=crop&w=800&q=80",
    tips: [
      "If possible, switch rescuers every 2 minutes to prevent fatigue",
      "Don't stop CPR unless the person shows signs of life, emergency services take over, or you're too exhausted to continue",
    ],
  },
]

export default function ManualCPRScreen() {
  const insets = useSafeAreaInsets()
  const [currentStep, setCurrentStep] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const handleNextStep = () => {
    if (currentStep < cprSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#121826"]} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manual CPR Guide</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentStep + 1) / cprSteps.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {cprSteps.length}
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <Animated.View entering={FadeInDown.duration(500)} key={currentStep}>
            <Text style={styles.stepTitle}>{cprSteps[currentStep].title}</Text>

            <View style={styles.imageContainer}>
              <Image source={{ uri: cprSteps[currentStep].imageUrl }} style={styles.stepImage} resizeMode="cover" />
            </View>

            <BlurView intensity={30} tint="dark" style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{cprSteps[currentStep].description}</Text>
            </BlurView>

            <Text style={styles.tipsTitle}>Important Tips:</Text>
            {cprSteps[currentStep].tips.map((tip, index) => (
              <View key={index} style={styles.tipContainer}>
                <View style={styles.tipBullet}>
                  <Ionicons name="checkmark" size={16} color="#FF3A5E" />
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Animated.View>
        </ScrollView>

        <View style={[styles.navigationContainer, { paddingBottom: insets.bottom || 16 }]}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
            onPress={handlePrevStep}
            disabled={currentStep === 0}
          >
            <Ionicons name="arrow-back" size={24} color={currentStep === 0 ? "#8d9cb8" : "#fff"} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledButtonText]}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, currentStep === cprSteps.length - 1 && styles.disabledButton]}
            onPress={handleNextStep}
            disabled={currentStep === cprSteps.length - 1}
          >
            <Text style={[styles.navButtonText, currentStep === cprSteps.length - 1 && styles.disabledButtonText]}>
              Next
            </Text>
            <Ionicons name="arrow-forward" size={24} color={currentStep === cprSteps.length - 1 ? "#8d9cb8" : "#fff"} />
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
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF3A5E",
    borderRadius: 3,
  },
  progressText: {
    color: "#B0B7C3",
    fontSize: 14,
    textAlign: "right",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  stepTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  stepImage: {
    width: "100%",
    height: "100%",
  },
  descriptionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  descriptionText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  tipsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 58, 94, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    color: "#B0B7C3",
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: "#8d9cb8",
  },
})
