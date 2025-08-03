import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  // baseURL: "https://movie-mate-fastapi-production.up.railway.app",
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;
