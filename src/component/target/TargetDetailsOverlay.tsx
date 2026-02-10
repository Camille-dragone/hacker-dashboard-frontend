import { useMemo } from "react";
import type { Entreprise, LogOut } from "./TargetDomain";
import {
	barClass,
	cls,
	formatDateTime,
	statusInfo,
	threatPct,
	typeColor,
} from "./TargetDomain";
import { statutBadge, vulnBadge } from "./TargetListSection";

type BannerVariant = "soft" | "hacker" | "hardcore";

function nonBreachedBanner(infoKey: string, variant: BannerVariant) {
	const messages = {
		soft: {
			cible: "Cible en attente — aucune opération lancée.",
			analyse: "Scan actif — reconnaissance en cours.",
			securise: "Cible durcie — niveau de sécurité élevé (priorité basse).",
			inconnu: "Statut non reconnu — en attente de classification.",
		},
		hacker: {
			cible: "QUEUE ▸ cible indexée. opération en attente.",
			analyse: "SCAN ▸ ports & vecteurs en cours de cartographie…",
			securise: "HARDENED ▸ surface faible. ROI bas. skip recommandé.",
			inconnu: "UNKNOWN ▸ signature non classée. analyse manuelle requise.",
		},
		hardcore: {
			cible: "QUEUE ▸ en attente d’ordre. aucun paquet envoyé.",
			analyse: "RECON ▸ fingerprint + vuln sweep en cours…",
			securise: "LOCKED ▸ durcie. brute-force inutile. pivot ailleurs.",
			inconnu: "ANOMALY ▸ statut invalide. corriger la cible.",
		},
	} as const;

	const set = messages[variant];

	if (infoKey === "analyse") return set.analyse;
	if (infoKey === "securise") return set.securise;
	if (infoKey === "cible") return set.cible;
	return set.inconnu;
}

function nonBreachedDateLine(infoKey: string, variant: BannerVariant) {
	const messages = {
		soft: {
			cible: "En attente d’opération.",
			analyse: "Traitement en cours.",
			securise: "Niveau de sécurité très élevé.",
			inconnu: "Statut indéterminé.",
		},
		hacker: {
			cible: "QUEUE ▸ aucun payload.",
			analyse: "SCAN ▸ en cours d’exécution…",
			securise: "NO ENTRY ▸ vecteurs bloqués.",
			inconnu: "UNKNOWN ▸ état non fiable.",
		},
		hardcore: {
			cible: "QUEUE ▸ idle.",
			analyse: "RECON ▸ running…",
			securise: "LOCKED ▸ deprioritized.",
			inconnu: "ANOMALY ▸ check required.",
		},
	} as const;

	const set = messages[variant];

	if (infoKey === "analyse") return set.analyse;
	if (infoKey === "securise") return set.securise;
	if (infoKey === "cible") return set.cible;
	return set.inconnu;
}

