"use client";

import { useState } from "react";
import { LandingPage } from "./LandingPage";
import { Dashboard } from "./Dashboard";

type View = "landing" | "dashboard";

export function ScribeApp() {
  /* Start auf Landing: klarer Einstieg; „Zur App“ wechselt ins Dashboard */
  const [currentView, setCurrentView] = useState<View>("landing");

  return (
    <div className="min-h-screen w-full">
      {currentView === "landing" ? (
        <LandingPage onNavigate={setCurrentView} />
      ) : (
        <Dashboard onNavigate={setCurrentView} />
      )}
    </div>
  );
}
