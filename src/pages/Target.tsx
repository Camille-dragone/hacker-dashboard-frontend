import { useCallback, useEffect, useMemo, useState } from "react";
import { TargetDetailsOverlay } from "../component/target/TargetDetailsOverlay";

import {
	type Entreprise,
	type EntrepriseCreate,
	type LogOut,
	statusInfo,
} from "../component/target/TargetDomain";
import {
	EntrepriseForm,
	TargetFilters,
	TargetHeader,
	TargetPagination,
	TargetTable,
} from "../component/target/TargetListSection";
import { Card, Modal } from "../component/target/TargetUI";
import { apiFetch } from "../lib/api";

export default function Target() {
	const [items, setItems] = useState<Entreprise[]>([]);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	const [limit] = useState(20);
	const [offset, setOffset] = useState(0);

	const [filtrePays, setFiltrePays] = useState("");
	const [filtreStatut, setFiltreStatut] = useState("");
	const [filtreAcces, setFiltreAcces] = useState("");

	const [modalOpen, setModalOpen] = useState(false);
	const [mode, setMode] = useState<"create" | "edit">("create");
	const [editing, setEditing] = useState<Entreprise | null>(null);

	const [form, setForm] = useState<EntrepriseCreate>({
		nom: "",
		pays: "",
		acces: "public",
		vulnerabilite: "medium",
		statut: "cible",
	});

	const [detailsOpen, setDetailsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [logs, setLogs] = useState<LogOut[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);

	const selected = useMemo(() => {
		if (selectedId == null) return null;
		return items.find((x) => x.id === selectedId) ?? null;
	}, [items, selectedId]);

	const canSubmit = useMemo(() => {
		return form.nom.trim().length > 0 && form.pays.trim().length > 0;
	}, [form.nom, form.pays]);

	const refreshList = useCallback(async () => {
		setLoading(true);
		setErr(null);

		try {
			const q = new URLSearchParams();
			q.set("limit", String(limit));
			q.set("offset", String(offset));
			if (filtrePays) q.set("pays", filtrePays);
			if (filtreStatut) q.set("statut", filtreStatut);
			if (filtreAcces) q.set("acces", filtreAcces);

			const data = await apiFetch<Entreprise[]>(`/entreprises?${q.toString()}`);
			setItems(data);

			setSelectedId((prev) => {
				if (prev == null) return prev;
				return data.some((x) => x.id === prev) ? prev : null;
			});
		} catch (e: unknown) {
			setErr(e instanceof Error ? e.message : "Erreur");
		} finally {
			setLoading(false);
		}
	}, [limit, offset, filtrePays, filtreStatut, filtreAcces]);

	const refreshLogs = useCallback(async (entrepriseId: number) => {
		setLogsLoading(true);
		try {
			const data = await apiFetch<LogOut[]>(
				`/entreprises/${entrepriseId}/logs`,
			);
			setLogs(data.slice(0, 30));
		} catch {
			setLogs([]);
		} finally {
			setLogsLoading(false);
		}
	}, []);

	useEffect(() => {
		void refreshList();
	}, [refreshList]);

	const openCreate = useCallback(() => {
		setMode("create");
		setEditing(null);
		setForm({
			nom: "",
			pays: "",
			acces: "public",
			vulnerabilite: "medium",
			statut: "cible",
		});
		setModalOpen(true);
	}, []);

	const openEdit = useCallback((ent: Entreprise) => {
		setMode("edit");
		setEditing(ent);
		setForm({
			nom: ent.nom,
			pays: ent.pays,
			acces: ent.acces,
			vulnerabilite: ent.vulnerabilite,
			statut: ent.statut,
		});
		setModalOpen(true);
	}, []);

	const submit = useCallback(async () => {
		if (!canSubmit) return;

		setErr(null);
		try {
			if (mode === "create") {
				await apiFetch<Entreprise>("/entreprises", {
					method: "POST",
					body: JSON.stringify(form),
				});
			} else if (mode === "edit" && editing) {
				await apiFetch<Entreprise>(`/entreprises/${editing.id}`, {
					method: "PUT",
					body: JSON.stringify(form),
				});
			}

			setModalOpen(false);
			await refreshList();
		} catch (e: unknown) {
			setErr(e instanceof Error ? e.message : "Erreur");
		}
	}, [canSubmit, mode, editing, form, refreshList]);

	const remove = useCallback(
		async (ent: Entreprise) => {
			const ok = window.confirm(
				`Supprimer "${ent.nom}" ? Cette action est irréversible.`,
			);
			if (!ok) return;

			setErr(null);
			try {
				await apiFetch<{ message: string }>(`/entreprises/${ent.id}`, {
					method: "DELETE",
				});

				if (selectedId === ent.id) {
					setSelectedId(null);
					setLogs([]);
					setDetailsOpen(false);
				}

				await refreshList();
			} catch (e: unknown) {
				setErr(e instanceof Error ? e.message : "Erreur");
			}
		},
		[refreshList, selectedId],
	);

	const hackedAt = useMemo(() => {
		if (!selected) return null;

		const info = statusInfo(selected.statut);
		if (!info.hacked) return null;

		const success100 = logs.find((l) => {
			return (
				l.type === "succes" && l.message.toLowerCase().includes("100% terminé")
			);
		});
		if (success100) return success100.created_at;

		const anySuccess = logs.find((l) => l.type === "succes");
		return anySuccess ? anySuccess.created_at : null;
	}, [logs, selected]);

	const canNext = items.length >= limit && !loading;
	const canPrev = offset > 0 && !loading;

	return (
		<div className="bg-black font-mono min-h-screen">
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_45%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.08),transparent_45%)]" />
			<div className="pointer-events-none fixed inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(34,197,94,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
			<div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

			<div className="relative mx-auto max-w-[1400px] px-4 py-10">
				<TargetHeader />

				{err ? (
					<div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
						{err}
					</div>
				) : null}

				<div className="mt-10">
					<Card
						title=""
						right={
							<button
								type="button"
								onClick={openCreate}
								className="rounded-full border px-3 py-2 text-xs uppercase tracking-widest border-green-500/30 bg-green-500/10 text-green-200 hover:border-green-400/60 hover:bg-green-500/15 active:scale-[0.98]"
							>
								+ Ajouter
							</button>
						}
					>
						<TargetFilters
							filtrePays={filtrePays}
							setFiltrePays={setFiltrePays}
							filtreStatut={filtreStatut}
							setFiltreStatut={setFiltreStatut}
							filtreAcces={filtreAcces}
							setFiltreAcces={setFiltreAcces}
							setOffset={setOffset}
						/>

						<TargetTable
							items={items}
							loading={loading}
							onRowOpenDetails={(ent) => {
								setSelectedId(ent.id);
								setDetailsOpen(true);
								void refreshLogs(ent.id);
							}}
							onEdit={(ent) => openEdit(ent)}
							onRemove={(ent) => void remove(ent)}
						/>

						<TargetPagination
							canPrev={canPrev}
							canNext={canNext}
							offset={offset}
							limit={limit}
							onPrev={() => setOffset((o) => Math.max(0, o - limit))}
							onNext={() => setOffset((o) => o + limit)}
						/>
					</Card>
				</div>
			</div>

			<TargetDetailsOverlay
				open={detailsOpen}
				entreprise={selected}
				logs={logs}
				logsLoading={logsLoading}
				hackedAt={hackedAt}
				onClose={() => setDetailsOpen(false)}
			/>

			<Modal
				open={modalOpen}
				title={
					mode === "create" ? "Nouvelle entreprise" : "Modifier entreprise"
				}
				onClose={() => setModalOpen(false)}
			>
				<EntrepriseForm
					form={form}
					setForm={setForm}
					canSubmit={canSubmit}
					mode={mode}
					onCancel={() => setModalOpen(false)}
					onSubmit={() => void submit()}
				/>
			</Modal>
		</div>
	);
}
