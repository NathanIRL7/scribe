"use client";

import { useState } from "react";
import { LandingPage } from "./LandingPage";
import { Dashboard } from "./Dashboard";

type View = "landing" | "dashboard";

export function ScribeApp() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

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
