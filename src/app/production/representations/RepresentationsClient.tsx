"use client";

import { useRef, useState } from "react";
import { updateRepresentation, deleteRepresentation, removeReservation } from "./actions";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Pagination } from "@/components/ui";

const PAGE_SIZE = 20;

// ========== Types ==========

interface ReservationData {
  id: number;
  objet: {
    id: number;
    etat: string;
    commentaire: string | null;
    typeObjet: {
      id: number;
      nom: string;
    };
  };
}

interface RepresentationData {
  id: number;
  debutResa: string;
  finResa: string;
  spectacleId: number;
  lieuId: number;
  spectacle: { id: number; titre: string };
  lieu: {
    id: number;
    libelle: string;
    adresse: string;
    ville: string;
    numero_salle: string | null;
  };
  _count: { reservations: number };
  reservations: ReservationData[];
}

interface SpectacleData {
  id: number;
  titre: string;
}

interface LieuData {
  id: number;
  libelle: string;
  ville: string;
}

interface RepresentationsClientProps {
  representations: RepresentationData[];
  spectacles: SpectacleData[];
  lieux: LieuData[];
}

// ========== Helpers ==========

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
};

const formatDateInput = (date: string) => {
  return new Date(date).toISOString().slice(0, 16);
};

const etatLabels: Record<string, string> = {
  NEUF: "✅ Neuf",
  ABIME: "⚠️ Abîmé",
  CASSE: "❌ Cassé",
};

// ========== Reservation Popover ==========

function ReservationPopover({ reservations }: { reservations: ReservationData[] }) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLButtonElement>(null);

  useOutsideClick([popoverRef, eyeRef], () => setShowPopover(false), showPopover);

  return (
    <span className="relative inline-block">
      <button
        ref={eyeRef}
        type="button"
        onClick={() => setShowPopover((p) => !p)}
        className="ml-1 text-slate-500 hover:text-[#D00039] cursor-pointer"
        title="Voir les objets réservés"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 inline"
        >
          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
          <path
            fillRule="evenodd"
            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute z-50 left-0 bottom-full mb-1 w-72 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-left"
        >
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Objets réservés ({reservations.length})
          </p>
          {reservations.length === 0 ? (
            <p className="text-xs text-slate-400">Aucun objet réservé.</p>
          ) : (
            reservations.map((res) => (
              <div
                key={res.id}
                className="text-xs text-slate-600 mb-1.5 pb-1.5 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium">
                    {res.objet.typeObjet.nom}{" "}
                    <span className="text-slate-400">#{res.objet.id}</span>
                  </p>
                  <p className="text-slate-400">
                    {etatLabels[res.objet.etat] || res.objet.etat}
                    {res.objet.commentaire ? ` — ${res.objet.commentaire}` : ""}
                  </p>
                </div>
                <form action={removeReservation}>
                  <input type="hidden" name="id" value={res.id} />
                  <button
                    type="submit"
                    className="text-red-400 hover:text-red-600 cursor-pointer shrink-0"
                    title="Retirer cette réservation"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      )}
    </span>
  );
}

// ========== Main Component ==========

export default function RepresentationsClient({
  representations,
  spectacles,
  lieux,
}: RepresentationsClientProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(representations.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const representationsPaginees = representations.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-4xl text-[#D00039] text-center font-bold">
          📅 Gestion des Représentations
        </h1>

        {/* Representations List */}
        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D00039]">
            📋 Liste des représentations ({representations.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {representationsPaginees.map((r) => (
              <div
                key={r.id}
                className="p-6 shadow-md border-l-4 border-l-[#D00039] bg-white rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">#{r.id}</p>
                    <h4 className="text-lg font-bold text-[#D00039] mb-2">{r.spectacle.titre}</h4>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        📍 {r.lieu.libelle}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        📦 {r._count.reservations} réservation(s)
                      </span>
                      {r._count.reservations > 0 && (
                        <ReservationPopover reservations={r.reservations} />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2 text-sm">
                    <p>
                      <strong>📅 Date:</strong> {formatDate(r.debutResa)}
                    </p>
                    <p>
                      <strong>📍 Adresse:</strong> {r.lieu.adresse}, {r.lieu.ville}
                    </p>
                    {r.lieu.numero_salle && (
                      <p>
                        <strong>🚪 Salle:</strong> {r.lieu.numero_salle}
                      </p>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-slate-200" />

                  {/* Update Form */}
                  <form action={updateRepresentation}>
                    <input type="hidden" name="id" value={r.id} />
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          name="date"
                          type="datetime-local"
                          defaultValue={formatDateInput(r.debutResa)}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        />
                        <select
                          name="spectacleId"
                          defaultValue={r.spectacleId}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          {spectacles.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.titre}
                            </option>
                          ))}
                        </select>
                        <select
                          name="lieuId"
                          defaultValue={r.lieuId}
                          className="text-sm h-8 px-2 border border-slate-300 rounded-md focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
                        >
                          {lieux.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.libelle} - {l.ville}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-8 text-sm bg-[#D00039] text-white font-semibold rounded-md hover:bg-[#a00030] active:bg-[#800020] transition-colors"
                      >
                        💾 Enregistrer
                      </button>
                    </div>
                  </form>

                  {/* Delete Form */}
                  <form action={deleteRepresentation}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="w-full h-8 text-sm border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-md transition-colors"
                    >
                      🗑️ Supprimer
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {representations.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl shadow-md">
              <p className="text-slate-500 text-lg">Aucune représentation pour le moment.</p>
            </div>
          )}

          {representations.length > PAGE_SIZE && (
            <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}
