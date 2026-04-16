"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Loader2, Search } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Input } from "./Input";
import {
  buildCampaignPackage,
  upsertCampaign,
  type Campaign,
  type CampaignTone,
} from "@/lib/scribeLocalStorage";
import type { DeepResearchSnapshot } from "@/lib/deepResearch";
import { fetchDeepResearch } from "@/lib/scribeDeepResearchApi";

const textareaClass =
  "w-full min-h-[220px] px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background resize-y";

const STEPS = [
  { title: "Zielgruppe", hint: "Wen willst du ansprechen? (Branche, Rolle, Interesse)" },
  { title: "Angebot", hint: "Was bietest du konkret an?" },
  { title: "Stil", hint: "Wie soll die Mail klingen?" },
  { title: "Tabus", hint: "Was soll vermieden werden? (optional)" },
  { title: "Follow-ups", hint: "Wie oft soll nachgefragt werden? (1-3)" },
] as const;

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [ok, setOk] = useState(false);
  const copy = useCallback(() => {
    void navigator.clipboard.writeText(text).then(() => {
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    });
  }, [text]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <Button type="button" variant="secondary" size="sm" onClick={copy} className="shrink-0 gap-1">
          {ok ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-3.5 h-3.5" aria-hidden />}
          {ok ? "Kopiert" : "Kopieren"}
        </Button>
      </div>
      <pre className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm text-foreground">
        {text}
      </pre>
    </div>
  );
}

