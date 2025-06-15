"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

type UserRole = "athlete" | "coach" | "teammate" | "referee"

const roleConfig = {
  athlete: {
    icon: "person",
    route: "/athlete",
    label: "Athlete",
    description: "Monitor your health and access emergency assistance"
  },
  coach: {
    icon: "shield",
    route: "/coach",
    label: "Coach",
    description: "Monitor team health and manage emergencies"
  },
  teammate: {
    icon: "people",
    route: "/teammates",
    label: "Teammate",
    description: "Support teammates and respond to emergencies"
  },
  referee: {
    icon: "flag",
    route: "/referee",
    label: "Referee",
    description: "Monitor player status and manage game incidents"
  }
} as const

export default function LoginScreen() {
  const [userType, setUserType] = useState<UserRole>("athlete")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = () => {
    // In a real app, you would validate credentials here
    const route = roleConfig[userType].route
    console.log("Navigating to:", route) // Pour le débogage
    router.push(route)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.loginAs}>Login as</Text>

          <View style={styles.userTypeContainer}>
            {Object.entries(roleConfig).map(([role, config]) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.userTypeButton,
                  userType === role ? styles.activeUserType : null,
                ]}
                onPress={() => setUserType(role as UserRole)}
              >
                <Ionicons
                  name={config.icon as any}
                  size={24}
                  color={userType === role ? "#ff6b6b" : "#8d9cb8"}
                />
                <Text
                  style={[
                    styles.userTypeText,
                    userType === role ? styles.activeUserTypeText : null
                  ]}
                >
                  {config.label}
                </Text>
                <Text style={styles.roleDescription}>
                  {config.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#8d9cb8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#8d9cb8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#8d9cb8"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121826",
    padding: 20,
  },
  loginAs: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  userTypeContainer: {
    gap: 12,
    marginBottom: 30,
  },
  userTypeButton: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  activeUserType: {
    borderColor: "#ff6b6b",
  },
  userTypeText: {
    color: "#8d9cb8",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
  },
  activeUserTypeText: {
    color: "#ff6b6b",
  },
  roleDescription: {
    color: "#8d9cb8",
    fontSize: 14,
    marginTop: 4,
  },
  formContainer: {
    marginTop: 10,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    marginBottom: 30,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: "#fff",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  signInButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  forgotPasswordText: {
    color: "#ff6b6b",
    fontSize: 16,
  },
})
