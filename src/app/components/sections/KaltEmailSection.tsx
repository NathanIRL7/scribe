"use client";

import { useState } from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  upsertDraft,
  type Draft,
} from "@/lib/scribeLocalStorage";

const textareaClass =
  "w-full min-h-[220px] px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background resize-y";

type  KaltEmailSectionProps = {
  /**Wenn true, kein eigener Seitentitel (z.B. in Tabs). */
  hideHeading?: boolean;
};

export function KaltEmailSection({ hideHeading = false }: KaltEmailSectionProps) {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSave() {
    setError("");
    try {
      const now = new Date().toISOString();
      const draft: Draft = {
        id: crypto.randomUUID(),
        type: "kalt-email",
        subject: subject.trim() || "(Ohne Betreff)",
        body: body.trim(),
        toEmail: toEmail.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      upsertDraft(draft);
      setSaved(true);
      setSubject("");
      setBody("");
      setToEmail("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Speichern fehlgeschlagen. Speicher voll?"
      );
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {!hideHeading && (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kalt-Email</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Erste Kontaktaufnahme - Entwurf lokal speichern (später Supabase).
          </p>
        </div>
      )}

      <Card>
        <div className="space-y-4">
          <Input
            label="Empfänger (E-Mail, optional)"
            type="email"
            placeholder="kunde@firma.de"
            value={toEmail}
            onChange={(e) => {
              setToEmail(e.target.value);
              setSaved(false);
            }}
            autoComplete="off"
          />
          <Input
            label="Betreff"
            placeholder="Kurz und klar"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setSaved(false);
            }}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">E-Mail-Text</label>
            <textarea
              className={textareaClass}
              placeholder="Hallo …"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setSaved(false);
              }}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="text-sm text-accent-foreground font-medium">
              Entwurf gespeichert – unter „Verlauf“ sichtbar.
            </p>
          )}
          <Button type="button" onClick={handleSave}>
            Entwurf speichern
          </Button>
        </div>
      </Card>
    </div>
  );
}
