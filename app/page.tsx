import App from "../app"
import { StyleSheet, View } from "react-native"

export default function Page() {
  return (
    <View style={styles.container}>
      <App />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
