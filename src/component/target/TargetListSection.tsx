import type { Entreprise, EntrepriseCreate } from "./TargetDomain";
import { barClass, cls, statusInfo, threatPct } from "./TargetDomain";
import { Badge, TextInput } from "./TargetUI";

export function TargetHeader() {
	return (
		<div className="flex items-start justify-between gap-6">
			<h1 className="mt-2 text-xl md:text-2xl lg:text-3xl font-extrabold tracking-[0.35em] text-green-400 drop-shadow-[0_0_35px_rgba(34,197,94,0.35)]">
				CENTRE DE CONTRÔLES DES CIBLES
			</h1>
		</div>
	);
}

export function TargetFilters({
	filtrePays,
	setFiltrePays,
	filtreStatut,
	setFiltreStatut,
	filtreAcces,
	setFiltreAcces,
	setOffset,
}: {
	filtrePays: string;
	setFiltrePays: React.Dispatch<React.SetStateAction<string>>;
	filtreStatut: string;
	setFiltreStatut: React.Dispatch<React.SetStateAction<string>>;
	filtreAcces: string;
	setFiltreAcces: React.Dispatch<React.SetStateAction<string>>;
	setOffset: React.Dispatch<React.SetStateAction<number>>;
}) {
	return (
		<div className="grid grid-cols-1 gap-2 md:grid-cols-3">
			<TextInput
				placeholder="Pays"
				value={filtrePays}
				onChange={(e) => {
					setOffset(0);
					setFiltrePays(e.target.value);
				}}
			/>
			<TextInput
				placeholder="Statut"
				value={filtreStatut}
				onChange={(e) => {
					setOffset(0);
					setFiltreStatut(e.target.value);
				}}
			/>
			<TextInput
				placeholder="Accès"
				value={filtreAcces}
				onChange={(e) => {
					setOffset(0);
					setFiltreAcces(e.target.value);
				}}
			/>
		</div>
	);
}

export function vulnBadge(vuln: string) {
	const v = (vuln || "").toLowerCase();

	if (v.includes("critical")) return <Badge label={vuln} variant="red" />;
	if (v.includes("high")) return <Badge label={vuln} variant="yellow" />;
	if (v.includes("medium")) return <Badge label={vuln} variant="cyan" />;
	if (v.includes("low")) return <Badge label={vuln} variant="green" />;

	return <Badge label={vuln} variant="dim" />;
}

export function statutBadge(statut: string) {
	const info = statusInfo(statut);
	return <Badge label={info.label} variant={info.badgeVariant} />;
}

