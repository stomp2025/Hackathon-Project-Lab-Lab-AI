import { Stack } from "expo-router"

export default function TeammatesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Team Status",
          headerStyle: { backgroundColor: "#4CAF50" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="teammate-detail"
        options={{
          title: "Teammate Details",
          headerStyle: { backgroundColor: "#4CAF50" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="emergency-assist"
        options={{
          title: "Emergency Assistance",
          headerStyle: { backgroundColor: "#FF4444" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  )
}
