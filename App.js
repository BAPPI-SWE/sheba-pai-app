import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* App title */}
      <Text style={styles.logo}>সেবা পাই</Text>
      <Text style={styles.tagline}>হাসপাতালে সহজে সেবা নিন</Text>

      {/* Main action button */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>সেবা নিতে চাই</Text>
      </TouchableOpacity>

      {/* Secondary link */}
      <TouchableOpacity activeOpacity={0.6}>
        <Text style={styles.helperLink}>আমি একজন সাহায্যকারী</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0F766E", // teal
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: "#475569",
    marginBottom: 60,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0F766E",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
  helperLink: {
    color: "#0F766E",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});