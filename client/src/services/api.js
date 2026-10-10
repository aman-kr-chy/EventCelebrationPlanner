import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://eventcelebrationplanner.onrender.com/api' : '/api'),
  withCredentials: true, // important for sending cookies
});

export default api;
