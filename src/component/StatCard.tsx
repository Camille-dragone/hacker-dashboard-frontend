import { CARD_TITLE_CLASS, GlassCard } from "./DashboardShell";

type BadgeVariant = "ok" | "warn" | "danger";

function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
	const badgeClasses =
		variant === "ok"
			? "border-green-500/30 text-green-300 bg-green-500/10"
			: variant === "warn"
				? "border-yellow-500/30 text-yellow-300 bg-yellow-500/10"
				: "border-red-500/30 text-red-300 bg-red-500/10";

	return (
		<div
			className={[
				"rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest",
				"transition-all duration-300",
				"group-hover:scale-[1.04]",
				badgeClasses,
			].join(" ")}
		>
			{label}
		</div>
	);
}

export function StatCard({
	titre,
	valeur,
	sousTitre,
	badge,
}: {
	titre: string;
	valeur: string | number;
	sousTitre: string;
	badge?: { label: string; variant: BadgeVariant };
}) {
	return (
		<GlassCard className="hover:scale-[1.05]">
			<div className="p-5">
				<div className="flex items-start justify-between gap-3">
					<div>
						<div className={CARD_TITLE_CLASS}>{titre}</div>

						<div className="mt-2 text-4xl font-bold text-green-400 transition-all drop-shadow-[0_0_18px_rgba(34,197,94,0.35)] group-hover:drop-shadow-[0_0_28px_rgba(34,197,94,0.55)]">
							{valeur}
						</div>
					</div>

					{badge && <Badge label={badge.label} variant={badge.variant} />}
				</div>

				<div className="mt-3 text-sm text-green-300/80">{sousTitre}</div>
			</div>
		</GlassCard>
	);
}
