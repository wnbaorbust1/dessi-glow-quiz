"use client";

import { useState, useEffect, useRef } from "react";
import { Download, RefreshCw } from "lucide-react";

interface Props {
  baseUrl: string;
}

const PRESETS = [
  { label: "In-Clinic Display",   utm: "utm_source=qr&utm_medium=offline&utm_campaign=clinic" },
  { label: "Instagram Bio",       utm: "utm_source=instagram&utm_medium=bio_link&utm_campaign=glowquiz" },
  { label: "Business Card",       utm: "utm_source=qr&utm_medium=print&utm_campaign=business_card" },
  { label: "Flyer / Brochure",    utm: "utm_source=qr&utm_medium=print&utm_campaign=flyer" },
  { label: "Email Signature",     utm: "utm_source=email&utm_medium=signature&utm_campaign=glowquiz" },
  { label: "Custom",              utm: "" },
];

export default function QRGenerator({ baseUrl }: Props) {
  const [preset, setPreset]       = useState(0);
  const [customUtm, setCustomUtm] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError]         = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const utmString = preset === PRESETS.length - 1 ? customUtm : PRESETS[preset].utm;
  const quizUrl   = `${baseUrl.replace(/\/$/, "")}/glow-quiz${utmString ? `?${utmString}` : ""}`;

  async function runQR(url: string) {
    try {
      const QRCode = (await import("qrcode")).default;
      const canvas = canvasRef.current;
      if (!canvas) return;
      await QRCode.toCanvas(canvas, url, {
        width: 280,
        margin: 2,
        color: { dark: "#2a1a16", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setError("");
    } catch (e) {
      console.error("QR generation failed:", e);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // Generate on mount. All setState calls inside runQR are async (after awaits) — safe.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runQR(quizUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `desi-dollhouse-glow-quiz-qr-${PRESETS[preset]?.label.toLowerCase().replace(/\s+/g, "-") ?? "custom"}.png`;
    a.click();
  }

  const hasQR = !generating && !error;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ── Config ──────────────────────────────────────────── */}
      <div
        className="space-y-5 rounded-md p-6"
        style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.2)" }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#c6a06b" }}>
          Configuration
        </h2>

        <div>
          <label className="mb-2 block text-xs font-semibold" style={{ color: "#8a7a6e" }}>
            Placement Preset
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPreset(i)}
                className="rounded-sm px-3 py-2 text-left text-xs transition-all"
                style={{
                  background: preset === i ? "rgba(193,126,108,0.15)" : "rgba(198,160,107,0.04)",
                  border: `1px solid ${preset === i ? "rgba(193,126,108,0.5)" : "rgba(198,160,107,0.15)"}`,
                  color: preset === i ? "#c17e6c" : "#8a7a6e",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {preset === PRESETS.length - 1 && (
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: "#8a7a6e" }}>
              Custom UTM Parameters
            </label>
            <input
              type="text"
              value={customUtm}
              onChange={(e) => setCustomUtm(e.target.value)}
              placeholder="utm_source=instagram&utm_medium=stories"
              className="w-full rounded-sm px-3 py-2 font-mono text-xs"
              style={{ background: "#0a0a0a", border: "1px solid rgba(198,160,107,0.25)", color: "#f3e3d5" }}
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold" style={{ color: "#8a7a6e" }}>
            Quiz URL
          </label>
          <p
            className="break-all rounded-sm px-3 py-2 font-mono text-xs"
            style={{ background: "#0a0a0a", border: "1px solid rgba(198,160,107,0.15)", color: "#c6a06b" }}
          >
            {quizUrl}
          </p>
        </div>

        <button
          onClick={() => { setGenerating(true); setError(""); runQR(quizUrl); }}
          disabled={generating}
          className="flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "rgba(193,126,108,0.2)", border: "1px solid rgba(193,126,108,0.4)", color: "#c17e6c" }}
        >
          <RefreshCw size={14} className={generating ? "animate-spin" : ""} aria-hidden="true" />
          {generating ? "Generating…" : "Generate QR Code"}
        </button>
      </div>

      {/* ── Preview ─────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-md p-8"
        style={{ background: "#141414", border: "1px solid rgba(198,160,107,0.2)" }}
      >
        {/* Canvas is always in the DOM — shown when QR is ready */}
        <div
          className="rounded-md p-3"
          style={{
            background: "#fff",
            display: generating || error ? "none" : "block",
          }}
        >
          <canvas ref={canvasRef} aria-label="QR Code for Desi Dollhouse Glow Quiz" />
        </div>

        {generating && (
          <div className="text-center">
            <div
              className="mx-auto mb-4 h-[200px] w-[200px] animate-pulse rounded-md"
              style={{ background: "rgba(198,160,107,0.1)" }}
            />
            <p className="text-xs" style={{ color: "#8a7a6e" }}>Generating…</p>
          </div>
        )}

        {error && !generating && (
          <p className="text-center text-xs" style={{ color: "#b3453d" }}>{error}</p>
        )}

        {hasQR && (
          <>
            <p className="text-center text-xs" style={{ color: "#8a7a6e" }}>
              {PRESETS[preset]?.label ?? "Custom"} · Desi Dollhouse Glow Quiz
            </p>
            <button
              onClick={downloadPNG}
              className="flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "linear-gradient(135deg, #c17e6c, #a8604e)", color: "#f3e3d5" }}
            >
              <Download size={14} aria-hidden="true" />
              Download PNG
            </button>
          </>
        )}
      </div>
    </div>
  );
}
