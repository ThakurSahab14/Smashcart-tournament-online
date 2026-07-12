# 🏎️  SmashKart Tournament

A live, animated tournament site for SmashKart race nights — admins run the
grid in real time, everyone else watches a live leaderboard, confetti, and
auto-generated certificates as results come in.

- **Backend:** Node + Express + Socket.io, a flat JSON file as the database
  (no setup, no external DB).
- **Frontend:** React (Vite) + Tailwind + Framer Motion + canvas-confetti.
- **Real-time:** every admin action broadcasts instantly to all connected
  viewers over a websocket.

---

## 1. Install

You need [Node.js](https://nodejs.org) 18+ installed. Then, in two terminals:

```bash
# Terminal 1 — backend
cd server
npm install
npm start
# → SmashKart Tournament server running on http://localhost:4000

# Terminal 2 — frontend
cd client
npm install
npm run dev
# → open http://localhost:5173
```

That's it — no database to configure. Tournament data lives in
`server/data/tournament.json` and updates live as the admin makes changes.

## 2. Admin login

Default admin password: **``**

Change it any time by editing `"adminPassword"` in
`server/data/tournament.json` (restart the server after editing).

Log in from the "Admin Login" button in the top nav, at `/admin/login`.

## 3. Running a tournament

From the **Race Control** panel (`/admin`) an admin can:

- Switch the whole event between **Solo** and **Team** mode
- Set the **prize pool** and, in Solo mode, the champion / 2nd / 3rd split
  percentages (must add up to 100%)
- Paste a **game join link** for Solo and/or Team lobbies — whichever
  matches the live mode shows up instantly on the homepage as a pulsing
  "Join the race" button, no redeploy needed
- **Solo:** add/remove racers on the grid
- **Team:** create teams, assign a captain, add/remove members
- **Declare a result** — pick the podium (Solo) or the winning team (Team)
  and hit "Drop the flag 🏁"
- **Reset winners** — separately for Solo and Team (see section 5)

The instant a result is declared:

- Every connected viewer sees confetti fire and a results overlay appear
- Personalized certificates render live (canvas-based) for Champion, 2nd,
  and 3rd (or the winning team's captain) with a **Download certificate**
  button — no server-side file generation needed, everything renders in
  the browser
- The live prize podium on the homepage updates to show each finisher's
  actual name under Champion / 2nd / 3rd
- A **"Latest results"** section on the homepage shows the most recent
  completed Solo result *and* the most recent completed Team result side
  by side (team result includes the winning team's members). Each stays
  visible until an admin resets that mode specifically — resetting Solo
  doesn't touch Team's result and vice versa.

### How prizes are calculated

- **Solo:** `prizePool × split% ` for each of the top 3 (e.g. 50/30/20 of
  ₹3,000 → ₹1,500 / ₹900 / ₹600). The split is fully configurable from
  Race Control and always must total 100%.
- **Team:** the entire prize pool goes to the winning team as one lump
  sum — the certificate + payout note make clear it's meant to be split by
  the captain among teammates. The winning team's roster is snapshotted
  into the match record at the moment the result is declared, so history
  stays accurate even if you rename or delete the team afterward.

## 4. The 3D hero & kart companion

The homepage hero is a real, interactive Three.js scene (via
`@react-three/fiber`) — a procedurally-built kart styled after the
SmashKarts "popsicle" racer (striped head, cartoon eyes, arm tubes, light
gray tires so they actually show up against the dark background — see
`client/src/components/three/KartMesh.jsx`), plus five smaller karts
drifting around in the background for atmosphere.

- **The headline** ("Welcome to BrowserStack SmashKart Tournament") dances
  in character by character — each letter scatters, tumbles in 3D, and
  bounces into its final position over ~2.3 seconds — before the kart
  scene itself fades in underneath.
- **Move your cursor anywhere on the page:** the kart rotates to face
  wherever your cursor is horizontally, so you can spin it around and see
  every side, the same way you'd spin the dice on the admin panel.
- **Hover the hero:** instead of zooming, the kart splits into two smaller
  identical twins that peel apart to either side, its color cycles
  through the neon palette, and confetti bursts from behind it. Move away
  and they slide back together into one kart.
- **Scroll the page:** the whole scene drifts down and fades slightly.

A small **companion kart** (bottom-right corner) stays with you down every
section of the homepage — it wobbles based on how fast you're scrolling,
and clicking it fires a little "Gotcha!" confetti moment.

Everything is built from primitive geometries (boxes, cylinders, spheres,
tori) — no external model files, no licensing concerns, loads instantly.
If you'd rather use the actual Sketchfab model
([smash-karts-popsicle-character](https://sketchfab.com/3d-models/smash-karts-popsicle-character-e223d11bb23d4dd5969be16831d012c8)),
download the `.glb` yourself (Sketchfab requires a login/license check I
can't do from here), drop it in `client/public/models/`, and swap
`KartMesh.jsx` for a `useGLTF('/models/kart.glb')` call from
`@react-three/drei` — the split/rotate/color logic in `InteractiveKart.jsx`
only touches the outer twin `<group>`s, so it'll keep working the same way.

## 5. Reset winners (per mode)

Race Control has a **Reset winners** section with two buttons: "Reset
Solo results" and "Reset Team results". Each one only clears that mode's
declared match history (and its live-announcement, if one was mid-flight)
— they're fully independent, so you can run Solo and Team as separate
tournaments and reset one without disturbing the other. Until you reset,
the homepage keeps showing that mode's latest result for anyone who
checks the site later.

## 6. Admin panel

Race Control (`/admin`) now opens with a small 3D dice — hover it and it
spins faster, with racing-themed icon cards (flag, trophy, kart,
confetti, stopwatch, star) drifting around it against a dark, glowing
background.

## 7. Sharing it live with friends via ngrok

Since there are two servers (frontend on 5173, backend on 4000), the
simplest setup is to open **two ngrok tunnels**:

```bash
ngrok http 5173   # for the site itself
ngrok http 4000   # for the API/websocket
```

Then, in `client/.env` (copy from `client/.env.example`), point the
frontend at your API tunnel:

```
VITE_API_URL=https://your-api-tunnel.ngrok-free.app
```

Restart `npm run dev` in `client/` after adding the `.env` file, then share
your **frontend** ngrok URL (the `5173` one) with friends — they'll see
live updates as the admin manages the tournament.

> If you only need to demo locally on the same Wi-Fi (no ngrok), skip the
> `.env` entirely — the client auto-detects the API on the same hostname,
> port 4000, so `http://<your-laptop-ip>:5173` just works for anyone on
> the same network.

## 8. Project structure

```
server/
  index.js              Express + Socket.io API
  data/tournament.json  Flat-file "database" (mode, prize pool, teams, matches)
client/
  src/
    pages/               Home, AdminLogin, Admin
    components/          Hero, mode explainer, podium, roster, certificates, live announcement
    context/              Auth (admin JWT) + Tournament (live socket state)
    lib/                  API client, socket client, certificate canvas renderer
```

## 9. Notes & next steps

- The admin password is a single shared secret by design (simple race-night
  use). For anything more sensitive, swap it for per-admin accounts.
- `tournament.json` is the source of truth — back it up between events if
  you want match history to persist. To start a completely fresh event,
  replace it with a starter file (mode: solo, empty players/teams/matches,
  prize pool 0, and whatever admin password you want).
- Certificates are pure `<canvas>` renders (no server round-trip), so they
  work perfectly over ngrok with zero extra config.
- The 3D hero adds real weight to the JS bundle (three.js + fiber). It's
  fine for a friends' race night, but if you ever want a lighter mobile
  experience, the easiest lever is lowering the roaming-kart count in
  `HeroKartScene.jsx` (currently 5) or capping `dpr` further in
  `Hero3D.jsx`.
