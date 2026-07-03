"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createSpectacle } from "./actions";

interface SpectacleData {
  id: number;
  titre: string;
  type: string | null;
  statut: string;
  hasImage: boolean;
  imageVersion: number | null;
}

function SpectacleCard({ spectacle }: { spectacle: SpectacleData }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => router.push(`/production/spectacles/${spectacle.id}`)}
      className="relative aspect-[3/4] rounded-[20px] overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
    >
      {spectacle.hasImage && !imgError ? (
        <Image
          fill
          src={`/production/api/spectacles/${spectacle.id}/image${spectacle.imageVersion ? `?v=${spectacle.imageVersion}` : ""}`}
          alt={spectacle.titre}
          onError={() => setImgError(true)}
          className="absolute inset-0 object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg font-serif leading-tight">{spectacle.titre}</h3>
        {spectacle.type && (
          <span className="text-white/70 text-sm font-serif">{spectacle.type}</span>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-[#D00039]/0 group-hover:bg-[#D00039]/10 transition-colors" />
    </div>
  );
}

function AddSpectacleCard() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="relative aspect-[3/4] rounded-[20px] overflow-hidden cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#D00039] transition-colors flex items-center justify-center bg-white group"
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-[#FFE3E7] flex items-center justify-center mx-auto mb-3 transition-colors">
            <svg
              className="w-7 h-7 text-slate-400 group-hover:text-[#D00039] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <p className="font-serif font-bold text-slate-500 group-hover:text-[#D00039] transition-colors">
            Ajouter un spectacle
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden border-2 border-[#D00039] bg-white flex items-center justify-center p-4">
      <form action={createSpectacle} className="w-full flex flex-col gap-3">
        <h3 className="text-[#D00039] font-serif font-bold text-lg text-center">
          Nouveau spectacle
        </h3>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Titre *</label>
          <input
            name="titre"
            required
            placeholder="Titre du spectacle"
            className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif focus:border-[#D00039] focus:ring-1 focus:ring-[#D00039] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Type *</label>
          <select
            name="type"
            required
            defaultValue=""
            className="w-full rounded-[12px] border border-slate-300 px-3 py-2 text-sm font-serif"
          >
            <option disabled value="">
              Type de spectacle
            </option>
            <option value="THEATRE">Theatre</option>
            <option value="DANSE">Danse</option>
            <option value="MUSIQUE">Musique</option>
            <option value="CIRQUE">Cirque</option>
            <option value="AUTRE">Autre</option>
          </select>
        </div>

        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            className="flex-1 bg-[#D00039] text-white font-serif font-bold italic rounded-[12px] py-2 text-sm hover:bg-[#B00030] transition-colors cursor-pointer"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-3 border border-slate-300 rounded-[12px] text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SpectaclesClient({ spectacles }: { spectacles: SpectacleData[] }) {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl text-[#D00039] text-center font-bold font-serif mb-8">
          Gestion des Spectacles
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {spectacles.map((s) => (
            <SpectacleCard key={s.id} spectacle={s} />
          ))}
          <AddSpectacleCard />
        </div>

        {spectacles.length === 0 && (
          <p className="text-center text-slate-500 mt-8 font-serif">
            Aucun spectacle pour le moment. Ajoutez-en un !
          </p>
        )}
      </div>
    </div>
  );
}
