"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { SidebarItem } from "./SidebarItem";
import { Button } from "./Button";
import { DashboardHome } from "./DashboardHome";
import { DashboardSectionContent } from "./DashboardSectionContent";
import {
  Home,
  User,
  PenTool,
  Users,
  LayoutGrid,
  Mail,
  Reply,
  History,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

type NavItem = { id: string; icon: React.ReactNode; label: string };

type NavGroup = { heading: string; items: NavItem[] };

type View = "landing" | "dashboard";

function labelFromUser(user: SupabaseUser | null): string {
  if (!user) return "Lädt...";
  if (user.email) return user.email;
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const name = 
    typeof meta?.full_name === "string"
      ? meta.full_name 
      : typeof meta?.name === "string"
        ? meta.name 
        : "";
  if (name.trim()) return name.trim();
  return `Nutzer ${user.id.slice(0, 8)}...`;
}

export function Dashboard({
  onNavigate,
}: {
  onNavigate: (view: View) => void;
}) {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountLabel, setAccountLabel] = useState("Lädt...");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setAccountLabel(labelFromUser(data.session?.user ?? null));
    }
    void sync();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setAccountLabel(labelFromUser(session?.user ?? null));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("signOut", error);
    } catch (e) {
      console.error("signOut",e);
    } finally {
      setSigningOut(false);
    }
  }

  const navigationGroups: NavGroup[] = [
    {
      heading: "Übersicht",
      items: [{ id: "home", icon: <Home className="w-5 h-5" />, label: "Übersicht"}],
    },
    {
      heading: "Kontakte & CRM",
      items: [
        { id: "kontakte", icon: <Users className="w-5 h-5" />, label: "Kontakte" },
        { id: "crm", icon: <LayoutGrid className="w-5 h-5" />, label: "CRM/ Pipeline" },
      ],
    },
    {
      heading: "E-Mail",
      items: [
        { id: "kalt-email", icon: <Mail className="w-5 h-5" />, label: "Kalt-Email" },
        { id: "follow-up", icon: <Reply className="w-5 h-5" />, label: "Follow-up"},
        { id: "antwort", icon: <MessageSquare className="w-5 h-5" />, label: "Antwort"},
        { id: "verlauf", icon: <History className="w-5 h-5" />, label: "Verlauf" },
      ],
    },
    {
      heading: "Du",
      items: [
        { id: "profil", icon: <User className="w-5 h-5" />, label: "Profil" },
        { id: "schreibstil", icon: <PenTool className="w-5 h-5" />, label: "Schreibstil"},
      ],
    },
  ];

  const flatNavItems: NavItem[] = navigationGroups.flatMap((g) => g.items);



  const sidebarFooter = (
    <>
      <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/60">
        <p className="text-xs text-muted-foreground mb-1">Angemeldet als</p>
        <p
          className="text-sm font-medium text-foreground truncate"
          title={accountLabel}
          >
            {accountLabel}

        </p>
        <p className="text-xs text-muted-foreground mt-2">
          <Link href="/auth" className="text-accent-foreground font-medium hover:underline">
            Konto / Login
          </Link>
        </p>
      </div>
      <Button
        variant="secondary"
        className="w-full justify-start"
        type="button"
        disabled={signingOut}
        onClick={() => void handleSignOut()}
      >
        {signingOut ? "Wird abgemeldet..." : "Abmelden"}
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start "
        type="button"
        onClick={() => onNavigate("landing")}
      >
        Zur Startseite
      </Button>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex w-64 min-w-[16rem] bg-sidebar border-r border-sidebar-border flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary shrink-0" aria-hidden />
            <span className="text-xl font-semibold tracking-tight">Scribe</span>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto space-y-5" aria-label="Hauptnavigation">
          {navigationGroups.map((group) => (
            <div key={group.heading}>
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.heading}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">{sidebarFooter}</div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        >
          <aside
            className="w-[min(100%,18rem)] bg-sidebar h-full flex flex-col shadow-xl border-r border-sidebar-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-sidebar-border flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-6 h-6 text-primary shrink-0" aria-hidden />
                <span className="text-xl font-semibold truncate">Scribe</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-foreground hover:bg-sidebar-accent/50 transition-colors"
                aria-label="Menü schließen"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>

            <nav className="flex-1 p-3 overflow-y-auto space-y-5" aria-label="Hauptnavigation">
              {navigationGroups.map((group) => (
                <div key={group.heading}>
                  <p className= "px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.heading}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
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
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-2">{sidebarFooter}</div>
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4 shrink-0">
          <button
            type="button"
            className="md:hidden rounded-lg p-2 -ml-2 text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menü öffnen"
          >
            <Menu className="w-6 h-6" aria-hidden />
          </button>
          <h2 className="capitalize font-semibold text-lg truncate flex-1 text-center md:text-left md:flex-none">
            {flatNavItems.find((item) => item.id === activeSection)?.label || "Scribe"}
          </h2>
          <div className="w-10 md:w-0 shrink-0" aria-hidden />
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-12 pb-16">
            {activeSection === "home" && (
              <DashboardHome onGoTo={(id) => setActiveSection(id)} />
            )}

            {activeSection !== "home" && (
              <DashboardSectionContent
                sectionId={activeSection}
                onBackHome={() => setActiveSection("home")}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

