export type LogType = "info" | "succes" | "erreur" | (string & {});

export type LogOut = {
  id: number;
  entreprise_id: number | null;
  message: string;
  type: LogType;
  created_at: string;
};

export type Entreprise = {
  id: number;
  nom: string;
  pays: string;
  acces: string;
  vulnerabilite: string;
  statut: string;
  created_at?: string;
};

export type EntrepriseCreate = Omit<Entreprise, "id" | "created_at">;

export function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return "--";
  const d = new Date(iso);
  return d.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export type StatusInfo = {
  key: "cible" | "analyse" | "compromis" | "securise" | "inconnu";
  label: string;
  subtitle: string;
  hacked: boolean;
  badgeVariant: "green" | "cyan" | "red" | "yellow" | "dim";
};

export function statusInfo(statutRaw: string): StatusInfo {
  const s = (statutRaw || "").toLowerCase();

  if (s.includes("compromis")) {
    return {
      key: "compromis",
      label: "ALERTE",
      subtitle: "Accès compromis détecté",
      hacked: true,
      badgeVariant: "red",
    };
  }

  if (s.includes("analyse") || s.includes("scan")) {
    return {
      key: "analyse",
      label: "SCAN",
      subtitle: "Traitement en cours",
      hacked: false,
      badgeVariant: "yellow",
    };
  }

  if (s.includes("secur")) {
    return {
      key: "securise",
      label: "SECUR",
      subtitle: "Niveau de sécurité très élevé",
      hacked: false,
      badgeVariant: "green",
    };
  }

  if (s.includes("cible") || s.trim() === "") {
    return {
      key: "cible",
      label: "En attente",
      subtitle: "Cible enregistrée. En attente d’opération.",
      hacked: false,
      badgeVariant: "dim",
    };
  }

  return {
    key: "inconnu",
    label: statutRaw || "INCONNU",
    subtitle: "Statut non reconnu (valeur libre).",
    hacked: false,
    badgeVariant: "dim",
  };
}

export function threatPct(ent: Pick<Entreprise, "vulnerabilite" | "statut">) {
  const v = (ent.vulnerabilite || "").toLowerCase();
  const s = (ent.statut || "").toLowerCase();

  let score = 20;

  if (v.includes("critical")) score += 60;
  else if (v.includes("high")) score += 45;
  else if (v.includes("medium")) score += 30;
  else if (v.includes("low")) score += 10;

  if (s.includes("compromis")) score += 35;
  else if (s.includes("analyse") || s.includes("scan")) score += 15;
  else if (s.includes("secur")) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function barClass(pct: number) {
  if (pct >= 80) return "bg-red-500/60";
  if (pct >= 60) return "bg-yellow-500/50";
  if (pct >= 35) return "bg-cyan-500/50";
  return "bg-green-500/50";
}

export function typeColor(t: LogType) {
  if (t === "succes") return "text-green-200";
  if (t === "erreur") return "text-red-300";
  return "text-green-300/85";
}
