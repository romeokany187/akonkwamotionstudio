"use client";

type CreativeFxPanelProps = {
  activeEffects: string[];
  intensity: number;
  onToggle: (id: string) => void;
  onIntensityChange: (value: number) => void;
  accentClass?: string;
};

export const creativeEffects = [
  { id: "hologram", label: "Hologram", description: "Scanlines, flicker and cyan projection glow" },
  { id: "glitch", label: "Digital Glitch", description: "Signal tears, RGB displacement and noise" },
  { id: "bokeh", label: "Bokeh Dust", description: "Floating luminous particles" },
  { id: "lensflare", label: "Lens Flare", description: "Animated optical flare" },
  { id: "bluestreak", label: "Blue Streak", description: "Directional light streak" },
  { id: "kaleidoscope", label: "Kaleidoscope", description: "Mirrored geometric echoes" },
  { id: "promist", label: "Pro Mist", description: "Soft diffusion around highlights" },
  { id: "liquid", label: "Liquid Distortion", description: "Procedural wave displacement" },
];

export default function CreativeFxPanel({ activeEffects, intensity, onToggle, onIntensityChange, accentClass = "accent-cyan-400" }: CreativeFxPanelProps) {
  return (
    <div className="rounded-[20px] border border-cyan-400/20 bg-cyan-500/5 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">FX Library</p>
          <p className="mt-1 text-[11px] text-slate-400">Plugin effects for this creation</p>
        </div>
        <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-[10px] text-cyan-200">{activeEffects.length} active</span>
      </div>
      <div className="space-y-2">
        {creativeEffects.map((effect) => {
          const active = activeEffects.includes(effect.id);
          return (
            <button key={effect.id} type="button" onClick={() => onToggle(effect.id)} className={`w-full rounded-xl border p-2.5 text-left transition ${active ? "border-cyan-400/60 bg-cyan-400/15" : "border-white/10 bg-slate-900/60 hover:border-white/25"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{effect.label}</span>
                <span className={`h-2 w-2 rounded-full ${active ? "bg-cyan-300 shadow-[0_0_10px_#67e8f9]" : "bg-slate-600"}`} />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">{effect.description}</p>
            </button>
          );
        })}
      </div>
      <div>
        <div className="flex justify-between text-xs text-slate-300"><span>FX intensity</span><span>{intensity}%</span></div>
        <input type="range" min={10} max={100} value={intensity} onChange={(event) => onIntensityChange(Number(event.target.value))} className={`w-full ${accentClass}`} />
      </div>
    </div>
  );
}
