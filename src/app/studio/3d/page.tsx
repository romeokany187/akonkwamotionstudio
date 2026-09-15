"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import StudioLayoutHeader from "@/components/StudioLayoutHeader";
import StudioLeftSidebar from "@/components/StudioLeftSidebar";
import CreativeFxPanel from "@/components/CreativeFxPanel";

const compositeLayers = [
  { id: "3d_cube", name: "3D Hologram Cube", type: "3D", src: "/assets/gen/vrheadset.png" },
  { id: "product_drone", name: "Drone 3D Model", type: "Product", src: "/assets/gen/drone.png" },
  { id: "custom_img", name: "Photo Importée", type: "Image", src: "/assets/gen/car.png" },
];

export default function Studio3DPage() {
  const [layers, setLayers] = useState(compositeLayers);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  // 3D & Composite Controls
  const [rotX, setRotX] = useState(25);
  const [rotY, setRotY] = useState(45);
  const [rotZ, setRotZ] = useState(0);
  const [depthZ, setDepthZ] = useState(150);

  // Text & Emoji Layer addition
  const [overlayText, setOverlayText] = useState("3D COMPOSITE");
  const [overlayEmoji, setOverlayEmoji] = useState("✨");

  // VFX After Effects
  const [enableParticles, setEnableParticles] = useState(true);
  const [enableLightSweep, setEnableLightSweep] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeEffects, setActiveEffects] = useState(["hologram", "bokeh"]);
  const [effectIntensity, setEffectIntensity] = useState(55);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preloadedImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const toggleEffect = (id: string) => setActiveEffects((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = layers[selectedLayerIndex]?.src || layers[0].src;
    img.onload = () => {
      preloadedImgRef.current = img;
    };
  }, [layers, selectedLayerIndex]);

  // Canvas 60fps 3D Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = isPlaying ? (time - startTime) / 1000 : 0;
      const cycle = (elapsed % 6) / 6;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background Grid
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      if (activeEffects.includes("hologram")) {
        ctx.fillStyle = `rgba(34, 211, 238, ${effectIntensity / 650})`;
        for (let y = (elapsed * 80) % 8; y < height; y += 8) ctx.fillRect(0, y, width, 2);
      }
      if (activeEffects.includes("glitch") && Math.random() > 0.86) {
        ctx.fillStyle = `rgba(244, 63, 94, ${effectIntensity / 300})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, width * 0.3, 4 + Math.random() * 15);
      }
      if (activeEffects.includes("lensflare")) {
        const flareX = ((elapsed * 120) % (width + 240)) - 120;
        const flare = ctx.createRadialGradient(flareX, height / 2, 0, flareX, height / 2, 120);
        flare.addColorStop(0, `rgba(255,255,255,${effectIntensity / 180})`);
        flare.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = flare;
        ctx.globalCompositeOperation = "screen";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      }

      // Draw 3D Transformed Layer
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const dynamicRotY = (rotY + elapsed * 20) * (Math.PI / 180);
      const dynamicRotX = rotX * (Math.PI / 180);

      // Simulate Pseudo 3D Matrix Perspective Scale
      const scaleX = Math.cos(dynamicRotY);
      const scaleY = Math.cos(dynamicRotX);

      ctx.scale(scaleX * 1.1, scaleY * 1.1);

      const img = preloadedImgRef.current;
      if (img && img.complete) {
        ctx.drawImage(img, -200, -150, 400, 300);
      }
      ctx.restore();

      // 3D Particles
      if (enableParticles) {
        ctx.save();
        ctx.fillStyle = "rgba(99, 102, 241, 0.7)";
        for (let i = 0; i < 40; i++) {
          const px = (Math.sin(i * 45 + elapsed) * 0.4 + 0.5) * width;
          const py = ((i * 20 + elapsed * 30) % height);
          ctx.beginPath();
          ctx.arc(px, py, (i % 4) + 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Overlay Composite Text & Emoji
      ctx.save();
      ctx.font = "900 28px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillText(`${overlayEmoji} ${overlayText}`, 50, 80);
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [rotX, rotY, layers, selectedLayerIndex, overlayText, overlayEmoji, enableParticles, isPlaying, activeEffects, effectIntensity]);

  const handleUploadCustomMedia = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newLayer = { id: `custom_${Date.now()}`, name: file.name, type: "Upload", src: url };
    setLayers([newLayer, ...layers]);
    setSelectedLayerIndex(0);
  };

  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setProgress(0);

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
        a.download = "composite_3d_render.webm";
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 5000);
    } catch {
      setIsExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
        <StudioLayoutHeader activeSource="3d" />

        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          {/* Left Sidebar Fixed Position */}
          <StudioLeftSidebar activeSource="3d" />

          {/* Center Main Stage (Fixed Viewport) */}
          <section className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/60 p-4 md:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-indigo-300">3D Composite Studio</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Texte + Image + Vidéo + Forme + Emoji</h2>
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="rounded-full bg-indigo-500 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg hover:bg-indigo-400"
              >
                {isExporting ? "Rendu..." : "Télécharger Rendu (.webm)"}
              </button>
            </div>

            {/* Canvas Viewport */}
            <div className="relative flex-1 my-3 flex items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#020617] p-2 shadow-2xl">
              <canvas ref={canvasRef} width={800} height={480} className="h-full w-full object-contain rounded-[20px]" />
            </div>
          </section>

          {/* Right Scrollable Inspector Panel */}
          <aside className="h-[calc(100vh-7rem)] overflow-y-auto rounded-[26px] border border-white/10 bg-slate-950/70 p-4 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Réglages 3D & Composite</p>

            {/* Media & Layer Source Selection */}
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300">Media 3D & Calque Active</p>
              <label className="block text-center cursor-pointer rounded-xl border border-dashed border-indigo-400/50 bg-indigo-500/10 p-2.5 text-xs text-indigo-200 hover:bg-indigo-500/20">
                + Importer Image / Vidéo / Forme
                <input type="file" className="hidden" onChange={handleUploadCustomMedia} />
              </label>

              <div className="space-y-1.5">
                {layers.map((layer, idx) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setSelectedLayerIndex(idx)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex justify-between ${
                      selectedLayerIndex === idx ? "bg-indigo-500/20 border border-indigo-400 text-white" : "bg-slate-900/60 text-slate-400"
                    }`}
                  >
                    <span>{layer.name}</span>
                    <span className="text-[10px] text-indigo-300 uppercase">{layer.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text & Emoji Overlay Input */}
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300">Ajouter du Texte & Emoji</p>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none"
                placeholder="Texte 3D Overlay"
              />
              <div className="flex gap-2">
                {["✨", "🚀", "🔥", "💎", "⚡"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setOverlayEmoji(emoji)}
                    className="flex-1 rounded-xl bg-slate-900 py-1.5 text-center text-sm border border-white/10 hover:border-white/30"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Transform Angles */}
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300">Rotation & Perspective 3D</p>
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Axe Rotation X</span>
                  <span>{rotX}°</span>
                </div>
                <input type="range" min={-90} max={90} value={rotX} onChange={(e) => setRotX(Number(e.target.value))} className="w-full accent-indigo-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Axe Rotation Y</span>
                  <span>{rotY}°</span>
                </div>
                <input type="range" min={-180} max={180} value={rotY} onChange={(e) => setRotY(Number(e.target.value))} className="w-full accent-indigo-400" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Profondeur Z</span>
                  <span>{depthZ}px</span>
                </div>
                <input type="range" min={50} max={400} value={depthZ} onChange={(e) => setDepthZ(Number(e.target.value))} className="w-full accent-indigo-400" />
              </div>
            </div>
            <CreativeFxPanel activeEffects={activeEffects} intensity={effectIntensity} onToggle={toggleEffect} onIntensityChange={setEffectIntensity} accentClass="accent-indigo-400" />
          </aside>
        </div>
      </div>
    </main>
  );
}

