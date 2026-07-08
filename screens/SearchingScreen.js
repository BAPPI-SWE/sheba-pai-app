import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function SearchingScreen({ route, navigation }) {
  const { request, candidateHelpers, serviceName } = route.params;

  const foundHelpers = candidateHelpers > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.service}>{serviceName}</Text>

      {foundHelpers ? (
        <>
          <Text style={styles.statusGood}>সাহায্যকারী খোঁজা হচ্ছে...</Text>
          <Text style={styles.detail}>
            {candidateHelpers} জন কাছাকাছি সাহায্যকারী পাওয়া গেছে
          </Text>
          <Text style={styles.hint}>একজন সাহায্যকারী গ্রহণ করলে জানানো হবে</Text>
        </>
      ) : (
        <>
          <Text style={styles.statusBad}>কোনো সাহায্যকারী পাওয়া যায়নি</Text>
          <Text style={styles.hint}>পরে আবার চেষ্টা করুন</Text>
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
  detail: { fontSize: 18, color: "#1E293B", marginTop: 16, textAlign: "center" },
  hint: { fontSize: 15, color: "#64748B", marginTop: 12, textAlign: "center" },
  button: { backgroundColor: "#0F766E", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 40, paddingHorizontal: 40 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});