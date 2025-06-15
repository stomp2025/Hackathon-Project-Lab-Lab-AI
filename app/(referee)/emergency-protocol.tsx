"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

export default function EmergencyProtocolScreen() {
  const [protocolStep, setProtocolStep] = useState(0)
  const [matchPaused, setMatchPaused] = useState(true)

  const protocolSteps = [
    {
      title: "Immediate Match Pause",
      description: "Match has been paused for medical emergency",
      action: "Signal all players to stop immediately",
      completed: true,
    },
    {
      title: "Secure the Area",
      description: "Clear space around the affected player",
      action: "Direct players and staff away from the incident",
      completed: false,
    },
    {
      title: "Medical Assessment",
      description: "Allow medical staff to assess the situation",
      action: "Ensure medical team has clear access",
      completed: false,
    },
    {
      title: "Emergency Services",
      description: "Contact emergency services if required",
      action: "Call 112 if situation is critical",
      completed: false,
    },
    {
      title: "Communication",
      description: "Inform relevant parties about the situation",
      action: "Update match officials and team management",
      completed: false,
    },
  ]

  const handleStepComplete = (stepIndex: number) => {
    Alert.alert("Complete Step", `Mark "${protocolSteps[stepIndex].title}" as completed?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: () => {
          // Update step completion status
          setProtocolStep(stepIndex + 1)
        },
      },
    ])
  }

  const handleResumeMatch = () => {
    Alert.alert("Resume Match", "Are you sure the emergency has been resolved and it's safe to resume?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Resume",
        onPress: () => {
          setMatchPaused(false)
          Alert.alert("Match Resumed", "The match has been resumed.")
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      {/* Emergency Status */}
      <View style={styles.statusHeader}>
        <MaterialIcons name="emergency" size={32} color="#fff" />
        <View style={styles.statusInfo}>
          <Text style={styles.statusTitle}>EMERGENCY PROTOCOL ACTIVE</Text>
          <Text style={styles.statusSubtitle}>Match Status: {matchPaused ? "PAUSED" : "ACTIVE"}</Text>
        </View>
      </View>

      {/* Protocol Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Protocol Steps</Text>

        {protocolSteps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepCard,
              step.completed && styles.completedStep,
              index === protocolStep && styles.activeStep,
            ]}
          >
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              <MaterialIcons
                name={step.completed ? "check-circle" : "radio-button-unchecked"}
                size={24}
                color={step.completed ? "#4CAF50" : "#666"}
              />
            </View>

            <Text style={styles.stepAction}>Action: {step.action}</Text>

            {!step.completed && index === protocolStep && (
              <TouchableOpacity style={styles.completeButton} onPress={() => handleStepComplete(index)}>
                <Text style={styles.completeButtonText}>Mark as Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>

        <TouchableOpacity style={styles.contactButton}>
          <MaterialIcons name="phone" size={20} color="#FF4444" />
          <Text style={styles.contactText}>Emergency Services (112)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton}>
          <MaterialIcons name="local-hospital" size={20} color="#2196F3" />
          <Text style={styles.contactText}>Venue Medical Officer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton}>
          <MaterialIcons name="sports" size={20} color="#4CAF50" />
          <Text style={styles.contactText}>Match Commissioner</Text>
        </TouchableOpacity>
      </View>

      {/* Match Control */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Control</Text>

        {matchPaused ? (
          <TouchableOpacity style={styles.resumeButton} onPress={handleResumeMatch}>
            <MaterialIcons name="play-arrow" size={24} color="#fff" />
            <Text style={styles.resumeButtonText}>Resume Match</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.matchActiveIndicator}>
            <MaterialIcons name="sports" size={24} color="#4CAF50" />
            <Text style={styles.matchActiveText}>Match is Active</Text>
          </View>
        )}
      </View>

      {/* Incident Report */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Incident Documentation</Text>

        <TouchableOpacity style={styles.reportButton}>
          <MaterialIcons name="description" size={20} color="#666" />
          <Text style={styles.reportText}>Create Incident Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportButton}>
          <MaterialIcons name="camera-alt" size={20} color="#666" />
          <Text style={styles.reportText}>Add Photos/Evidence</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statusHeader: {
    backgroundColor: "#FF4444",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  statusInfo: {
    flex: 1,
    marginLeft: 15,
  },
  statusTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  completedStep: {
    backgroundColor: "#E8F5E8",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  activeStep: {
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  stepAction: {
    fontSize: 14,
    color: "#2196F3",
    fontStyle: "italic",
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  contactButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  resumeButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  resumeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  matchActiveIndicator: {
    backgroundColor: "#E8F5E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  matchActiveText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  reportButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  reportText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
})