export function TargetTable({
	items,
	loading,
	onRowOpenDetails,
	onEdit,
	onRemove,
}: {
	items: Entreprise[];
	loading: boolean;
	onRowOpenDetails: (ent: Entreprise) => void;
	onEdit: (ent: Entreprise) => void;
	onRemove: (ent: Entreprise) => void;
}) {
	return (
		<div className="mt-4 overflow-x-auto rounded-xl border border-green-500/15 bg-black/60">
			<table className="w-full min-w-[1100px] border-collapse text-left text-sm">
				<thead className="bg-green-500/10 text-green-200">
					<tr>
						<th className="px-4 py-3 w-[280px]">Entreprises</th>
						<th className="px-4 py-3 w-[90px]">Pays</th>
						<th className="px-4 py-3 w-[130px]">Accès</th>
						<th className="px-4 py-3 w-[240px]">Vulnérabilité</th>
						<th className="px-4 py-3 w-[160px]">Statut</th>
						<th className="px-4 py-3 w-[220px]">Niveau menace</th>
						<th className="px-4 py-3 w-[220px] text-right">Actions</th>
					</tr>
				</thead>

				<tbody className="divide-y divide-green-500/10">
					{items.map((ent) => {
						const pct = threatPct(ent);
						const pulse = pct > 70;

						return (
							<tr
								key={ent.id}
								onClick={() => onRowOpenDetails(ent)}
								className="cursor-pointer hover:bg-green-500/5"
							>
								<td className="px-4 py-3 font-medium">
									<div className="flex items-center gap-2">
										<span className="text-green-100">{ent.nom}</span>
										<span className="text-xs text-green-300/40">#{ent.id}</span>
									</div>
								</td>

								<td className="px-4 py-3 text-green-200/90">{ent.pays}</td>

								<td className="px-4 py-3">
									<Badge label={ent.acces} variant="dim" />
								</td>

								<td className="px-4 py-3">
									<div className="inline-flex">
										{vulnBadge(ent.vulnerabilite)}
									</div>
								</td>

								<td className="px-4 py-3">{statutBadge(ent.statut)}</td>

								<td className="px-4 py-3">
									<div className="h-2 w-[200px] rounded-full bg-black/60 border border-green-500/10 overflow-hidden">
										<div
											className={cls(
												"h-full",
												barClass(pct),
												pulse && "animate-pulse",
											)}
											style={{ width: `${pct}%` }}
										/>
									</div>
								</td>

								<td className="px-4 py-3">
									{/* biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation volontaire */}
									{/* biome-ignore lint/a11y/useKeyWithClickEvents: boutons internes gèrent le clic */}
									<div
										className="flex justify-end gap-2"
										onClick={(e) => e.stopPropagation()}
									>
										<button
											type="button"
											onClick={() => onEdit(ent)}
											className="rounded-full border px-3 py-2 text-[11px] uppercase tracking-widest border-green-500/20 bg-black/40 text-green-300/80 hover:border-green-400/40 hover:text-green-200"
										>
											Modifier
										</button>

										<button
											type="button"
											onClick={() => onRemove(ent)}
											className="rounded-full border px-3 py-2 text-[11px] uppercase tracking-widest border-red-500/20 bg-black/40 text-red-200/80 hover:border-red-400/40 hover:text-red-200"
										>
											Supprimer
										</button>
									</div>
								</td>
							</tr>
						);
					})}

					{items.length === 0 && !loading ? (
						<tr>
							<td
								colSpan={7}
								className="px-4 py-10 text-center text-green-300/50"
							>
								Aucune entreprise.
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
}

export function TargetPagination({
	canPrev,
	canNext,
	offset,
	limit,
	onPrev,
	onNext,
}: {
	canPrev: boolean;
	canNext: boolean;
	offset: number;
	limit: number;
	onPrev: () => void;
	onNext: () => void;
}) {
	return (
		<div className="mt-4 flex items-center justify-between">
			<button
				type="button"
				disabled={!canPrev}
				onClick={onPrev}
				className={cls(
					"rounded-full border px-3 py-2 text-xs uppercase tracking-widest",
					canPrev
						? "border-green-500/20 bg-black/40 text-green-300/80 hover:border-green-400/40 hover:text-green-200"
						: "border-green-500/10 bg-black/30 text-green-300/30 cursor-not-allowed",
				)}
			>
				← Prev
			</button>

			<div className="text-xs text-green-300/50">
				offset {offset} • limit {limit}
			</div>

			<button
				type="button"
				disabled={!canNext}
				onClick={onNext}
				className={cls(
					"rounded-full border px-3 py-2 text-xs uppercase tracking-widest",
					canNext
						? "border-green-500/20 bg-black/40 text-green-300/80 hover:border-green-400/40 hover:text-green-200"
						: "border-green-500/10 bg-black/30 text-green-300/30 cursor-not-allowed",
				)}
			>
				Next →
			</button>
		</div>
	);
}

export function EntrepriseForm({
	form,
	setForm,
	canSubmit,
	mode,
	onCancel,
	onSubmit,
}: {
	form: EntrepriseCreate;
	setForm: React.Dispatch<React.SetStateAction<EntrepriseCreate>>;
	canSubmit: boolean;
	mode: "create" | "edit";
	onCancel: () => void;
	onSubmit: () => void;
}) {
	return (
		<div className="grid grid-cols-1 gap-3">
			<div>
				<div className="mb-1 text-xs text-green-300/70 uppercase tracking-widest">
					Entreprise
				</div>
				<TextInput
					value={form.nom}
					onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
					placeholder="Umbrella Corp"
				/>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div>
					<div className="mb-1 text-xs text-green-300/70 uppercase tracking-widest">
						Pays
					</div>
					<TextInput
						value={form.pays}
						onChange={(e) => setForm((f) => ({ ...f, pays: e.target.value }))}
						placeholder="FR"
					/>
				</div>

				<div>
					<div className="mb-1 text-xs text-green-300/70 uppercase tracking-widest">
						Accès
					</div>
					<TextInput
						value={form.acces}
						onChange={(e) => setForm((f) => ({ ...f, acces: e.target.value }))}
						placeholder="vpn / intranet / public"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div>
					<div className="mb-1 text-xs text-green-300/70 uppercase tracking-widest">
						Vulnérabilité
					</div>
					<TextInput
						value={form.vulnerabilite}
						onChange={(e) =>
							setForm((f) => ({ ...f, vulnerabilite: e.target.value }))
						}
						placeholder="low / medium / high / critical"
					/>
				</div>

				<div>
					<div className="mb-1 text-xs text-green-300/70 uppercase tracking-widest">
						Statut
					</div>
					<TextInput
						value={form.statut}
						onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value }))}
						placeholder="cible / analyse / compromis / securise"
					/>
				</div>
			</div>

			<div className="mt-2 flex items-center justify-end gap-2">
				<button
					type="button"
					onClick={onCancel}
					className="rounded-xl border border-green-500/20 bg-black/40 px-3 py-2 text-xs uppercase tracking-widest text-green-300/80 hover:border-green-400/40 hover:text-green-200"
				>
					Annuler
				</button>

				<button
					type="button"
					disabled={!canSubmit}
					onClick={onSubmit}
					className={cls(
						"rounded-xl border px-3 py-2 text-xs uppercase tracking-widest",
						canSubmit
							? "border-green-500/30 bg-green-500/10 text-green-200 hover:border-green-400/60 hover:bg-green-500/15"
							: "border-green-500/10 bg-black/30 text-green-300/30 cursor-not-allowed",
					)}
				>
					{mode === "create" ? "Créer" : "Enregistrer"}
				</button>
			</div>
		</div>
	);
}
