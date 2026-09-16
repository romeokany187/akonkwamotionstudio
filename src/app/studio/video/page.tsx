"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import StudioLayoutHeader from "@/components/StudioLayoutHeader";
import StudioLeftSidebar from "@/components/StudioLeftSidebar";
import StudioTimeline from "@/components/StudioTimeline";

const demoVideo = "/assets/gen/demo.mp4";
const colorLooks = [
  { id: "original", label: "Original", filter: "none" },
  { id: "cinematic", label: "Cinematic", filter: "contrast(1.12) saturate(1.22) sepia(0.08)" },
  { id: "neon", label: "Neon", filter: "contrast(1.28) saturate(1.5) hue-rotate(160deg)" },
  { id: "noir", label: "Noir", filter: "grayscale(1) contrast(1.35) brightness(0.9)" },
];

const effectLibrary = [
  { id: "hologram", label: "Hologram", description: "Scanlines, cyan glow and digital flicker" },
  { id: "glitch", label: "Digital Glitch", description: "RGB tears and horizontal displacement" },
  { id: "bokeh", label: "Bokeh Dust", description: "Floating luminous particles" },
  { id: "lensflare", label: "Lens Flare", description: "Animated optical flare across the frame" },
  { id: "bluestreak", label: "Blue Streak", description: "Directional blue light streak" },
  { id: "kaleidoscope", label: "Kaleidoscope", description: "Mirrored geometric image echo" },
  { id: "promist", label: "Pro Mist", description: "Soft diffusion around highlights" },
  { id: "liquid", label: "Liquid Distortion", description: "Procedural wave displacement" },
];

