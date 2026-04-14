/**
 * Deep Research Check - Ergebnis für personalisierte Akquise (News, Problem, Ansprechpartner).
 * Wird von /api/scribe/deep-research geliefert und in buildCampaignPackage eingewebt.
 */

export type DeepResearchSource = "heuristic" | "llm";

export type DeepResearchSnapshot = {
    url: string;
    fetchedAt: string;
    /**Was macht die Firma / Hauptangebot */
    mainOffer:string;
    /**News / aktueller Haken für den Einstieg  */
    newsHook: string;
    /** Typische Branchenprobleme - Basis für Lösungsbezug */
    industryProblems: string;
    /** Ansprechpartner / Rolle (kann " unklar" sein ) */
    contactPerson: string;
    source: DeepResearchSource;
};