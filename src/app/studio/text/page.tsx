"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StudioLayoutHeader from "@/components/StudioLayoutHeader";
import StudioLeftSidebar from "@/components/StudioLeftSidebar";
import CreativeFxPanel from "@/components/CreativeFxPanel";
import StudioTimeline from "@/components/StudioTimeline";

const animationCategories = ["Animations", "Effets", "Mouvements", "In & Out", "Distorsion", "3D & Caméra"] as const;
type AnimationCategory = (typeof animationCategories)[number];

const textPresets: Record<AnimationCategory, { id: string; name: string; detail: string }[]> = {
  Animations: [
    { id: "fade", name: "Fondu", detail: "Apparition douce" },
    { id: "slide-up", name: "Glissement haut", detail: "Entrée verticale" },
    { id: "slide-left", name: "Glissement gauche", detail: "Entrée latérale" },
    { id: "zoom", name: "Zoom avant", detail: "Impact progressif" },
    { id: "pop", name: "Apparition", detail: "Rebond rapide" },
    { id: "type", name: "Machine à écrire", detail: "Lettre par lettre" },
  ],
  Effets: [
    { id: "neon", name: "Néon", detail: "Lueur colorée" },
    { id: "glow", name: "Lueur", detail: "Halo lumineux" },
    { id: "outline", name: "Contour", detail: "Bordure nette" },
    { id: "hologram", name: "Hologramme", detail: "Scanlines cyan" },
  ],
  Mouvements: [
    { id: "float", name: "Flottement", detail: "Mouvement organique" },
    { id: "pulse", name: "Pulsation", detail: "Rythme respiré" },
    { id: "wave", name: "Vague", detail: "Déformation douce" },
    { id: "swing", name: "Oscillation", detail: "Rotation légère" },
  ],
  "In & Out": [
    { id: "in-fade", name: "Fondu entrée", detail: "Entrée progressive" },
    { id: "out-fade", name: "Fondu sortie", detail: "Sortie progressive" },
    { id: "in-slide", name: "Entrée latérale", detail: "Arrivée hors champ" },
    { id: "blur-in", name: "Flou d'entrée", detail: "Netteté progressive" },
  ],
  Distorsion: [
    { id: "glitch", name: "Glitch", detail: "Décalage numérique" },
    { id: "stretch", name: "Étirement", detail: "Impact élastique" },
    { id: "wobble", name: "Onde", detail: "Tremblement fluide" },
    { id: "jump", name: "Saut", detail: "Impulsion verticale" },
  ],
  "3D & Caméra": [
    { id: "depth", name: "Profondeur", detail: "Perspective simulée" },
    { id: "rotate-3d", name: "Rotation 3D", detail: "Tour sur l'axe Y" },
    { id: "flip", name: "Retournement", detail: "Rotation frontale" },
    { id: "drift-3d", name: "Caméra orbitale", detail: "Mouvement de caméra" },
  ],
};

export default function StudioTextPage() {
  const [text, setText] = useState("MOTION DESIGN");
  const [size, setSize] = useState(48);
  const [letterSpace, setLetterSpace] = useState(4);
  const [activeCategory, setActiveCategory] = useState<AnimationCategory>("Animations");
  const [selectedPreset, setSelectedPreset] = useState("fade");

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

      const preset = Object.values(textPresets).flat().find((item) => item.id === selectedPreset);
      const cycle = (elapsed % 3) / 3;
      const pulse = Math.sin(elapsed * Math.PI * 2);
      let offsetX = 0;
      let offsetY = enableWhipPan ? pulse * 12 : 0;
      let scale = 1;
      let rotation = 0;
      let opacity = 1;
      let blur = 0;

      if (preset) {
        if (["fade", "in-fade", "blur-in"].includes(preset.id)) opacity = Math.min(1, cycle * 1.8);
        if (["in-slide", "slide-left"].includes(preset.id)) offsetX = (1 - Math.min(1, cycle * 1.5)) * 180;
        if (preset.id === "slide-up") offsetY += (1 - Math.min(1, cycle * 1.5)) * 100;
        if (preset.id === "zoom") scale = 0.55 + Math.min(1, cycle * 1.5) * 0.45;
        if (preset.id === "pop") scale = cycle < 0.5 ? 0.7 + cycle * 1.0 : 1.2 - (cycle - 0.5) * 0.4;
        if (["float", "wave", "drift-3d"].includes(preset.id)) offsetY += pulse * 18;
        if (preset.id === "wave") rotation = pulse * 0.05;
        if (preset.id === "swing") rotation = Math.sin(elapsed * 2.2) * 0.12;
        if (preset.id === "pulse") scale = 1 + pulse * 0.08;
        if (preset.id === "jump") offsetY += Math.max(0, pulse) * -55;
        if (["rotate-3d", "flip"].includes(preset.id)) scale = Math.max(0.08, Math.abs(Math.cos(elapsed * 1.4)));
        if (preset.id === "depth") {
          scale = 0.9 + Math.sin(elapsed * 1.3) * 0.16;
          offsetX = Math.sin(elapsed * 1.3) * 24;
        }
        if (preset.id === "stretch") scale = 1 + Math.max(0, pulse) * 0.2;
        if (preset.id === "wobble") rotation = pulse * 0.08;
        if (preset.id === "out-fade") opacity = 1 - Math.max(0, cycle - 0.55) * 2.2;
        if (preset.id === "blur-in") blur = (1 - opacity) * 12;
      }

      ctx.translate(offsetX, offsetY);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      ctx.font = `900 ${size}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (enableGlow) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 30;
      }

      ctx.globalAlpha = Math.max(0, opacity);
      ctx.filter = blur ? `blur(${blur}px)` : "none";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text.toUpperCase(), 0, 0);
      ctx.filter = "none";
      ctx.globalAlpha = 1;

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
  }, [text, size, letterSpace, enableGlow, glowColor, enableWhipPan, activeEffects, effectIntensity, selectedPreset]);

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

            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300">Bibliothèque d&apos;animations</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {animationCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] ${activeCategory === category ? "bg-pink-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {textPresets[activeCategory].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`rounded-xl border p-2 text-left transition ${selectedPreset === preset.id ? "border-pink-400 bg-pink-500/15" : "border-white/10 bg-slate-900/60 hover:border-white/30"}`}
                  >
                    <span className="block text-xs font-semibold text-white">{preset.name}</span>
                    <span className="mt-1 block text-[10px] text-slate-400">{preset.detail}</span>
                  </button>
                ))}
              </div>
            </div>

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
            <StudioTimeline accent="#ec4899" tracks={[{ name: "Texte principal", color: "#ec4899", start: 8, width: 55 }, { name: "Effets", color: "#22d3ee", start: 18, width: 38 }]} />
          </aside>
        </div>
      </div>
    </main>
  );
}

