import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import HealthMetricCard from "../components/HealthMetricCard"
import { useState, useEffect } from "react"
import { router } from "expo-router"
import { BlurView } from "expo-blur"
import Animated, { FadeInDown } from "react-native-reanimated"

// Define a type for the simulated health metrics
type Metrics = {
  temperature: number; // °C
  heartRate: number; // BPM
  bloodPressure: { systolic: number; diastolic: number }; // mmHg
  oxygenSaturation: number; // %
  respiratoryRate: number; // respirations/min
  glucose: number; // mg/dL
  ecg: string; // (simulé)
}

// Simulate mocked health data for the athlete
const mockMetrics: Metrics = {
  temperature: (Math.random() * 0.5) + 36.5,
  heartRate: Math.floor(Math.random() * 10 + 70),
  bloodPressure: { systolic: Math.floor(Math.random() * 10 + 110), diastolic: Math.floor(Math.random() * 5 + 70) },
  oxygenSaturation: Math.floor(Math.random() * 2 + 97),
  respiratoryRate: Math.floor(Math.random() * 2 + 15),
  glucose: Math.floor(Math.random() * 10 + 90),
  ecg: "Normal Sinus",
}

// Function to simulate an alert (e.g., if heart rate is too high or oxygen saturation is too low)
const simulateAlert = (metrics: Metrics) => {
  if (metrics.heartRate > 100) {
    Alert.alert("Alert", "High heart rate detected. Do you want to activate emergency mode?", [
      { text: "No", style: "cancel" },
      { text: "Activate", onPress: () => router.push("/(emergency)/automated-cpr" as any) },
    ])
  } else if (metrics.oxygenSaturation < 95) {
    Alert.alert("Alert", "Low oxygen saturation detected. Do you want to activate emergency mode?", [
      { text: "No", style: "cancel" },
      { text: "Activate", onPress: () => router.push("/(emergency)/automated-cpr" as any) },
    ])
  } else if (metrics.glucose < 80) {
    Alert.alert("Alert", "Low glucose detected. Do you want to activate emergency mode?", [
      { text: "No", style: "cancel" },
      { text: "Activate", onPress: () => router.push("/(emergency)/automated-cpr" as any) },
    ])
  }
}

