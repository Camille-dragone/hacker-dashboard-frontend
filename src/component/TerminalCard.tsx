import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api";
import { CARD_TITLE_CLASS, GlassCard } from "./DashboardShell";

type LogType = "info" | "succes" | "erreur" | (string & {});

type LogOut = {
	id: number;
	entreprise_id: number | null;
	message: string;
	type: LogType;
	created_at: string;
};

type TerminalLine = {
	id: number;
	time: string;
	type: LogType;
	full: string;
	typed: string;
	done: boolean;
};

type EntrepriseOption = { id: number; label: string };

function formatHHMMSS(iso: string) {
	const d = new Date(iso);
	return d.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

function typeColor(t: LogType) {
	if (t === "succes") return "text-green-200";
	if (t === "erreur") return "text-red-300";
	return "text-green-300/85";
}

function nextDelayForChar(ch: string) {
	let ms = 18 + Math.random() * 55;

	if (ch === "." || ch === "…" || ch === "!" || ch === "?")
		ms += 120 + Math.random() * 220;
	if (ch === "," || ch === ";" || ch === ":") ms += 60 + Math.random() * 120;
	if (ch === "%") ms += 40 + Math.random() * 80;

	if (Math.random() < 0.03) ms += 120 + Math.random() * 240;

	return ms;
}

function TerminalHeader({
	started,
	loading,
	canStart,
	targetId,
	entreprises,
	onPickTarget,
	onReset,
	onStart,
}: {
	started: boolean;
	loading: boolean;
	canStart: boolean;
	targetId: number | null;
	entreprises: EntrepriseOption[];
	onPickTarget: (id: number | null) => void;
	onReset: () => void;
	onStart: () => void;
}) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div>
				<div className={CARD_TITLE_CLASS}>TERMINAL</div>
				<div className="mt-2 text-xs text-green-300/70"></div>
			</div>

			<div className="text-right text-xs text-green-300/70 flex items-center gap-2">
				{!started && (
					<select
						value={targetId ?? ""}
						onChange={(e) => {
							const v = String(e.target.value);
							const id = v ? Number(v) : null;
							onPickTarget(id);
						}}
						className={[
							"rounded-lg border px-3 py-1",
							"border-green-500/20 bg-black/60 text-green-200",
							"text-xs uppercase tracking-widest",
							"focus:outline-none focus:border-green-400/50",
						].join(" ")}
					>
						<option value="">TARGET</option>
						{entreprises.map((opt) => (
							<option key={opt.id} value={opt.id}>
								{opt.label}
							</option>
						))}
					</select>
				)}

				{started && (
					<button
						type="button"
						onClick={onReset}
						className={[
							"rounded-full border px-3 py-1",
							"border-green-500/20 bg-black/40 text-green-300/80",
							"uppercase tracking-widest",
							"transition-all duration-200",
							"hover:border-green-400/40 hover:text-green-200",
							"active:scale-[0.98]",
						].join(" ")}
					>
						Réinitialiser
					</button>
				)}

				{!started ? (
					<button
						type="button"
						onClick={onStart}
						disabled={!canStart}
						className={[
							"rounded-full border px-3 py-1",
							canStart
								? "border-green-500/30 bg-green-500/10 text-green-200 hover:border-green-400/60 hover:bg-green-500/15"
								: "border-green-500/10 bg-black/30 text-green-300/30 cursor-not-allowed",
							"uppercase tracking-widest",
							"transition-all duration-200",
							"active:scale-[0.98]",
						].join(" ")}
					>
						Init intrusion
					</button>
				) : loading ? (
					"SYNC…"
				) : (
					"LIVE"
				)}
			</div>
		</div>
	);
}

