import React from "react";

export default function TablesModesModal({ isOpen, onClose, onSelectMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenu du modal */}
      <div className="relative z-30 w-full max-w-md bg-white/10 border border-white/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-8 md:p-10 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Choisis ton mode
            </h2>
            <p className="text-sm text-slate-100/80 mt-1">
              Sélectionne un mode de jeu pour travailler tes tables.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-100/70 hover:text-white text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-6">
          {/* GROS BOUTON APPRENTISSAGE */}
          <button
            type="button"
            onClick={() => onSelectMode("entrainement")}
            className="w-full h-14 rounded-full bg-white/15 hover:bg-white/20 border border-white/25 shadow-lg px-6 flex items-center justify-center transition"
          >
            <span className="text-base md:text-lg font-semibold tracking-wide">
              Apprentissage
            </span>
          </button>

          {/* Séparateur */}
          <div className="h-px bg-white/15" />

          {/* 4 BOUTONS EN GRILLE 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onSelectMode("entrainement")}
              className="w-full h-20 rounded-2xl bg-emerald-500/90 hover:bg-emerald-400 shadow-lg p-3 flex flex-col justify-center items-center transition"
            >
              <span className="text-sm font-semibold">Entraînement</span>
              <span className="text-[0.7rem] opacity-90">
                Mode libre, sans pression
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode("chrono")}
              className="w-full h-20 rounded-2xl bg-indigo-500/90 hover:bg-indigo-400 shadow-lg p-3 flex flex-col justify-center items-center transition"
            >
              <span className="text-sm font-semibold">Chrono</span>
              <span className="text-[0.7rem] opacity-90">
                Réponds vite, le temps compte
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode("survie")}
              className="w-full h-20 rounded-2xl bg-rose-500/90 hover:bg-rose-400 shadow-lg p-3 flex flex-col justify-center items-center transition"
            >
              <span className="text-sm font-semibold">Survie</span>
              <span className="text-[0.7rem] opacity-90">
                Une erreur et c&apos;est fini
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode("defi30")}
              className="w-full h-20 rounded-2xl bg-amber-400/95 hover:bg-amber-300 shadow-lg p-3 flex flex-col justify-center items-center transition"
            >
              <span className="text-sm font-semibold">Défi 30s</span>
              <span className="text-[0.7rem] opacity-90">
                Max de bonnes réponses
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