export default function AthleteScreen() {
  const [metrics, setMetrics] = useState<Metrics>(mockMetrics)
  const [emergencyMode, setEmergencyMode] = useState(false)

  useEffect(() => {
    // Simulate updating metrics every 5 seconds (to simulate the connected bracelet)
    const interval = setInterval(() => {
      const newMetrics: Metrics = {
        temperature: (Math.random() * 0.5) + 36.5,
        heartRate: Math.floor(Math.random() * 10 + 70),
        bloodPressure: { systolic: Math.floor(Math.random() * 10 + 110), diastolic: Math.floor(Math.random() * 5 + 70) },
        oxygenSaturation: Math.floor(Math.random() * 2 + 97),
        respiratoryRate: Math.floor(Math.random() * 2 + 15),
        glucose: Math.floor(Math.random() * 10 + 90),
        ecg: "Normal Sinus",
      }
      setMetrics(newMetrics)
      simulateAlert(newMetrics) // Check if an alert should be triggered
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleEmergencyToggle = () => {
    if (emergencyMode) {
      Alert.alert("Disable Emergency Mode", "Are you sure you want to disable emergency mode?", [
        { text: "Cancel", style: "cancel" },
        { text: "Disable", onPress: () => setEmergencyMode(false) },
      ])
    } else {
      Alert.alert("Activate Emergency Mode", "Do you want to activate emergency mode (simulated)?", [
        { text: "Cancel", style: "cancel" },
        { text: "Activate", onPress: () => { setEmergencyMode(true); router.push("/(emergency)/automated-cpr" as any) } },
      ])
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="heart" size={24} color="#ff6b6b" />
            </View>
            <View>
              <Text style={styles.logoText}>STOMP</Text>
              <Text style={styles.subTitle}>Athlete Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, Alex</Text>
          <Text style={styles.welcomeSubText}>Monitor your cardiac health in real-time</Text>
        </View>

        <Link href="/(metrics)/health-metrics" asChild>
          <TouchableOpacity>
            <HealthMetricCard
              icon="heart"
              iconColor="#4CAF50"
              value="72"
              label="Heart Rate (BPM)"
              status="NORMAL"
              statusColor="#4CAF50"
            />
          </TouchableOpacity>
        </Link>

        <Link href="/(metrics)/health-metrics" asChild>
          <TouchableOpacity>
            <HealthMetricCard
              icon="pulse"
              iconColor="#2196F3"
              value="98%"
              label="SpO2 Levels"
              status="STABLE"
              statusColor="#2196F3"
            />
          </TouchableOpacity>
        </Link>

        <Link href="/(metrics)/health-metrics" asChild>
          <TouchableOpacity>
            <HealthMetricCard
              icon="flash"
              iconColor="#9C27B0"
              value="Low"
              label="Stress Level"
              status="LOW"
              statusColor="#4CAF50"
            />
          </TouchableOpacity>
        </Link>

        <Link href="/(metrics)/ecg-monitoring" asChild>
          <TouchableOpacity style={styles.ecgCard}>
            <View style={styles.ecgHeader}>
              <Text style={styles.ecgTitle}>ECG Monitoring</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>

            <View style={styles.ecgVisualization}>
              <Ionicons name="water-outline" size={40} color="#8d9cb8" />
              <Text style={styles.ecgPlaceholder}>ECG Waveform Visualization</Text>
            </View>

            <View style={styles.ecgFooter}>
              <Text style={styles.rhythmText}>Rhythm: Normal Sinus</Text>
              <Text style={styles.normalText}>No Abnormalities</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="heart" size={24} color="#4CAF50" />
            </View>
            <View style={styles.activityContent}>
              <View style={styles.activityHeader}>
                <View>
                  <Text style={styles.activityTitle}>Training session completed</Text>
                  <Text style={styles.activitySubtitle}>All vitals remained in normal range</Text>
                </View>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="time" size={24} color="#2196F3" />
            </View>
            <View style={styles.activityContent}>
              <View style={styles.activityHeader}>
                <View>
                  <Text style={styles.activityTitle}>Daily health report generated</Text>
                  <Text style={styles.activitySubtitle}>Health score: 85/100 - Good condition</Text>
                </View>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.dashboardContainer}>
          <Text style={styles.sectionTitle}>Health Metrics (Simulated)</Text>
          <BlurView intensity={30} tint="dark" style={styles.dashboardCard}>
            <View style={styles.metricItem}>
              <Ionicons name="thermometer" size={24} color="#FF9800" />
              <Text style={styles.metricLabel}>Temperature</Text>
              <Text style={styles.metricValue}>{metrics.temperature.toFixed(1)} °C</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="heart" size={24} color="#FF3A5E" />
              <Text style={styles.metricLabel}>Heart Rate</Text>
              <Text style={styles.metricValue}>{metrics.heartRate} BPM</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="pulse" size={24} color="#2196F3" />
              <Text style={styles.metricLabel}>Blood Pressure</Text>
              <Text style={styles.metricValue}>{metrics.bloodPressure.systolic}/{metrics.bloodPressure.diastolic} mmHg</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="water" size={24} color="#4CAF50" />
              <Text style={styles.metricLabel}>O₂ Saturation</Text>
              <Text style={styles.metricValue}>{metrics.oxygenSaturation} %</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="pulse" size={24} color="#2196F3" />
              <Text style={styles.metricLabel}>Respiratory Rate</Text>
              <Text style={styles.metricValue}>{metrics.respiratoryRate} rpm</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="flask" size={24} color="#FFC107" />
              <Text style={styles.metricLabel}>Glucose</Text>
              <Text style={styles.metricValue}>{metrics.glucose} mg/dL</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="pulse" size={24} color="#FF3A5E" />
              <Text style={styles.metricLabel}>ECG</Text>
              <Text style={styles.metricValue}>{metrics.ecg}</Text>
            </View>
          </BlurView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(800)} style={styles.alertContainer}>
          <Text style={styles.sectionTitle}>Alerts (Simulated)</Text>
          <BlurView intensity={30} tint="dark" style={styles.alertCard}>
            <Text style={styles.alertText}>If a metric goes out of normal range, an alert will be triggered and you can activate emergency mode.</Text>
          </BlurView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(800)} style={styles.emergencyContainer}>
          <Text style={styles.sectionTitle}>Emergency Mode (Simulated)</Text>
          <BlurView intensity={30} tint="dark" style={styles.emergencyCard}>
            <View style={styles.emergencyToggleContainer}>
              <Text style={styles.emergencyLabel}>Activate Emergency Mode (Simulated)</Text>
              <Switch
                value={emergencyMode}
                onValueChange={handleEmergencyToggle}
                trackColor={{ false: "#1e293b", true: "rgba(255, 58, 94, 0.3)" }}
                thumbColor={emergencyMode ? "#FF3A5E" : "#8d9cb8" }
              />
            </View>
          </BlurView>
        </Animated.View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#8d9cb8",
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  welcomeSubText: {
    color: "#8d9cb8",
    fontSize: 16,
    marginTop: 4,
  },
  ecgCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  ecgHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ecgTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  liveText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  ecgVisualization: {
    height: 120,
    backgroundColor: "#121826",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  ecgPlaceholder: {
    color: "#8d9cb8",
    marginTop: 8,
  },
  ecgFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rhythmText: {
    color: "#fff",
    fontSize: 14,
  },
  normalText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  recentActivitySection: {
    padding: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#121826",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  activityTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  activitySubtitle: {
    color: "#8d9cb8",
    fontSize: 14,
    marginTop: 4,
  },
  activityTime: {
    color: "#8d9cb8",
    fontSize: 14,
  },
  dashboardContainer: { margin: 16 },
  dashboardCard: { borderRadius: 12, padding: 16, backgroundColor: "#1e293b" },
  metricItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  metricLabel: { color: "#8d9cb8", fontSize: 14, marginLeft: 10, flex: 1 },
  metricValue: { color: "#fff", fontSize: 16, fontWeight: "500" },
  alertContainer: { margin: 16 },
  alertCard: { borderRadius: 12, padding: 16, backgroundColor: "#1e293b" },
  alertText: { color: "#8d9cb8", fontSize: 14, lineHeight: 20 },
  emergencyContainer: { margin: 16 },
  emergencyCard: { borderRadius: 12, padding: 16, backgroundColor: "#1e293b" },
  emergencyToggleContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  emergencyLabel: { color: "#fff", fontSize: 16, fontWeight: "500" },
})
