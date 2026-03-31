"use client";

import { LandingPage } from "./LandingPage";

/**
 * Öffentliche Startseite: nur Warteliste (Name + E-Mail), kein Login-Flow.
 * Dashboard / Auth später wieder anbinden, wenn ihr soweit seid.
 */
export function ScribeApp() {
  return (
    <div className="min-h-screen w-full">
      <LandingPage />
    </div>
  );
}
