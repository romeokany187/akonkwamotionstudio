"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StudioLayoutHeader from "@/components/StudioLayoutHeader";
import StudioLeftSidebar from "@/components/StudioLeftSidebar";
import CreativeFxPanel from "@/components/CreativeFxPanel";

export default function StudioTextPage() {
  const [text, setText] = useState("MOTION DESIGN");
  const [size, setSize] = useState(48);
  const [letterSpace, setLetterSpace] = useState(4);

  // After Effects Typography VFX
  const [enableGlow, setEnableGlow] = useState(true);
  const [glowColor, setGlowColor] = useState("#ec4899");
  const [enableWhipPan, setEnableWhipPan] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [activeEffects, setActiveEffects] = useState(["hologram", "lensflare"]);
  const [effectIntensity, setEffectIntensity] = useState(55);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const toggleEffect = (id: string) => setActiveEffects((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  // Canvas 60fps Typography Engine
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

      const floatY = enableWhipPan ? Math.sin(elapsed * 3) * 12 : 0;
      ctx.translate(0, floatY);

      ctx.font = `900 ${size}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (enableGlow) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 30;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillText(text.toUpperCase(), 0, 0);

      ctx.restore();

      if (activeEffects.includes("hologram")) {
        ctx.fillStyle = `rgba(34, 211, 238, ${effectIntensity / 650})`;
        for (let y = (elapsed * 80) % 8; y < height; y += 8) ctx.fillRect(0, y, width, 2);
      }
      if (activeEffects.includes("glitch") && Math.random() > 0.86) {
        ctx.fillStyle = `rgba(244, 63, 94, ${effectIntensity / 300})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, width * 0.25, 3 + Math.random() * 12);
      }
      if (activeEffects.includes("lensflare")) {
        const flareX = ((elapsed * 100) % (width + 240)) - 120;
        const flare = ctx.createRadialGradient(flareX, height / 2, 0, flareX, height / 2, 110);
        flare.addColorStop(0, `rgba(255,255,255,${effectIntensity / 180})`);
        flare.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = flare;
        ctx.globalCompositeOperation = "screen";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [text, size, letterSpace, enableGlow, glowColor, enableWhipPan, activeEffects, effectIntensity]);

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
        a.download = "typography_aftereffects_render.webm";
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
        <StudioLayoutHeader activeSource="text" />

        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          <StudioLeftSidebar activeSource="text" />

          {/* Fixed Center Stage */}
          <section className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/60 p-4 md:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-pink-200">Typography Studio</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">After Effects Kinetic Text</h2>
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="rounded-full bg-pink-500 px-5 py-2 text-xs font-bold uppercase text-white hover:bg-pink-400"
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
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Réglages Typographie & Effets</p>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300">Texte Kinetic</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none h-20"
              />
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300">Taille & Espacement</p>
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Taille Police</span>
                  <span>{size}px</span>
                </div>
                <input type="range" min={24} max={110} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-pink-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Letter Spacing</span>
                  <span>{letterSpace}px</span>
                </div>
                <input type="range" min={-4} max={20} value={letterSpace} onChange={(e) => setLetterSpace(Number(e.target.value))} className="w-full accent-pink-400" />
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300">Neon Glow & Flottement</p>
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-200">Glow Neon Lumineux</label>
                <input type="checkbox" checked={enableGlow} onChange={(e) => setEnableGlow(e.target.checked)} className="accent-pink-400" />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-200">Flottement Wave Kinetic</label>
                <input type="checkbox" checked={enableWhipPan} onChange={(e) => setEnableWhipPan(e.target.checked)} className="accent-pink-400" />
              </div>
            </div>
            <CreativeFxPanel activeEffects={activeEffects} intensity={effectIntensity} onToggle={toggleEffect} onIntensityChange={setEffectIntensity} accentClass="accent-pink-400" />
          </aside>
        </div>
      </div>
    </main>
  );
}

