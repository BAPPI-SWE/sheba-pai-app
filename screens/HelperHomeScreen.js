import { useState, useEffect } from "react";
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert, Switch,
} from "react-native";
import * as Location from "expo-location";
import { apiFetch } from "../api";
import { socket } from "../socket";

// Maps current status -> { label for the button, the next status }
const NEXT_STEP = {
  accepted: { label: "রওনা হয়েছি", next: "on_the_way" },
  on_the_way: { label: "পৌঁছেছি, সেবা শুরু", next: "helping" },
  helping: { label: "সেবা সম্পন্ন", next: "completed" },
};

const STATUS_LABEL = {
  accepted: "গৃহীত",
  on_the_way: "রোগীর দিকে যাচ্ছি",
  helping: "সেবা চলছে",
};

export default function HelperHomeScreen() {
  const [online, setOnline] = useState(false);
  const [requests, setRequests] = useState([]);
  const [activeJob, setActiveJob] = useState(null); // the request she's handling
  const [loading, setLoading] = useState(false);

  async function toggleOnline(value) {
    try {
      if (value) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("অনুমতি প্রয়োজন", "অনলাইন হতে লোকেশন অনুমতি দিন");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        const res = await apiFetch("/api/helper/location", {
          method: "PATCH",
          body: JSON.stringify({
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
            isAvailable: true,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          Alert.alert("ব্যর্থ", d.error || "প্রোফাইল তৈরি করুন");
          return;
        }
        setOnline(true);
        loadRequests();
      } else {
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

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/helper/requests");
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleNewRequest(request) {
      setRequests((prev) => {
        if (prev.find((r) => r._id === request._id)) return prev;
        return [request, ...prev];
      });
    }
    socket.on("newRequest", handleNewRequest);
    return () => socket.off("newRequest", handleNewRequest);
  }, []);

  async function acceptRequest(request) {
    try {
      const res = await apiFetch(`/api/requests/${request._id}/accept`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("দুঃখিত", data.error || "অনুরোধটি আর নেই");
        setRequests((prev) => prev.filter((r) => r._id !== request._id));
        return;
      }
      // Move into active-job mode
      setActiveJob(data);
      setRequests([]); // clear the list while handling one job
    } catch (err) {
      Alert.alert("ত্রুটি", err.message);
    }
  }

  // Advance the active job to its next state
  async function advanceJob() {
    const step = NEXT_STEP[activeJob.status];
    if (!step) return;
    try {
      const res = await apiFetch(`/api/requests/${activeJob._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ nextStatus: step.next }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("ব্যর্থ", data.error || "পরিবর্তন ব্যর্থ");
        return;
      }
      if (data.status === "completed") {
        Alert.alert("সম্পন্ন", "সেবা সম্পন্ন হয়েছে");
        setActiveJob(null); // job done, back to receiving requests
        loadRequests();
      } else {
        setActiveJob(data);
      }
    } catch (err) {
      Alert.alert("ত্রুটি", err.message);
    }
  }

  // --- ACTIVE JOB VIEW ---
  if (activeJob) {
    const step = NEXT_STEP[activeJob.status];
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>চলমান কাজ</Text>
        <View style={styles.jobCard}>
          <Text style={styles.cardRole}>{activeJob.role}</Text>
          <Text style={styles.jobStatus}>{STATUS_LABEL[activeJob.status]}</Text>
        </View>
        {step && (
          <TouchableOpacity style={styles.bigBtn} onPress={advanceJob}>
            <Text style={styles.bigBtnText}>{step.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // --- NORMAL (online/offline + request list) VIEW ---
  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>{online ? "আপনি অনলাইন" : "আপনি অফলাইন"}</Text>
        <Switch value={online} onValueChange={toggleOnline} trackColor={{ true: "#0F766E" }} />
      </View>

      {!online && <Text style={styles.hint}>অনুরোধ পেতে অনলাইন হন</Text>}

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
                <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptRequest(item)}>
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
  acceptBtn: { backgroundColor: "#0F766E", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 14 },
  acceptText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  jobCard: {
    backgroundColor: "#fff", padding: 24, borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0",
    marginBottom: 30,
  },
  jobStatus: { fontSize: 18, color: "#475569", marginTop: 8 },
  bigBtn: { backgroundColor: "#0F766E", padding: 20, borderRadius: 14, alignItems: "center" },
  bigBtnText: { color: "#fff", fontSize: 22, fontWeight: "700" },
});