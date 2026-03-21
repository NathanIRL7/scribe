"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-green-600 mb-2">Check deine E-Mail!</h2>
          <p className="text-zinc-600 mb-4">
            Wir haben dir einen Link geschickt. Klick drauf, um dein Konto zu aktivieren.
          </p>
          <Link href="/" className="text-black font-medium underline">
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {istLogin ? "Login" : "Registrieren"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
              minLength={6}
            />
          </div>
          {fehler && <p className="text-red-500 text-sm">{fehler}</p>}
          <button
            type="submit"
            disabled={lädt}
            className="w-full bg-black text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {lädt ? "Lädt..." : istLogin ? "Einloggen" : "Konto erstellen"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 mt-4">
          {istLogin ? "Noch kein Konto? " : "Schon ein Konto? "}
          <button
            type="button"
            onClick={() => {
              setIstLogin(!istLogin);
              setFehler("");
            }}
            className="text-blue-500 font-medium underline"
          >
            {istLogin ? "Registrieren" : "Login"}
          </button>
        </p>

        <p className="text-center text-sm mt-2">
          <Link href="/" className="text-zinc-500 hover:underline">
            ← Zur Startseite
          </Link>
        </p>
      </div>
    </div>
  );
}
