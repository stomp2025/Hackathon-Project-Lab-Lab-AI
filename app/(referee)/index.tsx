"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"

interface Player {
  id: string
  name: string
  jerseyNumber: number
  status: "normal" | "warning" | "emergency"
  team: "A" | "B"
}

interface MatchStatus {
  isActive: boolean
  isPaused: boolean
  timeElapsed: number
  emergencyPause: boolean
}

export default function RefereeScreen() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "John Doe", jerseyNumber: 10, status: "normal", team: "A" },
    { id: "2", name: "Jane Smith", jerseyNumber: 7, status: "normal", team: "A" },
    { id: "3", name: "Mike Johnson", jerseyNumber: 15, status: "warning", team: "B" },
    { id: "4", name: "Sarah Wilson", jerseyNumber: 22, status: "normal", team: "B" },
  ])

  const [matchStatus, setMatchStatus] = useState<MatchStatus>({
    isActive: false,
    isPaused: false,
    timeElapsed: 0,
    emergencyPause: false,
  })

  const [emergencyAlerts, setEmergencyAlerts] = useState<number>(0)

  useEffect(() => {
    // Simulate real-time player status updates
    const interval = setInterval(() => {
      const emergencyCount = players.filter((p) => p.status === "emergency").length
      setEmergencyAlerts(emergencyCount)
    }, 1000)

    return () => clearInterval(interval)
  }, [players])

  const handleEmergencyPause = () => {
    Alert.alert("Emergency Pause", "This will immediately pause the match for medical emergency. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Emergency Pause",
        style: "destructive",
        onPress: () => {
          setMatchStatus((prev) => ({
            ...prev,
            isPaused: true,
            emergencyPause: true,
          }))
          // Trigger emergency protocol
          router.push("/(referee)/emergency-protocol")
        },
      },
    ])
  }

  const handleMatchControl = () => {
    router.push("/(referee)/emergency-protocol" as any)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#4CAF50"
      case "warning":
        return "#FFA500"
      case "emergency":
        return "#FF4444"
      default:
        return "#666"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return "check-circle"
      case "warning":
        return "warning"
      case "emergency":
        return "emergency"
      default:
        return "help"
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Emergency Alert Banner */}
      {emergencyAlerts > 0 && (
        <View style={styles.emergencyBanner}>
          <MaterialIcons name="warning" size={24} color="#fff" />
          <Text style={styles.emergencyText}>
            {emergencyAlerts} EMERGENCY ALERT{emergencyAlerts > 1 ? "S" : ""}
          </Text>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyPause}>
            <Text style={styles.emergencyButtonText}>PAUSE MATCH</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Match Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Status</Text>
        <View style={styles.matchStatusCard}>
          <View style={styles.matchStatusRow}>
            <Text style={styles.matchStatusLabel}>Match Active:</Text>
            <Switch
              value={matchStatus.isActive}
              onValueChange={(value) => setMatchStatus((prev) => ({ ...prev, isActive: value }))}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>

          <View style={styles.matchStatusRow}>
            <Text style={styles.matchStatusLabel}>Status:</Text>
            <Text
              style={[
                styles.matchStatusValue,
                { color: matchStatus.emergencyPause ? "#FF4444" : matchStatus.isPaused ? "#FFA500" : "#4CAF50" },
              ]}
            >
              {matchStatus.emergencyPause
                ? "EMERGENCY PAUSE"
                : matchStatus.isPaused
                  ? "PAUSED"
                  : matchStatus.isActive
                    ? "ACTIVE"
                    : "STOPPED"}
            </Text>
          </View>

          <TouchableOpacity style={styles.matchControlButton} onPress={handleMatchControl}>
            <MaterialIcons name="sports" size={20} color="#fff" />
            <Text style={styles.matchControlText}>Match Control</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Players Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Players Status</Text>

        {/* Team A */}
        <View style={styles.teamSection}>
          <Text style={styles.teamTitle}>Team A</Text>
          {players
            .filter((p) => p.team === "A")
            .map((player) => (
              <View key={player.id} style={styles.playerCard}>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerNumber}>#{player.jerseyNumber}</Text>
                  <Text style={styles.playerName}>{player.name}</Text>
                </View>
                <View style={styles.playerStatus}>
                  <MaterialIcons name={getStatusIcon(player.status)} size={20} color={getStatusColor(player.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(player.status) }]}>
                    {player.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Team B */}
        <View style={styles.teamSection}>
          <Text style={styles.teamTitle}>Team B</Text>
          {players
            .filter((p) => p.team === "B")
            .map((player) => (
              <View key={player.id} style={styles.playerCard}>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerNumber}>#{player.jerseyNumber}</Text>
                  <Text style={styles.playerName}>{player.name}</Text>
                </View>
                <View style={styles.playerStatus}>
                  <MaterialIcons name={getStatusIcon(player.status)} size={20} color={getStatusColor(player.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(player.status) }]}>
                    {player.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="local-hospital" size={24} color="#FF4444" />
          <Text style={styles.actionText}>Emergency Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="healing" size={24} color="#4CAF50" />
          <Text style={styles.actionText}>Medical Protocol</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="report" size={24} color="#FFA500" />
          <Text style={styles.actionText}>Incident Report</Text>
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
  emergencyBanner: {
    backgroundColor: "#FF4444",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
  },
  emergencyText: {
    color: "#fff",
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
  },
  emergencyButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  emergencyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
  matchStatusCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  matchStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  matchStatusLabel: {
    fontSize: 16,
    color: "#333",
  },
  matchStatusValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  matchControlButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  matchControlText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  teamSection: {
    marginBottom: 20,
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 10,
  },
  playerCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginRight: 10,
  },
  playerName: {
    fontSize: 14,
    color: "#333",
  },
  playerStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  actionButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
})
