import { View, Text, StyleSheet } from "react-native"
import { Link } from "expo-router"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="heart" size={40} color="#ff6b6b" />
        </View>
        <Text style={styles.appName}>STOMP</Text>
        <Text style={styles.tagline}>AI Cardiac Health Monitoring</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="pulse" size={24} color="#ff6b6b" />
          <Text style={styles.featureText}>Real-time monitoring</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="shield-checkmark" size={24} color="#ff6b6b" />
          <Text style={styles.featureText}>AI-powered analysis</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="notifications" size={24} color="#ff6b6b" />
          <Text style={styles.featureText}>Instant health alerts</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121826",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#8d9cb8",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 60,
  },
  button: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
})
