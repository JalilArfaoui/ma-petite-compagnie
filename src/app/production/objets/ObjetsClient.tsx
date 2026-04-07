"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Input } from "@/components/ui/Input/Input";
import {
  createTypeObjet,
  updateTypeObjet,
  deleteTypeObjet,
  createObjet,
  updateObjet,
  deleteObjet,
  createReservation,
} from "./actions";

// ========== Types ==========

type EtatObjet = "NEUF" | "ABIME" | "CASSE";

interface ObjetData {
  id: number;
  etat: EtatObjet;
  estDisponible: boolean;
  commentaire: string | null;
  compagnie: { id: number; nom: string };
  reservations: {
    id: number;
    representation: {
      id: number;
      date: string;
      spectacle: { titre: string };
      lieu: { libelle: string };
    };
  }[];
}

interface TypeObjetData {
  id: number;
  nom: string;
  image: string | null;
  categorieId: number;
  categorie: { id: number; nom: string };
  objets: ObjetData[];
}

interface CategorieData {
  id: number;
  nom: string;
}

interface CompagnieData {
  id: number;
  nom: string;
}

interface RepresentationData {
  id: number;
  date: string;
  spectacle: { titre: string };
  lieu: { libelle: string };
}

interface ObjetsClientProps {
  typesObjets: TypeObjetData[];
  categories: CategorieData[];
  compagnies: CompagnieData[];
  representations: RepresentationData[];
}

// ========== Helpers ==========

const etatConfig: Record<
  EtatObjet,
  { label: string; variant: "green" | "orange" | "red"; emoji: string }
> = {
  NEUF: { label: "Neuf", variant: "green", emoji: "✅" },
  ABIME: { label: "Abîmé", variant: "orange", emoji: "⚠️" },
  CASSE: { label: "Cassé", variant: "red", emoji: "❌" },
};

const etatOrder: Record<EtatObjet, number> = {
  NEUF: 0,
  ABIME: 1,
  CASSE: 2,
};