export default function StudioVideoPage() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("Aucune vidéo importée");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1.04);
  const [blur, setBlur] = useState(0);
  const [chroma, setChroma] = useState(0);
  const [grain, setGrain] = useState(12);
  const [vignette, setVignette] = useState(38);
  const [lightLeak, setLightLeak] = useState(28);
  const [look, setLook] = useState("cinematic");
  const [activeEffects, setActiveEffects] = useState<string[]>(["hologram", "bokeh"]);
  const [effectIntensity, setEffectIntensity] = useState(55);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const exportTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeFilter = colorLooks.find((item) => item.id === look)?.filter ?? "none";
  const hasEffect = (id: string) => activeEffects.includes(id);
  const toggleEffect = (id: string) => setActiveEffects((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const formatTime = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (videoSrc?.startsWith("blob:")) URL.revokeObjectURL(videoSrc);
    setVideoSrc(URL.createObjectURL(file));
    setVideoName(file.name);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = speed;
  }, [speed, videoSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const render = (time: number) => {
      const width = canvas.width;
      const height = canvas.height;
      const progress = videoDuration > 0 ? (video.currentTime % videoDuration) / videoDuration : (time / 10000) % 1;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#020617";
      context.fillRect(0, 0, width, height);

      if (video.readyState >= 2 && video.videoWidth > 0) {
        const sourceRatio = video.videoWidth / video.videoHeight;
        const canvasRatio = width / height;
        let drawWidth = width;
        let drawHeight = height;
        if (sourceRatio > canvasRatio) drawWidth = height * sourceRatio;
        else drawHeight = width / sourceRatio;

        const drift = Math.sin(progress * Math.PI * 2) * 12;
        const drawX = (width - drawWidth) / 2 + drift;
        const drawY = (height - drawHeight) / 2;
        context.save();
        context.filter = `${activeFilter} blur(${blur}px)`;
        if (chroma > 0) {
          context.globalCompositeOperation = "screen";
          context.globalAlpha = 0.55;
          context.translate(-chroma, 0);
          context.drawImage(video, drawX, drawY, drawWidth, drawHeight);
          context.translate(chroma * 2, 0);
          context.drawImage(video, drawX, drawY, drawWidth, drawHeight);
        } else {
          context.drawImage(video, drawX - (drawWidth * (zoom - 1)) / 2, drawY - (drawHeight * (zoom - 1)) / 2, drawWidth * zoom, drawHeight * zoom);
        }
        context.restore();
      } else {
        context.fillStyle = "#0f172a";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "#94a3b8";
        context.font = "16px system-ui";
        context.textAlign = "center";
        context.fillText("Importez une vidéo MP4, MOV ou WebM", width / 2, height / 2);
      }

      context.filter = "none";

      const fxStrength = effectIntensity / 100;

      if (hasEffect("liquid")) {
        context.save();
        context.globalAlpha = 0.12 * fxStrength;
        context.globalCompositeOperation = "screen";
        for (let line = 0; line < 12; line += 1) {
          context.beginPath();
          for (let point = 0; point <= width; point += 24) {
            const wave = Math.sin(point * 0.025 + progress * Math.PI * 4 + line) * (8 + 16 * fxStrength);
            if (point === 0) context.moveTo(point, line * (height / 12) + wave);
            else context.lineTo(point, line * (height / 12) + wave);
          }
          context.strokeStyle = "#38bdf8";
          context.stroke();
        }
        context.restore();
      }

      if (hasEffect("kaleidoscope")) {
        context.save();
        context.globalAlpha = 0.16 * fxStrength;
        context.globalCompositeOperation = "screen";
        context.translate(width / 2, height / 2);
        context.rotate(progress * Math.PI * 2);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, -height);
        context.lineTo(width, height);
        context.closePath();
        context.clip();
        context.scale(-1, 1);
        context.drawImage(canvas, -width / 2, -height / 2, width, height);
        context.restore();
      }

      if (hasEffect("promist")) {
        context.save();
        context.globalAlpha = 0.16 * fxStrength;
        context.filter = `blur(${10 + effectIntensity / 5}px)`;
        context.globalCompositeOperation = "screen";
        context.drawImage(canvas, -2, -2, width + 4, height + 4);
        context.restore();
      }

      if (hasEffect("hologram")) {
        context.save();
        context.globalAlpha = 0.22 * fxStrength;
        context.globalCompositeOperation = "screen";
        context.fillStyle = "#22d3ee";
        for (let y = (progress * 80) % 8; y < height; y += 8) context.fillRect(0, y, width, 2);
        context.fillStyle = `rgba(34, 211, 238, ${0.12 * fxStrength})`;
        context.fillRect(0, 0, width, height);
        context.restore();
      }

      if (hasEffect("glitch")) {
        context.save();
        context.globalCompositeOperation = "screen";
        context.globalAlpha = 0.3 * fxStrength;
        for (let slice = 0; slice < 5; slice += 1) {
          const sliceY = Math.random() * height;
          const sliceHeight = 2 + Math.random() * 14;
          context.drawImage(canvas, (Math.random() - 0.5) * 34 * fxStrength, sliceY, width, sliceHeight, 0, sliceY, width, sliceHeight);
        }
        context.restore();
      }

      if (hasEffect("bokeh")) {
        context.save();
        context.globalCompositeOperation = "screen";
        for (let particle = 0; particle < 28; particle += 1) {
          const x = (Math.sin(particle * 17 + time * 0.0003) * 0.5 + 0.5) * width;
          const y = ((particle * 43 - time * 0.025) % height + height) % height;
          const radius = 2 + (particle % 4) * fxStrength;
          context.fillStyle = `rgba(186, 230, 253, ${0.25 + fxStrength * 0.45})`;
          context.shadowBlur = 14;
          context.shadowColor = "#67e8f9";
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }

      if (hasEffect("lensflare")) {
        context.save();
        const flareX = ((progress * 1.5 - 0.25) % 1.5) * width;
        const flare = context.createRadialGradient(flareX, height * 0.48, 0, flareX, height * 0.48, 110 + effectIntensity);
        flare.addColorStop(0, `rgba(255,255,255,${0.8 * fxStrength})`);
        flare.addColorStop(0.08, `rgba(125,211,252,${0.5 * fxStrength})`);
        flare.addColorStop(1, "rgba(0,0,0,0)");
        context.globalCompositeOperation = "screen";
        context.fillStyle = flare;
        context.fillRect(0, 0, width, height);
        context.restore();
      }

      if (hasEffect("bluestreak")) {
        context.save();
        const streakX = ((progress * 1.4 - 0.2) % 1.4) * width;
        const streak = context.createLinearGradient(streakX - 180, 0, streakX + 180, 0);
        streak.addColorStop(0, "rgba(56,189,248,0)");
        streak.addColorStop(0.5, `rgba(56,189,248,${0.55 * fxStrength})`);
        streak.addColorStop(1, "rgba(56,189,248,0)");
        context.globalCompositeOperation = "screen";
        context.fillStyle = streak;
        context.transform(1, 0, -0.18, 1, 0, 0);
        context.fillRect(streakX - 240, height * 0.38, 480, 7 + effectIntensity / 12);
        context.restore();
      }

      if (lightLeak > 0) {
        const leak = context.createRadialGradient(progress * width, height * 0.35, 10, progress * width, height * 0.35, width * 0.65);
        leak.addColorStop(0, `rgba(255, 196, 104, ${lightLeak / 180})`);
        leak.addColorStop(0.35, `rgba(244, 63, 94, ${lightLeak / 420})`);
        leak.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = leak;
        context.globalCompositeOperation = "screen";
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = "source-over";
      }

      if (grain > 0) {
        context.fillStyle = "rgba(255,255,255,0.045)";
        for (let index = 0; index < grain * 90; index += 1) context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
      }

      if (vignette > 0) {
        const vignetteGradient = context.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.76);
        vignetteGradient.addColorStop(0, "rgba(0,0,0,0)");
        vignetteGradient.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
        context.fillStyle = vignetteGradient;
        context.fillRect(0, 0, width, height);
      }

      setCurrentTime(video.currentTime || 0);
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [activeFilter, activeEffects, blur, chroma, effectIntensity, grain, lightLeak, vignette, videoDuration, zoom]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;
    const recorderType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
    const recorder = new MediaRecorder(canvas.captureStream(60), { mimeType: recorderType });
    const chunks: Blob[] = [];
    const exportDuration = Math.max(2, ((trimEnd - trimStart) / 100) * (videoDuration || 5));

    setIsExporting(true);
    setExportProgress(0);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      const url = URL.createObjectURL(new Blob(chunks, { type: recorderType }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${videoName.replace(/\.[^/.]+$/, "")}_motionforge.webm`;
      anchor.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      setExportProgress(100);
    };
    recorder.start();
    exportTimerRef.current = setInterval(() => setExportProgress((value) => Math.min(96, value + 4)), exportDuration * 1000 / 24);
    setTimeout(() => {
      if (exportTimerRef.current) clearInterval(exportTimerRef.current);
      recorder.stop();
    }, exportDuration * 1000);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
        <StudioLayoutHeader activeSource="video" />
        <video ref={videoRef} src={videoSrc ?? demoVideo} muted loop playsInline className="hidden" onLoadedMetadata={(event) => { const value = event.currentTarget.duration; setVideoDuration(Number.isFinite(value) ? value : 0); setTrimStart(0); setTrimEnd(100); }} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} />

        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
          <StudioLeftSidebar activeSource="video" />

          <section className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/60 p-4 md:p-5">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200">Video compositing studio</p><h2 className="mt-1 text-2xl font-semibold text-white">Motion Array video workflow</h2></div><button type="button" onClick={handleExport} disabled={isExporting} className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold uppercase text-slate-950 disabled:opacity-50">{isExporting ? `Rendu ${exportProgress}%` : "Télécharger le rendu"}</button></div>
            <div className="relative my-3 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#020617] p-2 shadow-2xl"><canvas ref={canvasRef} width={800} height={480} className="h-full w-full rounded-[20px] object-contain" /><div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md"><button type="button" onClick={togglePlayback} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-950">{isPlaying ? "Pause" : "Play"}</button><span className="text-[11px] text-slate-300">{formatTime(currentTime)} / {formatTime(videoDuration)}</span><span className="max-w-[180px] truncate text-[10px] uppercase tracking-[0.16em] text-cyan-300">{videoName}</span></div></div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3"><div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400"><span>Timeline</span><span>{speed}x playback</span></div><input aria-label="Position vidéo" type="range" min={0} max={videoDuration || 100} step={0.01} value={currentTime} onChange={(event) => seek(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" /><div className="mt-1 flex justify-between text-[10px] text-slate-500"><span>In {formatTime((trimStart / 100) * videoDuration)}</span><span>Out {formatTime((trimEnd / 100) * videoDuration)}</span></div></div>
          </section>

          <aside className="h-[calc(100vh-7rem)] overflow-y-auto rounded-[26px] border border-white/10 bg-slate-950/70 p-4 space-y-4">
            <StudioTimeline accent="#22d3ee" tracks={[{ name: "Vidéo", color: "#22d3ee", start: 0, width: 86 }, { name: "Audio", color: "#34d399", start: 0, width: 86 }]} />
            <div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Video inspector</p><label className="cursor-pointer rounded-full bg-cyan-400 px-3 py-1 text-[10px] font-bold text-slate-950">+ Import<input type="file" accept="video/*" className="hidden" onChange={handleUpload} /></label></div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3"><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Source & timing</p><div><div className="flex justify-between text-xs text-slate-300"><span>Playback speed</span><span>{speed}x</span></div><input type="range" min={0.25} max={2} step={0.05} value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="w-full accent-cyan-400" /></div><div><div className="flex justify-between text-xs text-slate-300"><span>Trim in</span><span>{trimStart}%</span></div><input type="range" min={0} max={trimEnd - 1} value={trimStart} onChange={(event) => setTrimStart(Number(event.target.value))} className="w-full accent-cyan-400" /></div><div><div className="flex justify-between text-xs text-slate-300"><span>Trim out</span><span>{trimEnd}%</span></div><input type="range" min={trimStart + 1} max={100} value={trimEnd} onChange={(event) => setTrimEnd(Number(event.target.value))} className="w-full accent-cyan-400" /></div></div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3"><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Camera & transition</p><div><div className="flex justify-between text-xs text-slate-300"><span>Ken Burns zoom</span><span>{zoom.toFixed(2)}x</span></div><input type="range" min={1} max={1.35} step={0.01} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-full accent-cyan-400" /></div><div><div className="flex justify-between text-xs text-slate-300"><span>Motion blur</span><span>{blur}px</span></div><input type="range" min={0} max={14} value={blur} onChange={(event) => setBlur(Number(event.target.value))} className="w-full accent-cyan-400" /></div></div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5 space-y-3"><p className="text-[10px] uppercase tracking-[0.2em] text-rose-300">After Effects VFX</p><div><div className="flex justify-between text-xs text-slate-300"><span>RGB split</span><span>{chroma}px</span></div><input type="range" min={0} max={12} value={chroma} onChange={(event) => setChroma(Number(event.target.value))} className="w-full accent-cyan-400" /></div><div><div className="flex justify-between text-xs text-slate-300"><span>Film grain</span><span>{grain}%</span></div><input type="range" min={0} max={50} value={grain} onChange={(event) => setGrain(Number(event.target.value))} className="w-full accent-cyan-400" /></div><div><div className="flex justify-between text-xs text-slate-300"><span>Light leak</span><span>{lightLeak}%</span></div><input type="range" min={0} max={100} value={lightLeak} onChange={(event) => setLightLeak(Number(event.target.value))} className="w-full accent-cyan-400" /></div><div><div className="flex justify-between text-xs text-slate-300"><span>Vignette</span><span>{vignette}%</span></div><input type="range" min={0} max={100} value={vignette} onChange={(event) => setVignette(Number(event.target.value))} className="w-full accent-cyan-400" /></div></div>
            <div className="rounded-[20px] border border-cyan-400/20 bg-cyan-500/5 p-3.5 space-y-3"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">FX Library</p><p className="mt-1 text-[11px] text-slate-400">Effets plugin appliqués au rendu</p></div><span className="rounded-full bg-cyan-400/15 px-2 py-1 text-[10px] text-cyan-200">{activeEffects.length} actifs</span></div><div className="space-y-2">{effectLibrary.map((effect) => <button key={effect.id} type="button" onClick={() => toggleEffect(effect.id)} className={`w-full rounded-xl border p-2.5 text-left transition ${hasEffect(effect.id) ? "border-cyan-400/60 bg-cyan-400/15" : "border-white/10 bg-slate-900/60 hover:border-white/25"}`}><div className="flex items-center justify-between"><span className="text-xs font-semibold text-white">{effect.label}</span><span className={`h-2 w-2 rounded-full ${hasEffect(effect.id) ? "bg-cyan-300 shadow-[0_0_10px_#67e8f9]" : "bg-slate-600"}`} /></div><p className="mt-1 text-[10px] text-slate-400">{effect.description}</p></button>)}</div><div><div className="flex justify-between text-xs text-slate-300"><span>FX intensity</span><span>{effectIntensity}%</span></div><input type="range" min={10} max={100} value={effectIntensity} onChange={(event) => setEffectIntensity(Number(event.target.value))} className="w-full accent-cyan-400" /></div></div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3.5"><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">Color grade</p><div className="mt-2 grid grid-cols-2 gap-2">{colorLooks.map((item) => <button key={item.id} type="button" onClick={() => setLook(item.id)} className={`rounded-xl border px-2 py-2 text-xs ${look === item.id ? "border-cyan-400 bg-cyan-500/20 text-white" : "border-white/10 bg-slate-900 text-slate-400"}`}>{item.label}</button>)}</div></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
