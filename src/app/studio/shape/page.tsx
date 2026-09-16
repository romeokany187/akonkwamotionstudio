"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StudioLayoutHeader from "@/components/StudioLayoutHeader";
import StudioLeftSidebar from "@/components/StudioLeftSidebar";
import CreativeFxPanel from "@/components/CreativeFxPanel";
import StudioTimeline from "@/components/StudioTimeline";

const shapes = [
  { name: "Cercle", kind: "circle", gradient: ["#fb923c", "#f97316", "#ec4899"] },
  { name: "Carré", kind: "square", gradient: ["#93c5fd", "#3b82f6", "#8b5cf6"] },
  { name: "Triangle", kind: "triangle", gradient: ["#a7f3d0", "#22c55e", "#14b8a6"] },
  { name: "Étoile", kind: "star", gradient: ["#f9a8d4", "#ec4899", "#8b5cf6"] },
  { name: "Losange", kind: "diamond", gradient: ["#fcd34d", "#f97316", "#ef4444"] },
  { name: "Cœur", kind: "heart", gradient: ["#fda4af", "#e11d48", "#9f1239"] },
  { name: "Anneau", kind: "ring", gradient: ["#67e8f9", "#06b6d4", "#2563eb"] },
  { name: "Hexagone", kind: "hexagon", gradient: ["#c4b5fd", "#7c3aed", "#4338ca"] },
];

