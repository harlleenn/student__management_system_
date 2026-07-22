// src/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // sends cookie automatically on every request
});

export default api;