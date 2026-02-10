import { useEffect } from "react";

type ConfirmDeleteProps = {
	open: boolean;
	targetName: string;
	loading?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

export function ConfirmDelete({
	open,
	targetName,
	loading = false,
	onCancel,
	onConfirm,
}: ConfirmDeleteProps) {
	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-label="Confirmation suppression"
		>
			<button
				type="button"
				aria-label="Fermer"
				onClick={onCancel}
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
			/>

			<div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-green-500/20 bg-black/60 p-5 shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_0_60px_rgba(34,197,94,0.08)]">
				<div className="pointer-events-none absolute inset-0 opacity-30">
					<div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-[size:100%_6px]" />
				</div>

				<div className="relative">
					<div className="mb-3 text-xs tracking-[0.25em] text-green-200/70">
						CONFIRMATION
					</div>

					<h3 className="text-lg font-semibold text-green-100">
						Supprimer &quot;{targetName}&quot; ?
					</h3>

					<p className="mt-2 text-sm text-green-100/70">
						Cette action est irréversible.
					</p>

					<div className="mt-5 flex items-center justify-end gap-2">
						<button
							type="button"
							onClick={onCancel}
							disabled={loading}
							className="rounded-lg border border-green-500/20 bg-black/40 px-4 py-2 text-sm text-green-100/80 transition hover:bg-black/55 disabled:cursor-not-allowed disabled:opacity-60"
						>
							Annuler
						</button>

						<button
							type="button"
							onClick={onConfirm}
							disabled={loading}
							className="rounded-lg border border-red-500/25 bg-red-500/15 px-4 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? "Suppression…" : "Supprimer"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
