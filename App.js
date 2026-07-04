import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// ⚠️ Replace with YOUR computer's IP from the Expo output (after exp://)
const API_URL = "http://192.168.1.5:3000";

export default function App() {
  // State: three things that can change and re-draw the screen
  const [services, setServices] = useState([]); // the fetched services
  const [loading, setLoading] = useState(false); // are we waiting?
  const [error, setError] = useState(null); // did something fail?

  // Fetch services from the backend
  async function loadServices() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/services`);
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError("সংযোগ ব্যর্থ হয়েছে"); // "Connection failed"
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.logo}>সেবা পাই</Text>
      <Text style={styles.tagline}>আপনি কোন সেবা নিতে চান?</Text>

      {/* Show the button only before services are loaded */}
      {services.length === 0 && !loading && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={loadServices}
        >
          <Text style={styles.buttonText}>সেবা দেখুন</Text>
        </TouchableOpacity>
      )}

      {/* Loading spinner while waiting */}
      {loading && <ActivityIndicator size="large" color="#0F766E" />}

      {/* Error message if the fetch failed */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* The list of services */}
      <FlatList
        style={styles.list}
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceCard} activeOpacity={0.7}>
            <Text style={styles.serviceName}>{item.nameBangla}</Text>
            <Text style={styles.serviceNameEn}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  logo: { fontSize: 40, fontWeight: "bold", color: "#0F766E", marginBottom: 8 },
  tagline: { fontSize: 18, color: "#475569", marginBottom: 40, textAlign: "center" },
  button: {
    backgroundColor: "#0F766E",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 22, fontWeight: "600" },
  error: { color: "#DC2626", fontSize: 16, marginTop: 20 },
  list: { width: "100%", marginTop: 20 },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  serviceName: { fontSize: 24, fontWeight: "600", color: "#1E293B" },
  serviceNameEn: { fontSize: 15, color: "#64748B", marginTop: 4 },
});