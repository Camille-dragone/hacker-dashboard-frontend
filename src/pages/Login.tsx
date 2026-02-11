import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import IndiceLogin from "../component/IndiceLogin";

type RedDrop = {
	char: string;
	col: number;
	y: number;
	speed: number;
};

export default function Login() {
	const navigate = useNavigate();

	const EXPECTED_PASSWORD = "MaTrIx";
	const [user] = useState("Camille-hacker");
	const [pass, setPass] = useState("");
	const [phase, setPhase] = useState<
		"idle" | "verifying" | "granted" | "denied"
	>("idle");

	const inputRef = useRef<HTMLInputElement | null>(null);
	const focusPass = useCallback(() => {
		requestAnimationFrame(() => inputRef.current?.focus());
	}, []);

	const [deniedFx, setDeniedFx] = useState(false);

	const [showIndice, setShowIndice] = useState(true);

	const [showHint, setShowHint] = useState(false);
	const [hintIndex, setHintIndex] = useState(0);

	const HINTS = [
		"Les caractères rouges forment le mot de passe. Observe attentivement la séquence.",
		"Le mot de passe est sensible à la casse : respecte majuscules et minuscules.",
		"La première lettre est « M ».",
		"Le mot de passe contient exactement trois majuscules.",
		"La dernière lettre est « x ».",
		"Le mot de passe correspond au nom d'un film.",
	] as const;

	const openHint = () => {
		setShowHint(true);
		setHintIndex((i) => (i + 1) % HINTS.length);
	};

	const closeHint = useCallback(() => {
		setShowHint(false);
		focusPass();
	}, [focusPass]);

	const uiCfg = useMemo(
		() => ({
			verifyingMs: 900,
			grantedMs: 900,
			deniedMs: 1800,
			stressMs: 2600,
			deniedFlashMs: 260,
			deniedShakeMs: 650,
		}),
		[],
	);
	useEffect(() => {
		focusPass();
	}, [focusPass]);

	useEffect(() => {
		if (!showHint) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeHint();
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [showHint, closeHint]);

	const canSubmit = pass.trim().length > 0 && phase === "idle";
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const matrixCfg = useMemo(
		() => ({
			fontSize: 36,
			fade: 0.035,

			greenSpeedMin: 0.08,
			greenSpeedMax: 0.18,

			redSpeedMin: 0.012,
			redSpeedMax: 0.025,

			stressSpeedMul: 10.0,
			stressFadeMul: 3.1,

			green: "#50FFA0",
			red: "#FF3C3C",

			injectedPassword: "MaTrIx",
			injectEveryMs: 1100,

			maxRedDrops: 180,
		}),
		[],
	);

	const dropsRef = useRef<number[]>([]);
	const speedsRef = useRef<number[]>([]);
	const colsRef = useRef(0);
	const rowsRef = useRef(0);
	const redDropsRef = useRef<RedDrop[]>([]);
	const injectIndexRef = useRef(0);
	const stressUntilRef = useRef<number>(0);
	const cycleSpeedRef = useRef<number | null>(null);

	const submit = () => {
		if (!canSubmit) return;

		setPhase("verifying");

		window.setTimeout(() => {
			const ok = pass === EXPECTED_PASSWORD;

			if (ok) {
				setPhase("granted");
				window.setTimeout(() => navigate("/dashboard"), uiCfg.grantedMs);
				return;
			}

			stressUntilRef.current = Date.now() + uiCfg.stressMs;

			setPhase("denied");
			setDeniedFx(true);
			window.setTimeout(
				() => setDeniedFx(false),
				Math.max(uiCfg.deniedFlashMs, uiCfg.deniedShakeMs),
			);

			window.setTimeout(() => {
				setPass("");
				setPhase("idle");
				focusPass();
			}, uiCfg.deniedMs);
		}, uiCfg.verifyingMs);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.textBaseline = "top";

		const rand = (min: number, max: number) =>
			min + Math.random() * (max - min);

		const resize = () => {
			const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
			const w = Math.floor(window.innerWidth);
			const h = Math.floor(window.innerHeight);

			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const cols = Math.floor(w / matrixCfg.fontSize);
			const rows = Math.floor(h / matrixCfg.fontSize);

			colsRef.current = Math.max(1, cols);
			rowsRef.current = Math.max(1, rows);

			dropsRef.current = Array.from(
				{ length: colsRef.current },
				() => Math.random() * rowsRef.current,
			);

			speedsRef.current = Array.from({ length: colsRef.current }, () =>
				rand(matrixCfg.greenSpeedMin, matrixCfg.greenSpeedMax),
			);
		};

		resize();
		window.addEventListener("resize", resize);

		const injectTimer = window.setInterval(() => {
			if (colsRef.current <= 0) return;

			if (injectIndexRef.current === 0) {
				cycleSpeedRef.current = rand(
					matrixCfg.redSpeedMin,
					matrixCfg.redSpeedMax,
				);
			}

			const idx = injectIndexRef.current;
			const char = matrixCfg.injectedPassword[idx];

			redDropsRef.current.push({
				char,
				col: Math.floor(Math.random() * colsRef.current),
				y: -4,
				speed:
					cycleSpeedRef.current ??
					rand(matrixCfg.redSpeedMin, matrixCfg.redSpeedMax),
			});

			injectIndexRef.current += 1;

			if (injectIndexRef.current >= matrixCfg.injectedPassword.length) {
				injectIndexRef.current = 0;
			}

			if (redDropsRef.current.length > matrixCfg.maxRedDrops) {
				redDropsRef.current.splice(
					0,
					redDropsRef.current.length - matrixCfg.maxRedDrops,
				);
			}
		}, matrixCfg.injectEveryMs);

		let raf = 0;

		const tick = () => {
			const w = window.innerWidth;
			const h = window.innerHeight;

			const stress = Date.now() < stressUntilRef.current;

			const fade = stress
				? Math.min(0.28, matrixCfg.fade * matrixCfg.stressFadeMul)
				: matrixCfg.fade;

			const speedMul = stress ? matrixCfg.stressSpeedMul : 1;

			ctx.fillStyle = `rgba(0,0,0,${fade})`;
			ctx.fillRect(0, 0, w, h);

			ctx.font = `${matrixCfg.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

			const cols = colsRef.current;
			const rows = rowsRef.current;

			ctx.fillStyle = matrixCfg.green;
			for (let col = 0; col < cols; col++) {
				const row = Math.floor(dropsRef.current[col]);

				const x = Math.round(col * matrixCfg.fontSize);
				const y = Math.round(row * matrixCfg.fontSize);

				ctx.fillText(Math.random() < 0.5 ? "0" : "1", x, y);

				dropsRef.current[col] += speedsRef.current[col] * speedMul;

				const respawnChance = stress ? 0.94 : 0.992;

				if (dropsRef.current[col] > rows && Math.random() > respawnChance) {
					dropsRef.current[col] = 0;
					speedsRef.current[col] = rand(
						matrixCfg.greenSpeedMin,
						matrixCfg.greenSpeedMax,
					);
				}
			}

			ctx.fillStyle = matrixCfg.red;
			for (const d of redDropsRef.current) {
				d.y += d.speed * (stress ? 1.9 : 1);

				const x = Math.round(d.col * matrixCfg.fontSize);
				const y = Math.round(Math.floor(d.y) * matrixCfg.fontSize);

				ctx.fillText(d.char, x, y);
			}

			redDropsRef.current = redDropsRef.current.filter((d) => d.y <= rows + 14);

			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
			window.clearInterval(injectTimer);
		};
	}, [matrixCfg]);

	const panelShakeClass =
		phase === "denied" && deniedFx ? "animate-[shake_0.22s_linear_0s_3]" : "";

	const flashRed = phase === "denied" && deniedFx ? "opacity-30" : "opacity-0";

	return (
		<div className="relative h-screen w-screen overflow-hidden bg-black font-mono">
			{showIndice && (
				<IndiceLogin
					durationMs={5_000}
					onDone={() => {
						setShowIndice(false);
						focusPass();
					}}
				/>
			)}

			{showHint && (
				<div
					className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4"
					role="dialog"
					aria-modal="true"
					aria-label="Indice"
					onMouseDown={(e) => {
						if (e.target === e.currentTarget) closeHint();
					}}
				>
					<div className="w-full max-w-md rounded-2xl border border-green-500/20 bg-black/80 p-5 shadow-2xl backdrop-blur">
						<div className="text-xs tracking-[0.35em] text-green-300/70">
							INDICE N°{hintIndex + 1}
						</div>

						<div className="mt-3 font-mono text-sm text-green-100/85">
							<span className="text-green-400">{">"}</span> {HINTS[hintIndex]}
						</div>

						<div className="mt-4 flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={closeHint}
								className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-200/80 hover:bg-green-500/15"
							>
								OK
							</button>
						</div>
					</div>
				</div>
			)}

			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

			<div
				className={`pointer-events-none absolute inset-0 bg-red-500 transition-opacity duration-150 ${flashRed}`}
			/>
			<div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.10),transparent_45%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.06),transparent_45%)]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.90)_100%)]" />

			<div className="absolute inset-0 flex items-center justify-center p-6">
				<button
					type="button"
					onMouseDown={focusPass}
					className={[
						"relative z-20 w-[min(520px,92vw)] rounded-2xl border bg-black/70 p-6 text-left",
						"shadow-[0_0_90px_rgba(34,197,94,0.12)] backdrop-blur-[2px]",
						phase === "denied"
							? "border-red-500/35 shadow-[0_0_90px_rgba(239,68,68,0.16)]"
							: "border-green-500/25",
						panelShakeClass,
					].join(" ")}
				>
					<div className="text-xs tracking-[0.35em] text-green-300/70">
						SECURE ACCESS
					</div>

					<div className="mt-4 space-y-3 text-sm text-green-200/90">
						<div className="flex items-center gap-3">
							<span className="text-green-400">USER :</span>
							<span className="text-green-200">{user}</span>
						</div>

						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-3">
								<span className="text-green-400">PASS :</span>
								<span className="text-green-200">
									{pass}
									{phase === "idle" && <span className="animate-pulse">▌</span>}
								</span>
							</div>

							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									openHint();
								}}
								className="pointer-events-auto mt-4 w-fit self-start rounded-lg border border-green-500/20 bg-green-500/10 px-2 py-1 text-[11px] tracking-widest text-green-200/80 hover:bg-green-500/15"
							>
								INDICE
							</button>
						</div>

						<div className="mt-4 text-green-300/70">
							{phase === "verifying" && (
								<div>
									<span className="text-green-400">{">"}</span> VERIFYING…
								</div>
							)}
							{phase === "granted" && (
								<div className="text-green-200">
									<span className="text-green-400">{">"}</span> ACCESS GRANTED
								</div>
							)}
							{phase === "denied" && (
								<div className="text-red-300">
									<span className="text-red-400">{">"}</span> ACCESS DENIED
								</div>
							)}
						</div>

						{(phase === "verifying" ||
							phase === "granted" ||
							phase === "denied") && (
							<div className="mt-4 h-[2px] w-full overflow-hidden rounded bg-green-500/10">
								<div
									className="h-full bg-green-400/70"
									style={{
										width:
											phase === "verifying"
												? "60%"
												: phase === "granted"
													? "100%"
													: "25%",
										transition: "width 700ms linear",
									}}
								/>
							</div>
						)}
					</div>

					<style>
						{`
              @keyframes shake {
                0% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-8px); }
                80% { transform: translateX(8px); }
                100% { transform: translateX(0); }
              }
            `}
					</style>

					<input
						ref={inputRef}
						value={pass}
						onChange={(e) => setPass(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") submit();
						}}
						className="absolute left-[-9999px] top-[-9999px]"
						autoComplete="off"
						spellCheck={false}
					/>
				</button>
			</div>

			<button
				type="button"
				onClick={focusPass}
				className="absolute inset-0 z-10 cursor-text bg-transparent"
				aria-label="Focus password input"
			/>
		</div>
	);
}