export default function StudioShapePage() {
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [scale, setScale] = useState(1.1);
  const [rotationSpeed, setRotationSpeed] = useState(25);

  // After Effects VFX
  const [enableGlow, setEnableGlow] = useState(true);
  const [glowPower, setGlowPower] = useState(50);
  const [enablePulse, setEnablePulse] = useState(true);
  const [activeEffects, setActiveEffects] = useState(["hologram", "bokeh"]);
  const [effectIntensity, setEffectIntensity] = useState(55);
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const toggleEffect = (id: string) => setActiveEffects((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  // Canvas 60fps Shape Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      const rotAngle = (elapsed * rotationSpeed) * (Math.PI / 180);
      const pulseScale = enablePulse ? scale + Math.sin(elapsed * 4) * 0.08 : scale;

      ctx.rotate(rotAngle);
      ctx.scale(pulseScale, pulseScale);

      // Shape Gradient Fill
      const grad = ctx.createLinearGradient(-120, -120, 120, 120);
      grad.addColorStop(0, selectedShape.gradient[0]);
      grad.addColorStop(0.5, selectedShape.gradient[1]);
      grad.addColorStop(1, selectedShape.gradient[2]);

      ctx.fillStyle = grad;
      if (enableGlow) {
        ctx.shadowColor = selectedShape.gradient[1];
        ctx.shadowBlur = glowPower;
      }

      // Draw the selected vector geometry.
      ctx.beginPath();
      if (selectedShape.kind === "circle") {
        ctx.arc(0, 0, 105, 0, Math.PI * 2);
      } else if (selectedShape.kind === "square") {
        ctx.roundRect(-100, -100, 200, 200, 18);
      } else if (selectedShape.kind === "triangle") {
        ctx.moveTo(0, -115);
        ctx.lineTo(112, 85);
        ctx.lineTo(-112, 85);
        ctx.closePath();
      } else if (selectedShape.kind === "diamond") {
        ctx.moveTo(0, -120);
        ctx.lineTo(120, 0);
        ctx.lineTo(0, 120);
        ctx.lineTo(-120, 0);
        ctx.closePath();
      } else if (selectedShape.kind === "heart") {
        ctx.moveTo(0, 105);
        ctx.bezierCurveTo(-145, 15, -105, -105, 0, -35);
        ctx.bezierCurveTo(105, -105, 145, 15, 0, 105);
        ctx.closePath();
      } else if (selectedShape.kind === "ring") {
        ctx.arc(0, 0, 110, 0, Math.PI * 2);
        ctx.arc(0, 0, 62, 0, Math.PI * 2, true);
      } else {
        const sides = selectedShape.kind === "star" ? 10 : 6;
        for (let point = 0; point < sides; point += 1) {
          const radius = selectedShape.kind === "star" && point % 2 === 0 ? 115 : 52;
          const angle = point * (Math.PI * 2 / sides) - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (point === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
      ctx.fill();
      if (selectedShape.kind === "ring") {
        ctx.fill("evenodd");
      }

      ctx.restore();

      if (activeEffects.includes("hologram")) {
        ctx.fillStyle = `rgba(34, 211, 238, ${effectIntensity / 650})`;
        for (let y = (elapsed * 80) % 8; y < height; y += 8) ctx.fillRect(0, y, width, 2);
      }
      if (activeEffects.includes("bokeh")) {
        ctx.fillStyle = `rgba(186, 230, 253, ${effectIntensity / 220})`;
        for (let particle = 0; particle < 18; particle += 1) {
          ctx.beginPath();
          ctx.arc((Math.sin(particle * 17 + elapsed) * 0.5 + 0.5) * width, ((particle * 43 - elapsed * 30) % height + height) % height, 2 + (particle % 3), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedShape, scale, rotationSpeed, enableGlow, glowPower, enablePulse, activeEffects, effectIntensity]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    try {
      const stream = canvas.captureStream(60);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "shape_aftereffects_render.webm";
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 4000);
    } catch {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
        <StudioLayoutHeader activeSource="shape" />

        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          <StudioLeftSidebar activeSource="shape" />

          {/* Fixed Center Stage */}
          <section className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/60 p-4 md:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200">Shape FX Studio</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">After Effects Shape Vector</h2>
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="rounded-full bg-amber-400 px-5 py-2 text-xs font-bold uppercase text-slate-950 hover:bg-amber-300"
              >
                {isExporting ? "Rendu..." : "Télécharger (.webm)"}
              </button>
            </div>

            <div className="relative flex-1 my-3 flex items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#020617] p-2 shadow-2xl">
              <canvas ref={canvasRef} width={800} height={480} className="h-full w-full object-contain rounded-[20px]" />
            </div>
          </section>

          {/* Scrollable Right Inspector Panel */}
          <aside className="h-[calc(100vh-7rem)] overflow-y-auto rounded-[26px] border border-white/10 bg-slate-950/70 p-4 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Réglages Formes & Vector</p>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300">Bibliothèque de formes</p>
              <div className="grid grid-cols-2 gap-2">
                {shapes.map((shape) => (
                  <button
                    key={shape.name}
                    type="button"
                    onClick={() => setSelectedShape(shape)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center ${
                      selectedShape.name === shape.name ? "border-amber-400 bg-amber-500/20 text-white" : "border-white/10 bg-slate-900/60 text-slate-400"
                    }`}
                  >
                    {shape.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300">Mouvement & Rotation</p>
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Scale Échelle</span>
                  <span>{scale.toFixed(2)}x</span>
                </div>
                <input type="range" min={0.6} max={1.6} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-amber-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Vitesse de Rotation</span>
                  <span>{rotationSpeed}°/s</span>
                </div>
                <input type="range" min={0} max={120} value={rotationSpeed} onChange={(e) => setRotationSpeed(Number(e.target.value))} className="w-full accent-amber-400" />
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300">Aura Glow & Pulsation</p>
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-200">Glow Aura Lumineuse</label>
                <input type="checkbox" checked={enableGlow} onChange={(e) => setEnableGlow(e.target.checked)} className="accent-amber-400" />
              </div>

              {enableGlow && (
                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Intensité Glow</span>
                    <span>{glowPower}px</span>
                  </div>
                  <input type="range" min={10} max={100} value={glowPower} onChange={(e) => setGlowPower(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-200">Pulsation Rhythmique</label>
                <input type="checkbox" checked={enablePulse} onChange={(e) => setEnablePulse(e.target.checked)} className="accent-amber-400" />
              </div>
            </div>
            <CreativeFxPanel activeEffects={activeEffects} intensity={effectIntensity} onToggle={toggleEffect} onIntensityChange={setEffectIntensity} accentClass="accent-amber-400" />
            <StudioTimeline accent="#fbbf24" tracks={[{ name: "Forme", color: "#fbbf24", start: 12, width: 58 }, { name: "Aura", color: "#fb7185", start: 20, width: 42 }]} />
          </aside>
        </div>
      </div>
    </main>
  );
}

