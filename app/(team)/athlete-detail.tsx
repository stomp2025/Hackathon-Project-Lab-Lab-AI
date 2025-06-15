import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import HealthMetricCard from "../../components/HealthMetricCard"

export default function AthleteDetailScreen() {
  const params = useLocalSearchParams()
  const { name, sport, heartRate, risk } = params

  const getStatusColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "#4CAF50"
      case "MEDIUM":
        return "#FFC107"
      case "HIGH":
        return "#F44336"
      default:
        return "#8d9cb8"
    }
  }

  const getHeartIconColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "#4CAF50"
      case "MEDIUM":
        return "#FFC107"
      case "HIGH":
        return "#F44336"
      default:
        return "#8d9cb8"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.sport}>{sport}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(risk as string) }]} />
            <Text style={styles.statusText}>
              {risk === "HIGH" ? "Critical" : risk === "MEDIUM" ? "Caution" : "Normal"}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton}>
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.buttonText}>Emergency</Text>
          </TouchableOpacity>
        </View>

        <HealthMetricCard
          icon="heart"
          iconColor={getHeartIconColor(risk as string)}
          value={heartRate as string}
          label="Heart Rate (BPM)"
          status={risk as string}
          statusColor={getStatusColor(risk as string)}
          showProgressBar={true}
          progress={Number(heartRate) > 100 ? 0.8 : Number(heartRate) > 80 ? 0.5 : 0.3}
          progressColor={getStatusColor(risk as string)}
        />

        <HealthMetricCard
          icon="pulse"
          iconColor="#2196F3"
          value="97%"
          label="SpO2 (%)"
          status="STABLE"
          statusColor="#2196F3"
          showProgressBar={true}
          progress={0.97}
          progressColor="#2196F3"
        />

        <HealthMetricCard
          icon="warning"
          iconColor="#F44336"
          value="78"
          label="Risk Score"
          status="HIGH"
          statusColor="#F44336"
          showProgressBar={true}
          progress={0.78}
          progressColor="#F44336"
        />

        <View style={styles.ecgSection}>
          <Text style={styles.sectionTitle}>Live ECG Monitoring</Text>
          <View style={styles.ecgVisualization}>
            <Ionicons name="pulse" size={40} color="#8d9cb8" />
            <Text style={styles.ecgPlaceholder}>ECG Waveform Visualization</Text>
          </View>
        </View>

        <View style={styles.vitalSignsSection}>
          <Text style={styles.sectionTitle}>Vital Signs</Text>

          <View style={styles.vitalRow}>
            <View style={styles.vitalItem}>
              <Ionicons name="thermometer" size={24} color="#FF9800" />
              <Text style={styles.vitalValue}>37.2°C</Text>
              <Text style={styles.vitalLabel}>Temperature</Text>
            </View>

            <View style={styles.vitalItem}>
              <Ionicons name="speedometer" size={24} color="#2196F3" />
              <Text style={styles.vitalValue}>120/80</Text>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
            </View>
          </View>

          <View style={styles.vitalRow}>
            <View style={styles.vitalItem}>
              <Ionicons name="water" size={24} color="#4CAF50" />
              <Text style={styles.vitalValue}>16/min</Text>
              <Text style={styles.vitalLabel}>Respiratory Rate</Text>
            </View>

            <View style={styles.vitalItem}>
              <Ionicons name="fitness" size={24} color="#9C27B0" />
              <Text style={styles.vitalValue}>Normal</Text>
              <Text style={styles.vitalLabel}>Activity Level</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121826",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  sport: {
    color: "#8d9cb8",
    fontSize: 16,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "#8d9cb8",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: "#ff6b6b",
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  ecgSection: {
    padding: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ecgVisualization: {
    height: 150,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  ecgPlaceholder: {
    color: "#8d9cb8",
    marginTop: 8,
  },
  vitalSignsSection: {
    padding: 16,
  },
  vitalRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  vitalItem: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  vitalValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  vitalLabel: {
    color: "#8d9cb8",
    fontSize: 12,
    marginTop: 4,
  },
})
