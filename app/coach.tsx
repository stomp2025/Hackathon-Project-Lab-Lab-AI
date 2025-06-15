import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"

export default function CoachScreen() {
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
              <Text style={styles.subTitle}>Coach Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back, Coach</Text>
          <Text style={styles.welcomeSubText}>Monitor your team's health in real-time</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Athletes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>High Risk</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Training Today</Text>
          </View>
        </View>

        <Link href="/(team)/team-overview" asChild>
          <TouchableOpacity style={styles.teamOverviewCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Team Overview</Text>
              <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
            </View>
            <View style={styles.teamStats}>
              <View style={styles.teamStat}>
                <View style={[styles.statusDot, { backgroundColor: "#4CAF50" }]} />
                <Text style={styles.teamStatText}>3 Low Risk</Text>
              </View>
              <View style={styles.teamStat}>
                <View style={[styles.statusDot, { backgroundColor: "#FFC107" }]} />
                <Text style={styles.teamStatText}>1 Medium Risk</Text>
              </View>
              <View style={styles.teamStat}>
                <View style={[styles.statusDot, { backgroundColor: "#F44336" }]} />
                <Text style={styles.teamStatText}>1 High Risk</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>

          <Link href="/(team)/athlete-detail?id=3&name=Mike Chen&sport=Track&heartRate=110&risk=HIGH" asChild>
            <TouchableOpacity style={styles.alertCard}>
              <View style={styles.alertIconContainer}>
                <Ionicons name="warning" size={24} color="#F44336" />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>High Heart Rate</Text>
                <Text style={styles.alertDescription}>Mike Chen's heart rate reached 110 BPM during rest</Text>
                <Text style={styles.alertTime}>15 minutes ago</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/(team)/athlete-detail?id=2&name=Sarah Williams&sport=Soccer&heartRate=95&risk=MEDIUM" asChild>
            <TouchableOpacity style={styles.alertCard}>
              <View style={styles.alertIconContainer}>
                <Ionicons name="information-circle" size={24} color="#FFC107" />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Elevated Stress Level</Text>
                <Text style={styles.alertDescription}>Sarah Williams showing signs of elevated stress</Text>
                <Text style={styles.alertTime}>2 hours ago</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Training</Text>

          <View style={styles.trainingCard}>
            <View style={styles.trainingHeader}>
              <Text style={styles.trainingTitle}>Team Practice</Text>
              <View style={styles.trainingBadge}>
                <Text style={styles.trainingBadgeText}>Today</Text>
              </View>
            </View>
            <View style={styles.trainingDetails}>
              <View style={styles.trainingDetail}>
                <Ionicons name="time" size={16} color="#8d9cb8" />
                <Text style={styles.trainingDetailText}>3:00 PM - 5:00 PM</Text>
              </View>
              <View style={styles.trainingDetail}>
                <Ionicons name="location" size={16} color="#8d9cb8" />
                <Text style={styles.trainingDetailText}>Main Field</Text>
              </View>
              <View style={styles.trainingDetail}>
                <Ionicons name="people" size={16} color="#8d9cb8" />
                <Text style={styles.trainingDetailText}>All Athletes</Text>
              </View>
            </View>
          </View>

          <View style={styles.trainingCard}>
            <View style={styles.trainingHeader}>
              <Text style={styles.trainingTitle}>Strength Training</Text>
              <View style={styles.trainingBadge}>
                <Text style={styles.trainingBadgeText}>Tomorrow</Text>
              </View>
            </View>
            <View style={styles.trainingDetails}>
              <View style={styles.trainingDetail}>
                <Ionicons name="time" size={16} color="#8d9cb8" />
                <Text style={styles.trainingDetailText}>9:00 AM - 10:30 AM</Text>
              </View>
              <View style={styles.trainingDetail}>
                <Ionicons name="location" size={16} color="#8d9cb8" />
                <Text style={styles.trainingDetailText}>Gym</Text>
              </View>
              <View style={styles.trainingDetail}>
                <Ionicons name="people" size={16} color="#8d9cb8" />
                <Text style={styles.trainingDetailText}>Selected Athletes</Text>
              </View>
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#8d9cb8",
    fontSize: 12,
    marginTop: 4,
  },
  teamOverviewCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  teamStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teamStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  teamStatText: {
    color: "#8d9cb8",
    fontSize: 14,
  },
  alertsSection: {
    padding: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  alertDescription: {
    color: "#8d9cb8",
    fontSize: 14,
    marginTop: 4,
  },
  alertTime: {
    color: "#8d9cb8",
    fontSize: 12,
    marginTop: 8,
  },
  upcomingSection: {
    padding: 16,
  },
  trainingCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  trainingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trainingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  trainingBadge: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  trainingBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  trainingDetails: {
    gap: 8,
  },
  trainingDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  trainingDetailText: {
    color: "#8d9cb8",
    fontSize: 14,
    marginLeft: 8,
  },
})
