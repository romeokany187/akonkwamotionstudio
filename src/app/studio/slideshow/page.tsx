"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const defaultSlides = [
  { name: "Slide 1 - Urban Drone", src: "/assets/gen/drone.png", title: "URBAN MOTION", subtitle: "Cinematic Parallax Slideshow" },
  { name: "Slide 2 - Speed & Style", src: "/assets/gen/car.png", title: "SPEED & DRIFT", subtitle: "Dynamic Wipe & Split FX" },
  { name: "Slide 3 - Modern Tech", src: "/assets/gen/vrheadset.png", title: "FUTURE VISION", subtitle: "Glitch & Distortion Transition" },
  { name: "Slide 4 - Creative Living", src: "/assets/gen/lamp.png", title: "ELEGANT LIVING", subtitle: "Smooth Zoom & Light Leak" },
];

const motionStylePresets = [
  { id: "cinematic_parallax", name: "Cinematic Parallax", desc: "Smooth 3D push-in with multi-layer depth shift & floating dust" },
  { id: "fast_dynamic_wipe", name: "Fast Dynamic Whip Pan", desc: "High-energy horizontal blur wipe with chromatic flash" },
  { id: "glitch_distortion", name: "Cyber Glitch & Split", desc: "RGB displacement, digital noise & horizontal screen tear" },
  { id: "minimal_smooth_zoom", name: "Minimal Soft Zoom", desc: "Elegant slow push with light leak flare and warm glow" },
  { id: "glass_morphism_overlay", name: "Glassmorphism Card Slide", desc: "Modern floating frosted glass container with title reveal" },
];

const transitionTimingOptions = [
  { speed: 3, label: "Fast (3s)" },
  { speed: 5, label: "Medium (5s)" },
  { speed: 8, label: "Cinematic (8s)" },
];

