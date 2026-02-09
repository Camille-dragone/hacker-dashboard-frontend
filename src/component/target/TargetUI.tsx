import { cls } from "./TargetDomain";

export function Badge({
	label,
	variant = "dim",
}: {
	label: string;
	variant?: "green" | "cyan" | "red" | "yellow" | "dim";
}) {
	const classes =
		variant === "green"
			? "border-green-500/30 text-green-300 bg-green-500/10"
			: variant === "cyan"
				? "border-cyan-500/30 text-cyan-200 bg-cyan-500/10"
				: variant === "red"
					? "border-red-500/30 text-red-200 bg-red-500/10"
					: variant === "yellow"
						? "border-yellow-500/30 text-yellow-200 bg-yellow-500/10"
						: "border-green-500/15 text-green-300/50 bg-black/30";

	return (
		<span
			className={[
				"inline-flex items-center rounded-full border px-3 py-1",
				"text-[11px] uppercase tracking-widest",
				classes,
			].join(" ")}
		>
			{label}
		</span>
	);
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			className={cls(
				"w-full rounded-xl border border-green-500/20 bg-black/60 px-3 py-2",
				"text-green-200 placeholder:text-green-300/30 outline-none",
				"focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20",
				props.className,
			)}
		/>
	);
}

export function Card({
	title,
	right,
	children,
}: {
	title: string;
	right?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div
			className={[
				"group relative rounded-2xl",
				"border border-green-500/20",
				"bg-zinc-900/60 backdrop-blur-md",
				"overflow-hidden",
				"transition-all duration-300 ease-out",
				"hover:border-green-400/50",
				"hover:shadow-[0_0_35px_rgba(34,197,94,0.35)]",
			].join(" ")}
		>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/45 opacity-80 group-hover:opacity-100 transition-opacity" />
			<div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(34,197,94,0.12)] group-hover:shadow-[inset_0_0_45px_rgba(34,197,94,0.25)] transition-shadow" />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_94%,rgba(255,255,255,0.03)_100%)] bg-[length:100%_4px] opacity-20" />
			<div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:3px_3px]" />
			<div className="pointer-events-none absolute inset-0 opacity-10 animate-[scan_4s_linear_infinite] bg-[linear-gradient(to_bottom,transparent,rgba(34,197,94,0.25),transparent)]" />

			<div className="relative p-5">
				<div className="flex items-start justify-between gap-3">
					<div className="text-sm uppercase tracking-[0.4em] text-green-300/70">
						{title}
					</div>
					{right}
				</div>

				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
}

export function Modal({
	open,
	title,
	onClose,
	children,
}: {
	open: boolean;
	title: string;
	onClose: () => void;
	children: React.ReactNode;
}) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
			<div className="w-full max-w-xl rounded-2xl border border-green-500/20 bg-black/90 shadow-[0_0_60px_rgba(34,197,94,0.15)] overflow-hidden">
				<div className="flex items-center justify-between border-b border-green-500/10 px-5 py-4">
					<div className="text-sm font-semibold tracking-[0.25em] text-green-200 uppercase">
						{title}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-green-500/20 bg-black/50 px-2 py-1 text-green-200 hover:bg-green-500/10"
					>
						✕
					</button>
				</div>
				<div className="p-5">{children}</div>
			</div>
		</div>
	);
}
