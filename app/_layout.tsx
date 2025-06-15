import { Stack } from "expo-router"
import { StatusBar } from "react-native"
import { ThemeProvider } from "../components/ThemeProvider"
import { useLocalSearchParams } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

type AthleteDetailParams = {
  name?: string;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar barStyle="light-content" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#121826",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              backgroundColor: "#121826",
            },
          }}
        >
          {/* Routes publiques */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />

          {/* Routes Athlète */}
          <Stack.Screen name="athlete" options={{ title: "Athlete Dashboard" }} />
          <Stack.Screen name="(metrics)/health-metrics" options={{ title: "Health Metrics" }} />
          <Stack.Screen name="(metrics)/ecg-monitoring" options={{ title: "ECG Monitoring" }} />
          <Stack.Screen name="(metrics)/blood-pressure-monitoring" options={{ title: "Blood Pressure" }} />
          <Stack.Screen name="(metrics)/glucose-monitoring" options={{ title: "Glucose" }} />
          <Stack.Screen name="(metrics)/heart-rate-monitoring" options={{ title: "Heart Rate" }} />
          <Stack.Screen name="(metrics)/oxygen-monitoring" options={{ title: "Oxygen" }} />
          <Stack.Screen name="(metrics)/respiratory-monitoring" options={{ title: "Respiratory" }} />
          <Stack.Screen name="(metrics)/temperature-monitoring" options={{ title: "Temperature" }} />

          {/* Routes Coach */}
          <Stack.Screen name="coach" options={{ title: "Coach Dashboard" }} />
          <Stack.Screen name="(team)/team-overview" options={{ title: "Team Overview" }} />
          <Stack.Screen
            name="(team)/athlete-detail"
            options={{
              title: "Athlete Details",
              headerTitle: () => {
                const params = useLocalSearchParams<AthleteDetailParams>();
                return params.name || "Athlete Details";
              }
            }}
          />

          {/* Routes Teammate */}
          <Stack.Screen 
            name="(teammates)" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="(teammates)/index" 
            options={{ 
              title: "Teammate Dashboard",
              headerShown: true
            }} 
          />
          <Stack.Screen 
            name="(teammates)/emergency-assist" 
            options={{ 
              title: "Emergency Assistance",
              headerShown: true
            }} 
          />

          {/* Routes Referee */}
          <Stack.Screen 
            name="(referee)" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="(referee)/index" 
            options={{ 
              title: "Referee Dashboard",
              headerShown: true
            }} 
          />
          <Stack.Screen 
            name="(referee)/emergency-protocol" 
            options={{ 
              title: "Emergency Protocol",
              headerShown: true
            }} 
          />

          {/* Routes d'urgence */}
          <Stack.Screen 
            name="(emergency)/automated-cpr" 
            options={{ 
              title: "Automated CPR",
              headerShown: false,
              animation: "none"
            }} 
          />
          <Stack.Screen 
            name="(emergency)/manual-cpr" 
            options={{ 
              title: "Manual CPR Guide",
              headerShown: false,
              animation: "none"
            }} 
          />
          <Stack.Screen 
            name="(emergency)/automated-system" 
            options={{ 
              title: "Automated System",
              headerShown: false,
              animation: "none"
            }} 
          />
          <Stack.Screen 
            name="(emergency)/cpr-guide" 
            options={{ 
              title: "CPR Guide",
              headerShown: false,
              animation: "none"
            }} 
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
