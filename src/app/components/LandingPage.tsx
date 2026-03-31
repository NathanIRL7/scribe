"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Card } from "./Card";
import { Mail, CheckCircle2, Shield, Zap, Users, ArrowRight } from "lucide-react";

export function LandingPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setSubmitError(data.message ?? "Eintragen fehlgeschlagen.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showWaitlist) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWaitlist(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showWaitlist]);

  useEffect(() => {
    if (showWaitlist) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showWaitlist]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-6 h-6 text-primary shrink-0" aria-hidden />
            <span className="text-xl font-semibold tracking-tight">Scribe</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={() => setShowWaitlist(true)}
            className="shrink-0 gap-1.5"
          >
            Warteliste
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
          <p className="text-sm font-medium text-accent-foreground mb-4 tracking-wide uppercase">
            Für Freelancer
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight text-balance leading-tight">
            E-Mails schreiben,
            <br className="hidden sm:block" /> die ankommen
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            Scribe hilft Freelancern, professionelle E-Mails für Outreach und
            Follow-ups zu verfassen. Klar, persönlich und effektiv.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" type="button" onClick={() => setShowWaitlist(true)} className="w-full sm:w-auto gap-2">
              Auf die Warteliste
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={() => document.getElementById("scribe-features")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto"
            >
              Mehr erfahren
            </Button>
          </div>
        </section>

        <section id="scribe-features" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 scroll-mt-20">
          <h2 className="sr-only">Funktionen</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent-foreground" aria-hidden />
              </div>
              <h3 className="mb-2 font-semibold">Vertrauenswürdig</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Keine generischen Vorlagen. Jede E-Mail klingt nach dir.
              </p>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent-foreground" aria-hidden />
              </div>
              <h3 className="mb-2 font-semibold">Schnell & klar</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Strukturierte Hilfe beim Schreiben – ohne Ablenkung.
              </p>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1 transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-foreground" aria-hidden />
              </div>
              <h3 className="mb-2 font-semibold">Für Freelancer</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Entwickelt von Freelancern für Freelancer.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Scribe</span>
          <button
            type="button"
            onClick={() => document.getElementById("scribe-features")?.scrollIntoView({ behavior: "smooth" })}
            className="hover:text-foreground transition-colors"
          >
            Funktionen
          </button>
        </div>
      </footer>

      {showWaitlist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
          onClick={() => setShowWaitlist(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <Card className="shadow-xl border-border/80 rounded-xl">
              {!submitted ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 id="waitlist-title" className="font-semibold text-lg">
                      Warteliste beitreten
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowWaitlist(false)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      aria-label="Dialog schließen"
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        ×
                      </span>
                    </button>
                  </div>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Wir informieren dich, sobald Scribe verfügbar ist.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Name"
                      placeholder="Dein Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      autoComplete="name"
                      required
                    />
                    <Input
                      label="E-Mail"
                      type="email"
                      placeholder="deine@email.de"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      autoComplete="email"
                      required
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Deine Daten werden vertraulich behandelt und nicht weitergegeben.
                    </p>
                    {submitError && (
                      <p className="text-sm text-destructive" role="alert">
                        {submitError}
                      </p>
                    )}
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Wird gesendet…" : "Eintragen"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-primary mx-auto mb-4" aria-hidden />
                  <h3 className="mb-2 font-semibold text-lg">Vielen Dank!</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Du bist auf der Warteliste. Wir melden uns bald.
                  </p>
                  <Button type="button" onClick={() => setShowWaitlist(false)}>
                    Schließen
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
