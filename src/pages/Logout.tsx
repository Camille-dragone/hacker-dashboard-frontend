import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Step = {
	text: string;
	ms: number; 
	progressTo: number; 
};

function clamp(n: number, a: number, b: number) {
	return Math.max(a, Math.min(b, n));
}

export default function Logout() {
	const navigate = useNavigate();

	const steps: Step[] = useMemo(
		() => [
			{ text: "PURGE ▸ destruction des jetons de session…", ms: 850, progressTo: 18 },
			{ text: "PURGE ▸ nettoyage complet du cache local…", ms: 750, progressTo: 34 },
			{ text: "PURGE ▸ coupure des tunnels actifs…", ms: 850, progressTo: 52 },
			{ text: "TOR ▸ reconfiguration du circuit…", ms: 900, progressTo: 70 },
			{ text: "TOR ▸ circuit neutralisé.", ms: 800, progressTo: 82 },
			{ text: "SEC ▸ effacement des traces système…", ms: 900, progressTo: 94 },
			{ text: "DONE ▸ session clôturée..", ms: 700, progressTo: 100 },
		],
		[],
	);

	const [lines, setLines] = useState<string[]>([]);
	const [typed, setTyped] = useState("");
	const [stepIndex, setStepIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const [glitchOn, setGlitchOn] = useState(false);

	const typingTimer = useRef<number | null>(null);
	const stepTimer = useRef<number | null>(null);

	const current = steps[stepIndex] ?? null;

	useEffect(() => {
		const i = window.setInterval(() => {
			setGlitchOn(Math.random() < 0.18);
			window.setTimeout(() => setGlitchOn(false), 120 + Math.random() * 220);
		}, 220);
		return () => window.clearInterval(i);
	}, []);

	useEffect(() => {
		return () => {
			if (typingTimer.current) window.clearTimeout(typingTimer.current);
			if (stepTimer.current) window.clearTimeout(stepTimer.current);
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!current) return;

		setTyped("");
		const full = `> ${current.text}`;

		const tick = () => {
			setTyped((prev) => {
				const nextLen = prev.length + 1;
				const next = full.slice(0, nextLen);
				if (nextLen < full.length) {
					typingTimer.current = window.setTimeout(
						tick,
						14 + Math.random() * 35,
					);
				}
				return next;
			});
		};

		typingTimer.current = window.setTimeout(tick, 120);

		const start = performance.now();
		const from = progress;
		const to = current.progressTo;
		const dur = current.ms;

		const anim = (t: number) => {
			const elapsed = t - start;
			const k = clamp(elapsed / dur, 0, 1);
			const eased = 1 - Math.pow(1 - k, 3); 
			const val = from + (to - from) * eased;
			setProgress(Math.round(val));
			if (k < 1) requestAnimationFrame(anim);
		};
		requestAnimationFrame(anim);

		stepTimer.current = window.setTimeout(() => {
			setLines((prev) => [...prev, full]);
			setTyped("");

			if (stepIndex >= steps.length - 1) {
				window.setTimeout(() => {
					navigate("/", { replace: true });
				}, 550);
				return;
			}

			setStepIndex((i) => i + 1);
		}, current.ms + 420);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stepIndex, current?.text]); 

	return (
		<div className="min-h-screen bg-black font-mono relative overflow-hidden">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_55%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.10),transparent_55%)]" />
			<div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.92)_100%)]" />

			<div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:100%_3px]" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-[1100px] flex-col justify-center px-6 py-10">
				<div className="mb-6">
					<div
						className={[
							"text-green-400 font-extrabold tracking-[0.45em]",
							"text-lg sm:text-xl md:text-2xl",
							"drop-shadow-[0_0_28px_rgba(34,197,94,0.35)]",
							glitchOn ? "purge-glitch" : "",
						].join(" ")}
					>
						PROTOCOLE DE PURGE ACTIVÉ
					</div>
					<div className="mt-3 text-xs uppercase tracking-widest text-green-300/70">
						<span className="text-green-400">{">"}</span> Fin de session - évacuation sécurisée en cours ...  
					</div>
				</div>

				<div className="mb-6 rounded-2xl border border-green-500/20 bg-black/60 p-4 shadow-[inset_0_0_30px_rgba(34,197,94,0.10)]">
					<div className="flex items-center justify-between text-xs uppercase tracking-widest text-green-300/70">
						<span>Flush</span>
						<span className="tabular-nums text-green-200">{progress}%</span>
					</div>
					<div className="mt-3 h-3 w-full rounded-full border border-green-500/20 bg-black/50 overflow-hidden">
						<div
							className={[
								"h-full rounded-full",
								"bg-green-500/20",
								"shadow-[0_0_22px_rgba(34,197,94,0.35)]",
							].join(" ")}
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className="mt-3 text-[11px] text-green-300/60">
						{progress < 100 ? (
							<>
								<span className="text-green-400">{">"}</span> Ne pas interrompre ...
							</>
						) : (
							<>
								<span className="text-green-400">{">"}</span> Redirecting to home…
							</>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-green-500/15 bg-black/60 p-5 shadow-[inset_0_0_25px_rgba(0,0,0,0.75)]">
					<div className="text-xs uppercase tracking-widest text-green-300/70">
						TERMINAL OUT
					</div>

					<div className="mt-4 space-y-2 text-sm leading-6">
						{lines.map((l) => (
							<div key={l} className="text-green-300/85">
								{l}
							</div>
						))}

						{current && (
							<div className="text-green-300/85">
								{typed}
								<span className="ml-1 inline-block w-[10px] text-green-200 animate-pulse">
									█
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<style>{`
        @keyframes purgeGlitch {
          0% { transform: translate(0px, 0px); filter: blur(0px); opacity: 1; }
          20% { transform: translate(1px, -1px); filter: blur(0.3px); opacity: 0.95; }
          40% { transform: translate(-1px, 1px); filter: blur(0.2px); opacity: 0.9; }
          60% { transform: translate(2px, 0px); filter: blur(0.4px); opacity: 0.95; }
          80% { transform: translate(-2px, 0px); filter: blur(0.2px); opacity: 0.92; }
          100% { transform: translate(0px, 0px); filter: blur(0px); opacity: 1; }
        }
        .purge-glitch {
          animation: purgeGlitch 220ms linear 1;
          text-shadow: 0 0 18px rgba(34,197,94,0.35);
        }
      `}</style>
		</div>
	);
}
