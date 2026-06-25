// Base URL for the backend API.
// Set VITE_API_URL in the environment (e.g. Render dashboard or a .env file)
// to point at the deployed backend. Falls back to localhost for local dev.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
