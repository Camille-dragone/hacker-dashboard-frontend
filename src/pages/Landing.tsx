import landingBg from "../assets/LANDINGHACKER.jpg";

export default function Landing() {
	return (
		<section
			className="min-h-screen w-full bg-cover bg-center flex items-center justify-center font-mono"
			style={{
				backgroundImage: `url(${landingBg})`,
			}}
		>
			<div className="absolute inset-0 bg-black/70" />

			<div
				className="relative z-10 max-w-xl rounded-xl bg-black/60 p-10 text-center
                   backdrop-blur-sm border border-green-500/30
                   shadow-[0_0_30px_rgba(34,197,94,0.15)]"
			>
				<h1 className="mb-4 text-4xl font-bold text-green-400 tracking-widest">
					HACKING
				</h1>

				<p className="text-sm text-green-300">
					Interface de surveillance • Données fictives
				</p>
			</div>
		</section>
	);
}
