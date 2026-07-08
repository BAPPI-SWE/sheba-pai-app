import { useState } from "react";
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert,
} from "react-native";
import * as Location from "expo-location";
import { API_URL } from "../config";
import { apiFetch } from "../api";

export default function ServicesScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
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

  async function requestService(service) {
    setRequesting(true);
    try {
      // 1. Ask for location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("অনুমতি প্রয়োজন", "সেবা পেতে লোকেশন অনুমতি দিন");
        return;
      }

      // 2. Get current GPS coordinates
      const pos = await Location.getCurrentPositionAsync({});
      const { longitude, latitude } = pos.coords;

      // 3. Create the request on the backend (uses the first helper role of the service)
      const res = await apiFetch("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          role: service.helperRoles[0], // e.g. "Nurse"
          longitude,
          latitude,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        Alert.alert("ব্যর্থ", data.error || "অনুরোধ ব্যর্থ হয়েছে");
        return;
      }

      // 4. Go to a status screen, passing the request data
      navigation.navigate("Searching", {
        request: data.request,
        candidateHelpers: data.candidateHelpers,
        serviceName: service.nameBangla,
      });
    } catch (err) {
      console.log("REQUEST ERROR:", err.message);
      Alert.alert("ত্রুটি", err.message);
    } finally {
      setRequesting(false);
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

      {requesting && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0F766E" />
          <Text style={styles.overlayText}>অনুরোধ পাঠানো হচ্ছে...</Text>
        </View>
      )}

      <FlatList
        style={styles.list}
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceCard}
            activeOpacity={0.7}
            onPress={() => requestService(item)}
          >
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
  button: { backgroundColor: "#0F766E", paddingVertical: 18, paddingHorizontal: 40, borderRadius: 16, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 22, fontWeight: "600" },
  error: { color: "#DC2626", fontSize: 16, marginTop: 20, textAlign: "center" },
  list: { width: "100%", marginTop: 20 },
  serviceCard: {
    backgroundColor: "#FFFFFF", padding: 20, borderRadius: 14, marginBottom: 14,
    borderWidth: 1, borderColor: "#E2E8F0",
  },
  serviceName: { fontSize: 24, fontWeight: "600", color: "#1E293B" },
  serviceNameEn: { fontSize: 15, color: "#64748B", marginTop: 4 },
  overlay: {
    position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(247,250,252,0.9)", justifyContent: "center", alignItems: "center", zIndex: 10,
  },
  overlayText: { marginTop: 16, fontSize: 18, color: "#0F766E" },
});