"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StudioLayoutHeader from "@/components/StudioLayoutHeader";
import StudioLeftSidebar from "@/components/StudioLeftSidebar";

const emojis = ["✨", "🔥", "🚀", "💡", "🎯", "🌙", "⚡", "🎨"];

export default function StudioEmojiPage() {
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(18);

  // After Effects Emoji VFX
  const [enableGlow, setEnableGlow] = useState(true);
  const [enableBounce, setEnableBounce] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Canvas 60fps Emoji Engine
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

      const bounceY = enableBounce ? Math.sin(elapsed * 5) * 18 : 0;
      const pulseScale = scale + Math.cos(elapsed * 3) * 0.05;

      ctx.translate(0, bounceY);
      ctx.scale(pulseScale, pulseScale);
      ctx.rotate((rotation * Math.PI) / 180);

      ctx.font = "120px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (enableGlow) {
        ctx.shadowColor = "rgba(16, 185, 129, 0.8)";
        ctx.shadowBlur = 40;
      }

      ctx.fillText(selectedEmoji, 0, 0);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedEmoji, scale, rotation, enableGlow, enableBounce]);

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
        a.download = "emoji_aftereffects_render.webm";
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
        <StudioLayoutHeader activeSource="emoji" />

        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          <StudioLeftSidebar activeSource="emoji" />

          {/* Fixed Center Stage */}
          <section className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/60 p-4 md:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-200">Emoji FX Studio</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">After Effects Animated Emoji</h2>
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="rounded-full bg-emerald-400 px-5 py-2 text-xs font-bold uppercase text-slate-950 hover:bg-emerald-300"
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
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Réglages Emoji</p>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">Banque Emoji</p>
              <div className="grid grid-cols-4 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`p-2 rounded-xl text-xl border text-center ${
                      selectedEmoji === emoji ? "border-emerald-400 bg-emerald-500/20" : "border-white/10 bg-slate-900/60"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">Transformations</p>
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Scale Échelle</span>
                  <span>{scale.toFixed(2)}x</span>
                </div>
                <input type="range" min={0.6} max={2} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-emerald-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Rotation</span>
                  <span>{rotation}°</span>
                </div>
                <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-emerald-400" />
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">Aura Glow & Rebond</p>
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-200">Glow Aura Lumineuse</label>
                <input type="checkbox" checked={enableGlow} onChange={(e) => setEnableGlow(e.target.checked)} className="accent-emerald-400" />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-200">Rebond Rythmique</label>
                <input type="checkbox" checked={enableBounce} onChange={(e) => setEnableBounce(e.target.checked)} className="accent-emerald-400" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

