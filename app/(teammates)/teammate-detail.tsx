"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"

type TeammateDetailParams = {
  name?: string
  id?: string
}

export default function TeammateDetailScreen() {
  const params = useLocalSearchParams<TeammateDetailParams>()
  const teammateName = params.name || "Teammate"

  // Données fictives pour la démonstration
  const teammateData = {
    name: teammateName,
    position: "Forward",
    number: "10",
    stats: {
      matches: 15,
      goals: 8,
      assists: 5,
      yellowCards: 2,
      redCards: 0,
    },
    health: {
      heartRate: "72 bpm",
      oxygen: "98%",
      temperature: "36.5°C",
      lastCheck: "5 min ago",
    },
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{teammateData.name.charAt(0)}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{teammateData.name}</Text>
            <Text style={styles.position}>#{teammateData.number} • {teammateData.position}</Text>
          </View>
        </View>
      </View>

      {/* Health Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Status</Text>
        <View style={styles.healthGrid}>
          <View style={styles.healthItem}>
            <MaterialIcons name="favorite" size={24} color="#FF4444" />
            <Text style={styles.healthLabel}>Heart Rate</Text>
            <Text style={styles.healthValue}>{teammateData.health.heartRate}</Text>
          </View>
          <View style={styles.healthItem}>
            <MaterialIcons name="air" size={24} color="#2196F3" />
            <Text style={styles.healthLabel}>Oxygen</Text>
            <Text style={styles.healthValue}>{teammateData.health.oxygen}</Text>
          </View>
          <View style={styles.healthItem}>
            <MaterialIcons name="thermostat" size={24} color="#FF9800" />
            <Text style={styles.healthLabel}>Temperature</Text>
            <Text style={styles.healthValue}>{teammateData.health.temperature}</Text>
          </View>
          <View style={styles.healthItem}>
            <MaterialIcons name="update" size={24} color="#4CAF50" />
            <Text style={styles.healthLabel}>Last Check</Text>
            <Text style={styles.healthValue}>{teammateData.health.lastCheck}</Text>
          </View>
        </View>
      </View>

      {/* Statistics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Season Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{teammateData.stats.matches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{teammateData.stats.goals}</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{teammateData.stats.assists}</Text>
            <Text style={styles.statLabel}>Assists</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{teammateData.stats.yellowCards}</Text>
            <Text style={styles.statLabel}>Yellow Cards</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{teammateData.stats.redCards}</Text>
            <Text style={styles.statLabel}>Red Cards</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.emergencyButton]}
          onPress={() => router.push("/(teammates)/emergency-assist")}
        >
          <MaterialIcons name="warning" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Emergency Assistance</Text>
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
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    paddingTop: 40,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  nameContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  position: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
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
  healthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  healthItem: {
    width: "48%",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  healthLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "30%",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
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