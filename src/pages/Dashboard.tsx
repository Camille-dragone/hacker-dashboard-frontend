import { useEffect, useMemo, useState } from "react";
import { StatCard } from "../component/StatCard";
import { type PieDatum, StatusPieCard } from "../component/StatusPieCard";
import { TerminalCard } from "../component/TerminalCard";
import { apiFetch } from "../lib/api";

type StatsEntreprises = {
	total: number;
	par_statut: Record<string, number>;
	par_vulnerabilite: Record<string, number>;
};

type StatsActivite = {
	logs_derniere_heure: number;
	logs_dernieres_24h: number;
	dernier_log: {
		message: string | null;
		type: string | null;
		created_at: string | null;
	};
};

function formatTime(iso: string | null) {
	if (!iso) return "--:--:--";
	const d = new Date(iso);
	return d.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

export default function Dashboard() {
	const [statsE, setStatsE] = useState<StatsEntreprises | null>(null);
	const [statsA, setStatsA] = useState<StatsActivite | null>(null);
	const [err, setErr] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const [e, a] = await Promise.all([
					apiFetch<StatsEntreprises>("/stats/entreprises"),
					apiFetch<StatsActivite>("/stats/activite"),
				]);

				if (!cancelled) {
					setStatsE(e);
					setStatsA(a);
				}
			} catch (e: unknown) {
				if (!cancelled) {
					const message = e instanceof Error ? e.message : "Erreur inconnue";
					setErr(message);
				}
			}
		}

		void load();
		return () => {
			cancelled = true;
		};
	}, []);

	const counts = useMemo(() => {
		const parStatut = statsE?.par_statut ?? {};
		const compromises = parStatut.compromis ?? 0;
		const enAnalyse = parStatut.analyse ?? 0;
		const securisees = parStatut.securise ?? 0;

		return { compromises, enAnalyse, securisees };
	}, [statsE]);

	const pieData: PieDatum[] = useMemo(
		() => [
			{ name: "Compromises", value: statsE ? counts.compromises : 0 },
			{ name: "En Analyse", value: statsE ? counts.enAnalyse : 0 },
			{ name: "Sécurisées", value: statsE ? counts.securisees : 0 },
		],
		[counts, statsE],
	);

	return (
		<div className="bg-black font-mono">
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_45%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.08),transparent_45%)]" />
			<div className="pointer-events-none fixed inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

			<div className="relative w-full px-4 sm:px-6 lg:px-10 py-10">
				<div className="mb-6 flex items-start justify-between gap-6">
					<div className="text-start">
						<h1
							className="
                mt-40
                text-xl md:text-2xl lg:text-3xl
                font-extrabold
                tracking-[0.45em]
                text-green-400
                drop-shadow-[0_0_35px_rgba(34,197,94,0.35)]
                relative
              "
						>
							MONITORING ILLEGAL SYSTEM
						</h1>

						<div className="mt-4 text-xs text-green-300/70">
							<span className="text-green-400">{">"}</span> Session:{" "}
							<span className="text-green-300">camillebujotzek@hacker.com</span>
						</div>
					</div>

					<div className="relative rounded-2xl border border-green-500/20 bg-zinc-900/60 backdrop-blur-md px-4 py-3 text-right overflow-hidden">
						<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/35" />
						<div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(34,197,94,0.12)]" />
						<div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:3px_3px]" />

						<div className="relative">
							<div className="text-xs mb-2 uppercase tracking-widest text-green-300/70">
								Statut réseau
							</div>

							<div className="mt-1 text-sm text-green-300">
								<span className="inline-block mr-2 h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
								CONNECTÉ
							</div>

							<div className="mt-1 text-xs text-green-300/70">
								Dernière action :{" "}
								{formatTime(statsA?.dernier_log.created_at ?? null)}
							</div>
						</div>
					</div>
				</div>

				{err && (
					<div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
						{err}
					</div>
				)}

				<div className="grid gap-4 mt-20 md:grid-cols-2 xl:grid-cols-4">
					<StatCard
						titre="Entreprises surveillées"
						valeur={statsE ? statsE.total : "…"}
						sousTitre="Nombre total de cibles en base"
						badge={{ label: "ACTIF", variant: "ok" }}
					/>

					<StatCard
						titre="Compromises"
						valeur={statsE ? counts.compromises : "…"}
						sousTitre="Intrusion obtenue"
						badge={{ label: "ALERTE", variant: "danger" }}
					/>

					<StatCard
						titre="En Analyse"
						valeur={statsE ? counts.enAnalyse : "…"}
						sousTitre="Traitement en cours"
						badge={{ label: "SCAN", variant: "warn" }}
					/>

					<StatCard
						titre="Sécurisées"
						valeur={statsE ? counts.securisees : "…"}
						sousTitre="Niveau de sécurité très élevé"
						badge={{ label: "SECUR", variant: "ok" }}
					/>
				</div>

				<div className="mt-20 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start">
					<div className="flex justify-start">
						<StatusPieCard data={pieData} />
					</div>

					<div className="flex justify-center">
						<TerminalCard />
					</div>
				</div>
			</div>
		</div>
	);
}
