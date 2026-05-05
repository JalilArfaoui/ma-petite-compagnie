"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge/Badge";
import { updateSpectacle, deleteSpectacle, deleteBesoin, createBesoinsFromList, ensureFicheTechnique } from "./actions";
import ObjectPickerModal from "./ObjectPickerModal";

// ========== Types ==========

interface BesoinData {
  id: number;
  nb: number;
  typeObjet: {
    id: number;
    nom: string;
    image: string | null;
    categorie: { id: number; nom: string };
  };
}

interface FicheTechniqueData {
  id: number;
  texte: string;
  pdfName: string | null;
}

interface SpectacleData {
  id: number;
  titre: string;
  description: string | null;
  type: string | null;
  statut: string;
  budget_initial: number;
  dure: number | null;
  hasImage: boolean;
  hasDossier: boolean;
  dossierArtistiqueName: string | null;
  ficheTechnique: FicheTechniqueData | null;
  besoins: BesoinData[];
}

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

interface Props {
  spectacle: SpectacleData;
  typeObjets: TypeObjetData[];
  categories: CategorieData[];
}

// ========== Helpers ==========

const statusLabels: Record<string, string> = {
  EN_CREATION: "En Création",
  EN_REPETITION: "En Répétition",
  EN_TOURNEE: "En Tournée",
  ARCHIVE: "Archivé",
};

const statusColors: Record<string, "blue" | "orange" | "green" | "gray"> = {
  EN_CREATION: "blue",
  EN_REPETITION: "orange",
  EN_TOURNEE: "green",
  ARCHIVE: "gray",
};

