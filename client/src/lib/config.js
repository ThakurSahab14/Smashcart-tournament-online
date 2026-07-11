// The client and server can be opened from localhost or via an ngrok URL.
// This assumes the API server runs on the same hostname, port 4000.
// Override by creating a `.env` file with VITE_API_URL=https://your-ngrok-url
const explicit = import.meta.env.VITE_API_URL;

export const API_URL =
  explicit && explicit.trim() ? explicit : `${window.location.protocol}//${window.location.hostname}:4000`;