function countByEtat(objets: ObjetData[]) {
  const counts: Record<EtatObjet, number> = { NEUF: 0, ABIME: 0, CASSE: 0 };
  for (const o of objets) {
    counts[o.etat]++;
  }
  return counts;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ========== Modal Component ==========

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#D00039]">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ========== TypeObjet Card ==========

function TypeObjetCard({
  typeObjet,
  categories,
  compagnies,
  representations,
}: {
  typeObjet: TypeObjetData;
  categories: CategorieData[];
  compagnies: CompagnieData[];
  representations: RepresentationData[];
}) {
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockEtatFilter, setStockEtatFilter] = useState<"TOUS" | EtatObjet>("TOUS");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showAddObjetModal, setShowAddObjetModal] = useState(false);

  const counts = countByEtat(typeObjet.objets);
  const total = typeObjet.objets.length;
  const availableCount = typeObjet.objets.filter((o) => o.estDisponible).length;

  const stockObjets = useMemo(() => {
    const filtered =
      stockEtatFilter === "TOUS"
        ? typeObjet.objets
        : typeObjet.objets.filter((o) => o.etat === stockEtatFilter);

    return [...filtered].sort((a, b) => {
      const etatDiff = etatOrder[a.etat] - etatOrder[b.etat];
      if (etatDiff !== 0) {
        return etatDiff;
      }

      return a.id - b.id;
    });
  }, [stockEtatFilter, typeObjet.objets]);

  const availableObjets = typeObjet.objets.filter((o) => o.estDisponible);

  return (
    <>
      <Card className="relative overflow-hidden border border-slate-200/70 hover:shadow-lg transition-all bg-white">
        {/* Image */}
        <div className="w-full h-40 bg-slate-100 rounded-xl overflow-hidden mb-4">
          {typeObjet.image ? (
            <Image
              src={typeObjet.image}
              alt={typeObjet.nom}
              width={400}
              height={160}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">
              📦
            </div>
          )}
        </div>

        {/* Title & Category */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">{typeObjet.nom}</h3>
          <Badge variant="purple">{typeObjet.categorie.nom}</Badge>
        </div>

        {/* Inventory count */}
        <p className="text-sm text-slate-600 mb-4">
          <strong>{total}</strong> en inventaire · <strong>{availableCount}</strong> disponible
          {availableCount > 1 ? "s" : ""}
        </p>

        {/* État breakdown */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(["NEUF", "ABIME", "CASSE"] as EtatObjet[]).map((etat) =>
            counts[etat] > 0 ? (
              <Badge key={etat} variant={etatConfig[etat].variant}>
                {etatConfig[etat].emoji} {etatConfig[etat].label}: {counts[etat]}
              </Badge>
            ) : null
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStockModal(true)}>
            📦 Stock
          </Button>
          <Button variant="solid" size="sm" onClick={() => setShowEditModal(true)}>
            ✏️ Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowReserveModal(true)}>
            📅 Réserver
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddObjetModal(true)}>
            ➕ Ajouter objet
          </Button>
        </div>
      </Card>

      {/* Modal: Stock */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title={`Stock: ${typeObjet.nom}`}
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600">Filtrer par état:</span>
          <button
            type="button"
            onClick={() => setStockEtatFilter("TOUS")}
            className={`h-8 px-3 text-xs rounded-md border cursor-pointer transition-colors ${
              stockEtatFilter === "TOUS"
                ? "bg-[#D00039] text-white border-[#D00039]"
                : "border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tous
          </button>
          {(["NEUF", "ABIME", "CASSE"] as EtatObjet[]).map((etat) => (
            <button
              key={etat}
              type="button"
              onClick={() => setStockEtatFilter(etat)}
              className={`h-8 px-3 text-xs rounded-md border cursor-pointer transition-colors ${
                stockEtatFilter === etat
                  ? "bg-[#D00039] text-white border-[#D00039]"
                  : "border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {etatConfig[etat].emoji} {etatConfig[etat].label}
            </button>
          ))}
        </div>

        {stockObjets.length === 0 ? (
          <p className="text-slate-500">Aucun objet dans cet état.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {stockObjets.map((obj) => (
              <div key={obj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Objet #{obj.id}</span>
                  <div className="flex gap-1">
                    <Badge variant={obj.estDisponible ? "green" : "red"}>
                      {obj.estDisponible ? "Disponible" : "Indisponible"}
                    </Badge>
                    <Badge variant={etatConfig[obj.etat].variant}>
                      {etatConfig[obj.etat].label}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  <strong>Compagnie:</strong> {obj.compagnie.nom}
                </p>
                {obj.commentaire && (
                  <p className="text-sm text-slate-600 mt-1">
                    <strong>Commentaire:</strong> {obj.commentaire}
                  </p>
                )}
                {obj.reservations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Réservations:</p>
                    {obj.reservations.map((r) => (
                      <p key={r.id} className="text-xs text-slate-500">
                        📅 {formatDate(r.representation.date)} — {r.representation.spectacle.titre}{" "}
                        @ {r.representation.lieu.libelle}
                      </p>
                    ))}
                  </div>
                )}

                {/* Inline edit form */}
                <form action={updateObjet} className="mt-3 flex flex-wrap gap-2 items-end">
                  <input type="hidden" name="id" value={obj.id} />
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-semibold text-slate-500">État</label>
                    <select
                      name="etat"
                      defaultValue={obj.etat}
                      className="w-full text-sm h-8 px-2 border border-slate-300 rounded-md"
                    >
                      <option value="NEUF">Neuf</option>
                      <option value="ABIME">Abîmé</option>
                      <option value="CASSE">Cassé</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-semibold text-slate-500">Dispo.</label>
                    <select
                      name="estDisponible"
                      defaultValue={obj.estDisponible.toString()}
                      className="w-full text-sm h-8 px-2 border border-slate-300 rounded-md"
                    >
                      <option value="true">Oui</option>
                      <option value="false">Non</option>
                    </select>
                  </div>
                  <div className="flex-[2] min-w-[150px]">
                    <label className="text-xs font-semibold text-slate-500">Commentaire</label>
                    <input
                      name="commentaire"
                      defaultValue={obj.commentaire || ""}
                      placeholder="Commentaire..."
                      className="w-full text-sm h-8 px-2 border border-slate-300 rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-8 px-3 text-xs bg-[#D00039] text-white rounded-md hover:bg-[#a00030] cursor-pointer"
                  >
                    💾
                  </button>
                </form>
                <form action={deleteObjet} className="mt-1">
                  <input type="hidden" name="id" value={obj.id} />
                  <button
                    type="submit"
                    className="h-8 px-3 text-xs border border-red-200 text-red-600 rounded-md hover:bg-red-50 cursor-pointer"
                  >
                    🗑️
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Modal: Modifier le type d'objet */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Modifier: ${typeObjet.nom}`}
      >
        <form
          action={updateTypeObjet}
          onSubmit={() => setShowEditModal(false)}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={typeObjet.id} />
          <div>
            <label className="block text-sm font-semibold mb-1">Nom</label>
            <Input name="nom" defaultValue={typeObjet.nom} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Catégorie</label>
            <select
              name="categorieId"
              defaultValue={typeObjet.categorieId}
              className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">URL Image</label>
            <Input name="image" defaultValue={typeObjet.image || ""} placeholder="https://..." />
          </div>
          <Button type="submit" variant="solid" size="sm">
            💾 Enregistrer
          </Button>
        </form>
        <form action={deleteTypeObjet} onSubmit={() => setShowEditModal(false)} className="mt-2">
          <input type="hidden" name="id" value={typeObjet.id} />
          <Button type="submit" variant="destructive" size="sm">
            🗑️ Supprimer le type
          </Button>
        </form>
      </Modal>

      {/* Modal: Réserver un objet */}
      <Modal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        title={`Réserver: ${typeObjet.nom}`}
      >
        {availableObjets.length === 0 ? (
          <p className="text-slate-500">Aucun objet disponible pour ce type.</p>
        ) : (
          <form
            action={createReservation}
            onSubmit={() => setShowReserveModal(false)}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-semibold mb-1">Objet à réserver</label>
              <select
                name="objetId"
                required
                className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
              >
                <option value="">Sélectionner un objet</option>
                {availableObjets.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — {etatConfig[o.etat].label}
                    {o.commentaire ? ` (${o.commentaire})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Représentation</label>
              <select
                name="representationId"
                required
                className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
              >
                <option value="">Sélectionner une représentation</option>
                {representations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {formatDate(r.date)} — {r.spectacle.titre} @ {r.lieu.libelle}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="solid" size="sm">
              📅 Confirmer la réservation
            </Button>
          </form>
        )}
      </Modal>

      {/* Modal: Ajouter un objet physique */}
      <Modal
        isOpen={showAddObjetModal}
        onClose={() => setShowAddObjetModal(false)}
        title={`Ajouter un: ${typeObjet.nom}`}
      >
        <form
          action={createObjet}
          onSubmit={() => setShowAddObjetModal(false)}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="typeObjetId" value={typeObjet.id} />
          <div>
            <label className="block text-sm font-semibold mb-1">État</label>
            <select
              name="etat"
              className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="NEUF">✅ Neuf</option>
              <option value="ABIME">⚠️ Abîmé</option>
              <option value="CASSE">❌ Cassé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Disponible</label>
            <select
              name="estDisponible"
              className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Compagnie</label>
            <select
              name="compagnieId"
              required
              className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="">Sélectionner</option>
              {compagnies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Commentaire (optionnel)</label>
            <Input name="commentaire" placeholder="Ex: Pied bancal..." />
          </div>
          <Button type="submit" variant="solid" size="sm">
            ➕ Ajouter
          </Button>
        </form>
      </Modal>
    </>
  );
}

// ========== Main Client Component ==========

export default function ObjetsClient({
  typesObjets,
  categories,
  compagnies,
  representations,
}: ObjetsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("TOUTES");
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTypes = useMemo(() => {
    let result = typesObjets;

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) => t.nom.toLowerCase().includes(q) || t.categorie.nom.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategorie !== "TOUTES") {
      const selectedCategorieId = Number(selectedCategorie);
      result = result.filter((t) => t.categorieId === selectedCategorieId);
    }

    // Filter by availability unless showing all
    if (!showUnavailable) {
      result = result.filter((t) => t.objets.some((o) => o.estDisponible));
    }

    // Default order by category then by name for a predictable inventory view
    return [...result].sort((a, b) => {
      const categoryDiff = a.categorie.nom.localeCompare(b.categorie.nom, "fr", {
        sensitivity: "base",
      });
      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      return a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" });
    });
  }, [typesObjets, search, selectedCategorie, showUnavailable]);

  const totalPages = Math.max(1, Math.ceil(filteredTypes.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTypes = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return filteredTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [safeCurrentPage, filteredTypes, itemsPerPage]);

  const totalObjetsInFilteredList = filteredTypes.reduce((acc, t) => acc + t.objets.length, 0);
  const startDisplayIndex =
    filteredTypes.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endDisplayIndex = Math.min(safeCurrentPage * itemsPerPage, filteredTypes.length);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">🎪 Gestion des Objets</h1>

        {/* Filters + controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar
                placeholder="Rechercher un type d'objet..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="w-full md:w-72">
              <select
                value={selectedCategorie}
                onChange={(e) => {
                  setSelectedCategorie(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
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

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Checkbox
                checked={showUnavailable}
                onChange={(e) => {
                  setShowUnavailable((e.target as HTMLInputElement).checked);
                  setCurrentPage(1);
                }}
              >
                Afficher les indisponibles
              </Checkbox>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-600">Items par page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-[10px] border border-slate-300 px-3 py-2 text-sm"
                >
                  {[3, 6, 9, 12].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button variant="solid" size="sm" onClick={() => setShowCreateModal(true)}>
              ➕ Nouveau type d&apos;objet
            </Button>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>
            {filteredTypes.length} type{filteredTypes.length > 1 ? "s" : ""} d&apos;objet affiché
            {filteredTypes.length > 1 ? "s" : ""}
          </span>
          <span>·</span>
          <span>
            {totalObjetsInFilteredList} objet{totalObjetsInFilteredList > 1 ? "s" : ""} au total
          </span>
          <span>·</span>
          <span>
            Affichage {startDisplayIndex}-{endDisplayIndex}
          </span>
        </div>

        {/* Grid of TypeObjet cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTypes.map((typeObjet) => (
            <TypeObjetCard
              key={typeObjet.id}
              typeObjet={typeObjet}
              categories={categories}
              compagnies={compagnies}
              representations={representations}
            />
          ))}
        </div>

        {filteredTypes.length === 0 && (
          <div className="p-12 text-center bg-white rounded-xl shadow-md">
            <p className="text-slate-500 text-lg">
              {search
                ? `Aucun type d'objet ne correspond à "${search}"`
                : "Aucun objet disponible pour le moment."}
            </p>
          </div>
        )}

        {/* Pager */}
        {filteredTypes.length > 0 && (
          <div className="w-full mt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, Math.min(totalPages, p) - 1))}
              disabled={safeCurrentPage === 1}
              className="h-10 w-10 rounded-lg border border-slate-300 text-slate-700 text-2xl leading-none flex items-center justify-center cursor-pointer transition-colors hover:bg-[#D00039] hover:text-white hover:border-[#D00039] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ‹
            </button>

            <p className="text-slate-600 text-sm font-semibold">
              Page {safeCurrentPage} sur {totalPages}
            </p>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, Math.min(totalPages, p) + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="h-10 w-10 rounded-lg border border-slate-300 text-slate-700 text-2xl leading-none flex items-center justify-center cursor-pointer transition-colors hover:bg-[#D00039] hover:text-white hover:border-[#D00039] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Modal: Créer un nouveau type d'objet */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouveau type d'objet"
      >
        <form
          action={createTypeObjet}
          onSubmit={() => setShowCreateModal(false)}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Nom *</label>
            <Input name="nom" placeholder="Ex: Chaise en bois" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Catégorie *</label>
            <select
              name="categorieId"
              required
              className="w-full rounded-[12px] border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">URL Image (optionnel)</label>
            <Input name="image" placeholder="https://..." />
          </div>
          <Button type="submit" variant="solid" size="sm">
            ➕ Créer le type d&apos;objet
          </Button>
        </form>
      </Modal>
    </div>
  );
}