function TerminalBody({
	started,
	loading,
	targetId,
	targetLabel,
	lines,
	boxRef,
}: {
	started: boolean;
	loading: boolean;
	targetId: number | null;
	targetLabel: string;
	lines: TerminalLine[];
	boxRef: React.RefObject<HTMLDivElement | null>;
}) {
	return (
		<div
			ref={boxRef}
			className={[
				"mt-5 h-[360px] rounded-xl border border-green-500/15",
				"bg-black/60",
				"p-4",
				"overflow-y-auto",
				"text-sm leading-6",
				"shadow-[inset_0_0_25px_rgba(0,0,0,0.75)]",
			].join(" ")}
		>
			{!started && (
				<div className="text-green-300/70">
					<span className="text-green-400">{">"}</span>{" "}
					{targetId == null ? (
						<>Sélectionner une cible pour armer l’intrusion…</>
					) : (
						<>
							Target verrouillée :{" "}
							<span className="text-green-200">
								{targetLabel || `#${targetId}`}
							</span>{" "}
							— en attente d’initialisation…
						</>
					)}
				</div>
			)}

			{started && loading && (
				<div className="text-green-300/70">
					<span className="text-green-400">{">"}</span> Synchronisation des
					logs…
				</div>
			)}

			{started && !loading && lines.length === 0 && (
				<div className="text-green-300/70">
					<span className="text-green-400">{">"}</span> Aucun log pour
					l’instant.
				</div>
			)}

			<div className="space-y-1">
				{lines.map((l) => (
					<div key={l.id} className="flex gap-3">
						<span className="text-green-300/50 tabular-nums w-[88px] shrink-0">
							{l.time}
						</span>

						<span className={typeColor(l.type)}>
							{l.done ? l.full : l.typed}
							{!l.done && (
								<span className="ml-1 inline-block w-[10px] text-green-200 animate-pulse">
									█
								</span>
							)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function TerminalCard() {
	const [lines, setLines] = useState<TerminalLine[]>([]);
	const [queue, setQueue] = useState<LogOut[]>([]);
	const [loading, setLoading] = useState(true);
	const [started, setStarted] = useState(false);

	const [entreprises, setEntreprises] = useState<EntrepriseOption[]>([]);
	const [targetId, setTargetId] = useState<number | null>(null);
	const [targetLabel, setTargetLabel] = useState<string>("");

	const runIdRef = useRef(0);
	const startedRef = useRef(false);

	const boxRef = useRef<HTMLDivElement | null>(null);
	const seenIdsRef = useRef<Set<number>>(new Set());

	const queueRef = useRef<LogOut[]>([]);
	const linesRef = useRef<TerminalLine[]>([]);
	useEffect(() => {
		queueRef.current = queue;
	}, [queue]);
	useEffect(() => {
		linesRef.current = lines;
	}, [lines]);

	const startLogs = () => {
		if (startedRef.current) return;
		if (targetId == null) return;
		startedRef.current = true;
		setStarted(true);
	};

	const resetLogs = () => {
		runIdRef.current += 1;

		setStarted(false);
		setLoading(true);
		setLines([]);
		setQueue([]);

		seenIdsRef.current = new Set();

		if (targetId != null) {
			localStorage.removeItem(`cinema_autorun_done_${targetId}`);
		}

		startedRef.current = false;
	};

	useEffect(() => {
		let cancelled = false;

		async function loadTargets() {
			try {
				const list = await apiFetch<
					Array<{ id: number; nom?: string; name?: string }>
				>("/entreprises?limit=250");

				if (cancelled) return;

				const opts: EntrepriseOption[] = (list ?? [])
					.filter((x) => typeof x?.id === "number")
					.map((x) => ({
						id: x.id,
						label: (x.nom ?? x.name ?? `ENTREPRISE #${x.id}`).toUpperCase(),
					}))
					.sort((a, b) => a.label.localeCompare(b.label));

				setEntreprises(opts);
			} catch {
				if (!cancelled) setEntreprises([]);
			}
		}

		void loadTargets();
		return () => {
			cancelled = true;
		};
	}, []);

	const pickTarget = (id: number | null) => {
		setTargetId(id);
		const label = id ? (entreprises.find((x) => x.id === id)?.label ?? "") : "";
		setTargetLabel(label);
	};

	useEffect(() => {
		if (!started) return;
		if (targetId == null) return;

		const runId = runIdRef.current;
		const key = `cinema_autorun_done_${targetId}`;
		if (localStorage.getItem(key)) return;

		apiFetch(`/logs/cinema?entreprise_id=${targetId}`, { method: "POST" })
			.catch(() => {})
			.finally(() => {
				if (runId !== runIdRef.current) return;
				localStorage.setItem(key, "1");
			});
	}, [started, targetId]);

	useEffect(() => {
		if (!started) return;
		if (targetId == null) return;

		const runId = runIdRef.current;
		let cancelled = false;

		async function init() {
			setLoading(true);
			try {
				const initial = await apiFetch<LogOut[]>(
					`/entreprises/${targetId}/logs`,
				);
				if (cancelled) return;
				if (runId !== runIdRef.current) return;

				const asc = [...initial].sort((a, b) => a.id - b.id);
				for (const l of asc) {
					seenIdsRef.current.add(l.id);
				}
				setQueue(asc);
			} finally {
				if (!cancelled && runId === runIdRef.current) setLoading(false);
			}
		}

		void init();
		return () => {
			cancelled = true;
		};
	}, [started, targetId]);

	useEffect(() => {
		if (!started) return;
		if (targetId == null) return;

		const runId = runIdRef.current;
		let cancelled = false;

		const interval = window.setInterval(async () => {
			try {
				const fresh = await apiFetch<LogOut[]>(`/entreprises/${targetId}/logs`);
				if (cancelled) return;
				if (runId !== runIdRef.current) return;

				const asc = [...fresh].sort((a, b) => a.id - b.id);
				const filtered = asc.filter((l) => !seenIdsRef.current.has(l.id));
				if (filtered.length === 0) return;

				for (const l of filtered) {
					seenIdsRef.current.add(l.id);
				}
				setQueue((prev) => [...prev, ...filtered]);
			} catch {}
		}, 1200);

		return () => {
			cancelled = true;
			window.clearInterval(interval);
		};
	}, [started, targetId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: keep same behavior
	useEffect(() => {
		if (!started) return;

		setLines((prev) => {
			const hasRunning = prev.some((x) => !x.done);
			if (hasRunning) return prev;

			const q = queueRef.current;
			if (q.length === 0) return prev;

			const next = q[0];
			const full = next.message.startsWith(">")
				? next.message
				: `> ${next.message}`;

			const newLine: TerminalLine = {
				id: next.id,
				time: formatHHMMSS(next.created_at),
				type: next.type,
				full,
				typed: "",
				done: false,
			};

			return [...prev, newLine].slice(-120);
		});
	}, [queue, started, targetId, targetLabel]);

	useEffect(() => {
		if (!started) return;

		let cancelled = false;
		let timer: number | undefined;

		const scrollToBottom = () => {
			const el = boxRef.current;
			if (!el) return;
			el.scrollTop = el.scrollHeight;
		};

		const tick = () => {
			if (cancelled) return;

			const currentLines = linesRef.current;
			const idx = currentLines.findIndex((x) => !x.done);
			if (idx === -1) return;

			const line = currentLines[idx];
			const nextCharIndex = line.typed.length;

			if (nextCharIndex >= line.full.length) {
				setLines((prev) => {
					const i = prev.findIndex((x) => x.id === line.id);
					if (i === -1) return prev;
					const updated = [...prev];
					updated[i] = { ...updated[i], done: true };
					return updated;
				});
				setQueue((q) => q.slice(1));

				timer = window.setTimeout(tick, 90 + Math.random() * 140);
				return;
			}

			const ch = line.full[nextCharIndex] ?? " ";
			const delay = nextDelayForChar(ch);

			setLines((prev) => {
				const i = prev.findIndex((x) => x.id === line.id);
				if (i === -1) return prev;

				const updated = [...prev];
				const current = updated[i];
				if (current.done) return prev;

				updated[i] = {
					...current,
					typed: current.full.slice(0, current.typed.length + 1),
				};

				queueMicrotask(scrollToBottom);
				return updated;
			});

			timer = window.setTimeout(tick, delay);
		};

		if (lines.some((x) => !x.done)) {
			timer = window.setTimeout(tick, 120);
		}

		return () => {
			cancelled = true;
			if (timer) window.clearTimeout(timer);
		};
	}, [lines, started]);

	return (
		<GlassCard className="w-full max-w-[1800px]">
			<div className="p-6">
				<TerminalHeader
					started={started}
					loading={loading}
					canStart={targetId != null}
					targetId={targetId}
					entreprises={entreprises}
					onPickTarget={pickTarget}
					onReset={resetLogs}
					onStart={startLogs}
				/>

				<TerminalBody
					started={started}
					loading={loading}
					targetId={targetId}
					targetLabel={targetLabel}
					lines={lines}
					boxRef={boxRef}
				/>
			</div>
		</GlassCard>
	);
}
