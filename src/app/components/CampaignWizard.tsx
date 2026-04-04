"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { 
    buildCampaignPackage,
    upsertCampaign,
    type Campaign,
    type CampaignTone,
}   from "@/lib/scribeLocalStorage";

const textareaClass = 
  "w-full min-h-[220px] px-4 px-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background resize-y";

const STEPS = [
  { title: "Zielgruppe", hint: "Wen willst du ansprechen? (Branche, Rolle, Interesse)"},
  { title: "Angebot", hint: "Was bietest du konkretan?" },
  { title: "Stil", hint: "Wie soll die Mail klingen" },
  { title: "Tabus", hint: "Was soll vermieden werden? (optional)" },
  { title: "Follow-ups", hint: "Wie oft soll nachgefragt werden? (1-3)" },
] as const;

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [ok, setOk] = useState(false);
  const copy = useCallback(( => {
    void navigator.clipboard.writeText(text).then(() => {
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    });
  }, [text]);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <Button type="button" variant="secondary" size="sm" onClick={copy} className="shrink-0 gap-1"
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
  const [offer, setOffer ] = useState("");
  const [tone, setTone] = useState<CampaignTone>("neutral");
  const [taboos, setTaboos] = useState("");
  const [followUpCount, setFollowUpCount] = useState<1 | 2 | 3>(1);
  const [package, setPackage] = useState<Campaign | null>(null);
  const [error, setError] = useState("");
  
  const reset = () => {
    setStep(0);
    setAudience("");
    setOffer("");
    setTone("neutral");
    setTaboos("");
    setFollowUpCount(1);
    setDone(null);
    setError("");
  };

  const finish = () => {
    setError(" ");
    try {
      const pkg = buildCampaignPackage({
        audience,
        offer,
        tone,
        taboos,
        followUpCount,
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
        createdAt: now,
        updatedAt: now,
      };
      upsertCampaign(campaign);
      setDone(campaign);
      onSaved?.();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Speichern fehlgeschlagen."
      );
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
          <CopyBLock label="Betreff (Erstmail)" text={p.erstmailBetreff} />
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
  const isLast = step === STEPS.lenght -1;

  return (
    <div className="space-y-6 max-w-3xl">
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
                placeholder="z.B. inhabergeführte Shops mit Shopify ..."
              />
        </div>
          )}
          {step === 1 &&  (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Angebot</label>
              <textarea
                className={textareaClass}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="z.B. Conversion-Optimierung der Produktseiten ..."
              />
            </div>
          )}
          {step === 2 && (
            <fieldset className="space-y-3">
              <legend className="sr-only">Ton</legend>
              {(
                [
                  { v: "formell", as const, l: "Formell (Sie, klassisch)"},
                  { v: "neutral", as const, l: "Neutral (Sie, freundlich)"},
                  { v: "locker", as const, l: "Locker (Du, freundlich)"},
                ] as const
              ).map(({v, l}) => (
                <label
                  key={v}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-color"
                    tone === v
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={v}
                    checked={tone === v}
                    onChange={() => setTone (v)}
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
                placeholder="z.B. keine Preise nennen, kein Druck ..."
              />
            </div>
          )}
          {step === 4 && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground mb-1">
                Anzahl Follow-ups (nach der Erstmail)
              </legend>
              {([1, 2, 3] as const).map ((n) => (
                <label
                  key={n}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-color
                    followUpCount === n
                      ? "border-primary bg-primary/5"
                      : "border-border hover-bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="fu"
                    checked={followUpCount === n}
                    onChange={() => setFollowUpCount(n)}
                    className="shrink-0"
                  />
                  <span className="text-sm">{n} Follow-up {n === 1 ? "" : "s"}</span>
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
              <Button type="button" variant="secondary" onCLick={() => setStep((s) => s - 1)}>
                Zurück
              </Button>
            )}
            {!isLast && (
              <Button type="button" onClick={()  => setStep((s) => s + 1)}>
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
