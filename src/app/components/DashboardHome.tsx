"use client";

import { useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { DashboardShopifyChart } from "./DashboardShopifyChart";
import {
    Users,
    Mail,
    Reply,
    UserCheck,
    ArrowRight,
    Inbox,
} from "lucide-react";
import {
    countContacts,
    countDraftsInLastDays,
    countDraftsByType,
    loadDrafts,
    getDraftActivityLast7Days,
    loadHomePrompt,
    saveHomePrompt,
    type Draft,
    type DraftType,
} from "@/lib/scribeLocalStorage";

type Props = {
    onGoTo: (id: string) => void;
};

/** Fallback vor dem ersten Client-Render */
export const DASHBOARD_STATS_PLACEHOLDER = {
    kontakte: 0,
    outreachDieseWoche: 0,
    followUpsOffen: 0,
    kundenAusEmail: 0,
} as const;

const typeLabel: Record<Draft["type"], string> = {
    "kalt-email": "Kalt-Email",
    "follow-up": "Follow-up",
    antwort: "Antwort",
};

export function DashboardHome({ onGoTo }: Props) {
    const [kpi, setKpi] = useState<{
        kontakte: number;
        outreachDieseWoche: number;
        followUpsOffen: number;
        kundenAusEmail: number;
    }>({
        kontakte: DASHBOARD_STATS_PLACEHOLDER.kontakte,
        outreachDieseWoche: DASHBOARD_STATS_PLACEHOLDER.outreachDieseWoche,
        followUpsOffen: DASHBOARD_STATS_PLACEHOLDER.followUpsOffen,
        kundenAusEmail: DASHBOARD_STATS_PLACEHOLDER.kundenAusEmail,
    });
    const [recent, setRecent] = useState<Draft[]>([]);
    const [draftsByType, setDraftsByType] = useState<Record<DraftType, number>>({
        "kalt-email": 0,
        "follow-up": 0,
        antwort: 0,
    });
    const [activitySeries, setActivitySeries] = useState<
        ReturnType<typeof getDraftActivityLast7Days>
    >([]);
    const [homePrompt, setHomePrompt] = useState("");
    const [homePromptReady, setHomePromptReady] = useState(false);

    useEffect(() => {
        setHomePrompt(loadHomePrompt());
        setHomePromptReady(true);
    }, []);

    useEffect(() => {
        if (!homePromptReady) return;
        saveHomePrompt(homePrompt);
    }, [homePrompt, homePromptReady]);

    useEffect(() => {
        queueMicrotask(() => {
            try {
                setKpi({
                    kontakte: countContacts(),
                    outreachDieseWoche: countDraftsInLastDays("kalt-email", 7),
                    followUpsOffen: countDraftsByType("follow-up"),
                    kundenAusEmail: DASHBOARD_STATS_PLACEHOLDER.kundenAusEmail,
                });
                setDraftsByType({
                    "kalt-email": countDraftsByType("kalt-email"),
                    "follow-up": countDraftsByType("follow-up"),
                    antwort: countDraftsByType("antwort"),
                });
                setActivitySeries(getDraftActivityLast7Days());
                const sorted = [...loadDrafts()].sort(
                    (a, b) =>
                        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
                setRecent(sorted.slice(0, 5));
            } catch (e) {
                console.error("DashboardHome KPI laden", e);
            }
        });
    }, []);

    const stats = [
      {
        id: "kontakte",
        label: "Kontakte",
        value: kpi.kontakte,
        hint: "In deiner Liste",
        icon: Users,
        onClick: () => onGoTo("kontakte"),
      },
      {
        id: "outreach",
        label: "Outreach",
        value: kpi.outreachDieseWoche,
        hint: "Kalt-Email (7 Tage)",
        icon: Mail,
        onClick: () => onGoTo("kalt-email"),
      },
      {
        id: "followups",
        label: "Follow-ups",
        value: kpi.followUpsOffen,
        hint: "Gespeichert",
        icon: Reply,
        onClick: () => onGoTo("follow-up"),
      },
      {
        id: "kunden",
        label: "Kunden",
        value: kpi.kundenAusEmail,
        hint: "Noch Platzhalter",
        icon: UserCheck,
        onClick: () => onGoTo("kontakte"),
      },
    ] as const;

    const draftStripRows: { type: DraftType; label: string; onClick: () => void }[] = [
      { type: "kalt-email", label: "Kalt-Email", onClick: () => onGoTo("kalt-email") },
      { type: "follow-up", label: "Follow-up", onClick: () => onGoTo("follow-up") },
      { type: "antwort", label: "Antwort", onClick: () => onGoTo("antwort") },
    ];
    const maxDraftType = Math.max(
      1,
      draftsByType["kalt-email"],
      draftsByType["follow-up"],
      draftsByType.antwort
    );

    return (
        <div className="space-y-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section aria-labelledby="home-start-heading" className="space-y-6">
              <div>
                <h2
                  id="home-start-heading"
                  className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground"
                >
                  Was möchtest du heute erledigen?
                </h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                     Kurz beschreiben - später kann die KI hier andocken.
                </p>
              </div>
              <Card className="p-4 sm:p-6 border-border/80 shadow-sm">
                <label htmlFor="home-prompt" className="sr-only">
                  Aufgabe
                </label>
                <textarea
                  id="home-prompt"
                  rows={4}
                  placeholder="z.B. Follow-up für eine Firma XY, höflich und kurz..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[7rem]"
                />
              </Card>
            </section>
          </div>

          <section aria-labelledby="home-start-heading" className="space-y-6">
            <div>
              <h2 id="home-start-heading" 
                  className="text-lg sm:text-2xl font-semibold tracking-tight text-foreground"
                >
                  Was möchtest du heute erledigen?
              </h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                  Kurz beschreiben - später kann die KI hier andocken.
              </p>
            </div>
            <Card className="p-4 sm:p-6 border-border/80 shadow-sm">
                <label htmlFor="home-prompt" className="sr-only">
                    Aufgabe
                </label>
                <textarea
                  id="home-prompt"
                  rows={4}
                  value={homePrompt}
                  onChange={(e) => setHomePrompt(e.target.value)}
                  placeholder="z.B. Follow-up für eine Firma XY, höflich und kurz ..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[7rem]"
                />
            </Card>
          </section>
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-1">
                  Übersicht
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                </p>
            </div>

            <section aria-labelledby="kpi-heading" className="space-y-6">
                <h2 id="kpi-heading" className="text-lg font-semibold">
                  Kennzahlen
                </h2>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={s.onClick}
                        className="text-left rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-medium text-muted-foreground">
                            {s.label}
                          </span>
                          <span className="rounded-md bg-secondary p-1.5 text-foreground">
                            <Icon className="w-4 h-4" aria-hidden />
                          </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                          {s.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 leading-snug">{s.hint}</p>
                      </button>
                    );
                  })}
                </div>

                <DashboardShopifyChart series={activitySeries} />

                <Card className="p-5 sm:p-6 border-border/80 shadow-sm">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
                    Aufteilung nach Typ
                  </h3>
                  <div className="space-y-3.5" role="list">
                    {draftStripRows.map((row) => {
                      const n = draftsByType[row.type];
                      const widthPct =
                        n === 0 ? 0 : Math.max(5, (n / maxDraftType) * 100);
                      return (
                        <button
                          key={row.type}
                          type="button"
                          onClick={row.onClick}
                          className="block w-full text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          role="listitem"
                        >
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <span className="text-sm font-medium text-foreground">{row.label}</span>
                            <span className="text-sm tabular-nums text-muted-foreground">{n}</span>
                          </div>
                          <div className="h-2 w-full rounded-sm bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-sm bg-foreground/25 transition-[width] duration-300 ease-out"
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
            </section>

            <section aria-labelledby="quick-heading">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 id="quick-heading" className="text-lg font-semibold">
                  Schnellaktionen
                </h2>
              </div>
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <Card
                  className="cursor-pointer transition-all hover:border-primary hover:shadow-md active:scale-[0.99]"
                  onClick={() => onGoTo("kalt-email")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onGoTo("kalt-email");
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Mail className="w-8 h-8 text-primary shrink-0" aria-hidden />
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" aria-hidden />
                  </div>
                  <h3 className="mt-3 mb-2 font-semibold">Neue Kalt-Email</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Outreach-E-Mail für potenzielle Kunden.
                  </p>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:border-primary hover:shadow-md active:scale-[0.99]"
                  onClick={() => onGoTo("follow-up")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onGoTo("follow-up");
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Reply className="w-8 h-8 text-primary shrink-0" aria-hidden />
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" aria-hidden />
                  </div>
                  <h3 className="mt-3 mb-2 font-semibold">Follow-up schreiben</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nachfass-E-Mail nach vorherigem Kontakt.
                  </p>
                </Card>
              </div>
            </section>

            <section aria-labelledby="recent-heading">
              <h2 id="recent-heading" className="text-lg font-semibold mb-2">
                Letzte Aktivitäten
              </h2>
              {recent.length === 0 ? (
                <Card className="border-dashed bg-secondary/20">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
                    <div className="rounded-lg bg-card p-3 border border-border shrink-0 self-start">
                      <Inbox className="w-6 h-6 text-muted-foreground" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">Noch keine Entwürfe</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        Speichere eine Kalt-Email, ein Follow-up oder eine Antwort – dann erscheint es hier.
                      </p>
                    </div>
                    <Button type="button" variant="secondary" className="shrink-0 w-full sm:w-auto" onClick={() => onGoTo("verlauf")}>
                      Zum Verlauf
                    </Button>
                  </div>
                </Card>
              ) : (
                <ul className="space-y-2">
                  {recent.map((d) => (
                    <li key={d.id}>
                      <Card className="py-3 px-4 sm:py-4 sm:px-5">
                        <div className="flex flex-wrap items-center gap-2 justify-between">
                          <span className="text-xs font-medium uppercase text-accent-foreground bg-accent px-2 py-0.5 rounded">
                            {typeLabel[d.type]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(d.updatedAt).toLocaleString("de-DE", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                        <p className="font-medium text-foreground mt-2 truncate">{d.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{d.body}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
              {recent.length > 0 && (
                <div className="mt-3">
                  <Button type="button" variant="secondary" onClick={() => onGoTo("verlauf")}>
                    Alle im Verlauf
                  </Button>
                </div>
              )}
            </section>
        </div>
    );
}