export function TargetDetailsOverlay({
	open,
	entreprise,
	logs,
	logsLoading,
	hackedAt,
	onClose,
}: {
	open: boolean;
	entreprise: Entreprise | null;
	logs: LogOut[];
	logsLoading: boolean;
	hackedAt: string | null;
	onClose: () => void;
}) {
	if (!open || !entreprise) return null;

	const pct = threatPct(entreprise);
	const pulse = pct > 70;

	const info = statusInfo(entreprise.statut);
	const isBreached = info.hacked;

	const BANNER_VARIANT: BannerVariant = "hacker";

	const bannerText = nonBreachedBanner(info.key, BANNER_VARIANT);
	const dateFallbackText = nonBreachedDateLine(info.key, BANNER_VARIANT);

	// biome-ignore lint/correctness/useHookAtTopLevel: composant rendu conditionnel, hook stable ici
	const previewLogs = useMemo(() => {
		if (logs.length === 0) return [];
		return logs.slice(0, 3);
	}, [logs]);

	return (
		/* biome-ignore lint/a11y/noStaticElementInteractions: overlay clic pour fermer */
		<div
			className="fixed inset-0 z-50 bg-black/70 p-4"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className={cls(
					"mx-auto h-[85vh] w-full max-w-4xl",
					"rounded-2xl border border-green-500/20",
					"bg-black/90 backdrop-blur-md",
					"shadow-[0_0_70px_rgba(34,197,94,0.18)]",
					"overflow-hidden",
				)}
			>
				<div className="flex items-center justify-between border-b border-green-500/10 px-5 py-4">
					<div>
						<div className="mt-1 text-green-100 font-semibold">
							{entreprise.nom}{" "}
							<span className="text-green-300/40 text-sm">
								#{entreprise.id}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-full border px-3 py-2 text-xs uppercase tracking-widest border-green-500/20 bg-black/40 text-green-300/80 hover:border-green-400/40 hover:text-green-200"
						>
							X
						</button>
					</div>
				</div>

				<div className="h-[calc(85vh-64px)] overflow-auto p-5">
					<div className="mb-4 rounded-xl border border-green-500/15 bg-black/55 p-4">
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="text-xs uppercase tracking-widest text-green-300/60">
									Statut actuel
								</div>
								<div className="mt-2 flex items-center gap-3">
									<div className="text-sm text-green-200/80">
										{info.subtitle}
									</div>
								</div>
							</div>

							<div className="text-xs uppercase tracking-widest text-green-300/60">
								{info.hacked ? (
									<span className="text-red-200">HACKÉ</span>
								) : (
									<span className="text-green-200">NON HACKÉ</span>
								)}
							</div>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="rounded-xl border border-green-500/15 bg-black/50 p-4">
							<div className="text-xs uppercase tracking-widest text-green-300/60">
								Identité
							</div>

							<div className="mt-3 grid gap-2 text-sm text-green-200/80">
								<div>
									Pays:{" "}
									<span className="text-green-200">{entreprise.pays}</span>
								</div>
								<div>
									Accès:{" "}
									<span className="text-green-200">{entreprise.acces}</span>
								</div>
								<div>
									Vulnérabilité:{" "}
									<span className="ml-2 inline-flex">
										{vulnBadge(entreprise.vulnerabilite)}
									</span>
								</div>
								<div>
									Statut:{" "}
									<span className="ml-2 inline-flex">
										{statutBadge(entreprise.statut)}
									</span>
								</div>
								<div>
									Créée:{" "}
									<span className="text-green-200">
										{formatDateTime(entreprise.created_at ?? null)}
									</span>
								</div>
							</div>
						</div>

						<div className="rounded-xl border border-green-500/15 bg-black/50 p-4">
							<div className="text-xs uppercase tracking-widest text-green-300/60">
								Intrusion
							</div>

							<div className="mt-3">
								<div className="text-xs text-green-300/60 uppercase tracking-widest">
									Date hacking
								</div>
								<div className="mt-1 text-green-200">
									{isBreached && hackedAt
										? formatDateTime(hackedAt)
										: dateFallbackText}
								</div>
							</div>

							<div className="mt-4">
								<div className="text-xs text-green-300/60 uppercase tracking-widest">
									Threat Level
								</div>
								<div className="mt-2 h-2 w-full rounded-full bg-black/60 border border-green-500/10 overflow-hidden">
									<div
										className={cls(
											"h-full",
											barClass(pct),
											pulse && "animate-pulse",
										)}
										style={{ width: `${pct}%` }}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-5 rounded-xl border border-green-500/15 bg-black/60 overflow-hidden">
						<div className="flex items-center justify-between border-b border-green-500/10 px-4 py-3">
							<div className="text-xs uppercase tracking-widest text-green-200">
								Téléchargement métadonnées
							</div>
							<div className="text-xs text-green-300/50">
								{logsLoading ? "SYNC…" : `${logs.length} lignes`}
							</div>
						</div>

						<div className="max-h-[380px] overflow-auto p-4 text-sm leading-6">
							{isBreached ? (
								logs.length === 0 ? (
									<div className="text-green-300/60">
										<span className="text-green-400">{">"}</span> Aucun log.
									</div>
								) : (
									<div className="space-y-2">
										{logs.map((l) => (
											<div key={l.id} className="flex gap-3">
												<span className="text-green-300/45 tabular-nums w-[170px] shrink-0">
													{formatDateTime(l.created_at)}
												</span>
												<span className={typeColor(l.type)}>{l.message}</span>
											</div>
										))}
									</div>
								)
							) : previewLogs.length === 0 ? (
								<div className="text-green-300/60">
									<span className="text-green-400">{">"}</span> Aucun journal
									visible.{" "}
									<span className="text-green-300/40">({info.label})</span>
								</div>
							) : (
								<div className="space-y-2">
									<div className="text-green-300/60 mb-2">
										<span className="text-green-400">{">"}</span> {bannerText}
									</div>
									{previewLogs.map((l) => (
										<div key={l.id} className="flex gap-3">
											<span className="text-green-300/45 tabular-nums w-[170px] shrink-0">
												{formatDateTime(l.created_at)}
											</span>
											<span className={typeColor(l.type)}>{l.message}</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
