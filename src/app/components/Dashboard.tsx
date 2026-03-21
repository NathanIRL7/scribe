"use client";

import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { Button } from "./Button";
import { Card } from "./Card";
import {
  Home,
  User,
  PenTool,
  Users,
  Mail,
  Reply,
  History,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

type View = "landing" | "dashboard";

export function Dashboard({
  onNavigate,
}: {
  onNavigate: (view: View) => void;
}) {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
    { id: "profil", icon: <User className="w-5 h-5" />, label: "Profil" },
    {
      id: "schreibstil",
      icon: <PenTool className="w-5 h-5" />,
      label: "Schreibstil",
    },
    { id: "kontakte", icon: <Users className="w-5 h-5" />, label: "Kontakte" },
    { id: "kalt-email", icon: <Mail className="w-5 h-5" />, label: "Kalt-Email" },
    { id: "follow-up", icon: <Reply className="w-5 h-5" />, label: "Follow-up" },
    { id: "verlauf", icon: <History className="w-5 h-5" />, label: "Verlauf" },
    {
      id: "antwort",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Antwort",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Scribe</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="px-3 py-2 text-sm text-muted-foreground">
            freelancer@example.de
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("landing")}
          >
            Abmelden
          </Button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        >
          <aside
            className="w-64 bg-sidebar h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold">Scribe</h1>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navigationItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeSection === item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                />
              ))}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
              <div className="px-3 py-2 text-sm text-muted-foreground">
                freelancer@example.de
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onNavigate("landing")}
              >
                Abmelden
              </Button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menü öffnen"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="capitalize font-semibold">
            {navigationItems.find((item) => item.id === activeSection)?.label ||
              "Scribe"}
          </h2>
          <div className="w-6 md:w-0" />
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {activeSection === "home" && (
              <div className="space-y-8">
                <div>
                  <h1 className="mb-2 text-2xl font-semibold">
                    Willkommen zurück
                  </h1>
                  <p className="text-muted-foreground">
                    Wähle einen Bereich aus der Sidebar, um zu beginnen.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveSection("kalt-email")}
                  >
                    <Mail className="w-8 h-8 text-primary mb-3" />
                    <h3 className="mb-2 font-semibold">Neue Kalt-Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Erstelle eine neue Outreach-E-Mail für potenzielle Kunden.
                    </p>
                  </Card>

                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveSection("follow-up")}
                  >
                    <Reply className="w-8 h-8 text-primary mb-3" />
                    <h3 className="mb-2 font-semibold">Follow-up schreiben</h3>
                    <p className="text-sm text-muted-foreground">
                      Verfasse eine professionelle Nachfass-E-Mail.
                    </p>
                  </Card>
                </div>
              </div>
            )}

            {activeSection !== "home" && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 text-accent-foreground">
                    {navigationItems.find((item) => item.id === activeSection)
                      ?.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">
                    {
                      navigationItems.find((item) => item.id === activeSection)
                        ?.label
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    Dieser Bereich wird bald verfügbar sein.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
