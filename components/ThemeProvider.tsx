import type { ReactNode } from "react"
import { View } from "react-native"

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <View style={{ flex: 1, backgroundColor: "#121826" }}>{children}</View>
}
