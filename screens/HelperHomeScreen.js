import { useState, useEffect } from "react";
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert, Switch,
} from "react-native";
import * as Location from "expo-location";
import { apiFetch } from "../api";

export default function HelperHomeScreen({ navigation }) {
  const [online, setOnline] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toggle online/offline — sends location + availability to backend
  async function toggleOnline(value) {
    try {
      if (value) {
        // Going online: need location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("অনুমতি প্রয়োজন", "অনলাইন হতে লোকেশন অনুমতি দিন");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        const { longitude, latitude } = pos.coords;

        const res = await apiFetch("/api/helper/location", {
          method: "PATCH",
          body: JSON.stringify({ longitude, latitude, isAvailable: true }),
        });
        if (!res.ok) {
          const d = await res.json();
          Alert.alert("ব্যর্থ", d.error || "প্রোফাইল তৈরি করুন");
          return;
        }
        setOnline(true);
        loadRequests();
      } else {
        // Going offline
        const pos = await Location.getCurrentPositionAsync({});
        await apiFetch("/api/helper/location", {
          method: "PATCH",
          body: JSON.stringify({
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
            isAvailable: false,
          }),
        });
        setOnline(false);
        setRequests([]);
      }
    } catch (err) {
      Alert.alert("ত্রুটি", err.message);
    }
  }

  // Load pending requests near the helper
async function loadRequests() {
    setLoading(true);
    console.log("HELPER polling for requests...");
    try {
      const res = await apiFetch("/api/helper/requests");
      const data = await res.json();
      console.log("HELPER got requests:", JSON.stringify(data));
      if (res.ok) setRequests(data);
    } catch (err) {
      console.log("HELPER request error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // While online, refresh the request list every 5 seconds
  useEffect(() => {
    if (!online) return;
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, [online]);

  // Accept a request
  async function acceptRequest(requestId) {
    try {
      const res = await apiFetch(`/api/requests/${requestId}/accept`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("দুঃখিত", data.error || "অনুরোধটি আর নেই");
        loadRequests();
        return;
      }
      Alert.alert("গৃহীত", "আপনি অনুরোধটি গ্রহণ করেছেন");
      loadRequests();
    } catch (err) {
      Alert.alert("ত্রুটি", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>
          {online ? "আপনি অনলাইন" : "আপনি অফলাইন"}
        </Text>
        <Switch
          value={online}
          onValueChange={toggleOnline}
          trackColor={{ true: "#0F766E" }}
        />
      </View>

      {!online && (
        <Text style={styles.hint}>অনুরোধ পেতে অনলাইন হন</Text>
      )}

      {online && (
        <>
          <Text style={styles.heading}>নতুন অনুরোধ</Text>
          {loading && requests.length === 0 && (
            <ActivityIndicator size="large" color="#0F766E" style={{ marginTop: 20 }} />
          )}
          {!loading && requests.length === 0 && (
            <Text style={styles.hint}>এখনো কোনো অনুরোধ নেই...</Text>
          )}
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardRole}>{item.role}</Text>
                <Text style={styles.cardStatus}>অপেক্ষমাণ</Text>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => acceptRequest(item._id)}
                >
                  <Text style={styles.acceptText}>গ্রহণ করুন</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC", padding: 24 },
  statusRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", padding: 20, borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0",
  },
  statusLabel: { fontSize: 20, fontWeight: "600", color: "#1E293B" },
  hint: { fontSize: 16, color: "#64748B", textAlign: "center", marginTop: 40 },
  heading: { fontSize: 20, fontWeight: "600", color: "#1E293B", marginTop: 30, marginBottom: 16 },
  card: {
    backgroundColor: "#fff", padding: 20, borderRadius: 14, marginBottom: 14,
    borderWidth: 1, borderColor: "#E2E8F0",
  },
  cardRole: { fontSize: 22, fontWeight: "600", color: "#0F766E" },
  cardStatus: { fontSize: 14, color: "#64748B", marginTop: 4 },
  acceptBtn: {
    backgroundColor: "#0F766E", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 14,
  },
  acceptText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});