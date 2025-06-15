import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface HealthMetricCardProps {
  icon: string
  iconColor: string
  value: string
  label: string
  status: string
  statusColor: string
  showProgressBar?: boolean
  progress?: number
  progressColor?: string
  onPress?: () => void
}

export default function HealthMetricCard({
  icon,
  iconColor,
  value,
  label,
  status,
  statusColor,
  showProgressBar = false,
  progress = 0,
  progressColor = "#4CAF50",
  onPress,
}: HealthMetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
      <Text style={[styles.status, { color: statusColor }]}>{status}</Text>

      {showProgressBar && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress * 100}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    marginBottom: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  valueContainer: {
    flex: 1,
  },
  value: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    color: "#8d9cb8",
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    alignSelf: "flex-end",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#121826",
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
})