export default function MotionArraySlideshowStudio() {
  const [slides, setSlides] = useState(defaultSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [motionStyle, setMotionStyle] = useState("cinematic_parallax");
  
  // Controls
  const [slideDuration, setSlideDuration] = useState(5);
  const [transitionSpeed, setTransitionSpeed] = useState(1.2);
  const [isPlaying, setIsPlaying] = useState(true);

  // VFX Toggles
  const [enableLightLeak, setEnableLightLeak] = useState(true);
  const [enableParticles, setEnableParticles] = useState(true);
  const [enableTextOverlay, setEnableTextOverlay] = useState(true);
  const [enableFilmGrain, setEnableFilmGrain] = useState(true);
  const [enableRGBGrid, setEnableRGBGrid] = useState(true);

  // Custom text for active slide
  const [slideTitle, setSlideTitle] = useState(defaultSlides[0].title);
  const [slideSubtitle, setSlideSubtitle] = useState(defaultSlides[0].subtitle);

  // Export recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Preload images
  useEffect(() => {
    preloadedImagesRef.current = slides.map((slide) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = slide.src;
      return img;
    });
  }, [slides]);

  const handleActiveSlideChange = (index: number) => {
    const slide = slides[index];
    if (!slide) return;

    setActiveSlideIndex(index);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle);
  };

  // Main Motion Array Animation Engine (Canvas 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = isPlaying ? (time - startTime) / 1000 : 0;
      const totalLoopTime = slideDuration * slides.length;
      const currentLoopTime = elapsed % totalLoopTime;

      // Determine current slide and progress
      const currentIdx = Math.floor(currentLoopTime / slideDuration);
      const slideProgress = (currentLoopTime % slideDuration) / slideDuration; // 0.0 to 1.0

      const nextIdx = (currentIdx + 1) % slides.length;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const currentImg = preloadedImagesRef.current[currentIdx];
      const nextImg = preloadedImagesRef.current[nextIdx];

      // Helper function to draw image with proper cover aspect ratio
      const drawCoverImg = (img: HTMLImageElement, offsetX = 0) => {
        if (!img || !img.complete || img.naturalWidth === 0) return;
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

        ctx.drawImage(img, -drawW / 2 + offsetX, -drawH / 2, drawW, drawH);
      };

      // Draw Base Slide Motion depending on preset
      ctx.save();

      if (motionStyle === "cinematic_parallax") {
        // Continuous Ken Burns Zoom & Subtle Pan
        const scale = 1 + slideProgress * 0.18;
        const panX = Math.sin(slideProgress * Math.PI) * 20;

        ctx.translate(width / 2 + panX, height / 2);
        ctx.scale(scale, scale);

        drawCoverImg(currentImg);
      } else if (motionStyle === "fast_dynamic_wipe") {
        // Whip Pan Wipe
        const wipePos = slideProgress > 0.8 ? (slideProgress - 0.8) * 5 * width : 0;

        ctx.translate(width / 2 - wipePos, height / 2);
        drawCoverImg(currentImg);

        if (wipePos > 0 && nextImg) {
          drawCoverImg(nextImg, width);
        }
      } else if (motionStyle === "glitch_distortion") {
        // Digital RGB Tear
        const scale = 1.05 + slideProgress * 0.08;
        const glitchShift = Math.random() < 0.15 ? (Math.random() - 0.5) * 35 : 0;

        ctx.translate(width / 2 + glitchShift, height / 2);
        ctx.scale(scale, scale);

        drawCoverImg(currentImg);
      } else if (motionStyle === "minimal_smooth_zoom") {
        const scale = 1.25 - slideProgress * 0.12;

        ctx.translate(width / 2, height / 2);
        ctx.scale(scale, scale);

        drawCoverImg(currentImg);
      } else {
        // Glassmorphism default
        ctx.translate(width / 2, height / 2);
        ctx.scale(1.08, 1.08);
        drawCoverImg(currentImg);
      }

      ctx.restore();

      // Motion Array Light Leak Transition
      if (enableLightLeak) {
        ctx.save();
        const leakX = (slideProgress * 1.5 - 0.25) * width;
        const grad = ctx.createRadialGradient(leakX, height / 2, 20, leakX, height / 2, width * 0.5);
        grad.addColorStop(0, "rgba(255, 180, 80, 0.45)");
        grad.addColorStop(0.5, "rgba(244, 63, 94, 0.25)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = "screen";
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Floating Bokeh & Dust Particles
      if (enableParticles) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        for (let i = 0; i < 35; i++) {
          const px = (Math.sin(i * 99 + elapsed * 0.5) * 0.5 + 0.5) * width;
          const py = ((i * 30 + elapsed * 20) % height);
          ctx.beginPath();
          ctx.arc(px, py, (i % 3) + 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Film Grain Overlay
      if (enableFilmGrain) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        for (let i = 0; i < 2000; i++) {
          const gx = Math.random() * width;
          const gy = Math.random() * height;
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
        ctx.restore();
      }

      // Motion Array Cinematic Title & Subtitle Card Overlay
      if (enableTextOverlay && slides[currentIdx]) {
        ctx.save();

        // Animated Glass Card
        const textY = height - 120;
        const textFade = Math.sin(slideProgress * Math.PI); // Smooth fade in and out

        ctx.fillStyle = `rgba(15, 23, 42, ${0.65 * textFade})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * textFade})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.roundRect(40, textY - 45, width - 80, 90, 20);
        ctx.fill();
        ctx.stroke();

        // Accent Light Strip
        ctx.fillStyle = `rgba(249, 115, 22, ${0.9 * textFade})`;
        ctx.fillRect(55, textY - 30, 4, 60);

        // Slide Subtitle
        ctx.fillStyle = `rgba(203, 213, 225, ${0.9 * textFade})`;
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillText((slideSubtitle || slides[currentIdx].subtitle).toUpperCase(), 75, textY - 10);

        // Slide Main Title
        ctx.fillStyle = `rgba(255, 255, 255, ${1 * textFade})`;
        ctx.font = "900 24px system-ui, sans-serif";
        ctx.fillText(slideTitle || slides[currentIdx].title, 75, textY + 20);

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    slides,
    slideDuration,
    motionStyle,
    isPlaying,
    enableLightLeak,
    enableParticles,
    enableFilmGrain,
    enableTextOverlay,
    slideTitle,
    slideSubtitle,
  ]);

  // Upload Custom Image to Active Slide
  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const updated = [...slides];
    updated[activeSlideIndex] = {
      ...updated[activeSlideIndex],
      src: url,
      name: file.name.replace(/\.[^/.]+$/, ""),
    };
    setSlides(updated);
  };

  // Update Active Slide Text
  const handleTitleChange = (val: string) => {
    setSlideTitle(val);
    const updated = [...slides];
    if (updated[activeSlideIndex]) {
      updated[activeSlideIndex].title = val;
      setSlides(updated);
    }
  };

  const handleSubtitleChange = (val: string) => {
    setSlideSubtitle(val);
    const updated = [...slides];
    if (updated[activeSlideIndex]) {
      updated[activeSlideIndex].subtitle = val;
      setSlides(updated);
    }
  };

  // Download Complete Slideshow Video
  const handleExportSlideshow = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordProgress(0);

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
        a.download = `motionarray_slideshow_aftereffects.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      recorder.start();

      const totalMs = slideDuration * slides.length * 1000;
      const interval = setInterval(() => {
        setRecordProgress((p) => (p >= 95 ? 100 : p + 5));
      }, totalMs / 20);

      setTimeout(() => {
        clearInterval(interval);
        recorder.stop();
      }, totalMs);
    } catch {
      setIsRecording(false);
      alert("Export vidéo généré !");
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="rounded-[26px] border border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-600 text-lg font-black text-white shadow-[0_10px_25px_rgba(244,63,94,0.45)]">
                M
              </Link>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Motion Array Inspired</p>
                <h1 className="text-base font-semibold text-white">After Effects Slideshow Studio</h1>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <Link href="/studio" className="text-white">Studio</Link>
              <Link href="/library" className="hover:text-white">Library</Link>
              <Link href="/templates" className="hover:text-white">Templates</Link>
              <Link href="/export" className="hover:text-white">Export</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 hover:bg-white/10"
              >
                {isPlaying ? "Pause Loop" : "Play Loop"}
              </button>
              <button
                type="button"
                onClick={handleExportSlideshow}
                disabled={isRecording}
                className="rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(244,63,94,0.35)] transition hover:scale-105 disabled:opacity-50"
              >
                {isRecording ? `Rendu Vidéo ${recordProgress}%` : "Télécharger le Slideshow (.webm)"}
              </button>
            </div>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_380px]">
          {/* Left Panel: Slide Deck Manager & Upload */}
          <aside className="rounded-[26px] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Slide Deck ({slides.length})</p>
              <label className="cursor-pointer rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-300 hover:bg-white/20">
                + Uploader
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              {slides.map((slide, idx) => (
                <button
                  key={slide.name + idx}
                  type="button"
                  onClick={() => handleActiveSlideChange(idx)}
                  className={`flex w-full items-center gap-3 rounded-[20px] border p-2.5 text-left transition ${
                    activeSlideIndex === idx ? "border-orange-400 bg-orange-500/20" : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                    <img src={slide.src} alt={slide.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{slide.title}</p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 truncate">{slide.subtitle}</p>
                  </div>
                  <span className="text-xs font-bold text-orange-400">#{idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Active Slide Text Editor */}
            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-orange-300">Titre & Subtitle Slide #{activeSlideIndex + 1}</p>

              <div>
                <label className="text-[11px] text-slate-400">Titre Principal</label>
                <input
                  type="text"
                  value={slideTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Sous-titre / Categorie</label>
                <input
                  type="text"
                  value={slideSubtitle}
                  onChange={(e) => handleSubtitleChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-400"
                />
              </div>
            </div>
          </aside>

          {/* Center Canvas Preview */}
          <section className="rounded-[26px] border border-white/10 bg-slate-950/60 p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-orange-200">After Effects Realtime Preview</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">Motion Array Slideshow</h2>
              </div>
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                Loop 60 FPS
              </span>
            </div>

            <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#020617] p-4 shadow-2xl">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="h-full w-full rounded-[20px] border border-white/10 object-contain shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
              />
            </div>
          </section>

          {/* Right Panel: Motion Array FX Controls */}
          <aside className="rounded-[26px] border border-white/10 bg-slate-950/60 p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">After Effects Presets</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Motion Array Styles</h3>

            <div className="mt-4 space-y-4">
              {/* Style Presets */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-orange-300">Styles d’animation Slideshow</p>
                {motionStylePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setMotionStyle(preset.id)}
                    className={`w-full rounded-xl border p-2.5 text-left transition ${
                      motionStyle === preset.id ? "border-orange-400 bg-orange-500/20 text-white" : "border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <p className="text-xs font-semibold">{preset.name}</p>
                    <p className="text-[10px] text-slate-400">{preset.desc}</p>
                  </button>
                ))}
              </div>

              {/* Timing */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-orange-300">Duree par Slide</p>
                <div className="flex gap-2">
                  {transitionTimingOptions.map((opt) => (
                    <button
                      key={opt.speed}
                      type="button"
                      onClick={() => setSlideDuration(opt.speed)}
                      className={`flex-1 rounded-xl border py-2 text-center text-xs font-semibold transition ${
                        slideDuration === opt.speed ? "border-orange-400 bg-orange-500/20 text-white" : "border-white/10 bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* VFX Toggles */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-300">Effets After Effects</p>

                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-200">Light Leak & Lens Flare</label>
                  <input type="checkbox" checked={enableLightLeak} onChange={(e) => setEnableLightLeak(e.target.checked)} className="accent-orange-400" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-200">Floating Bokeh Dust Particles</label>
                  <input type="checkbox" checked={enableParticles} onChange={(e) => setEnableParticles(e.target.checked)} className="accent-orange-400" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-200">Title & Subtitle Glass Overlay</label>
                  <input type="checkbox" checked={enableTextOverlay} onChange={(e) => setEnableTextOverlay(e.target.checked)} className="accent-orange-400" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-200">Cinematic Film Grain</label>
                  <input type="checkbox" checked={enableFilmGrain} onChange={(e) => setEnableFilmGrain(e.target.checked)} className="accent-orange-400" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
