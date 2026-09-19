import Link from "next/link";
import { layers, stages } from "@/content/map";
import type { Coords } from "@/content/types";

/** Compact "where this fits" widget: the 7-layer stack plus lifecycle stages. */
export function MiniMap({ coords, href = "/map" }: { coords: Coords; href?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Where this fits</p>
        <Link href={href} className="text-[11.5px] font-medium text-accent hover:underline">
          Open map →
        </Link>
      </div>
      <ul className="mt-3 space-y-1">
        {layers.map((l) => {
          const on = coords.layers.includes(l.id);
          return (
            <li key={l.id} className="flex items-center gap-2">
              <span
                className="h-1.5 rounded-full transition-all"
                style={{ width: on ? 26 : 10, background: on ? l.color : "var(--line)" }}
              />
              <span className={`text-[12px] ${on ? "font-semibold text-ink" : "text-faint"}`}>{l.label}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Lifecycle</p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {stages.map((s) => {
          const on = coords.stages.includes(s.id);
          return (
            <span
              key={s.id}
              className={`rounded-md px-1.5 py-0.5 text-[11px] ${on ? "bg-accent-soft font-semibold text-accent" : "text-faint"}`}
            >
              {s.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
