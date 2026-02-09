import type React from "react";

export const CARD_TITLE_CLASS =
	"text-sm uppercase tracking-[0.4em] text-green-300/70";

const BASE_GLASS = [
	"group relative rounded-2xl",
	"border border-green-500/20",
	"bg-zinc-900/60 backdrop-blur-md",
	"overflow-hidden",
	"transition-all duration-300 ease-out",
	"hover:scale-[1.03]",
	"hover:border-green-400/50",
	"hover:shadow-[0_0_35px_rgba(34,197,94,0.35)]",
	"will-change-transform",
].join(" ");

function GlassOverlays() {
	return (
		<>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/45 opacity-80 group-hover:opacity-100 transition-opacity" />
			<div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(34,197,94,0.12)] group-hover:shadow-[inset_0_0_45px_rgba(34,197,94,0.25)] transition-shadow" />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_94%,rgba(255,255,255,0.03)_100%)] bg-[length:100%_4px] opacity-20" />
			<div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:3px_3px]" />
		</>
	);
}

export function GlassCard({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={[BASE_GLASS, className ?? ""].join(" ")}>
			<GlassOverlays />
			<div className="relative">{children}</div>
		</div>
	);
}
