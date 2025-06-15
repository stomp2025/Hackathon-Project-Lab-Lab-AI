"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"

interface Teammate {
  id: string
  name: string
  position: string
  status: "normal" | "warning" | "emergency"
  location: string
  distance: number // in meters
  lastUpdate: Date
  heartRate?: number
  isOnline: boolean
}

export default function TeammatesScreen() {
  const [teammates, setTeammates] = useState<Teammate[]>([
    {
      id: "1",
      name: "Alex Rodriguez",
      position: "Forward",
      status: "normal",
      location: "Training Field A",
      distance: 25,
      lastUpdate: new Date(),
      heartRate: 78,
      isOnline: true,
    },
    {
      id: "2",
      name: "Maria Garcia",
      position: "Midfielder",
      status: "warning",
      location: "Gym",
      distance: 150,
      lastUpdate: new Date(Date.now() - 300000), // 5 minutes ago
      heartRate: 95,
      isOnline: true,
    },
    {
      id: "3",
      name: "James Wilson",
      position: "Defender",
      status: "emergency",
      location: "Locker Room",
      distance: 80,
      lastUpdate: new Date(Date.now() - 60000), // 1 minute ago
      heartRate: 45,
      isOnline: false,
    },
    {
      id: "4",
      name: "Sophie Chen",
      position: "Goalkeeper",
      status: "normal",
      location: "Training Field B",
      distance: 200,
      lastUpdate: new Date(),
      heartRate: 72,
      isOnline: true,
    },
  ])

  const [refreshing, setRefreshing] = useState(false)
  const [emergencyMode, setEmergencyMode] = useState(false)

  useEffect(() => {
    // Check for emergency situations
    const hasEmergency = teammates.some((t) => t.status === "emergency")
    setEmergencyMode(hasEmergency)

    if (hasEmergency) {
      // Trigger emergency notification
      Alert.alert("TEAMMATE EMERGENCY", "A teammate needs immediate assistance!", [
        { text: "View Details", onPress: () => handleEmergencyAssist() },
        { text: "Call 112", onPress: () => Alert.alert("Calling Emergency Services...") },
      ])
    }
  }, [teammates])

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const handleTeammatePress = (teammate: Teammate) => {
    router.push({
      pathname: "/(teammates)/teammate-detail",
      params: { teammateId: teammate.id },
    })
  }

  const handleEmergencyAssist = () => {
    router.push("/(teammates)/emergency-assist")
  }

  const handleReportIncident = () => {
    Alert.alert("Report Incident", "What type of incident would you like to report?", [
      { text: "Cancel", style: "cancel" },
      { text: "Medical Emergency", onPress: () => reportIncident("medical") },
      { text: "Injury", onPress: () => reportIncident("injury") },
      { text: "Equipment Issue", onPress: () => reportIncident("equipment") },
    ])
  }

  const reportIncident = (type: string) => {
    Alert.alert("Incident Reported", `${type} incident has been reported to the coach and medical staff.`)
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

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance}m`
    }
    return `${(distance / 1000).toFixed(1)}km`
  }

  const formatLastUpdate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Emergency Mode Banner */}
      {emergencyMode && (
        <View style={styles.emergencyBanner}>
          <MaterialIcons name="emergency" size={24} color="#fff" />
          <Text style={styles.emergencyText}>TEAMMATE EMERGENCY</Text>
          <TouchableOpacity style={styles.assistButton} onPress={handleEmergencyAssist}>
            <Text style={styles.assistButtonText}>ASSIST</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Team Status Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Status</Text>
        <View style={styles.statusOverview}>
          <View style={styles.statusItem}>
            <Text style={styles.statusNumber}>{teammates.filter((t) => t.status === "normal").length}</Text>
            <Text style={styles.statusLabel}>Normal</Text>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusNumber}>{teammates.filter((t) => t.status === "warning").length}</Text>
            <Text style={styles.statusLabel}>Warning</Text>
            <MaterialIcons name="warning" size={20} color="#FFA500" />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusNumber}>{teammates.filter((t) => t.status === "emergency").length}</Text>
            <Text style={styles.statusLabel}>Emergency</Text>
            <MaterialIcons name="emergency" size={20} color="#FF4444" />
          </View>
        </View>
      </View>

      {/* Teammates List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teammates</Text>
        {teammates.map((teammate) => (
          <TouchableOpacity
            key={teammate.id}
            style={[styles.teammateCard, teammate.status === "emergency" && styles.emergencyCard]}
            onPress={() => handleTeammatePress(teammate)}
          >
            <View style={styles.teammateHeader}>
              <View style={styles.teammateInfo}>
                <Text style={styles.teammateName}>{teammate.name}</Text>
                <Text style={styles.teammatePosition}>{teammate.position}</Text>
              </View>
              <View style={styles.teammateStatus}>
                <MaterialIcons
                  name={getStatusIcon(teammate.status)}
                  size={24}
                  color={getStatusColor(teammate.status)}
                />
                <View style={[styles.onlineIndicator, { backgroundColor: teammate.isOnline ? "#4CAF50" : "#666" }]} />
              </View>
            </View>

            <View style={styles.teammateDetails}>
              <View style={styles.detailItem}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.detailText}>{teammate.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="near-me" size={16} color="#666" />
                <Text style={styles.detailText}>{formatDistance(teammate.distance)}</Text>
              </View>
              {teammate.heartRate && (
                <View style={styles.detailItem}>
                  <MaterialIcons name="favorite" size={16} color="#FF4444" />
                  <Text style={styles.detailText}>{teammate.heartRate} BPM</Text>
                </View>
              )}
            </View>

            <Text style={styles.lastUpdate}>Last update: {formatLastUpdate(teammate.lastUpdate)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton} onPress={handleReportIncident}>
          <MaterialIcons name="report-problem" size={24} color="#FFA500" />
          <Text style={styles.actionText}>Report Incident</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="healing" size={24} color="#4CAF50" />
          <Text style={styles.actionText}>CPR Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="local-hospital" size={24} color="#FF4444" />
          <Text style={styles.actionText}>Emergency Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="group" size={24} color="#2196F3" />
          <Text style={styles.actionText}>Team Communication</Text>
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
    fontSize: 16,
  },
  assistButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  assistButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
  statusOverview: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 2,
  },
  statusItem: {
    alignItems: "center",
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  teammateCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
  },
  teammateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  teammateInfo: {
    flex: 1,
  },
  teammateName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  teammatePosition: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  teammateStatus: {
    alignItems: "center",
    position: "relative",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: -2,
    right: -2,
  },
  teammateDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  lastUpdate: {
    fontSize: 11,
    color: "#999",
    fontStyle: "italic",
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
