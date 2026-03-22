"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function AuthPage() {
  const [istLogin, setIstLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fehler, setFehler] = useState("");
  const [lädt, setLädt] = useState(false);
  const [erfolg, setErfolg] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFehler("");
    setLädt(true);

    if (istLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLädt(false);
      if (error) {
        setFehler(error.message);
        return;
      }
      window.location.href = "/";
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLädt(false);
      if (error) {
        setFehler(error.message);
        return;
      }
      setErfolg(true);
    }
  }

  if (erfolg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card w-full max-w-md rounded-xl border border-border p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-accent-foreground" aria-hidden />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">E-Mail prüfen</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Wir haben dir einen Link geschickt. Klick drauf, um dein Konto zu aktivieren.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <Mail className="w-6 h-6 text-primary" aria-hidden />
            <span className="font-semibold">Scribe</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-center mb-1">
            {istLogin ? "Willkommen zurück" : "Konto erstellen"}
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-8">
            {istLogin ? "Melde dich mit E-Mail und Passwort an." : "Registriere dich für Scribe."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-foreground mb-1.5">
                E-Mail
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow"
                placeholder="du@beispiel.de"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-foreground mb-1.5">
                Passwort
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow"
                required
                minLength={6}
                autoComplete={istLogin ? "current-password" : "new-password"}
              />
            </div>

            {fehler && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2" role="alert">
                {fehler}
              </p>
            )}

            <button
              type="submit"
              disabled={lädt}
              className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 font-medium hover:bg-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {lädt ? "Lädt…" : istLogin ? "Einloggen" : "Registrieren"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {istLogin ? "Noch kein Konto? " : "Schon ein Konto? "}
            <button
              type="button"
              onClick={() => {
                setIstLogin(!istLogin);
                setFehler("");
              }}
              className="text-accent-foreground font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {istLogin ? "Registrieren" : "Zum Login"}
            </button>
          </p>

          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Zurück zur Startseite
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
