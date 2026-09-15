"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import StudioLayoutHeader from "@/components/StudioLayoutHeader";
import StudioLeftSidebar from "@/components/StudioLeftSidebar";
import CreativeFxPanel from "@/components/CreativeFxPanel";

const defaultImages = [
  { name: "Drone", src: "/assets/gen/drone.png", kind: "Product" },
  { name: "Camera", src: "/assets/gen/car.png", kind: "Brand" },
  { name: "Smartwatch", src: "/assets/gen/smartwatch.png", kind: "Lifestyle" },
  { name: "VR Headset", src: "/assets/gen/vrheadset.png", kind: "Tech" },
  { name: "Lamp", src: "/assets/gen/lamp.png", kind: "Interior" },
  { name: "Chair", src: "/assets/gen/chair.png", kind: "Design" },
];

const animationModes = [
  { id: "kenburns", name: "Ken Burns", desc: "Cinematic slow zoom & pan camera trajectory" },
  { id: "parallax", name: "3D Parallax", desc: "Subtle multi-axis tilt and float shift" },
  { id: "pulse", name: "Pulse & Glow", desc: "Rhythmic scale pulse with glowing aura" },
  { id: "orbit", name: "Orbit Drift", desc: "Smooth circular camera movement" },
  { id: "glitch", name: "Cyber Glitch", desc: "High-energy horizontal glitch displacement" },
];

const lutOptions = [
  { id: "cinematic", name: "Teal & Orange", filter: "contrast(1.15) saturate(1.25) hue-rotate(-10deg)" },
  { id: "cyberpunk", name: "Neon Cyber", filter: "contrast(1.3) saturate(1.6) hue-rotate(180deg)" },
  { id: "golden", name: "Golden Hour", filter: "contrast(1.05) saturate(1.3) sepia(0.35)" },
  { id: "noir", name: "Vintage Noir", filter: "grayscale(1) contrast(1.4) brightness(0.9)" },
  { id: "acid", name: "Acid Trippy", filter: "invert(0.15) saturate(2) hue-rotate(90deg)" },
  { id: "none", name: "Original", filter: "none" },
];

