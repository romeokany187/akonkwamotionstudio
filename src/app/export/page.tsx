import Link from "next/link";

const presets = [
  { label: "4K UHD", value: "3840×2160" },
  { label: "1080p", value: "1920×1080" },
  { label: "Square", value: "1080×1080" },
  { label: "Story", value: "1080×1920" },
];

export default function ExportPage() {
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
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">export</p>
                <h1 className="text-base font-semibold text-white">Render & delivery</h1>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <Link href="/studio" className="hover:text-white">Studio</Link>
              <Link href="/library" className="hover:text-white">Library</Link>
              <Link href="/templates" className="hover:text-white">Templates</Link>
              <Link href="/export" className="text-white">Export</Link>
            </nav>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Settings</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white">Export configuration</h2>

            <div className="mt-6 space-y-5">
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Format</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['MP4', 'MOV', 'GIF', 'PNG Sequence'].map((format) => (
                    <button key={format} type="button" className="rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-200">{format}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Codec</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['H.264', 'ProRes', 'HEVC', 'AV1'].map((codec) => (
                    <button key={codec} type="button" className="rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-200">{codec}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Frame rate</p>
                <input type="range" min={12} max={60} defaultValue={24} className="mt-4 w-full accent-orange-400" />
                <p className="mt-2 text-sm text-slate-300">24 FPS</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Render summary</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white">Ready for delivery</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {presets.map((preset) => (
                <div key={preset.label} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{preset.label}</p>
                  <p className="mt-3 text-xl font-semibold text-white">{preset.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Estimated render</p>
              <p className="mt-2 text-2xl font-semibold text-white">00:12:24</p>
              <p className="mt-2 text-sm text-emerald-100">Optimized for studio workflow and project delivery.</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">Export now</button>
              <button type="button" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200">Download preview</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
