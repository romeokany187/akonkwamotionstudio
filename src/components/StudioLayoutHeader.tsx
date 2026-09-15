"use client";

import Link from "next/link";

const studioSources = [
  { id: "image", name: "Image", path: "/studio/image" },
  { id: "video", name: "Video", path: "/studio/video" },
  { id: "slideshow", name: "Slideshow", path: "/studio/slideshow" },
  { id: "3d", name: "3D Composite", path: "/studio/3d" },
  { id: "text", name: "Text", path: "/studio/text" },
  { id: "shape", name: "Shape", path: "/studio/shape" },
  { id: "emoji", name: "Emoji", path: "/studio/emoji" },
];

export default function StudioLayoutHeader({ activeSource }: { activeSource: string }) {
  return (
    <header className="sticky top-0 z-50 rounded-[26px] border border-white/10 bg-slate-950/85 px-5 py-4 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-600 text-lg font-black text-white shadow-[0_10px_25px_rgba(244,63,94,0.45)]">
            M
          </Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-orange-300">AKONKWA</p>
            <h1 className="text-base font-semibold text-white">MotionForge</h1>
          </div>
        </div>

        {/* Global Navigation */}
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/studio/image" className={activeSource ? "text-orange-400 font-semibold" : "hover:text-white"}>Studio</Link>
          <Link href="/library" className="hover:text-white">Library</Link>
          <Link href="/templates" className="hover:text-white">Templates</Link>
          <Link href="/export" className="hover:text-white">Export</Link>
        </nav>

        {/* Mode Quick Selector Pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1">
          {studioSources.map((src) => (
            <Link
              key={src.id}
              href={src.path}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                activeSource === src.id ? "bg-orange-400 text-slate-950 font-bold shadow-md" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {src.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
