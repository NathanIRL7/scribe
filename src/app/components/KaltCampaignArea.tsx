"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { CampaignWizard } from "./CampaignWizard";
import { KaltEmailSection } from "./sections/KaltEmailSection";
import { Button } from "./Button";
import { Card } from "./Card";
import { deleteCampaign, laodCampaigns, type Campaign } from "@/lib/scribeLocalStorage";

type Tab = "guided" | "classic";

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }   catch {
        return iso;
    }
}

export function KaltCampaignArea() {
    const [tab, setTab] = useState<Tab>("guided");
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    const refresh = useCallback (( => {
        setCampaigns(loadCampaigns());
    }, []);

    useInsertionEffect(( => {
        refresh();
    }, [refresh]);

    const handleDelete = useCallback(id: string) => {
        deleteCampaign(id);
        refresh();
    };

    return (
        <div className="max-w-3xl space-y-8 w-full">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Kalt-Email</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Geführte Kampagne (Paket aus Vorlagen) oder klassicher Freitext-Entwurf - lokal gespeichert:
                </p>
            </div>

            <div
              className="flex rounded-lg border border-border p-1 bg-muted/30 gap-1"
              role="tablist"
              aria-label="Kalt-Email Modus"
            >
                <button 
                  type="button"
                  role="tab"
                  aria-selected={tab === "guided"}
                  className={`flex-1 rounded-md py-3 py-2 text-sm font-medium transition-colors ${
                    tab === "guided" 
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setTab("guided")}
                >
                    Geführte Kampagne
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "classic"}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    tab === "classic"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setTab("classic")}
                >
                    Klassischer Entwurf
                </button>
            </div>

            {tab === "guided" && (
                <>
                  {campaigns.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Gespeicherte Kampagnen </h3>
                        <ul className="space-y-2">
                            {campaigns.map((c) => (
                                <li key={c.id}>
                                    <Card padding="sm" className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {formatDate(c.updatedAt)} · {c.followUpCount} Follow-up 
                                                {c.followUpCount === 1 ? "" : "s"} · {c.tone}
                                            </p>
                                        </div>
                                        <Button 
                                          type="button"
                                          variant="secondary"
                                          size="sm"
                                          className="shrink-0 text-destructive hover:text-destructive"
                                          onClick={() => handleDelete(c.id)}
                                          aria-label="Kampagne löschen"
                                        >
                                            <Trash2 className="w-4 h-4" aria-hidden />
                                        </Button>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                  )}
                  <CampaignWizard onSaved={refresh} />
                </>
            )}
            {tab === "classic" && <KaltEmailSection hideHeading />}
        </div>
    );
}