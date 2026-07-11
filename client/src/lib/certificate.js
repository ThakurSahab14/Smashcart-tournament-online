const PLACE_STYLES = {
  1: { label: "CHAMPION", color: "#FFC93C", glow: "rgba(255,201,60,0.35)" },
  2: { label: "2ND PLACE", color: "#C9D6DF", glow: "rgba(201,214,223,0.3)" },
  3: { label: "3RD PLACE", color: "#D98C4A", glow: "rgba(217,140,74,0.3)" },
};

export function drawCertificate(canvas, { place, name, prizeAmount, mode, note }) {
  const W = 1200;
  const H = 800;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const style = PLACE_STYLES[place] || PLACE_STYLES[3];

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0B0E14");
  bg.addColorStop(1, "#1B212D");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // glow behind title
  const glow = ctx.createRadialGradient(W / 2, 230, 20, W / 2, 230, 420);
  glow.addColorStop(0, style.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // outer border
  ctx.strokeStyle = style.color;
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  // checkered strip top
  const squares = 40;
  const size = (W - 112) / squares;
  for (let i = 0; i < squares; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#e7ecf3" : "#0B0E14";
    ctx.fillRect(56 + i * size, 56, size, 14);
    ctx.fillStyle = i % 2 === 0 ? "#0B0E14" : "#e7ecf3";
    ctx.fillRect(56 + i * size, H - 70, size, 14);
  }

  ctx.textAlign = "center";

  // eyebrow
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "600 22px Inter, sans-serif";
  ctx.fillText("BROWSERSTACK SMASHKART TOURNAMENT", W / 2, 150);

  // place label
  ctx.fillStyle = style.color;
  ctx.font = "700 90px Rajdhani, sans-serif";
  ctx.fillText(style.label, W / 2, 250);

  // "certificate of achievement"
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "500 24px Inter, sans-serif";
  ctx.fillText("Certificate of Achievement", W / 2, 300);

  // name
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 64px Rajdhani, sans-serif";
  ctx.fillText(name || "Racer", W / 2, 420);

  // underline
  ctx.strokeStyle = style.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 220, 445);
  ctx.lineTo(W / 2 + 220, 445);
  ctx.stroke();

  // description
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "400 22px Inter, sans-serif";
  const modeLabel = mode === "team" ? "Team Mode" : "Solo Mode";
  ctx.fillText(`${modeLabel} · SmashKart Circuit`, W / 2, 500);

  if (typeof prizeAmount === "number") {
    ctx.fillStyle = style.color;
    ctx.font = "700 40px Rajdhani, sans-serif";
    ctx.fillText(`₹${prizeAmount.toLocaleString("en-IN")} Prize Share`, W / 2, 560);
  }

  if (note) {
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "italic 18px Inter, sans-serif";
    ctx.fillText(note, W / 2, 595);
  }

  // date
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "400 18px Inter, sans-serif";
  ctx.fillText(new Date().toLocaleDateString("en-IN", { dateStyle: "long" }), W / 2, 700);

  return canvas;
}

export function downloadCanvas(canvas, filename) {
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
