import { io } from "socket.io-client";
import { API_URL } from "./config";

// One shared socket for the whole app. autoConnect off — we connect after login.
export const socket = io(API_URL, { autoConnect: false });

// Call after login: connect and join our personal room (by userId)
export function connectSocket(userId) {
  if (!socket.connected) socket.connect();
  socket.emit("register", userId);
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}