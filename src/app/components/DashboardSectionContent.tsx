"use client";

import { Card } from "./Card";
import { Button } from "./Button";
import { ProfilSection } from "./sections/ProfilSection";
import { SchreibstilSection } from "./sections/SchreibstilSection";
import { KontakteSection } from "./sections/KontakteSection";
import { KaltEmailSection } from "./sections/KaltEmailSection";
import { FollowUpSection } from "./sections/FollowUpSection";
import { VerlaufSection } from "./sections/VerlaufSection";
import { AntwortSection } from "./sections/AntwortSection";
import { CrmBoardSection } from "./sections/CrmBoardSection";

type Props = {
  sectionId: string;
  onBackHome: () => void;
};

export function DashboardSectionContent({ sectionId, onBackHome }: Props) {
  switch (sectionId) {
    case "profil":
      return <ProfilSection />;
    case "schreibstil":
      return <SchreibstilSection />;
    case "kontakte":
      return <KontakteSection />;
    case "crm":
      return <CrmBoardSection />;
    case "kalt-email":
      return <KaltEmailSection />;
    case "follow-up":
      return <FollowUpSection />;
    case "verlauf":
      return <VerlaufSection />;
    case "antwort":
      return <AntwortSection />;
    default:
      return (
        <Card className="max-w-lg mx-auto text-center py-10 sm:py-12 px-6">
          <h3 className="mb-2 text-xl font-semibold">Bereich nicht gefunden</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Dieser Eintrag ist noch nicht verknüpft.
          </p>
          <Button type="button" variant="secondary" onClick={onBackHome}>
            Zurück zum Home
          </Button>
        </Card>
      );
  }
}
