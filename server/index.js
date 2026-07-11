import express from "express";
import cors from "cors";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data", "tournament.json");
const JWT_SECRET = "smashkart-local-secret-change-me";
const PORT = process.env.PORT || 4000;

// ---------- tiny JSON "database" ----------
function readState() {
  const state = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  if (!state.joinLinks) state.joinLinks = { solo: "", team: "" };
  return state;
}
function writeState(state) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}
function publicState(state) {
  const { adminPassword, ...rest } = state;
  return rest;
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------- app setup ----------
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

function broadcastState() {
  io.emit("state:update", publicState(readState()));
}

// ---------- auth ----------
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing admin token" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired admin session" });
  }
}

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const state = readState();
  if (password && password === state.adminPassword) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Incorrect password" });
});

// ---------- public read ----------
app.get("/api/state", (req, res) => {
  res.json(publicState(readState()));
});

// ---------- mode & prize pool ----------
app.post("/api/mode", requireAdmin, (req, res) => {
  const { mode } = req.body;
  if (!["solo", "team"].includes(mode)) {
    return res.status(400).json({ error: "Mode must be 'solo' or 'team'" });
  }
  const state = readState();
  state.mode = mode;
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

app.post("/api/prizepool", requireAdmin, (req, res) => {
  const { prizePool, soloSplit } = req.body;
  const state = readState();
  if (typeof prizePool === "number" && prizePool >= 0) {
    state.prizePool = prizePool;
  }
  if (soloSplit) {
    const total =
      Number(soloSplit.champion) + Number(soloSplit.second) + Number(soloSplit.third);
    if (Math.abs(total - 100) > 0.01) {
      return res.status(400).json({ error: "Solo split percentages must add up to 100" });
    }
    state.soloSplit = soloSplit;
  }
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

// ---------- game join link ----------
app.post("/api/join-link", requireAdmin, (req, res) => {
  const { mode, url } = req.body;
  if (!["solo", "team"].includes(mode)) {
    return res.status(400).json({ error: "Mode must be 'solo' or 'team'" });
  }
  const state = readState();
  if (!state.joinLinks) state.joinLinks = { solo: "", team: "" };
  state.joinLinks[mode] = (url || "").trim();
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

// ---------- solo players ----------
app.post("/api/players", requireAdmin, (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Player name required" });
  const state = readState();
  state.players.push({ id: uid(), name: name.trim() });
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

app.delete("/api/players/:id", requireAdmin, (req, res) => {
  const state = readState();
  state.players = state.players.filter((p) => p.id !== req.params.id);
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

// ---------- teams ----------
app.post("/api/teams", requireAdmin, (req, res) => {
  const { name, captain } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Team name required" });
  const state = readState();
  state.teams.push({
    id: uid(),
    name: name.trim(),
    captain: captain?.trim() || "",
    members: [],
  });
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

app.delete("/api/teams/:teamId", requireAdmin, (req, res) => {
  const state = readState();
  state.teams = state.teams.filter((t) => t.id !== req.params.teamId);
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

app.post("/api/teams/:teamId/members", requireAdmin, (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Member name required" });
  const state = readState();
  const team = state.teams.find((t) => t.id === req.params.teamId);
  if (!team) return res.status(404).json({ error: "Team not found" });
  team.members.push({ id: uid(), name: name.trim() });
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

app.delete("/api/teams/:teamId/members/:memberId", requireAdmin, (req, res) => {
  const state = readState();
  const team = state.teams.find((t) => t.id === req.params.teamId);
  if (!team) return res.status(404).json({ error: "Team not found" });
  team.members = team.members.filter((m) => m.id !== req.params.memberId);
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

// ---------- match results ----------
// body: { results: [{ place: 1|2|3, name, teamId? }] }
app.post("/api/match/result", requireAdmin, (req, res) => {
  const { results } = req.body;
  if (!Array.isArray(results) || results.length === 0) {
    return res.status(400).json({ error: "Results are required" });
  }
  const state = readState();
  const mode = state.mode;
  const pool = Number(state.prizePool) || 0;

  let payouts = [];
  if (mode === "solo") {
    const split = state.soloSplit;
    const pct = { 1: split.champion, 2: split.second, 3: split.third };
    payouts = results.map((r) => ({
      place: r.place,
      name: r.name,
      amount: Math.round((pool * (pct[r.place] || 0)) / 100),
    }));
  } else {
    // team mode: whole pool goes to the winning team, captain distributes.
    // Snapshot the roster now, so history stays accurate even if the team
    // is later renamed/removed.
    const winner = results.find((r) => r.place === 1);
    const team = state.teams.find((t) => t.id === winner?.teamId);
    payouts = [
      {
        place: 1,
        name: winner?.name || "Champion Team",
        teamId: winner?.teamId,
        captain: team?.captain || "",
        members: team?.members?.map((m) => m.name) || [],
        amount: pool,
        note: "Distributed by team captain",
      },
    ];
  }

  const match = {
    id: uid(),
    mode,
    prizePool: pool,
    results,
    payouts,
    timestamp: new Date().toISOString(),
  };

  state.matches.unshift(match);
  state.liveAnnouncement = match;
  writeState(state);

  io.emit("match:announced", match);
  broadcastState();
  res.json({ ok: true, match });
});

app.post("/api/match/clear-announcement", requireAdmin, (req, res) => {
  const state = readState();
  state.liveAnnouncement = null;
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

// Reset winners/history for one mode only, leaving the other mode's
// history untouched.
app.post("/api/match/reset", requireAdmin, (req, res) => {
  const { mode } = req.body;
  if (!["solo", "team"].includes(mode)) {
    return res.status(400).json({ error: "Mode must be 'solo' or 'team'" });
  }
  const state = readState();
  state.matches = state.matches.filter((m) => m.mode !== mode);
  if (state.liveAnnouncement?.mode === mode) {
    state.liveAnnouncement = null;
  }
  writeState(state);
  broadcastState();
  res.json({ ok: true });
});

io.on("connection", (socket) => {
  socket.emit("state:update", publicState(readState()));
});

server.listen(PORT, () => {
  console.log(`SmashKart Tournament server running on http://localhost:${PORT}`);
});
