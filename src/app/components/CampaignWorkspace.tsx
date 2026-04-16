"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "./Button";

type Props = {
  children: ReactNode;
};

/**
 * Layout A: Mitte = Outreach-Artefakt (children), rechts = Agent/Chat-Platzhalter.
 * Desktop: zwei Spalten, mobil: Chat ein-/ausblendbar.
 */
export function CampaignWorkspace({ children }: Props) {
  const [mobileChatOpen, setMobileChatOpen] = useState(true);

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 w-full gap-0">
      <section
        className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain py-4 md:py-6 pr-2 md:pr-6"
        aria-label="Outreach-Paket"
      >
        {children}
      </section>

      <div className="flex md:hidden shrink-0 border-t border-border bg-card/40 px-2 py-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full justify-center gap-2"
          onClick={() => setMobileChatOpen((open) => !open)}
          aria-expanded={mobileChatOpen}
        >
          <MessageSquare className="w-4 h-4 shrink-0" aria-hidden />
          {mobileChatOpen ? "Agent ausblenden" : "Agent / Chat anzeigen"}
        </Button>
      </div>

      <aside
        className={`flex flex-col min-h-0 border-border bg-muted/20 md:bg-card/30 md:w-[min(420px,40vw)] md:shrink-0 md:border-l max-md:border-t overflow-hidden ${
          !mobileChatOpen ? "max-md:hidden" : "max-md:max-h-[min(50vh,420px)]"
        }`}
        aria-label="Agent / Chat"
      >
        <div className="shrink-0 px-4 py-3 border-b border-border/80">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary shrink-0" aria-hidden />
            Agent
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Rueckfragen und Feinschliff - Anbindung folgt.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
          <div className="rounded-lg border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground/90 mb-2">Platzhalter</p>
            <p>
              Hier kommt spaeter der Dialog mit dem Agenten (z. B. gefuehrte Fragen,
              Feinschliff, Variationen).
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}