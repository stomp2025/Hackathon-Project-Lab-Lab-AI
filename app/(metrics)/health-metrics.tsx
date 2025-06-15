import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BarChart, LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const screenWidth = Dimensions.get("window").width

export default function HealthMetricsScreen() {
  // Simulated heart rate data
  const heartRateData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [65, 72, 68, 75, 71, 82, 72],
      },
    ],
  }

  // Simulated SpO2 data
  const spO2Data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [98, 97, 98, 99, 97, 98, 98],
      },
    ],
  }

  // Simulated stress level data
  const stressData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [3, 4, 2, 5, 3, 2, 1],
      },
    ],
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={24} color="#ff6b6b" />
            <Text style={styles.sectionTitle}>Heart Rate</Text>
          </View>
          <View style={styles.currentMetric}>
            <Text style={styles.metricValue}>72</Text>
            <Text style={styles.metricUnit}>BPM</Text>
          </View>
          <Text style={styles.metricStatus}>Normal Range</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={heartRateData}
              width={screenWidth - 32}
              height={180}
              chartConfig={{
                backgroundColor: "#1e293b",
                backgroundGradientFrom: "#1e293b",
                backgroundGradientTo: "#1e293b",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#ff6b6b",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={styles.statValue}>72 BPM</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Min</Text>
              <Text style={styles.statValue}>65 BPM</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Max</Text>
              <Text style={styles.statValue}>82 BPM</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pulse" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Oxygen Saturation (SpO2)</Text>
          </View>
          <View style={styles.currentMetric}>
            <Text style={styles.metricValue}>98</Text>
            <Text style={styles.metricUnit}>%</Text>
          </View>
          <Text style={styles.metricStatus}>Optimal</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={spO2Data}
              width={screenWidth - 32}
              height={180}
              chartConfig={{
                backgroundColor: "#1e293b",
                backgroundGradientFrom: "#1e293b",
                backgroundGradientTo: "#1e293b",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#2196F3",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={styles.statValue}>98%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Min</Text>
              <Text style={styles.statValue}>97%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Max</Text>
              <Text style={styles.statValue}>99%</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={24} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Stress Level</Text>
          </View>
          <View style={styles.currentMetric}>
            <Text style={styles.metricValue}>Low</Text>
          </View>
          <Text style={styles.metricStatus}>Healthy</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={stressData}
              width={screenWidth - 32}
              height={180}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#1e293b",
                backgroundGradientFrom: "#1e293b",
                backgroundGradientTo: "#1e293b",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.5,
              }}
              style={styles.chart}
            />
          </View>
          <View style={styles.stressLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.legendText}>1-2: Low</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#FFC107" }]} />
              <Text style={styles.legendText}>3-4: Medium</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#F44336" }]} />
              <Text style={styles.legendText}>5+: High</Text>
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
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  currentMetric: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  metricValue: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  metricUnit: {
    color: "#8d9cb8",
    fontSize: 20,
    marginLeft: 4,
  },
  metricStatus: {
    color: "#4CAF50",
    fontSize: 16,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  chart: {
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statLabel: {
    color: "#8d9cb8",
    fontSize: 12,
  },
  statValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  stressLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: "#8d9cb8",
    fontSize: 12,
  },
})
