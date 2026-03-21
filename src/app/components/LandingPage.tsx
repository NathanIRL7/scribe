"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Card } from "./Card";
import { Mail, CheckCircle2, Shield, Zap, Users } from "lucide-react";

type View = "landing" | "dashboard";

export function LandingPage({
  onNavigate,
}: {
  onNavigate: (view: View) => void;
}) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Scribe</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("dashboard")}>
            Anmelden
          </Button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-semibold mb-6 tracking-tight">
          E-Mails schreiben,
          <br />
          die ankommen
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Scribe hilft Freelancern, professionelle E-Mails für Outreach und
          Follow-ups zu verfassen. Klar, persönlich und effektiv.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" onClick={() => setShowWaitlist(true)}>
            Auf die Warteliste
          </Button>
          <Button variant="secondary" size="lg" type="button">
            Mehr erfahren
          </Button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">Vertrauenswürdig</h3>
            <p className="text-muted-foreground">
              Keine generischen Vorlagen. Jede E-Mail klingt nach dir.
            </p>
          </Card>

          <Card>
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">Schnell & Klar</h3>
            <p className="text-muted-foreground">
              Strukturierte Hilfe beim Schreiben – ohne Ablenkung.
            </p>
          </Card>

          <Card>
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">Für Freelancer</h3>
            <p className="text-muted-foreground">
              Entwickelt von Freelancern für Freelancer.
            </p>
          </Card>
        </div>
      </section>

      {showWaitlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <Card className="max-w-md w-full">
            {!submitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">Warteliste beitreten</h2>
                  <button
                    type="button"
                    onClick={() => setShowWaitlist(false)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Schließen"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-muted-foreground mb-6">
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
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Deine Daten werden vertraulich behandelt und nicht
                    weitergegeben.
                  </p>
                  <Button type="submit" className="w-full">
                    Eintragen
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="mb-2 font-semibold">Vielen Dank!</h3>
                <p className="text-muted-foreground mb-6">
                  Du bist auf der Warteliste. Wir melden uns bald.
                </p>
                <Button onClick={() => setShowWaitlist(false)}>Schließen</Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
