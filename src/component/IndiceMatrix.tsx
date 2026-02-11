import { useEffect, useState } from "react";

type IndiceMatrixProps = {
  durationMs?: number;
  onDone?: () => void;
};

export default function IndiceMatrix({ durationMs = 5_000, onDone }: IndiceMatrixProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setOpen(false);
      onDone?.();
    }, durationMs);

    return () => window.clearTimeout(t);
  }, [durationMs, onDone]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="POINT D’ACCÈS À LOCALISER"
    >
      <div className="w-full max-w-lg rounded-2xl border border-green-500/20 bg-black/70 p-6 shadow-2xl backdrop-blur">

        <h2 className="mt-2 font-mono text-xl font-semibold text-green-200">
          POINT D’ACCÈS À LOCALISER
        </h2>

        <p className="mt-3 text-sm text-green-100/80">
          Sélectionne une cible pour identifier les points d’accès exploitables.
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="font-mono text-xs text-green-200/70">
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-green-500/10 ring-1 ring-inset ring-green-500/20">
          <div className="h-full w-full origin-left animate-[scanBar_5s_linear_forwards] bg-green-400/30" />
        </div>

        <style>
          {`
            @keyframes scanBar {
              from { transform: scaleX(0); }
              to   { transform: scaleX(1); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
