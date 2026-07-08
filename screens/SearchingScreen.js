import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { socket } from "../socket";

export default function SearchingScreen({ route, navigation }) {
  const { request, candidateHelpers, serviceName } = route.params;

  const [status, setStatus] = useState(request.status); // "searching" initially
  const [helper, setHelper] = useState(null);

  const foundHelpers = candidateHelpers > 0;

  // Listen for the helper accepting / status changes
  useEffect(() => {
    function handleAccepted(updated) {
      if (updated._id === request._id) {
        setStatus("accepted");
        setHelper(updated.helper); // populated {name, phone}
      }
    }
    function handleUpdated(updated) {
      if (updated._id === request._id) {
        setStatus(updated.status);
      }
    }

    socket.on("requestAccepted", handleAccepted);
    socket.on("requestUpdated", handleUpdated);
    return () => {
      socket.off("requestAccepted", handleAccepted);
      socket.off("requestUpdated", handleUpdated);
    };
  }, []);

  // Bangla labels for each status
  const statusLabels = {
    searching: "সাহায্যকারী খোঁজা হচ্ছে...",
    accepted: "একজন সাহায্যকারী গ্রহণ করেছেন!",
    on_the_way: "সাহায্যকারী আপনার দিকে আসছেন",
    helping: "সেবা চলছে",
    completed: "সেবা সম্পন্ন হয়েছে",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.service}>{serviceName}</Text>

      {status === "searching" && !foundHelpers ? (
        <>
          <Text style={styles.statusBad}>কোনো সাহায্যকারী পাওয়া যায়নি</Text>
          <Text style={styles.hint}>পরে আবার চেষ্টা করুন</Text>
        </>
      ) : (
        <>
          {status === "searching" && <ActivityIndicator size="large" color="#0F766E" style={{ marginBottom: 16 }} />}
          <Text style={styles.statusGood}>{statusLabels[status] || status}</Text>

          {helper && (
            <View style={styles.helperCard}>
              <Text style={styles.helperName}>{helper.name}</Text>
              <Text style={styles.helperPhone}>{helper.phone}</Text>
            </View>
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Services")}>
        <Text style={styles.buttonText}>ফিরে যান</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC", justifyContent: "center", alignItems: "center", padding: 24 },
  service: { fontSize: 30, fontWeight: "bold", color: "#0F766E", marginBottom: 30 },
  statusGood: { fontSize: 22, color: "#0F766E", fontWeight: "600", textAlign: "center" },
  statusBad: { fontSize: 22, color: "#DC2626", fontWeight: "600", textAlign: "center" },
  hint: { fontSize: 15, color: "#64748B", marginTop: 12, textAlign: "center" },
  helperCard: {
    backgroundColor: "#fff", padding: 20, borderRadius: 14, marginTop: 24,
    borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", minWidth: 200,
  },
  helperName: { fontSize: 22, fontWeight: "600", color: "#1E293B" },
  helperPhone: { fontSize: 16, color: "#64748B", marginTop: 6 },
  button: { backgroundColor: "#0F766E", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 40, paddingHorizontal: 40 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});