import { API_URL } from "./config.js";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  login: (password) => request("/api/login", { method: "POST", body: { password } }),
  getState: () => request("/api/state"),
  setMode: (mode, token) => request("/api/mode", { method: "POST", body: { mode }, token }),
  setPrizePool: (payload, token) =>
    request("/api/prizepool", { method: "POST", body: payload, token }),
  addPlayer: (name, token) => request("/api/players", { method: "POST", body: { name }, token }),
  removePlayer: (id, token) => request(`/api/players/${id}`, { method: "DELETE", token }),
  addTeam: (name, captain, token) =>
    request("/api/teams", { method: "POST", body: { name, captain }, token }),
  removeTeam: (teamId, token) => request(`/api/teams/${teamId}`, { method: "DELETE", token }),
  addMember: (teamId, name, token) =>
    request(`/api/teams/${teamId}/members`, { method: "POST", body: { name }, token }),
  removeMember: (teamId, memberId, token) =>
    request(`/api/teams/${teamId}/members/${memberId}`, { method: "DELETE", token }),
  submitResult: (results, token) =>
    request("/api/match/result", { method: "POST", body: { results }, token }),
  clearAnnouncement: (token) =>
    request("/api/match/clear-announcement", { method: "POST", token }),
  setJoinLink: (mode, url, token) =>
    request("/api/join-link", { method: "POST", body: { mode, url }, token }),
  resetResults: (mode, token) =>
    request("/api/match/reset", { method: "POST", body: { mode }, token }),
};
