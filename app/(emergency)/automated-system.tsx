"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

export default function AutomatedSystemScreen() {
  const insets = useSafeAreaInsets()
  const [systemEnabled, setSystemEnabled] = useState(true)
  const [emergencyContactsEnabled, setEmergencyContactsEnabled] = useState(true)
  const [autoAlertEnabled, setAutoAlertEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [deviceStatus, setDeviceStatus] = useState("Connected")
  const [batteryLevel, setBatteryLevel] = useState(92)
  const [signalStrength, setSignalStrength] = useState(4) // Out of 5

  const pulseOpacity = useSharedValue(1)

  useEffect(() => {
    // Simulate battery drain
    const batteryTimer = setInterval(() => {
      setBatteryLevel((prev) => Math.max(prev - 1, 0))
    }, 60000) // Every minute

    // Pulse animation for the heart icon
    pulseOpacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true)

    return () => clearInterval(batteryTimer)
  }, [])

  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    }
  })

  const getBatteryColor = () => {
    if (batteryLevel > 60) return "#4CAF50"
    if (batteryLevel > 20) return "#FFC107"
    return "#FF3A5E"
  }

  const renderSignalBars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={[
            styles.signalBar,
            {
              height: 4 + index * 3,
              backgroundColor: index < signalStrength ? "#4CAF50" : "rgba(255, 255, 255, 0.2)",
            },
          ]}
        />
      ))
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#121826"]} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Automated CPR System</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.statusCard}>
            <BlurView intensity={30} tint="dark" style={styles.statusCardContent}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>System Status</Text>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: systemEnabled ? "#4CAF50" : "#FF3A5E" }]} />
                  <Text style={[styles.statusText, { color: systemEnabled ? "#4CAF50" : "#FF3A5E" }]}>
                    {systemEnabled ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>

              <View style={styles.deviceInfoContainer}>
                <Animated.View style={[styles.heartIconContainer, pulseStyle]}>
                  <Ionicons name="heart" size={40} color="#FF3A5E" />
                </Animated.View>

                <View style={styles.deviceInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Device:</Text>
                    <Text style={styles.infoValue}>STOMP CPR-X1</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text style={styles.infoValue}>{deviceStatus}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Battery:</Text>
                    <View style={styles.batteryContainer}>
                      <View
                        style={[styles.batteryLevel, { width: `${batteryLevel}%`, backgroundColor: getBatteryColor() }]}
                      />
                      <Text style={styles.batteryText}>{batteryLevel}%</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Signal:</Text>
                    <View style={styles.signalContainer}>{renderSignalBars()}</View>
                  </View>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(800)}>
            <Text style={styles.sectionTitle}>System Configuration</Text>

            <BlurView intensity={30} tint="dark" style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Enable Automated CPR System</Text>
                  <Text style={styles.settingDescription}>
                    Automatically detects cardiac arrest and activates emergency response
                  </Text>
                </View>
                <Switch
                  value={systemEnabled}
                  onValueChange={setSystemEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(255, 58, 94, 0.3)" }}
                  thumbColor={systemEnabled ? "#FF3A5E" : "#8d9cb8"}
                />
              </View>

              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Alert Emergency Contacts</Text>
                  <Text style={styles.settingDescription}>
                    Automatically notify emergency contacts when system activates
                  </Text>
                </View>
                <Switch
                  value={emergencyContactsEnabled}
                  onValueChange={setEmergencyContactsEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(255, 58, 94, 0.3)" }}
                  thumbColor={emergencyContactsEnabled ? "#FF3A5E" : "#8d9cb8"}
                />
              </View>

              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Auto-Alert Medical Services</Text>
                  <Text style={styles.settingDescription}>Automatically call emergency medical services</Text>
                </View>
                <Switch
                  value={autoAlertEnabled}
                  onValueChange={setAutoAlertEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(255, 58, 94, 0.3)" }}
                  thumbColor={autoAlertEnabled ? "#FF3A5E" : "#8d9cb8"}
                />
              </View>

              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Vibration Alerts</Text>
                  <Text style={styles.settingDescription}>
                    Device vibrates before activation to check for false alarms
                  </Text>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(255, 58, 94, 0.3)" }}
                  thumbColor={vibrationEnabled ? "#FF3A5E" : "#8d9cb8"}
                />
              </View>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).duration(800)}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>

            <BlurView intensity={30} tint="dark" style={styles.contactsCard}>
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="medkit" size={24} color="#FF3A5E" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>Emergency Medical Services</Text>
                  <Text style={styles.contactNumber}>911</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="person" size={24} color="#3E64FF" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>Dr. Sarah Johnson</Text>
                  <Text style={styles.contactNumber}>+1 (555) 123-4567</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="people" size={24} color="#4CAF50" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>Team Coach</Text>
                  <Text style={styles.contactNumber}>+1 (555) 987-6543</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.addContactButton}>
                <Ionicons name="add-circle" size={20} color="#FF3A5E" />
                <Text style={styles.addContactText}>Add Emergency Contact</Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(900).duration(800)}>
            <Text style={styles.sectionTitle}>System Information</Text>

            <BlurView intensity={30} tint="dark" style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Device Model</Text>
                <Text style={styles.infoItemValue}>STOMP CPR-X1</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Serial Number</Text>
                <Text style={styles.infoItemValue}>STP-2023-78542169</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Firmware Version</Text>
                <Text style={styles.infoItemValue}>v2.4.1</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Last Maintenance</Text>
                <Text style={styles.infoItemValue}>May 15, 2023</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoItemLabel}>Next Check Required</Text>
                <Text style={styles.infoItemValue}>November 15, 2023</Text>
              </View>

              <TouchableOpacity style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Check for Updates</Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <View style={styles.emergencyButtonContainer}>
            <TouchableOpacity style={styles.emergencyTestButton}>
              <LinearGradient colors={["#3E64FF", "#5A7FFF"]} style={styles.emergencyTestGradient}>
                <Ionicons name="play-circle" size={24} color="#fff" />
                <Text style={styles.emergencyTestText}>Test System</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1E",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 58, 94, 0.3)",
  },
  statusCardContent: {
    padding: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  deviceInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 58, 94, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    color: "#B0B7C3",
    fontSize: 14,
    width: 60,
  },
  infoValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  batteryContainer: {
    flex: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  batteryLevel: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  batteryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    position: "absolute",
    right: 6,
    top: 1,
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 16,
    gap: 2,
  },
  signalBar: {
    width: 4,
    borderRadius: 1,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  settingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    color: "#B0B7C3",
    fontSize: 12,
    maxWidth: "80%",
  },
  contactsCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  contactNumber: {
    color: "#B0B7C3",
    fontSize: 14,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  addContactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  addContactText: {
    color: "#FF3A5E",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  infoCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoItemLabel: {
    color: "#B0B7C3",
    fontSize: 12,
    marginBottom: 4,
  },
  infoItemValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: "rgba(62, 100, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  updateButtonText: {
    color: "#3E64FF",
    fontSize: 16,
    fontWeight: "500",
  },
  emergencyButtonContainer: {
    marginVertical: 24,
  },
  emergencyTestButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  emergencyTestGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  emergencyTestText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
})
