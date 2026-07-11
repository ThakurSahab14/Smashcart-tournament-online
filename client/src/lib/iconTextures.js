import * as THREE from "three";

function makeCanvas(draw, bg = "#12161F") {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const ICONS = {
  flag: (ctx, s) => {
    const cols = 8;
    const cell = s / cols;
    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < cols; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#e7ecf3" : "#0B0E14";
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  },
  trophy: (ctx, s) => {
    ctx.fillStyle = "#FFC93C";
    ctx.beginPath();
    ctx.arc(s / 2, s * 0.4, s * 0.22, Math.PI * 0.15, Math.PI * 0.85, true);
    ctx.fill();
    ctx.fillRect(s * 0.4, s * 0.38, s * 0.2, s * 0.28);
    ctx.beginPath();
    ctx.moveTo(s * 0.32, s * 0.66);
    ctx.lineTo(s * 0.68, s * 0.66);
    ctx.lineTo(s * 0.6, s * 0.8);
    ctx.lineTo(s * 0.4, s * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(s * 0.35, s * 0.8, s * 0.3, s * 0.06);
  },
  kart: (ctx, s) => {
    ctx.fillStyle = "#00E5FF";
    ctx.fillRect(s * 0.2, s * 0.45, s * 0.6, s * 0.2);
    ctx.fillStyle = "#FF2E92";
    ctx.beginPath();
    ctx.moveTo(s * 0.35, s * 0.45);
    ctx.lineTo(s * 0.65, s * 0.45);
    ctx.lineTo(s * 0.58, s * 0.28);
    ctx.lineTo(s * 0.42, s * 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0B0E14";
    [0.28, 0.72].forEach((cx) => {
      ctx.beginPath();
      ctx.arc(s * cx, s * 0.68, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  confetti: (ctx, s) => {
    const colors = ["#00E5FF", "#FF2E92", "#FFC93C", "#7ED957"];
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = colors[i % colors.length];
      const x = Math.random() * s;
      const y = Math.random() * s;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      ctx.fillRect(-6, -3, 12, 6);
      ctx.restore();
    }
  },
  stopwatch: (ctx, s) => {
    ctx.strokeStyle = "#C9D6DF";
    ctx.lineWidth = s * 0.045;
    ctx.beginPath();
    ctx.arc(s / 2, s * 0.55, s * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s / 2, s * 0.55);
    ctx.lineTo(s / 2, s * 0.35);
    ctx.moveTo(s / 2, s * 0.55);
    ctx.lineTo(s * 0.65, s * 0.55);
    ctx.stroke();
    ctx.fillStyle = "#C9D6DF";
    ctx.fillRect(s * 0.42, s * 0.16, s * 0.16, s * 0.07);
  },
  star: (ctx, s) => {
    ctx.fillStyle = "#FFC93C";
    const cx = s / 2;
    const cy = s / 2;
    const spikes = 5;
    const outer = s * 0.32;
    const inner = s * 0.14;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / spikes) * i - Math.PI / 2;
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  },
};

export function makeIconTexture(name) {
  return makeCanvas(ICONS[name] || ICONS.star);
}

export const ICON_NAMES = Object.keys(ICONS);
