import { useState } from "react";
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { API_URL } from "../config";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !phone || !password) {
      Alert.alert("তথ্য দিন", "সব ঘর পূরণ করুন");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role: "patient" }),
      });
      const data = await res.json();

      if (!res.ok) {
        Alert.alert("ব্যর্থ", data.error || "সাইনআপ ব্যর্থ হয়েছে");
        return;
      }

      Alert.alert("সফল", "অ্যাকাউন্ট তৈরি হয়েছে, এখন লগইন করুন");
      navigation.replace("Login");
    } catch (err) {
      Alert.alert("ত্রুটি", "সংযোগ ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>অ্যাকাউন্ট তৈরি করুন</Text>

      <TextInput style={styles.input} placeholder="নাম" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input} placeholder="ফোন নম্বর" keyboardType="phone-pad"
        value={phone} onChangeText={setPhone}
      />
      <TextInput
        style={styles.input} placeholder="পাসওয়ার্ড" secureTextEntry
        value={password} onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>সাইনআপ</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>আগে থেকে অ্যাকাউন্ট আছে? লগইন করুন</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC", padding: 24, justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: "bold", color: "#0F766E", marginBottom: 30, textAlign: "center" },
  input: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 12,
    padding: 16, fontSize: 18, marginBottom: 16,
  },
  button: { backgroundColor: "#0F766E", padding: 18, borderRadius: 12, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  link: { color: "#0F766E", textAlign: "center", marginTop: 20, fontSize: 16 },
});