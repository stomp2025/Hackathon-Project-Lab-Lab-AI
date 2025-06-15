"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"

export default function EmergencyAssistScreen() {
  const [emergencyTeammate] = useState({
    name: "James Wilson",
    location: "Locker Room",
    distance: 80,
    emergencyType: "Cardiac Arrest",
    timeElapsed: 0,
  })

  const [timeElapsed, setTimeElapsed] = useState(0)
  const [assistanceProvided, setAssistanceProvided] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCallEmergency = () => {
    Alert.alert("Call Emergency Services", "This will call 112 immediately", [
      { text: "Cancel", style: "cancel" },
      { text: "Call 112", onPress: () => Linking.openURL("tel:112") },
    ])
  }

  const handleStartCPR = () => {
    Alert.alert("Start CPR Assistance", "Are you trained in CPR? This will guide you through the process.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start CPR",
        onPress: () => {
          setAssistanceProvided(true)
          router.push("/(emergency)/cpr-guide")
        },
      },
    ])
  }

  const handleGetDirections = () => {
    Alert.alert("Getting directions to Locker Room...")
  }

  const handleNotifyCoach = () => {
    Alert.alert("Coach and medical staff have been notified")
  }

  return (
    <ScrollView style={styles.container}>
      {/* Emergency Header */}
      <View style={styles.emergencyHeader}>
        <MaterialIcons name="emergency" size={32} color="#fff" />
        <View style={styles.emergencyInfo}>
          <Text style={styles.emergencyTitle}>TEAMMATE EMERGENCY</Text>
          <Text style={styles.emergencySubtitle}>{emergencyTeammate.name}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
          <Text style={styles.timerLabel}>Elapsed</Text>
        </View>
      </View>

      {/* Emergency Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={20} color="#666" />
            <Text style={styles.detailLabel}>Teammate:</Text>
            <Text style={styles.detailValue}>{emergencyTeammate.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="warning" size={20} color="#FF4444" />
            <Text style={styles.detailLabel}>Emergency:</Text>
            <Text style={styles.detailValue}>{emergencyTeammate.emergencyType}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{emergencyTeammate.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="near-me" size={20} color="#666" />
            <Text style={styles.detailLabel}>Distance:</Text>
            <Text style={styles.detailValue}>{emergencyTeammate.distance}m away</Text>
          </View>
        </View>
      </View>

      {/* Immediate Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Immediate Actions</Text>

        <TouchableOpacity style={[styles.actionButton, styles.emergencyAction]} onPress={handleCallEmergency}>
          <MaterialIcons name="phone" size={24} color="#fff" />
          <Text style={styles.emergencyActionText}>Call Emergency Services (112)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.cprAction]} onPress={handleStartCPR}>
          <MaterialIcons name="healing" size={24} color="#fff" />
          <Text style={styles.cprActionText}>{assistanceProvided ? "CPR in Progress" : "Start CPR Assistance"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.navigationAction]} onPress={handleGetDirections}>
          <MaterialIcons name="directions" size={24} color="#fff" />
          <Text style={styles.navigationActionText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Support Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support Actions</Text>

        <TouchableOpacity style={styles.supportButton} onPress={handleNotifyCoach}>
          <MaterialIcons name="sports" size={20} color="#2196F3" />
          <Text style={styles.supportButtonText}>Notify Coach</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportButton}>
          <MaterialIcons name="local-hospital" size={20} color="#2196F3" />
          <Text style={styles.supportButtonText}>Contact Team Doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportButton}>
          <MaterialIcons name="group" size={20} color="#2196F3" />
          <Text style={styles.supportButtonText}>Alert Other Teammates</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportButton}>
          <MaterialIcons name="flash-on" size={20} color="#2196F3" />
          <Text style={styles.supportButtonText}>Find Nearest AED</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Instructions</Text>
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionStep}>1. Stay calm and assess the situation</Text>
          <Text style={styles.instructionStep}>2. Call emergency services immediately</Text>
          <Text style={styles.instructionStep}>3. Check if teammate is responsive</Text>
          <Text style={styles.instructionStep}>4. If trained, begin CPR if needed</Text>
          <Text style={styles.instructionStep}>5. Clear the area and wait for help</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  emergencyHeader: {
    backgroundColor: "#FF4444",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  emergencyInfo: {
    flex: 1,
    marginLeft: 15,
  },
  emergencyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emergencySubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  timerContainer: {
    alignItems: "center",
  },
  timerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  timerLabel: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  emergencyAction: {
    backgroundColor: "#FF4444",
  },
  emergencyActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cprAction: {
    backgroundColor: "#4CAF50",
  },
  cprActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  navigationAction: {
    backgroundColor: "#2196F3",
  },
  navigationActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  supportButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  supportButtonText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  instructionsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  instructionStep: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
})
