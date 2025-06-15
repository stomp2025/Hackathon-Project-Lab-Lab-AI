import { Stack } from "expo-router"

export default function RefereeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Referee Dashboard",
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="match-control"
        options={{
          title: "Match Control",
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="emergency-protocol"
        options={{
          title: "Emergency Protocol",
          headerStyle: { backgroundColor: "#FF4444" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  )
}
