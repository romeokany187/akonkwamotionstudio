import Link from "next/link";

const assets = [
  { name: "Portrait Drift", type: "Image", tag: "Photo motion", accent: "from-orange-500 via-rose-500 to-pink-500" },
  { name: "Cinematic Loop", type: "Video", tag: "Loop pack", accent: "from-cyan-500 via-blue-500 to-indigo-500" },
  { name: "Brand Pulse", type: "Text", tag: "Kinetic title", accent: "from-violet-500 via-purple-500 to-fuchsia-500" },
  { name: "Line Echo", type: "Shape", tag: "Line animation", accent: "from-emerald-500 via-teal-500 to-cyan-500" },
  { name: "Emoji Pop", type: "Emoji", tag: "Social emote", accent: "from-yellow-500 via-amber-500 to-orange-500" },
  { name: "Scene Depth", type: "3D", tag: "Volume render", accent: "from-slate-500 via-zinc-500 to-indigo-500" },
];

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="mx-auto max-w-[1500px] px-4 py-4 md:px-6 lg:px-8">
        <header className="rounded-[26px] border border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-orange-400 via-rose-500 to-fuchsia-600 text-lg font-black text-white shadow-[0_10px_25px_rgba(244,63,94,0.45)]">
                M
              </Link>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">library</p>
                <h1 className="text-base font-semibold text-white">Asset library</h1>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <Link href="/studio" className="hover:text-white">Studio</Link>
              <Link href="/library" className="text-white">Library</Link>
              <Link href="/templates" className="hover:text-white">Templates</Link>
              <Link href="/export" className="hover:text-white">Export</Link>
            </nav>
          </div>
        </header>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-orange-200">Creative assets</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white">Build from any source material</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Image', 'Video', 'Text', 'Shape', 'Emoji', '3D'].map((filter) => (
                <button key={filter} type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <div key={asset.name} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className={`mb-4 h-32 rounded-[18px] bg-linear-to-br ${asset.accent}`} />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold text-white">{asset.name}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">{asset.type}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-slate-900 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-slate-300">{asset.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
