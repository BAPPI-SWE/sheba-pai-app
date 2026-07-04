import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

// Every screen automatically receives "navigation" — use it to move between screens
export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.logo}>সেবা পাই</Text>
      <Text style={styles.tagline}>হাসপাতালে সহজে সেবা নিন</Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
      onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>সেবা নিতে চাই</Text>
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
  logo: { fontSize: 48, fontWeight: "bold", color: "#0F766E", marginBottom: 8 },
  tagline: { fontSize: 18, color: "#475569", marginBottom: 60, textAlign: "center" },
  button: {
    backgroundColor: "#0F766E",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 22, fontWeight: "600" },
});