const typeLabels: Record<string, string> = {
  THEATRE: "Théâtre",
  DANSE: "Danse",
  MUSIQUE: "Musique",
  CIRQUE: "Cirque",
  AUTRE: "Autre",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

// ========== Main Component ==========

export default function SpectacleDetailClient({ spectacle, typeObjets, categories }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgKey, setImgKey] = useState(() => Date.now());
  const [hasUploaded, setHasUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dossierUploading, setDossierUploading] = useState(false);
  const [ftUploading, setFtUploading] = useState(false);
  const [showObjectPicker, setShowObjectPicker] = useState(false);
  const [members, setMembers] = useState<string[]>([]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const dossierInputRef = useRef<HTMLInputElement>(null);
  const ftInputRef = useRef<HTMLInputElement>(null);

  // ========== Image Upload ==========

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    await fetch(`/production/api/spectacles/${spectacle.id}/image`, { method: "POST", body: fd });
    setImgError(false);
    setImgKey(Date.now());
    setHasUploaded(true);
    setUploading(false);
    router.refresh();
  }

  // ========== Dossier Upload ==========

  async function handleDossierUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDossierUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    await fetch(`/production/api/spectacles/${spectacle.id}/dossier-artistique`, {
      method: "POST",
      body: fd,
    });
    setDossierUploading(false);
    router.refresh();
  }

  // ========== FT PDF Upload ==========

  async function handleFtUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFtUploading(true);
    const ftId = spectacle.ficheTechnique?.id ?? await ensureFicheTechnique(spectacle.id);
    const fd = new FormData();
    fd.append("file", file);
    await fetch(`/production/api/spectacles/ficheTechnique/${ftId}/pdf`, {
      method: "POST",
      body: fd,
    });
    setFtUploading(false);
    router.refresh();
  }

  // ========== Object Picker Confirm ==========

  async function handleObjectsConfirm(items: { typeObjetId: number; nb: number }[]) {
    await createBesoinsFromList(spectacle.id, items);
    setShowObjectPicker(false);
    router.refresh();
  }

  // ========== Delete Besoin ==========

  async function handleDeleteBesoin(besoinId: number) {
    await deleteBesoin(besoinId, spectacle.id);
    router.refresh();
  }

  // ========== Delete Spectacle ==========

  async function handleDelete() {
    if (!confirm("Supprimer ce spectacle ?")) return;
    await deleteSpectacle(spectacle.id);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back link */}
        <button
          onClick={() => router.push("/production")}
          className="text-sm text-slate-500 hover:text-[#D00039] font-serif mb-4 inline-flex items-center gap-1 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour aux spectacles
        </button>

        {/* ===== SECTION 1: POSTER IMAGE ===== */}
        <div className="relative h-[300px] md:h-[400px] rounded-[20px] overflow-hidden bg-slate-200 mb-6 group">
          {(spectacle.hasImage || hasUploaded) && !imgError ? (
            <Image
              fill
              key={imgKey}
              src={`/production/api/spectacles/${spectacle.id}/image?v=${imgKey}`}
              alt={spectacle.titre}
              onError={() => setImgError(true)}
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <svg className="w-20 h-20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
              <p className="font-serif text-sm">Aucune affiche</p>
            </div>
          )}

          {/* Upload button overlay */}
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            {uploading ? (
              <svg className="w-5 h-5 text-[#D00039] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-[#D00039]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
            )}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* ===== SECTION 2: INFO ===== */}
        <div className="bg-white rounded-[20px] shadow-md p-6 mb-6">
          {!isEditing ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                    {spectacle.titre}
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={statusColors[spectacle.statut] || "gray"}>
                      {statusLabels[spectacle.statut] || spectacle.statut}
                    </Badge>
                    {spectacle.type && (
                      <Badge variant="purple">{typeLabels[spectacle.type] || spectacle.type}</Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#D00039] transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              </div>

              {spectacle.description && (
                <p className="text-slate-600 font-serif mb-4">{spectacle.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 font-semibold">Budget</span>
                  <p className="text-slate-800 font-serif">
                    {formatCurrency(spectacle.budget_initial)}
                  </p>
                </div>
                {spectacle.dure && (
                  <div>
                    <span className="text-slate-500 font-semibold">Durée</span>
                    <p className="text-slate-800 font-serif">{spectacle.dure} min</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form
              action={updateSpectacle}
              onSubmit={() => {
                setIsEditing(false);
                router.refresh();
              }}
            >
              <input type="hidden" name="id" value={spectacle.id} />
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Titre</label>
                  <input
                    name="titre"
                    defaultValue={spectacle.titre}
                    required
                    className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={spectacle.description || ""}
                    rows={3}
                    className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Type</label>
                    <select
                      name="type"
                      defaultValue={spectacle.type || ""}
                      className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif"
                    >
                      <option value="">-</option>
                      <option value="THEATRE">Théâtre</option>
                      <option value="DANSE">Danse</option>
                      <option value="MUSIQUE">Musique</option>
                      <option value="CIRQUE">Cirque</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                      Statut
                    </label>
                    <select
                      name="statut"
                      defaultValue={spectacle.statut}
                      className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif"
                    >
                      <option value="EN_CREATION">En Création</option>
                      <option value="EN_REPETITION">En Répétition</option>
                      <option value="EN_TOURNEE">En Tournée</option>
                      <option value="ARCHIVE">Archivé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                      Budget
                    </label>
                    <input
                      name="budget_initial"
                      type="number"
                      step="0.01"
                      defaultValue={spectacle.budget_initial}
                      className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                      Durée (min)
                    </label>
                    <input
                      name="dure"
                      type="number"
                      defaultValue={spectacle.dure || ""}
                      className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-[#D00039] text-white font-serif font-bold italic rounded-[12px] px-6 py-2 text-sm hover:bg-[#B00030] transition-colors cursor-pointer"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border border-slate-300 rounded-[12px] px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* ===== SECTION 3: DOCUMENTS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Dossier Artistique */}
          <div className="bg-white rounded-[20px] shadow-md p-6">
            <h3 className="text-lg font-serif font-bold text-[#D00039] mb-4">Dossier Artistique</h3>
            {spectacle.hasDossier ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-serif">{spectacle.dossierArtistiqueName}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      window.open(`/production/api/spectacles/${spectacle.id}/dossier-artistique`)
                    }
                    className="flex-1 bg-[#D00039] text-white font-serif font-bold italic rounded-[12px] py-2 text-sm hover:bg-[#B00030] transition-colors cursor-pointer"
                  >
                    Ouvrir le PDF
                  </button>
                  <button
                    onClick={() => dossierInputRef.current?.click()}
                    disabled={dossierUploading}
                    className="border border-slate-300 rounded-[12px] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {dossierUploading ? "..." : "Remplacer"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => dossierInputRef.current?.click()}
                disabled={dossierUploading}
                className="w-full border-2 border-dashed border-slate-300 hover:border-[#D00039] rounded-[12px] py-6 text-center text-slate-500 hover:text-[#D00039] transition-colors cursor-pointer"
              >
                {dossierUploading ? (
                  <span className="font-serif text-sm">Upload en cours...</span>
                ) : (
                  <>
                    <svg
                      className="w-8 h-8 mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span className="font-serif text-sm font-semibold">Importer un PDF</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={dossierInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleDossierUpload}
              className="hidden"
            />
          </div>

          {/* Fiche Technique */}
          <div className="bg-white rounded-[20px] shadow-md p-6">
            <h3 className="text-lg font-serif font-bold text-[#D00039] mb-4">Fiche Technique</h3>
            <div className="flex flex-col gap-3">
              {spectacle.ficheTechnique?.pdfName ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-serif">{spectacle.ficheTechnique.pdfName}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        window.open(
                          `/production/api/spectacles/ficheTechnique/${spectacle.ficheTechnique!.id}/pdf`
                        )
                      }
                      className="flex-1 bg-[#D00039] text-white font-serif font-bold italic rounded-[12px] py-2 text-sm hover:bg-[#B00030] transition-colors cursor-pointer"
                    >
                      Ouvrir le PDF
                    </button>
                    <button
                      onClick={() => ftInputRef.current?.click()}
                      disabled={ftUploading}
                      className="border border-slate-300 rounded-[12px] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {ftUploading ? "..." : "Remplacer"}
                    </button>
                  </div>
                  <a href={`${spectacle.id}/fiche`}>
                    <button
                      className="w-full bg-white border border-[#D00039] text-[#D00039] hover:bg-[#FFF5F7] font-serif font-bold italic rounded-[12px] py-2 text-sm transition-colors cursor-pointer"
                    >
                      Modifier la fiche technique
                    </button>
                  </a>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => ftInputRef.current?.click()}
                    disabled={ftUploading}
                    className="w-full border-2 border-dashed border-slate-300 hover:border-[#D00039] rounded-[12px] py-6 text-center text-slate-500 hover:text-[#D00039] transition-colors cursor-pointer"
                  >
                    {ftUploading ? (
                      <span className="font-serif text-sm">Upload en cours...</span>
                    ) : (
                      <>
                        <svg
                          className="w-8 h-8 mx-auto mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <span className="font-serif text-sm font-semibold">Importer un PDF</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-serif">ou</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <a href={`${spectacle.id}/fiche`}>
                    <button
                      //onClick={() => router.push("/production/fiches-techniques")}
                      className="w-full bg-white border border-[#D00039] text-[#D00039] hover:bg-[#FFF5F7] font-serif font-bold italic rounded-[12px] py-2 text-sm transition-colors cursor-pointer"
                    >
                      Faites la vôtre
                    </button>
                  </a>
                </div>
              )}
            </div>
            <input
              ref={ftInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFtUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* ===== SECTION 4: TWO COLUMNS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Left: Objects/Items (3/5) */}
          <div className="lg:col-span-3 bg-white rounded-[20px] shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-[#D00039]">Besoins matériels</h3>
              <button
                onClick={() => setShowObjectPicker(true)}
                className="bg-[#D00039] text-white font-serif font-bold italic rounded-[12px] px-4 py-2 text-sm hover:bg-[#B00030] transition-colors cursor-pointer"
              >
                Ajouter des objets
              </button>
            </div>

            {spectacle.besoins.length === 0 ? (
              <p className="text-slate-500 font-serif text-sm text-center py-8">
                Aucun objet assigné à ce spectacle
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {spectacle.besoins.map((besoin) => (
                  <div
                    key={besoin.id}
                    className="flex items-center gap-3 p-3 rounded-[12px] bg-slate-50 border border-slate-200"
                  >
                    {/* Image */}
                    <div className="relative w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                      {besoin.typeObjet.image ? (
                        <Image
                          fill
                          src={besoin.typeObjet.image}
                          alt={besoin.typeObjet.nom}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">
                          📦
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-semibold text-sm text-slate-800 truncate">
                        {besoin.typeObjet.nom}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="purple">{besoin.typeObjet.categorie.nom}</Badge>
                        <span className="text-xs text-slate-500">x{besoin.nb}</span>
                      </div>
                    </div>
                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteBesoin(besoin.id)}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
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
            )}
          </div>

          {/* Right: Members (2/5) */}
          <div className="lg:col-span-2 bg-white rounded-[20px] shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-[#D00039]">Membres</h3>
              <button
                onClick={() => setMembers([...members, ""])}
                className="text-[#D00039] hover:bg-[#FFE3E7] rounded-lg p-2 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>

            {members.length === 0 ? (
              <p className="text-slate-500 font-serif text-sm text-center py-8">
                Aucun membre — Bientôt disponible
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {members.map((member, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={member}
                      onChange={(e) => {
                        const copy = [...members];
                        copy[i] = e.target.value;
                        setMembers(copy);
                      }}
                      placeholder="Nom du membre"
                      className="flex-1 rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                    />
                    <button
                      onClick={() => setMembers(members.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
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
            )}
          </div>
        </div>

        {/* ===== SECTION 5: BOTTOM ACTIONS ===== */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <button
            disabled
            className="flex-1 bg-slate-200 text-slate-400 font-serif font-bold italic rounded-[12px] py-3 text-sm cursor-not-allowed"
          >
            Créer une représentation — Bientôt disponible
          </button>
          <button
            onClick={handleDelete}
            className="border border-red-200 text-red-600 bg-white hover:bg-red-50 font-serif rounded-[12px] px-6 py-3 text-sm transition-colors cursor-pointer"
          >
            Supprimer le spectacle
          </button>
        </div>
      </div>

      {/* Object Picker Modal */}
      <ObjectPickerModal
        isOpen={showObjectPicker}
        onClose={() => setShowObjectPicker(false)}
        onConfirm={handleObjectsConfirm}
        spectacleId={spectacle.id}
        existingBesoins={spectacle.besoins.map((b) => ({ typeObjetId: b.typeObjet.id, nb: b.nb }))}
        typeObjets={typeObjets}
        categories={categories}
      />
    </div>
  );
}
