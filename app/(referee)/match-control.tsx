"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"

export default function MatchControlScreen() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [period, setPeriod] = useState(1)
  const [score, setScore] = useState({ teamA: 0, teamB: 0 })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setTime(0)
    setIsRunning(false)
  }

  const handleNextPeriod = () => {
    setPeriod((prev) => prev + 1)
    setTime(0)
    setIsRunning(false)
  }

  const handleScore = (team: "A" | "B", action: "add" | "subtract") => {
    setScore((prev) => ({
      ...prev,
      [team === "A" ? "teamA" : "teamB"]: prev[team === "A" ? "teamA" : "teamB"] + (action === "add" ? 1 : -1),
    }))
  }

  return (
    <ScrollView style={styles.container}>
      {/* Timer Section */}
      <View style={styles.section}>
        <Text style={styles.periodText}>Period {period}</Text>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
        <View style={styles.timerControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleStartStop}>
            <MaterialIcons name={isRunning ? "pause" : "play-arrow"} size={24} color="#fff" />
            <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
            <MaterialIcons name="refresh" size={24} color="#fff" />
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleNextPeriod}>
            <MaterialIcons name="skip-next" size={24} color="#fff" />
            <Text style={styles.buttonText}>Next Period</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Score Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Score</Text>
        <View style={styles.scoreContainer}>
          <View style={styles.teamScore}>
            <Text style={styles.teamLabel}>Team A</Text>
            <Text style={styles.scoreText}>{score.teamA}</Text>
            <View style={styles.scoreControls}>
              <TouchableOpacity
                style={[styles.scoreButton, styles.addButton]}
                onPress={() => handleScore("A", "add")}
              >
                <MaterialIcons name="add" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scoreButton, styles.subtractButton]}
                onPress={() => handleScore("A", "subtract")}
              >
                <MaterialIcons name="remove" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.teamScore}>
            <Text style={styles.teamLabel}>Team B</Text>
            <Text style={styles.scoreText}>{score.teamB}</Text>
            <View style={styles.scoreControls}>
              <TouchableOpacity
                style={[styles.scoreButton, styles.addButton]}
                onPress={() => handleScore("B", "add")}
              >
                <MaterialIcons name="add" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scoreButton, styles.subtractButton]}
                onPress={() => handleScore("B", "subtract")}
              >
                <MaterialIcons name="remove" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.emergencyButton]}
          onPress={() => router.push("/(referee)/emergency-protocol")}
        >
          <MaterialIcons name="warning" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Emergency Protocol</Text>
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
  section: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  periodText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  controlButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  teamScore: {
    alignItems: "center",
  },
  teamLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 10,
  },
  scoreControls: {
    flexDirection: "row",
    gap: 10,
  },
  scoreButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  subtractButton: {
    backgroundColor: "#FF4444",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  emergencyButton: {
    backgroundColor: "#FF4444",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
  },
}) 