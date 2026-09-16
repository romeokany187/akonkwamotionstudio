"use client";

import { useState } from "react";

type TimelineTrack = { name: string; color: string; start: number; width: number };

const defaultTracks: TimelineTrack[] = [
  { name: "Texte principal", color: "#ff7a1a", start: 8, width: 42 },
  { name: "Forme 1", color: "#3a86ff", start: 30, width: 38 },
  { name: "Image de fond", color: "#8a5cff", start: 8, width: 72 },
];

export default function StudioTimeline({ tracks = defaultTracks, accent = "#ff7a1a" }: { tracks?: TimelineTrack[]; accent?: string }) {
  const [duration, setDuration] = useState(3);
  const [position, setPosition] = useState(0.8);
  const [loop, setLoop] = useState(true);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Timeline</p>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>{position.toFixed(2)}s / {duration.toFixed(1)}s</span>
          <button type="button" onClick={() => setLoop((value) => !value)} className={`rounded-md border px-2 py-1 ${loop ? "border-white/30 text-white" : "border-white/10"}`}>Boucle</button>
        </div>
      </div>
      <div className="relative mb-2 ml-[110px] h-4 border-b border-white/10 text-[9px] text-slate-500">
        {[0, 1, 2, 3, 4, 5].map((tick) => <span key={tick} className="absolute -translate-x-1/2" style={{ left: `${tick * 20}%` }}>{((duration / 5) * tick).toFixed(1)}s</span>)}
      </div>
      <div className="space-y-2">
        {tracks.map((track) => (
          <div key={track.name} className="flex items-center gap-2">
            <span className="w-[102px] shrink-0 truncate text-[10px] text-slate-400">{track.name}</span>
            <div className="relative h-7 flex-1 rounded-md border border-white/10 bg-white/[0.03]">
              <div className="absolute inset-y-1 rounded border" style={{ left: `${track.start}%`, width: `${track.width}%`, backgroundColor: `${track.color}44`, borderColor: track.color }}>
                <span className="px-2 text-[9px] text-white">{track.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] text-slate-400">Durée</span>
        <input aria-label="Durée de la timeline" type="range" min="1" max="10" step="0.1" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="flex-1" style={{ accentColor: accent }} />
        <span className="w-9 text-right text-[10px] text-slate-300">{duration.toFixed(1)}s</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-[10px] text-slate-400">Lecture</span>
        <input aria-label="Position de lecture" type="range" min="0" max={duration} step="0.01" value={position} onChange={(event) => setPosition(Number(event.target.value))} className="flex-1" style={{ accentColor: accent }} />
        <span className="w-9 text-right text-[10px] text-slate-300">{position.toFixed(2)}s</span>
      </div>
    </div>
  );
}
