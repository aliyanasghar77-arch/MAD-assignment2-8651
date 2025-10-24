import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://YOUR_COMPUTER_IP:3000/api"; // <-- Replace this with your PC IP (or 10.0.2.2 for Android emulator)

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// Add token to request headers
instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;