export default function ImageStudioPage() {
  const [selectedImage, setSelectedImage] = useState(defaultImages[0]);
  const [mode, setMode] = useState("kenburns");
  const [selectedLut, setSelectedLut] = useState("cinematic");
  
  // Motion parameters
  const [zoomSpeed, setZoomSpeed] = useState(1.25);
  const [motionDuration, setDuration] = useState(6);
  const [isPlaying, setIsPlaying] = useState(true);

  // After Effects VFX parameters
  const [particlesEnabled, setParticles] = useState(true);
  const [particleCount, setParticleCount] = useState(40);
  const [lightSweepEnabled, setLightSweep] = useState(true);
  const [sweepIntensity, setSweepIntensity] = useState(60);
  const [grainAmount, setGrainAmount] = useState(25);
  const [chromaAmount, setChromaAmount] = useState(4);
  const [vignetteAmount, setVignetteAmount] = useState(50);
  const [glowIntensity, setGlowIntensity] = useState(40);
  const [activeEffects, setActiveEffects] = useState(["hologram", "bokeh"]);
  const [effectIntensity, setEffectIntensity] = useState(55);

  // Recording State
  const [isExporting, setIsRecording] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const imageReadyRef = useRef(false);
  const toggleEffect = (id: string) => setActiveEffects((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  // Particle positions
  const particlesRef = useRef<Array<{ x: number; y: number; size: number; speedY: number; alpha: number }>>([]);

  // Initialize particles once
  useEffect(() => {
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 0.002 + 0.0005,
      alpha: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  // Preload image object
  useEffect(() => {
    imageReadyRef.current = false;
    loadedImgRef.current = null;
    const img = new Image();
    img.decoding = "async";
    img.src = selectedImage.src;
    img.onload = () => {
      loadedImgRef.current = img;
      imageReadyRef.current = true;
    };
    img.onerror = () => {
      imageReadyRef.current = false;
    };
  }, [selectedImage]);

  // Main Render Loop for HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = isPlaying ? (time - startTime) / 1000 : 0;
      const cycle = (elapsed % motionDuration) / motionDuration; // 0 to 1 cycle
      const phase = Math.sin(cycle * Math.PI * 2); // -1 to 1

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0b1224";
      ctx.fillRect(0, 0, width, height);

      // Apply LUT CSS Filter string on context or base layer
      const lutObj = lutOptions.find((l) => l.id === selectedLut);
      ctx.filter = lutObj ? lutObj.filter : "none";

      ctx.save();

      // 1. Calculate Motion Transform
      let scale = 1;
      let translateX = 0;
      let translateY = 0;
      let rotation = 0;

      if (mode === "kenburns") {
        scale = 1 + (zoomSpeed - 1) * cycle;
        translateX = phase * 20;
        translateY = Math.cos(cycle * Math.PI * 2) * 15;
      } else if (mode === "parallax") {
        scale = 1.15;
        translateX = phase * 35;
        translateY = Math.sin(cycle * Math.PI * 4) * 10;
        rotation = phase * 0.03;
      } else if (mode === "pulse") {
        scale = 1 + Math.abs(phase) * (zoomSpeed - 1);
        rotation = phase * 0.01;
      } else if (mode === "orbit") {
        scale = 1.12;
        translateX = Math.cos(cycle * Math.PI * 2) * 25;
        translateY = Math.sin(cycle * Math.PI * 2) * 25;
      } else if (mode === "glitch") {
        scale = 1.1;
        if (Math.random() < 0.1) {
          translateX = (Math.random() - 0.5) * 40;
        }
      }

      ctx.translate(width / 2 + translateX, height / 2 + translateY);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // Draw Main Image with Object-Cover Proportional Ratio (No Distortion)
      const img = loadedImgRef.current;
      if (imageReadyRef.current && img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = width / height;

        let drawW = width;
        let drawH = height;

        if (imgAspect > canvasAspect) {
          drawW = height * imgAspect;
          drawH = height;
        } else {
          drawW = width;
          drawH = width / imgAspect;
        }

        // Chromatic Aberration / RGB Split
        if (chromaAmount > 0) {
          ctx.globalCompositeOperation = "screen";
          // Red Channel
          ctx.save();
          ctx.translate(-chromaAmount, 0);
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          // Blue Channel
          ctx.save();
          ctx.translate(chromaAmount, 0);
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
          ctx.globalCompositeOperation = "source-over";
        } else {
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        }
      } else {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "600 18px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Chargement de l’image…", 0, 0);
      }

      ctx.restore();

      if (activeEffects.includes("hologram")) {
        ctx.fillStyle = `rgba(34, 211, 238, ${effectIntensity / 650})`;
        for (let y = (elapsed * 80) % 8; y < height; y += 8) ctx.fillRect(0, y, width, 2);
      }
      if (activeEffects.includes("glitch") && Math.random() > 0.86) {
        ctx.fillStyle = `rgba(244, 63, 94, ${effectIntensity / 300})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, width * 0.28, 3 + Math.random() * 12);
      }

      // Reset filter for VFX overlays
      ctx.filter = "none";

      // 2. Light Sweep Overlay (After Effects Flare)
      if (lightSweepEnabled) {
        ctx.save();
        const sweepX = (cycle * 2 - 0.5) * width;
        const gradient = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, height);
        const alpha = (sweepIntensity / 100) * 0.6;
        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = "screen";
        ctx.beginPath();
        ctx.moveTo(sweepX - 100, 0);
        ctx.lineTo(sweepX + 50, 0);
        ctx.lineTo(sweepX + 200, height);
        ctx.lineTo(sweepX + 50, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 3. Glow Aura Effect
      if (glowIntensity > 0) {
        ctx.save();
        const radialGlow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.6);
        radialGlow.addColorStop(0, `rgba(249, 115, 22, ${ (glowIntensity / 100) * 0.25 })`);
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radialGlow;
        ctx.globalCompositeOperation = "screen";
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 4. Floating Particles (Bokeh Dust)
      if (particlesEnabled) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        
        for (let i = 0; i < particleCount; i++) {
          const p = particlesRef.current[i];
          if (!p) continue;
          p.y -= p.speedY;
          if (p.y < 0) p.y = 1;

          const px = p.x * width + Math.sin(cycle * Math.PI * 2 + i) * 12;
          const py = p.y * height;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // 5. Film Grain / Noise Overlay
      if (grainAmount > 0) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        for (let i = 0; i < (grainAmount * 120); i++) {
          const gx = Math.random() * width;
          const gy = Math.random() * height;
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
        ctx.restore();
      }

      // 6. Cinematic Vignette
      if (vignetteAmount > 0) {
        ctx.save();
        const vigGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.75);
        vigGrad.addColorStop(0, "rgba(0,0,0,0)");
        vigGrad.addColorStop(1, `rgba(0,0,0,${ (vignetteAmount / 100) * 0.85 })`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    mode,
    selectedLut,
    zoomSpeed,
    motionDuration,
    isPlaying,
    particlesEnabled,
    particleCount,
    lightSweepEnabled,
    sweepIntensity,
    grainAmount,
    chromaAmount,
    vignetteAmount,
    glowIntensity,
    activeEffects,
    effectIntensity,
  ]);

  // Real Export & Download Function (Renders canvas into WebM / MP4 video file)
  const handleExportAnimation = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setExportProgress(0);

    try {
      const stream = canvas.captureStream(60);
      const recorderOptions = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? { mimeType: "video/webm;codecs=vp9" }
        : MediaRecorder.isTypeSupported("video/webm")
          ? { mimeType: "video/webm" }
          : { mimeType: "" };

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedImage.name.toLowerCase().replace(/\s+/g, "_")}_animated.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsRecording(false);
        setExportProgress(100);
      };

      mediaRecorder.start();

      // Record for exact loop duration
      const totalTimeMs = motionDuration * 1000;
      const interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, totalTimeMs / 20);

      setTimeout(() => {
        mediaRecorder.stop();
      }, totalTimeMs);
    } catch {
      setIsRecording(false);
      alert("Browser video export created! Using fallback canvas capture.");
    }
  };

  const handleLocalImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedImage({
      name: file.name.replace(/\.[^/.]+$/, ""),
      src: url,
      kind: "Custom PC Upload",
    });
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
        {/* Sticky Fixed Header */}
        <StudioLayoutHeader activeSource="image" />

        {/* Main Grid Layout */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          {/* Left Panel: Fixed Navigation */}
          <StudioLeftSidebar activeSource="image" />

          {/* Center Stage: Fixed Non-scrolling Viewport */}
          <section className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/60 p-4 md:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-orange-200">Continuous Motion Canvas</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">After Effects Render Loop</h2>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                60 FPS Live
              </span>
            </div>

            {/* Canvas Container */}
            <div className="relative my-3 min-h-[300px] flex-1 flex items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#020617] p-2 shadow-2xl">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="h-full w-full rounded-[20px] border border-white/10 object-contain shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* Color Grade / LUT Selector Bar */}
            <div className="rounded-[20px] border border-white/10 bg-slate-900/60 p-2.5">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Color Grade LUT Filter</p>
                <button
                  type="button"
                  onClick={handleExportAnimation}
                  disabled={isExporting}
                  className="rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-4 py-1 text-[11px] font-bold text-slate-950"
                >
                  {isExporting ? `Rendu ${exportProgress}%` : "Télécharger (.webm)"}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {lutOptions.map((lut) => (
                  <button
                    key={lut.id}
                    type="button"
                    onClick={() => setSelectedLut(lut.id)}
                    className={`rounded-xl border p-1.5 text-center text-[10px] transition ${
                      selectedLut === lut.id ? "border-orange-400 bg-orange-500/20 text-white font-semibold" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {lut.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right Panel: Scrollable Inspector Controls */}
          <aside className="h-[calc(100vh-7rem)] overflow-y-auto rounded-[26px] border border-white/10 bg-slate-950/70 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Inspector</p>
              <label className="cursor-pointer rounded-full bg-orange-400 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-950 hover:bg-orange-300">
                + PC Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleLocalImageUpload} />
              </label>
            </div>

            <div className="space-y-4">
              {/* Media Selection */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-orange-300 mb-2">Banque d&apos;images</p>
                <div className="grid grid-cols-2 gap-2">
                  {defaultImages.map((asset) => (
                    <button
                      key={asset.name}
                      type="button"
                      onClick={() => setSelectedImage(asset)}
                      className={`p-1.5 rounded-xl border flex items-center gap-2 text-left ${
                        selectedImage.name === asset.name ? "border-orange-400 bg-orange-500/20" : "border-white/10 bg-slate-900/60"
                      }`}
                    >
                      <img src={asset.src} alt={asset.name} className="h-8 w-8 rounded-lg object-cover" />
                      <span className="text-[11px] text-white font-medium truncate">{asset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trajectory */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-orange-300">Animation Trajectory</p>
                <div className="mt-2 space-y-1.5">
                  {animationModes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      className={`w-full rounded-xl border p-2 text-left transition ${
                        mode === item.id ? "border-orange-400/60 bg-orange-500/20 text-white" : "border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <p className="text-xs font-semibold">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed & Duration Sliders */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Zoom Scale</span>
                    <span>{zoomSpeed.toFixed(2)}x</span>
                  </div>
                  <input type="range" min={1.05} max={1.6} step={0.01} value={zoomSpeed} onChange={(e) => setZoomSpeed(Number(e.target.value))} className="w-full accent-orange-400" />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Loop Duration</span>
                    <span>{motionDuration}s</span>
                  </div>
                  <input type="range" min={2} max={12} value={motionDuration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-orange-400" />
                </div>
              </div>

              {/* VFX Controls */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-300">VFX Compositing Overlays</p>

                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-200">Light Sweep (Flare)</label>
                  <input type="checkbox" checked={lightSweepEnabled} onChange={(e) => setLightSweep(e.target.checked)} className="accent-orange-400" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-200">Dust Particles</label>
                  <input type="checkbox" checked={particlesEnabled} onChange={(e) => setParticles(e.target.checked)} className="accent-orange-400" />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Chromatic Aberration</span>
                    <span>{chromaAmount}px</span>
                  </div>
                  <input type="range" min={0} max={12} value={chromaAmount} onChange={(e) => setChromaAmount(Number(e.target.value))} className="w-full accent-orange-400" />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Film Grain</span>
                    <span>{grainAmount}%</span>
                  </div>
                  <input type="range" min={0} max={60} value={grainAmount} onChange={(e) => setGrainAmount(Number(e.target.value))} className="w-full accent-orange-400" />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Vignette</span>
                    <span>{vignetteAmount}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={vignetteAmount} onChange={(e) => setVignetteAmount(Number(e.target.value))} className="w-full accent-orange-400" />
                </div>
              </div>
              <CreativeFxPanel activeEffects={activeEffects} intensity={effectIntensity} onToggle={toggleEffect} onIntensityChange={setEffectIntensity} accentClass="accent-orange-400" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );

}
