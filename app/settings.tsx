"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)
  const [dataSync, setDataSync] = useState(true)
  const [emergencyMode, setEmergencyMode] = useState(true)

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0F1E", "#121826"]} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(300).duration(800)}>
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Text style={styles.profileInitials}>AJ</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Alex Johnson</Text>
                <Text style={styles.profileEmail}>alex.johnson@example.com</Text>
              </View>
              <TouchableOpacity style={styles.editProfileButton}>
                <Ionicons name="create-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(800)}>
            <Text style={styles.sectionTitle}>App Settings</Text>

            <BlurView intensity={30} tint="dark" style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="notifications" size={20} color="#FF3A5E" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>Receive alerts and updates</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(255, 58, 94, 0.3)" }}
                  thumbColor={notificationsEnabled ? "#FF3A5E" : "#8d9cb8"}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="location" size={20} color="#3E64FF" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Location Services</Text>
                  <Text style={styles.settingDescription}>Enable location tracking</Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(62, 100, 255, 0.3)" }}
                  thumbColor={locationEnabled ? "#3E64FF" : "#8d9cb8"}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="moon" size={20} color="#9C27B0" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Use dark theme</Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(156, 39, 176, 0.3)" }}
                  thumbColor={darkModeEnabled ? "#9C27B0" : "#8d9cb8"}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="finger-print" size={20} color="#4CAF50" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Biometric Authentication</Text>
                  <Text style={styles.settingDescription}>Use fingerprint or Face ID</Text>
                </View>
                <Switch
                  value={biometricsEnabled}
                  onValueChange={setBiometricsEnabled}
                  trackColor={{ false: "#1e293b", true: "rgba(76, 175, 80, 0.3)" }}
                  thumbColor={biometricsEnabled ? "#4CAF50" : "#8d9cb8"}
                />
              </View>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).duration(800)}>
            <Text style={styles.sectionTitle}>Health Monitoring</Text>

            <BlurView intensity={30} tint="dark" style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="sync" size={20} color="#FF9800" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Data Synchronization</Text>
                  <Text style={styles.settingDescription}>Sync health data with cloud</Text>
                </View>
                <Switch
                  value={dataSync}
                  onValueChange={setDataSync}
                  trackColor={{ false: "#1e293b", true: "rgba(255, 152, 0, 0.3)" }}
                  thumbColor={dataSync ? "#FF9800" : "#8d9cb8"}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="warning" size={20} color="#FF3A5E" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Emergency Mode</Text>
                  <Text style={styles.settingDescription}>Activate automated CPR system</Text>
                </View>
                <Switch
                  value={emergencyMode}
                  onValueChange={setEmergencyMode}
                  trackColor={{ false: "#1e293b", true: "rgba(255, 58, 94, 0.3)" }}
                  thumbColor={emergencyMode ? "#FF3A5E" : "#8d9cb8"}
                />
              </View>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="heart" size={20} color="#FF3A5E" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Health Thresholds</Text>
                  <Text style={styles.settingDescription}>Configure alert thresholds</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="medkit" size={20} color="#3E64FF" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Emergency Contacts</Text>
                  <Text style={styles.settingDescription}>Manage emergency contacts</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(900).duration(800)}>
            <Text style={styles.sectionTitle}>Account</Text>

            <BlurView intensity={30} tint="dark" style={styles.settingsCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="person" size={20} color="#3E64FF" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Personal Information</Text>
                  <Text style={styles.settingDescription}>Update your profile details</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="lock-closed" size={20} color="#4CAF50" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Security</Text>
                  <Text style={styles.settingDescription}>Change password and security settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="shield" size={20} color="#9C27B0" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Privacy</Text>
                  <Text style={styles.settingDescription}>Manage data privacy settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1100).duration(800)}>
            <Text style={styles.sectionTitle}>Support</Text>

            <BlurView intensity={30} tint="dark" style={styles.settingsCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="help-circle" size={20} color="#FF9800" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Help Center</Text>
                  <Text style={styles.settingDescription}>Get help and support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="document-text" size={20} color="#3E64FF" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Terms of Service</Text>
                  <Text style={styles.settingDescription}>Read our terms and conditions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Privacy Policy</Text>
                  <Text style={styles.settingDescription}>Read our privacy policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8d9cb8" />
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
            <Ionicons name="log-out" size={20} color="#FF3A5E" />
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 58, 94, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInitials: {
    color: "#FF3A5E",
    fontSize: 24,
    fontWeight: "600",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    color: "#B0B7C3",
    fontSize: 14,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    color: "#B0B7C3",
    fontSize: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginVertical: 16,
  },
  logoutText: {
    color: "#FF3A5E",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  versionText: {
    color: "#8d9cb8",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 24,
  },
})
