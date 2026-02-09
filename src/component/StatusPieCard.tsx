import { useMemo, useState } from "react";
import {
	Cell,
	Pie,
	PieChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	Sector,
} from "recharts";
import { CARD_TITLE_CLASS, GlassCard } from "./DashboardShell";

export type PieDatumName =
  | "Compromises"
  | "En Analyse"
  | "Sécurisées"
  | "Breached"
  | "Locked"
  | "Scanning";

export type PieDatum = { name: PieDatumName; value: number };

type PieWithActiveProps = React.ComponentProps<typeof Pie> & {
	activeIndex?: number;
	activeShape?: (props: unknown) => React.ReactElement | null;
};

export function StatusPieCard({ data }: { data: PieDatum[] }) {
	const total = data.reduce((a, d) => a + d.value, 0);

	const PIE_COLORS = [
		"rgba(180, 60, 60, 0.50)",
		"rgba(200, 170, 60, 0.50)",
		"rgba(0, 180, 120, 0.50)",
	] as const;

	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const tooltipStyle = useMemo<React.CSSProperties>(
		() => ({
			backgroundColor: "rgba(6,6,6,0.92)",
			border: "1px solid rgba(34,197,94,0.28)",
			color: "rgba(167,243,208,0.95)",
			borderRadius: 12,
			boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
			padding: "10px 12px",
			fontSize: 12,
			backdropFilter: "blur(10px)",
		}),
		[],
	);

	const PieWithActive = Pie as unknown as React.FC<PieWithActiveProps>;

	return (
		<GlassCard className="w-full max-w-[520px] h-[460px]">
			<div className="p-6">
				<div className={CARD_TITLE_CLASS}>RÉPARTITION GLOBALE DES STATUTS</div>

				<div className="mt-5 h-[360px]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<PieWithActive
								data={data}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								innerRadius={0}
								outerRadius={150}
								paddingAngle={3}
								stroke="rgba(0,0,0,0.65)"
								strokeWidth={2}
								activeIndex={activeIndex ?? undefined}
								activeShape={(props) => {
									const p = props as {
										cx: number;
										cy: number;
										innerRadius: number;
										outerRadius: number;
										startAngle: number;
										endAngle: number;
										fill: string;
									};

									return (
										<g>
											<Sector
												cx={p.cx}
												cy={p.cy}
												innerRadius={p.innerRadius}
												outerRadius={p.outerRadius + 14}
												startAngle={p.startAngle}
												endAngle={p.endAngle}
												fill={p.fill}
											/>
											<Sector
												cx={p.cx}
												cy={p.cy}
												innerRadius={p.outerRadius + 18}
												outerRadius={p.outerRadius + 22}
												startAngle={p.startAngle}
												endAngle={p.endAngle}
												fill="rgba(34,197,94,0.20)"
											/>
										</g>
									);
								}}
								onMouseEnter={(_, idx: number) => setActiveIndex(idx)}
								onMouseLeave={() => setActiveIndex(null)}
							>
								{data.map((entry, idx) => (
									<Cell
										key={entry.name}
										fill={PIE_COLORS[idx % PIE_COLORS.length]}
									/>
								))}
							</PieWithActive>

							<RechartsTooltip
								cursor={false}
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null;

									const p = payload[0];
									const name = String(p.name);
									const value = Number(p.value ?? 0);
									const pct = total > 0 ? Math.round((value / total) * 100) : 0;

									return (
										<div style={tooltipStyle}>
											<div
												style={{
													color: "rgba(34,197,94,0.95)",
													marginBottom: 4,
													fontWeight: 800,
													letterSpacing: "0.12em",
													textTransform: "uppercase",
												}}
											>
												{name}
											</div>

											<div style={{ opacity: 0.92 }}>{pct}%</div>
										</div>
									);
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</GlassCard>
	);
}
