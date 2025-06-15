import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const screenWidth = Dimensions.get("window").width

export default function RespiratoryMonitoringScreen() {
  // Données simulées de fréquence respiratoire (en respirations/min)
  const respData = {
    labels: ["", "", "", "", "", ""],
    datasets: [
      {
        data: [
          Math.floor(Math.random() * 2 + 15),
          Math.floor(Math.random() * 2 + 16),
          Math.floor(Math.random() * 2 + 15),
          Math.floor(Math.random() * 2 + 16),
          Math.floor(Math.random() * 2 + 15),
          Math.floor(Math.random() * 2 + 16),
        ],
      },
    ],
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Respiratory Rate Monitoring</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={respData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#1e293b",
            backgroundGradientFrom: "#1e293b",
            backgroundGradientTo: "#1e293b",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "0" },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Current</Text>
            <Text style={styles.infoValue}>16 rpm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Trend</Text>
            <Text style={styles.infoValue}>Stable</Text>
          </View>
        </View>
      </View>

      <View style={styles.analysisContainer}>
        <View style={styles.analysisHeader}>
          <Ionicons name="analytics" size={24} color="#2196F3" />
          <Text style={styles.analysisTitle}>AI Analysis</Text>
        </View>
        <Text style={styles.analysisText}>
          Respiratory rate is within normal range. No abnormality detected.
        </Text>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Events</Text>
        <View style={styles.eventItem}>
          <View style={styles.eventTimeContainer}>
            <Text style={styles.eventTime}>10:32 AM</Text>
            <Text style={styles.eventDate}>Today</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Slight increase</Text>
            <Text style={styles.eventDescription}>Respiratory rate rose to 20 rpm after exercise.</Text>
          </View>
        </View>
        <View style={styles.eventItem}>
          <View style={styles.eventTimeContainer}>
            <Text style={styles.eventTime}>8:15 AM</Text>
            <Text style={styles.eventDate}>Today</Text>
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>Normal</Text>
            <Text style={styles.eventDescription}>Respiratory rate stable (16 rpm).</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121826" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  title: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  liveIndicator: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(33, 150, 243, 0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#2196F3", marginRight: 6 },
  liveText: { color: "#2196F3", fontSize: 14, fontWeight: "500" },
  chartContainer: { alignItems: "center", marginVertical: 16 },
  chart: { borderRadius: 16 },
  infoContainer: { padding: 16 },
  infoRow: { flexDirection: "row", marginBottom: 16 },
  infoItem: { flex: 1, backgroundColor: "#1e293b", borderRadius: 12, padding: 16, marginHorizontal: 4 },
  infoLabel: { color: "#8d9cb8", fontSize: 14 },
  infoValue: { color: "#fff", fontSize: 18, fontWeight: "500", marginTop: 4 },
  analysisContainer: { margin: 16, padding: 16, backgroundColor: "#1e293b", borderRadius: 12 },
  analysisHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  analysisTitle: { color: "#fff", fontSize: 18, fontWeight: "500", marginLeft: 8 },
  analysisText: { color: "#8d9cb8", fontSize: 14, lineHeight: 20 },
  historyContainer: { padding: 16 },
  historyTitle: { color: "#fff", fontSize: 18, fontWeight: "500", marginBottom: 12 },
  eventItem: { flexDirection: "row", backgroundColor: "#1e293b", borderRadius: 12, padding: 12, marginBottom: 8 },
  eventTimeContainer: { width: 70, marginRight: 12 },
  eventTime: { color: "#fff", fontSize: 14, fontWeight: "500" },
  eventDate: { color: "#8d9cb8", fontSize: 12 },
  eventContent: { flex: 1 },
  eventTitle: { color: "#fff", fontSize: 14, fontWeight: "500" },
  eventDescription: { color: "#8d9cb8", fontSize: 12, marginTop: 4 },
}); 