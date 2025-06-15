"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"

interface Athlete {
  id: string
  name: string
  sport: string
  heartRate: number
  risk: "LOW" | "MEDIUM" | "HIGH"
  status: "online" | "offline"
}

const athletes: Athlete[] = [
  { id: "1", name: "Alex Johnson", sport: "Basketball", heartRate: 68, risk: "LOW", status: "online" },
  { id: "2", name: "Sarah Williams", sport: "Soccer", heartRate: 95, risk: "MEDIUM", status: "online" },
  { id: "3", name: "Mike Chen", sport: "Track", heartRate: 110, risk: "HIGH", status: "online" },
  { id: "4", name: "Emma Davis", sport: "Swimming", heartRate: 72, risk: "LOW", status: "online" },
  { id: "5", name: "James Wilson", sport: "Football", heartRate: 75, risk: "LOW", status: "online" },
]

export default function TeamOverviewScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredAthletes, setFilteredAthletes] = useState(athletes)

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    const filtered = athletes.filter(
      (athlete) =>
        athlete.name.toLowerCase().includes(text.toLowerCase()) ||
        athlete.sport.toLowerCase().includes(text.toLowerCase()),
    )
    setFilteredAthletes(filtered)
  }

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

  const getRiskBackgroundColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "rgba(76, 175, 80, 0.2)"
      case "MEDIUM":
        return "rgba(255, 193, 7, 0.2)"
      case "HIGH":
        return "rgba(244, 67, 54, 0.2)"
      default:
        return "transparent"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Team Overview</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{athletes.length} Athletes</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8d9cb8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search athletes..."
          placeholderTextColor="#8d9cb8"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel-outline" size={18} color="#8d9cb8" />
          <Text style={styles.filterText}>Filter by status</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAthletes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/(team)/athlete-detail",
              params: {
                id: item.id,
                name: item.name,
                sport: item.sport,
                heartRate: item.heartRate.toString(),
                risk: item.risk,
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.athleteCard}>
              <View style={styles.athleteInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.athleteName}>{item.name}</Text>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.risk) }]} />
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.sportText}>{item.sport}</Text>
                  <Text style={styles.heartRateText}>{item.heartRate} BPM</Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: getRiskBackgroundColor(item.risk) }]}>
                  <Text style={[styles.riskText, { color: getStatusColor(item.risk) }]}>{item.risk} RISK</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.rightSidebar}>
        <View style={styles.sidebarContent}>
          <Ionicons name="people" size={40} color="#8d9cb8" />
          <Text style={styles.sidebarTitle}>Select an Athlete</Text>
          <Text style={styles.sidebarText}>
            Choose an athlete from the sidebar to view their detailed health profile
          </Text>
        </View>
      </View>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#ff6b6b",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: "#fff",
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    color: "#8d9cb8",
    marginLeft: 4,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  athleteCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  athleteInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  athleteName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sportText: {
    color: "#8d9cb8",
    fontSize: 14,
  },
  heartRateText: {
    color: "#8d9cb8",
    fontSize: 14,
  },
  riskBadge: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: "600",
  },
  rightSidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "40%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  sidebarContent: {
    alignItems: "center",
  },
  sidebarTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  sidebarText: {
    color: "#8d9cb8",
    fontSize: 14,
    textAlign: "center",
  },
})
