import Constants from "expo-constants";

// Automatically detect your computer's IP from Expo's dev server.
// Falls back to a manual IP if detection fails.
function getApiUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    "";
  const host = hostUri.split(":")[0]; // grab the IP part
  if (host) {
    return `http://${host}:3000`;
  }
  return "http://192.168.1.5:3000"; // fallback — update if needed
}

export const API_URL = getApiUrl();