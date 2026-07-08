import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

export async function apiFetch(path, options = {}) {
  const token = await AsyncStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  return res;
}