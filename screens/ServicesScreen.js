import { useState } from "react";
import { API_URL } from "../config";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

// // ⚠️ Your computer's current IP
// const API_URL = "http://192.168.1.5:3000";

export default function ServicesScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadServices() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/services`);
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError("সংযোগ ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>আপনি কোন সেবা নিতে চান?</Text>

      {services.length === 0 && !loading && (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={loadServices}>
          <Text style={styles.buttonText}>সেবা দেখুন</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#0F766E" />}
      {error && <Text style={styles.error}>{error}</Text>}

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
  container: { flex: 1, backgroundColor: "#F7FAFC", paddingTop: 24, paddingHorizontal: 24 },
  heading: { fontSize: 22, fontWeight: "600", color: "#1E293B", marginBottom: 30, textAlign: "center" },
  button: {
    backgroundColor: "#0F766E",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 22, fontWeight: "600" },
  error: { color: "#DC2626", fontSize: 16, marginTop: 20, textAlign: "center" },
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