export function CampaignWizard({ onSaved }: { onSaved?: () => void }) {
  const [step, setStep] = useState(0);
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [tone, setTone] = useState<CampaignTone>("neutral");
  const [taboos, setTaboos] = useState("");
  const [followUpCount, setFollowUpCount] = useState<1 | 2 | 3>(1);
  const [done, setDone] = useState<Campaign | null>(null);
  const [error, setError] = useState("");
  const [researchUrl, setResearchUrl] = useState("");
  const [research, setResearch] = useState<DeepResearchSnapshot | null>(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState("");

  const reset = () => {
    setStep(0);
    setAudience("");
    setOffer("");
    setTone("neutral");
    setTaboos("");
    setFollowUpCount(1);
    setDone(null);
    setError("");
    setResearchUrl("");
    setResearch(null);
    setResearchError("");
  };

  const runDeepResearch = async () => {
    setResearchError("");
    const u = researchUrl.trim();
    if (!u) {
      setResearchError("Bitte eine URL eintragen (https://...).");
      return;
    }

    setResearchLoading(true);
    setResearch(null);
    try {
      const result = await fetchDeepResearch(u);
      if (!result.ok) {
        setResearchError(result.error);
        return;
      }
      setResearch(result.research);
    } finally {
      setResearchLoading(false);
    }
  };

  const finish = () => {
    setError("");
    try {
      const pkg = buildCampaignPackage({
        audience,
        offer,
        tone,
        taboos,
        followUpCount,
        research: research ?? undefined,
      });

      const now = new Date().toISOString();
      const title =
        offer.trim().slice(0, 72) || audience.trim().slice(0, 72) || "Kampagne";

      const campaign: Campaign = {
        id: crypto.randomUUID(),
        title,
        status: "draft",
        audience: audience.trim(),
        offer: offer.trim(),
        tone,
        taboos: taboos.trim(),
        followUpCount,
        package: pkg,
        research: research ?? undefined,
        createdAt: now,
        updatedAt: now,
      };

      upsertCampaign(campaign);
      setDone(campaign);
      onSaved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    }
  };

  if (done) {
    const { package: p } = done;
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Paket erstellt</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Lokal gespeichert - Texte unten kopieren und im Mail-Programm nutzen.
          </p>
        </div>
        <Card className="space-y-4">
          <CopyBlock label="Betreff (Erstmail)" text={p.erstmailBetreff} />
          <CopyBlock label="Erstmail" text={p.erstmailBody} />
          {done.followUpCount >= 1 && <CopyBlock label="Follow-up 1" text={p.followUp1} />}
          {done.followUpCount >= 2 && <CopyBlock label="Follow-up 2" text={p.followUp2} />}
          {done.followUpCount >= 3 && <CopyBlock label="Follow-up 3" text={p.followUp3} />}
          <CopyBlock label="Checkliste" text={p.checklist} />
        </Card>
        <Button type="button" onClick={reset}>
          Neue Kampagne starten
        </Button>
      </div>
    );
  }

  const meta = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="border-primary/20 bg-primary/5">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Search className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Deep Research Check</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Vor der Mail: Website scannen - News-Haken, Branchenprobleme, Ansprechpartner.
                Fliesst automatisch in Erstmail und Betreff ein.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Input
              label="Website der Zielfirma (URL)"
              type="url"
              placeholder="https://www.beispiel.de"
              value={researchUrl}
              onChange={(e) => {
                setResearchUrl(e.target.value);
                setResearchError("");
              }}
              autoComplete="off"
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="shrink-0 gap-2"
            disabled={researchLoading}
            onClick={() => void runDeepResearch()}
          >
            {researchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            ) : (
              <Search className="w-4 h-4" aria-hidden />
            )}
            Recherche starten
          </Button>
        </div>

        {researchError && (
          <p className="text-sm text-destructive" role="alert">
            {researchError}
          </p>
        )}

        {research && (
          <div className="rounded-md border border-border bg-background/80 p-3 text-sm space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Ergebnis ({research.source === "llm" ? "LLM + Seite" : "Heuristik (ohne API-Key)"})
            </p>
            <p>
              <span className="font-medium text-foreground">Hauptangebot: </span>
              {research.mainOffer}
            </p>
            <p>
              <span className="font-medium text-foreground">News / Einstieg: </span>
              {research.newsHook}
            </p>
            <p>
              <span className="font-medium text-foreground">Typische Probleme (Branche): </span>
              {research.industryProblems}
            </p>
            <p>
              <span className="font-medium text-foreground">Ansprechpartner: </span>
              {research.contactPerson}
            </p>
            <Button type="button" variant="secondary" size="sm" onClick={() => setResearch(null)}>
              Recherche fuer diese Kampagne entfernen
            </Button>
          </div>
        )}
      </Card>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Schritt {step + 1} von {STEPS.length}
        </p>
        <h2 className="text-xl font-semibold tracking-tight mt-1">{meta.title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{meta.hint}</p>
      </div>

      <Card>
        <div className="space-y-4">
          {step === 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Zielgruppe</label>
              <textarea
                className={textareaClass}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="z. B. inhabergefuehrte Shops mit Shopify ..."
              />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Angebot</label>
              <textarea
                className={textareaClass}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="z. B. Conversion-Optimierung der Produktseiten ..."
              />
            </div>
          )}

          {step === 2 && (
            <fieldset className="space-y-3">
              <legend className="sr-only">Ton</legend>
              {(
                [
                  { v: "formell", l: "Formell (Sie, klassisch)" },
                  { v: "neutral", l: "Neutral (Sie, freundlich)" },
                  { v: "locker", l: "Locker (Du, freundlich)" },
                ] as const
              ).map(({ v, l }) => (
                <label
                  key={v}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                    tone === v ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={v}
                    checked={tone === v}
                    onChange={() => setTone(v)}
                    className="shrink-0"
                  />
                  <span className="text-sm">{l}</span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Tabus</label>
              <textarea
                className={textareaClass}
                value={taboos}
                onChange={(e) => setTaboos(e.target.value)}
                placeholder="z. B. keine Preise nennen, kein Druck ..."
              />
            </div>
          )}

          {step === 4 && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground mb-1">
                Anzahl Follow-ups (nach der Erstmail)
              </legend>
              {[1, 2, 3].map((n) => (
                <label
                  key={n}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                    followUpCount === n ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="fu"
                    checked={followUpCount === n}
                    onChange={() => setFollowUpCount(n as 1 | 2 | 3)}
                    className="shrink-0"
                  />
                  <span className="text-sm">
                    {n} Follow-up {n === 1 ? "" : "s"}
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
                Zurueck
              </Button>
            )}
            {!isLast && (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Weiter
              </Button>
            )}
            {isLast && (
              <Button type="button" onClick={finish}>
                Paket erstellen &amp; speichern
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
