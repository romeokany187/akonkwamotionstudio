import Link from "next/link";

const navItems = [
  { href: "/studio", label: "Studio" },
  { href: "/library", label: "Library" },
  { href: "/templates", label: "Templates" },
  { href: "/export", label: "Export" },
];

const featureCards = [
  { title: "From image", detail: "Animate a photo, a portrait, a poster or a brand visual in one click.", accent: "from-orange-500 via-rose-500 to-fuchsia-500" },
  { title: "From video", detail: "Create transitions, motion overlays and cinematic loops from footage.", accent: "from-cyan-500 via-blue-500 to-indigo-500" },
  { title: "From shapes", detail: "Build loops, particles, logos and abstract patterns with custom timing.", accent: "from-emerald-500 via-teal-500 to-cyan-500" },
  { title: "From text", detail: "Generate kinetic typography and animated titles for reels and campaigns.", accent: "from-pink-500 via-rose-500 to-red-500" },
  { title: "From emoji", detail: "Add expressive motion objects for social content and short-form edits.", accent: "from-yellow-500 via-amber-500 to-orange-500" },
  { title: "From 3D", detail: "Add depth, camera motion and morphing forms directly in the workspace.", accent: "from-violet-500 via-purple-500 to-indigo-500" },
];

const steps = [
  { title: "Import", text: "Add a photo, video, shape, line, emoji or text element." },
  { title: "Animate", text: "Tap into presets, timeline controls, curves and motion layers." },
  { title: "Export", text: "Render in MP4, GIF, PNG sequence or production-ready project files." },
];

const stats = [
  { label: "Active creators", value: "18k+" },
  { label: "Motion presets", value: "4.2k" },
  { label: "Average render", value: "12 sec" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="mx-auto max-w-[1500px] px-4 py-4 md:px-6 lg:px-8">
        <header className="rounded-[28px] border border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-orange-400 via-rose-500 to-fuchsia-600 text-lg font-black text-white shadow-[0_10px_30px_rgba(244,63,94,0.45)]">
                M
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-300">AKONKWA</p>
                <h1 className="text-base font-semibold text-white">MotionForge</h1>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/studio" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-slate-200 transition hover:bg-white/10">
                Open studio
              </Link>
              <Link href="/templates" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                Start free
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.22),transparent_25%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_30%),linear-gradient(180deg,#0b1120,#0a0f1e_50%,#050816)] px-5 py-6 md:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                Creator motion platform
              </div>

              <h2 className="mt-6 max-w-xl text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-white">
                Build motion from image, video, text, shapes and 3D.
              </h2>

              <p className="mt-5 max-w-xl text-base text-slate-300 md:text-lg">
                A complete creative workspace for designers, photographers and motion creators who need to generate animations from scratch, from a reference, or from any asset in their workflow.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/studio" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                  Launch editor
                </Link>
                <Link href="/library" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200">
                  Explore library
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <span>Multi-source animation</span>
                <span>Professional exports</span>
                <span>Realtime preview</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-14 top-10 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="absolute -right-10 bottom-8 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.8)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Live project</span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-emerald-300">Ready</span>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_32%),linear-gradient(135deg,#111827,#0f172a)] p-4">
                  <div className="mb-5 h-52 rounded-[22px] bg-linear-to-br from-orange-500 via-rose-500 to-fuchsia-500 p-4">
                    <div className="flex h-full items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Motion layer</p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">Shape pulse</h3>
                      </div>
                      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-black/10 text-lg text-white">◇</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm text-slate-200">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">What it does</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white">From any creative source to export-ready motion</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card) => (
              <div key={card.title} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className={`mb-4 h-24 rounded-[18px] bg-linear-to-br ${card.accent}`} />
                <p className="text-xl font-semibold text-white">{card.title}</p>
                <p className="mt-2 text-sm text-slate-300">{card.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Workflow</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white">A professional pipeline in 3 steps</h3>

            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm font-semibold text-orange-200">0{index + 1}</span>
                    <p className="text-lg font-medium text-white">{step.title}</p>
                  </div>
                  <p className="text-sm text-slate-300">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Platform modules</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white">Everything needed for a serious motion studio</h3>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { name: "Motion Studio", text: "Timeline, layers, curves, easing, camera and transform controls." },
                { name: "Asset Library", text: "Images, videos, textures, shapes, fonts and emoji collections." },
                { name: "Preset Engine", text: "Instant motion templates for social, cinematic and commercial work." },
                { name: "Export Hub", text: "Render in a professional pipeline and download final files." },
              ].map((module) => (
                <div key={module.name} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-lg font-semibold text-white">{module.name}</p>
                  <p className="mt-2 text-sm text-slate-300">{module.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 mb-6 overflow-hidden rounded-[30px] border border-white/10 bg-linear-to-r from-orange-500/15 via-violet-500/10 to-cyan-500/10 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-orange-200">Ready to create</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white">Enter the studio and generate your first animation.</h3>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link href="/studio" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                Open studio
              </Link>
              <Link href="/templates" className="rounded-full border border-white/10 bg-slate-950/50 px-5 py-3 text-sm font-semibold text-white">
                Browse templates
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
