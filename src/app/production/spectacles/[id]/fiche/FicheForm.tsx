"use client";

import { useState, useRef } from "react";

type Section = { id: number; title: string; body: string };

function parseSections(texte: string): Section[] {
  try {
    const parsed = JSON.parse(texte);
    if (Array.isArray(parsed)) {
      return parsed.map((s, i) => ({ id: i + 1, title: s.title ?? "", body: s.body ?? "" }));
    }
  } catch {}
  // Ancien format texte brut : on crée une section unique
  return texte ? [{ id: 1, title: "", body: texte }] : [];
}

export default function FicheForm({
  spectacleTitre,
  fiche,
  createAction,
  updateAction,
  deleteAction,
}: {
  spectacleTitre: string;
  fiche?: { texte: string } | null;
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const isEdit = !!fiche;
  const [sections, setSections] = useState<Section[]>(() =>
    isEdit
      ? parseSections(fiche!.texte)
      : [
          { id: 1, title: "Durée du spectacle :", body: "" },
          { id: 2, title: "Scénographie :", body: "" },
          { id: 3, title: "Espace scénique :", body: "" },
          { id: 4, title: "Temps d'installation :", body: "" },
          { id: 5, title: "Sonorisation :", body: "" },
          { id: 6, title: "Position du public :", body: "" },
          { id: 7, title: "Jauge maximum :", body: "" },
        ]
  );
  const [confirmeSuppr, setConfirmeSuppr] = useState(false);
  const nextId = useRef(isEdit ? parseSections(fiche!.texte).length + 1 : 8);

  const add = () => setSections((p) => [...p, { id: nextId.current++, title: "", body: "" }]);

  const remove = (id: number) => setSections((p) => p.filter((s) => s.id !== id));

  const move = (id: number, dir: -1 | 1) =>
    setSections((p) => {
      const i = p.findIndex((s) => s.id === id);
      if (i + dir < 0 || i + dir >= p.length) return p;
      const next = [...p];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });

  const update = (id: number, field: "title" | "body", val: string) =>
    setSections((p) => p.map((s) => (s.id === id ? { ...s, [field]: val } : s)));

  const texteJSON = JSON.stringify(sections.map(({ title, body }) => ({ title, body })));

  const sectionEditor = (
    <div>
      <label className="block font-semibold mb-2">Contenu de la fiche *</label>

      {sections.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-5 border border-dashed border-slate-300 rounded-md mb-2">
          Aucune section — cliquez sur « + Ajouter une section » pour commencer.
        </p>
      )}

      {sections.map((s, i) => (
        <div key={s.id} className="border border-slate-200 rounded-lg p-4 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-400 w-5">{i + 1}.</span>
            <input
              type="text"
              value={s.title}
              onChange={(e) => update(s.id, "title", e.target.value)}
              placeholder="Titre de la section…"
              className="flex-1 border-b border-slate-300 bg-transparent text-sm font-medium focus:border-[#D00039] outline-none pb-1"
            />
            <button
              type="button"
              onClick={() => move(s.id, -1)}
              disabled={i === 0}
              className="px-2 py-1 text-xs border border-slate-200 rounded disabled:opacity-30 hover:bg-slate-50"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(s.id, 1)}
              disabled={i === sections.length - 1}
              className="px-2 py-1 text-xs border border-slate-200 rounded disabled:opacity-30 hover:bg-slate-50"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(s.id)}
              className="px-2 py-1 text-xs border border-slate-200 rounded hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            >
              ✕
            </button>
          </div>
          <textarea
            value={s.body}
            onChange={(e) => update(s.id, "body", e.target.value)}
            placeholder="Contenu du paragraphe…"
            rows={4}
            className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none resize-y"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full py-2 mb-2 border border-dashed border-slate-300 rounded-md text-sm text-slate-400 hover:border-[#D00039] hover:text-[#D00039] hover:bg-red-50 transition-colors"
      >
        + Ajouter une section
      </button>

      <input type="hidden" name="texte" value={texteJSON} />
    </div>
  );

  /* ---- MODE ÉDITION ---- */
  if (isEdit) {
    return (
      <div className="grid gap-6">
        <p className="font-semibold">Nom du spectacle : {spectacleTitre}</p>

        {/* Formulaire de modification */}
        <form action={updateAction} className="grid gap-4">
          {sectionEditor}
          <button
            type="submit"
            disabled={sections.length === 0}
            className="px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] disabled:opacity-40 transition-colors"
          >
            ✏️ Enregistrer les modifications
          </button>
        </form>

        {/* Zone suppression */}
        <div className="border-t border-slate-100 pt-4">
          {!confirmeSuppr ? (
            <button
              type="button"
              onClick={() => setConfirmeSuppr(true)}
              className="w-full py-2 text-sm border border-red-200 text-red-500 bg-white hover:bg-red-50 rounded-md transition-colors"
            >
              🗑️ Supprimer la fiche technique
            </button>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="flex-1 text-sm text-red-700 font-medium">Confirmer la suppression ?</p>
              <form action={deleteAction}>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </form>
              <button
                type="button"
                onClick={() => setConfirmeSuppr(false)}
                className="px-4 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---- MODE CRÉATION ---- */
  return (
    <form action={createAction} className="grid gap-4">
      <p className="font-semibold">Nom du spectacle : {spectacleTitre}</p>
      {sectionEditor}
      <button
        type="submit"
        disabled={sections.length === 0}
        className="mt-2 px-6 py-3 bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] disabled:opacity-40 transition-colors"
      >
        ➕ Ajouter la fiche technique
      </button>
    </form>
  );
}
