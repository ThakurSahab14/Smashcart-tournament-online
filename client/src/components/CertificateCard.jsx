import React, { useEffect, useRef } from "react";
import { drawCertificate, downloadCanvas } from "../lib/certificate.js";

export default function CertificateCard({ place, name, prizeAmount, mode, note }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCertificate(canvasRef.current, { place, name, prizeAmount, mode, note });
    }
  }, [place, name, prizeAmount, mode, note]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        className="w-full max-w-sm rounded-lg border border-white/10 shadow-lg"
      />
      <button
        onClick={() =>
          downloadCanvas(
            canvasRef.current,
            `${(name || "racer").replace(/\s+/g, "_")}_place${place}_certificate.png`
          )
        }
        className="rounded-full bg-volt px-5 py-2 font-display text-sm font-bold uppercase tracking-wide text-asphalt hover:brightness-110"
      >
        Download certificate
      </button>
    </div>
  );
}
