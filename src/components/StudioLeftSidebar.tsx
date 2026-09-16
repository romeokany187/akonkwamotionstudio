"use client";

import Link from "next/link";

const studioSources = [
  { id: "text", name: "Text Animations", path: "/studio/text" },
  { id: "shape", name: "Shapes", path: "/studio/shape" },
  { id: "presets", name: "Presets", path: "/templates" },
  { id: "easing", name: "Easing", path: "/studio/text" },
  { id: "styles", name: "Styles", path: "/studio/shape" },
  { id: "timing", name: "Speed & Timing", path: "/studio/video" },
  { id: "image", name: "Image", path: "/studio/image" },
  { id: "video", name: "Video", path: "/studio/video" },
  { id: "3d", name: "Caméra 3D", path: "/studio/3d" },
  { id: "emoji", name: "Emoji", path: "/studio/emoji" },
  { id: "slideshow", name: "Slideshow", path: "/studio/slideshow" },
  { id: "sound", name: "Sound FX", path: "/library" },
  { id: "favorites", name: "Favoris", path: "/library" },
  { id: "history", name: "Historique", path: "/library" },
  { id: "settings", name: "Réglages", path: "/library" },
];

export default function StudioLeftSidebar({ activeSource }: { activeSource: string }) {
  return (
    <aside className="sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto rounded-[26px] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Sources</p>
      <div className="mt-4 space-y-2">
        {studioSources.map((src) => (
          <Link
            key={src.id}
            href={src.path}
            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition ${
              activeSource === src.id ? "border-orange-400/60 bg-orange-500/20 text-white font-semibold" : "border-transparent bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span>{src.name}</span>
            <span className="text-xs text-slate-500">→</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-[22px] border border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-950 p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-orange-200">Tips Motion Design</p>
        <p className="mt-2 text-xs text-slate-300">
          Superposez du texte, des modèles 3D, des masques et des filtres After Effects pour vos créations.
        </p>
      </div>
    </aside>
  );
}
