"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/Badge/Badge";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";

interface TypeObjetData {
  id: number;
  nom: string;
  image: string | null;
  categorieId: number;
  categorie: { id: number; nom: string };
}

interface CategorieData {
  id: number;
  nom: string;
}

interface ObjectPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: { typeObjetId: number; nb: number }[]) => void;
  spectacleId: number;
  existingBesoins: { typeObjetId: number; nb: number }[];
  typeObjets: TypeObjetData[];
  categories: CategorieData[];
}

interface Selection {
  typeObjet: TypeObjetData;
  nb: number;
}

export default function ObjectPickerModal({
  isOpen,
  onClose,
  onConfirm,
  existingBesoins,
  typeObjets,
  categories,
}: ObjectPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("TOUTES");
  const [selections, setSelections] = useState<Map<number, Selection>>(new Map());
  const [confirming, setConfirming] = useState(false);

  const existingIds = new Set(existingBesoins.map((b) => b.typeObjetId));

  const filtered = useMemo(() => {
    let result = typeObjets;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) => t.nom.toLowerCase().includes(q) || t.categorie.nom.toLowerCase().includes(q)
      );
    }
    if (selectedCategorie !== "TOUTES") {
      result = result.filter((t) => t.categorieId === Number(selectedCategorie));
    }
    return result;
  }, [typeObjets, search, selectedCategorie]);

  function addItem(typeObjet: TypeObjetData) {
    setSelections((prev) => {
      const next = new Map(prev);
      const existing = next.get(typeObjet.id);
      if (existing) {
        next.set(typeObjet.id, { ...existing, nb: existing.nb + 1 });
      } else {
        next.set(typeObjet.id, { typeObjet, nb: 1 });
      }
      return next;
    });
  }

  function removeItem(id: number) {
    setSelections((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

  function updateQuantity(id: number, nb: number) {
    if (nb < 1) return;
    setSelections((prev) => {
      const next = new Map(prev);
      const item = next.get(id);
      if (item) {
        next.set(id, { ...item, nb });
      }
      return next;
    });
  }

  async function handleConfirm() {
    setConfirming(true);
    const items = Array.from(selections.values()).map((s) => ({
      typeObjetId: s.typeObjet.id,
      nb: s.nb,
    }));
    await onConfirm(items);
    setSelections(new Map());
    setSearch("");
    setSelectedCategorie("TOUTES");
    setConfirming(false);
  }

  function handleClose() {
    setSelections(new Map());
    setSearch("");
    setSelectedCategorie("TOUTES");
    onClose();
  }

  if (!isOpen) return null;

  const selectionList = Array.from(selections.values());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-[20px] shadow-2xl w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-[20px] flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-bold font-serif text-[#D00039]">Ajouter des objets</h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Search + Filter */}
        <div className="px-6 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher un type d'objet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
              className="rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif sm:w-48"
            >
              <option value="TOUTES">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((typeObjet) => {
              const isExisting = existingIds.has(typeObjet.id);
              const isSelected = selections.has(typeObjet.id);

              return (
                <div
                  key={typeObjet.id}
                  className={`rounded-[12px] border overflow-hidden transition-all ${
                    isSelected
                      ? "border-[#D00039] shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Image */}
                  <div className="w-full h-24 bg-slate-100 overflow-hidden">
                    {typeObjet.image ? (
                      <img
                        src={typeObjet.image}
                        alt={typeObjet.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-slate-300">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <p className="font-serif font-semibold text-xs text-slate-800 truncate">
                      {typeObjet.nom}
                    </p>
                    <Badge variant="purple">{typeObjet.categorie.nom}</Badge>

                    {isExisting && (
                      <p className="text-[10px] text-green-600 font-semibold mt-1">Déjà assigné</p>
                    )}

                    <button
                      onClick={() => addItem(typeObjet)}
                      className={`w-full mt-2 rounded-[8px] py-1.5 text-xs font-serif font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#FFE3E7] text-[#D00039] hover:bg-[#FFD0D6]"
                          : "bg-[#D00039] text-white hover:bg-[#B00030]"
                      }`}
                    >
                      {isSelected
                        ? `+ Encore (${selections.get(typeObjet.id)!.nb})`
                        : "Ajouter à la liste"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-slate-500 font-serif text-sm py-8">Aucun objet trouvé</p>
          )}
        </div>

        {/* Selection panel (sticky bottom) */}
        {selectionList.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 rounded-b-[20px] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-serif font-semibold text-slate-700">
                {selectionList.length} type{selectionList.length > 1 ? "s" : ""} sélectionné
                {selectionList.length > 1 ? "s" : ""}
              </p>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="bg-[#D00039] text-white font-serif font-bold italic rounded-[12px] px-6 py-2 text-sm hover:bg-[#B00030] transition-colors cursor-pointer disabled:opacity-50"
              >
                {confirming ? "Ajout en cours..." : "Confirmer"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
              {selectionList.map((sel) => (
                <div
                  key={sel.typeObjet.id}
                  className="flex items-center gap-2 bg-white rounded-[10px] border border-slate-200 px-3 py-1.5"
                >
                  <span className="text-xs font-serif font-semibold text-slate-700 truncate max-w-[100px]">
                    {sel.typeObjet.nom}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={sel.nb}
                    onChange={(e) => updateQuantity(sel.typeObjet.id, Number(e.target.value))}
                    className="w-12 text-center text-xs rounded border border-slate-300 py-1"
                  />
                  <button
                    onClick={() => removeItem(sel.typeObjet.id)}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
