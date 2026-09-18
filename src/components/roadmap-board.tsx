"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Check,
  ChevronDown,
  FlaskConical,
  Lightbulb,
  Rocket,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  ROADMAP,
  STAGE_META,
  STAGE_ORDER,
  roadmapTeams,
  type RoadmapItem,
  type Stage,
} from "@/lib/roadmap";

const STAGE_ICON: Record<Stage, LucideIcon> = {
  concept: Lightbulb,
  alpha: FlaskConical,
  beta: Rocket,
};

/**
 * The public roadmap board: stage columns (concept / alpha / beta) with
 * client-side search and a team filter. Cards open a detail dialog. Reads
 * straight from the ROADMAP data, so keeping it current is editing that array.
 */
export function RoadmapBoard() {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [selected, setSelected] = useState<RoadmapItem | null>(null);
  const teams = useMemo(() => roadmapTeams(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROADMAP.filter((item) => {
      if (team !== "all" && item.team !== team) return false;
      if (!q) return true;
      return `${item.title} ${item.team}`.toLowerCase().includes(q);
    });
  }, [query, team]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the roadmap…"
            aria-label="Search the roadmap"
            className="h-10 w-full rounded-lg border border-hairline bg-panel pl-9 pr-3 text-sm outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-brand"
          />
        </div>
        <div className="relative">
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            aria-label="Filter by team"
            className="h-10 w-full appearance-none rounded-lg border border-hairline bg-panel pl-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-44"
          >
            <option value="all">All teams</option>
            {teams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            strokeWidth={2}
            aria-hidden
          />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-subtle sm:ml-2">
          {filtered.length} of {ROADMAP.length}
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {STAGE_ORDER.map((stage) => {
          const items = filtered.filter((i) => i.stage === stage);
          const meta = STAGE_META[stage];
          const Icon = STAGE_ICON[stage];
          return (
            <section
              key={stage}
              aria-label={meta.label}
              className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-panel/40"
            >
              <div className="border-b border-hairline p-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-brand" strokeWidth={2} aria-hidden />
                  <h2 className="text-sm font-semibold tracking-tight">{meta.label}</h2>
                  <span className="font-mono text-[11px] tabular-nums text-subtle">
                    {items.length}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meta.blurb}</p>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                {items.length ? (
                  items.map((item) => (
                    <Card key={item.title} item={item} onOpen={() => setSelected(item)} />
                  ))
                ) : (
                  <p className="px-2 py-8 text-center text-xs text-subtle">Nothing here yet.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <Link
        href="/changelog"
        className="group mt-4 flex items-center justify-between gap-4 rounded-xl border border-dashed border-hairline px-5 py-4 transition-colors hover:border-mark"
      >
        <span className="text-sm">
          <span className="font-medium">What&rsquo;s just shipped?</span>{" "}
          <span className="text-muted-foreground">
            Anything that reaches general availability leaves the board for the changelog.
          </span>
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
          strokeWidth={2}
          aria-hidden
        />
      </Link>

      <ItemDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Card({ item, onOpen }: { item: RoadmapItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-lg border border-hairline bg-card p-3.5 text-left outline-none transition-colors hover:border-mark focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug tracking-tight">{item.title}</h3>
        {item.tag ? (
          <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-brand">
            {item.tag}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 text-xs text-subtle">{item.team}</p>
    </button>
  );
}

function ItemDialog({ item, onClose }: { item: RoadmapItem | null; onClose: () => void }) {
  const stage = item ? STAGE_META[item.stage] : null;
  const StageIcon = item ? STAGE_ICON[item.stage] : null;

  return (
    <Dialog.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-hairline bg-popover p-6 shadow-xl shadow-black/20 focus:outline-none">
          {item && stage && StageIcon ? (
            <>
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand">
                  <StageIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  {stage.label}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-subtle">
                  {item.team}
                </span>
                {item.tag ? (
                  <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-subtle">
                    {item.tag}
                  </span>
                ) : null}
              </div>

              <Dialog.Title className="mt-4 text-xl font-semibold tracking-tight">
                {item.title}
              </Dialog.Title>
              {item.summary ? (
                <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </Dialog.Description>
              ) : null}

              {item.includes?.length ? (
                <ul className="mt-5 flex flex-col gap-2.5 border-t border-hairline pt-5">
                  {item.includes.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <Dialog.Close
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md text-subtle outline-none transition-colors hover:bg-panel hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </Dialog.Close>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
