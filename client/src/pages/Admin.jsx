import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTournament } from "../context/TournamentContext.jsx";
import { api } from "../lib/api.js";
import AdminDice from "../components/AdminDice.jsx";

function Section({ title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-asphalt-light p-6"
    >
      <h2 className="font-display text-xl font-bold uppercase tracking-wide">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-asphalt px-3 py-2 text-sm text-white outline-none focus:border-volt";

function RegistrationsSection({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const res = await fetch("http://localhost:4000/api/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRegistrations(data);
        }
      } catch (e) {
        console.error("Failed to fetch registrations:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, [token]);

  return (
    <Section title="Registrations" subtitle="Players who registered via the form">
      {loading ? (
        <p className="text-white/40">Loading...</p>
      ) : registrations.length === 0 ? (
        <p className="text-white/40">No registrations yet</p>
      ) : (
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-asphalt-light text-left text-white/60">
              <tr>
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">IGN</th>
                <th className="pb-2 pr-4">Mobile</th>
                <th className="pb-2">Discord</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {registrations.map((r) => (
                <tr key={r.id} className="text-white/70">
                  <td className="py-2 pr-4">{r.name}</td>
                  <td className="py-2 pr-4 text-volt">{r.ign}</td>
                  <td className="py-2 pr-4">{r.mobile}</td>
                  <td className="py-2">{r.discord || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-white/40">
        Total: {registrations.length} registration{registrations.length !== 1 ? "s" : ""}
      </p>
    </Section>
  );
}

export default function Admin() {
  const { token, isAdmin } = useAuth();
  const { state } = useTournament();
  const [notice, setNotice] = useState("");

  const [prizePool, setPrizePool] = useState(0);
  const [soloPrizePool, setSoloPrizePool] = useState(0);
  const [split, setSplit] = useState({ champion: 50, second: 30, third: 20 });
  const [soloLink, setSoloLink] = useState("");
  const [teamLink, setTeamLink] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamCaptain, setTeamCaptain] = useState("");
  const [memberInputs, setMemberInputs] = useState({});
  const [results, setResults] = useState({ 1: "", 2: "", 3: "" });
  const [winningTeam, setWinningTeam] = useState("");

  // Fetch fresh state from server when admin panel opens
  const [freshState, setFreshState] = useState(null);

  useEffect(() => {
    api.getState().then(setFreshState).catch(() => {});
  }, []);

  // Use fresh state if available, otherwise fall back to context state
  const currentState = freshState || state;

  useEffect(() => {
    if (currentState) {
      setPrizePool(currentState.prizePool);
      setSoloPrizePool(currentState.soloPrizePool || 0);
      setSplit(currentState.soloSplit);
      setSoloLink(currentState.joinLinks?.solo || "");
      setTeamLink(currentState.joinLinks?.team || "");
    }
  }, [currentState]);

  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  if (!currentState) return <p className="p-10 text-center text-white/40">Loading race control…</p>;

  function flash(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  }

  async function handleModeChange(mode) {
    try {
      await api.setMode(mode, token);
      flash(`Mode set to ${mode}`);
    } catch (e) {
      flash(e.message);
    }
  }

  async function handlePrizeSubmit(e) {
    e.preventDefault();
    const total = Number(split.champion) + Number(split.second) + Number(split.third);
    if (total !== 100) return flash("Solo split must add up to 100%");
    try {
      await api.setPrizePool({ prizePool: Number(prizePool), soloPrizePool: Number(soloPrizePool), soloSplit: split }, token);
      flash("Prize pool updated");
    } catch (e) {
      flash(e.message);
    }
  }

  async function handleSaveLinks(e) {
    e.preventDefault();
    try {
      await api.setJoinLink("solo", soloLink, token);
      await api.setJoinLink("team", teamLink, token);
      flash("Join links updated");
    } catch (e) {
      flash(e.message);
    }
  }

  async function handleAddPlayer(e) {
    e.preventDefault();
    if (!playerName.trim()) return;
    await api.addPlayer(playerName, token);
    setPlayerName("");
  }

  async function handleAddTeam(e) {
    e.preventDefault();
    if (!teamName.trim()) return;
    await api.addTeam(teamName, teamCaptain, token);
    setTeamName("");
    setTeamCaptain("");
  }

  async function handleAddMember(teamId) {
    const name = memberInputs[teamId];
    if (!name || !name.trim()) return;
    await api.addMember(teamId, name, token);
    setMemberInputs((prev) => ({ ...prev, [teamId]: "" }));
  }

  async function handleDeclareSolo(e) {
    e.preventDefault();
    const entries = [1, 2, 3]
      .filter((place) => results[place])
      .map((place) => ({ place, name: results[place] }));
    if (entries.length === 0) return flash("Pick at least a champion");
    try {
      await api.submitResult(entries, token);
      setResults({ 1: "", 2: "", 3: "" });
      flash("Result declared — confetti incoming");
    } catch (e) {
      flash(e.message);
    }
  }

  async function handleDeclareTeam(e) {
    e.preventDefault();
    const team = currentState.teams.find((t) => t.id === winningTeam);
    if (!team) return flash("Pick the winning team");
    try {
      await api.submitResult([{ place: 1, name: team.name, teamId: team.id }], token);
      setWinningTeam("");
      flash("Winner declared — confetti incoming");
    } catch (e) {
      flash(e.message);
    }
  }

  async function handleReset(mode) {
    const label = mode === "solo" ? "Solo" : "Team";
    if (!window.confirm(`Reset all ${label} winners/history? This can't be undone.`)) return;
    try {
      await api.resetResults(mode, token);
      flash(`${label} results reset`);
    } catch (e) {
      flash(e.message);
    }
  }

  const isSolo = currentState.mode === "solo";

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide">
          Race Control
        </h1>
        {notice && (
          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full bg-volt px-4 py-1.5 text-sm font-medium text-asphalt"
          >
            {notice}
          </motion.span>
        )}
      </div>

      <AdminDice />

      <Section title="Mode" subtitle="Switch the whole tournament between Solo and Team.">
        <div className="flex gap-3">
          {["solo", "team"].map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`rounded-full px-5 py-2 font-display text-sm font-bold uppercase tracking-wide transition ${
                currentState.mode === m
                  ? "bg-volt text-asphalt"
                  : "border border-white/15 text-white/70 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Prize pool" subtitle="Dynamic — update any time before or between races.">
        <form onSubmit={handlePrizeSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Team Prize (₹)">
              <input
                type="number"
                min="0"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Solo Prize (₹)">
              <input
                type="number"
                min="0"
                value={soloPrizePool}
                onChange={(e) => setSoloPrizePool(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          {isSolo && (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Champion %">
                <input
                  type="number"
                  value={split.champion}
                  onChange={(e) => setSplit({ ...split, champion: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
              <Field label="2nd %">
                <input
                  type="number"
                  value={split.second}
                  onChange={(e) => setSplit({ ...split, second: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
              <Field label="3rd %">
                <input
                  type="number"
                  value={split.third}
                  onChange={(e) => setSplit({ ...split, third: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
            </div>
          )}

          <button
            type="submit"
            className="rounded-full bg-volt px-6 py-2 font-display text-sm font-bold uppercase tracking-wide text-asphalt hover:brightness-110"
          >
            Save prize pool
          </button>
        </form>
      </Section>

      <Section
        title="Game join link"
        subtitle="Dynamic — paste the lobby link for whichever mode racers should join. Shown live on the homepage."
      >
        <form onSubmit={handleSaveLinks} className="space-y-4">
          <Field label="Solo lobby link">
            <input
              type="url"
              value={soloLink}
              onChange={(e) => setSoloLink(e.target.value)}
              placeholder="https://smashkart.io/lobby/xyz"
              className={inputClass}
            />
          </Field>
          <Field label="Team lobby link">
            <input
              type="url"
              value={teamLink}
              onChange={(e) => setTeamLink(e.target.value)}
              placeholder="https://smashkart.io/lobby/xyz"
              className={inputClass}
            />
          </Field>
          <button
            type="submit"
            className="rounded-full bg-volt px-6 py-2 font-display text-sm font-bold uppercase tracking-wide text-asphalt hover:brightness-110"
          >
            Save join links
          </button>
        </form>
      </Section>

      {isSolo ? (
        <Section title="Racers" subtitle="Add solo entrants to the grid.">
          <form onSubmit={handleAddPlayer} className="flex gap-3">
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Racer name"
              className={inputClass}
            />
            <button className="shrink-0 rounded-full border border-volt/40 px-5 py-2 text-sm font-medium text-volt hover:bg-volt hover:text-asphalt">
              Add
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentState.players.map((p) => (
              <span
                key={p.id}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm"
              >
                {p.name}
                <button
                  onClick={() => api.removePlayer(p.id, token)}
                  className="text-white/30 hover:text-surge"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </Section>
      ) : (
        <Section title="Teams" subtitle="Create teams, assign a captain, and add members.">
          <form onSubmit={handleAddTeam} className="flex flex-wrap gap-3">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team name"
              className={`${inputClass} flex-1`}
            />
            <input
              value={teamCaptain}
              onChange={(e) => setTeamCaptain(e.target.value)}
              placeholder="Captain name"
              className={`${inputClass} flex-1`}
            />
            <button className="shrink-0 rounded-full border border-volt/40 px-5 py-2 text-sm font-medium text-volt hover:bg-volt hover:text-asphalt">
              Add team
            </button>
          </form>

          <div className="mt-5 space-y-4">
            {currentState.teams.map((team) => (
              <div key={team.id} className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg font-bold text-volt">{team.name}</p>
                    {team.captain && (
                      <p className="text-xs text-white/40">Captain: {team.captain}</p>
                    )}
                  </div>
                  <button
                    onClick={() => api.removeTeam(team.id, token)}
                    className="text-xs text-white/30 hover:text-surge"
                  >
                    Remove team
                  </button>
                </div>

                <ul className="mt-3 space-y-1">
                  {team.members.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-sm">
                      <span className="text-white/70">• {m.name}</span>
                      <button
                        onClick={() => api.removeMember(team.id, m.id, token)}
                        className="text-white/30 hover:text-surge"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex gap-2">
                  <input
                    value={memberInputs[team.id] || ""}
                    onChange={(e) =>
                      setMemberInputs((prev) => ({ ...prev, [team.id]: e.target.value }))
                    }
                    placeholder="Member name"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    onClick={() => handleAddMember(team.id)}
                    className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:text-volt"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section
        title="Declare result"
        subtitle="Triggers confetti and personalized certificates for everyone watching."
      >
        {isSolo ? (
          <form onSubmit={handleDeclareSolo} className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((place) => (
              <Field key={place} label={["Champion", "2nd", "3rd"][place - 1]}>
                <select
                  value={results[place]}
                  onChange={(e) => setResults({ ...results, [place]: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select racer</option>
                  {currentState.players.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
            ))}
            <button className="col-span-full rounded-full bg-surge px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-asphalt hover:brightness-110">
              Drop the flag 🏁
            </button>
          </form>
        ) : (
          <form onSubmit={handleDeclareTeam} className="space-y-4">
            <Field label="Winning team">
              <select
                value={winningTeam}
                onChange={(e) => setWinningTeam(e.target.value)}
                className={inputClass}
              >
                <option value="">Select team</option>
                {currentState.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
            <button className="rounded-full bg-surge px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-asphalt hover:brightness-110">
              Drop the flag 🏁
            </button>
          </form>
        )}
      </Section>

      <Section
        title="Reset winners"
        subtitle="Clears declared results for a fresh tournament. Solo and Team reset independently — resetting one leaves the other's history untouched."
      >
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleReset("solo")}
            className="rounded-full border border-surge/40 px-5 py-2 text-sm font-medium text-surge hover:bg-surge hover:text-asphalt"
          >
            Reset Solo results
          </button>
          <button
            onClick={() => handleReset("team")}
            className="rounded-full border border-surge/40 px-5 py-2 text-sm font-medium text-surge hover:bg-surge hover:text-asphalt"
          >
            Reset Team results
          </button>
        </div>
      </Section>

      {/* Registrations Section */}
      <RegistrationsSection token={token} />
    </main>
  );
}
