"use client";

import React from "react";
import { Heading, Text, Badge } from "@/components/ui";

// Carte pour les indicateurs clés en haut de page
export function IndicateurCle({ titre, valeur, sousTexte }: { titre: string; valeur: React.ReactNode; sousTexte: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center h-full">
      <Text className="text-gray-600 mb-2">{titre}</Text>
      <div className="flex items-baseline gap-2">
        <Text className="text-4xl text-gray-900">{valeur}</Text>
        <Text className="text-gray-500">{sousTexte}</Text>
      </div>
    </div>
  );
}

// Section Factures & Paiements à venir
export function FacturesAvenir() {
  const factures = [
    { destinataire: "Théâtre municipal des Lices", date: "le 27 janvier 2026", montant: "750 €", statut: "reçue", couleurStatut: "green" },
    { destinataire: "Mairie Gaillac", date: "le 17 janvier 2026", montant: "300 €", statut: "reçue", couleurStatut: "green" },
  ];

  const paiements = [
    { destinataire: "Décorations scène", date: "le 22 janvier 2026", montant: "400 €", statut: "payé", couleurStatut: "green" },
    { destinataire: "Loyer local de répét", date: "le 22 janvier 2026", montant: "128 €", statut: "non payé", couleurStatut: "red" },
  ];

  return (
    <div className="bg-[#F8F5EE] rounded-xl p-5 border border-[#EBE5D9]">
      <Heading as="h5" className="mb-4 text-gray-800">Factures & paiements à venir</Heading>
      
      {/* En-tête Factures */}
      <div className="flex justify-between items-center bg-[#D4E8CD] p-2 rounded-t-lg -mx-5 px-5 mb-3 text-sm font-semibold text-green-800">
        <span>Factures</span>
        <span>+1 050 €</span>
      </div>
      
      <div className="flex flex-col gap-3 mb-5">
        {factures.map((item, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center shadow-sm">
            <div>
              <Text className="font-bold text-sm text-gray-900">{item.destinataire}</Text>
              <Text className="text-xs text-gray-500">{item.date}</Text>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Text className="font-bold text-sm text-gray-900">{item.montant}</Text>
              <Badge variant={item.couleurStatut as any} className="text-[10px] px-2 py-0">{item.statut}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* En-tête Paiements */}
      <div className="flex justify-between items-center bg-[#FCE5B5] p-2 rounded-t-lg -mx-5 px-5 mb-3 mt-4 text-sm font-semibold text-orange-900">
        <span>Paiements</span>
        <span>-528 €</span>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {paiements.map((item, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center shadow-sm">
            <div>
              <Text className="font-bold text-sm text-gray-900">{item.destinataire}</Text>
              <Text className="text-xs text-gray-500">{item.date}</Text>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Text className="font-bold text-sm text-gray-900">{item.montant}</Text>
              <Badge variant={item.couleurStatut as any} className="text-[10px] px-2 py-0">{item.statut}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right">
        <a href="#" className="text-sm text-gray-500 underline hover:text-gray-800">Voir tout</a>
      </div>
    </div>
  );
}

// Composant pour une barre de progression de budget
export function BarreBudget({ pourcentageTotal, pourcentageRealise, couleur }: { pourcentageTotal: number, pourcentageRealise: number, couleur: 'green' | 'red' }) {
  const bgColorPrincipal = couleur === 'green' ? 'bg-[#53826A]' : 'bg-[#CC4F4F]';
  const bgColorSecondaire = couleur === 'green' ? 'bg-[#A3CDA8]' : 'bg-[#F0A8A8]';
  
  return (
    <div className={`h-3 w-48 rounded-sm overflow-hidden flex ${bgColorSecondaire} relative`}>
      <div className={`h-full ${bgColorPrincipal}`} style={{ width: `${pourcentageTotal}%` }}></div>
      <div className={`h-full bg-white opacity-40 absolute top-0 bottom-0 right-0`} style={{ width: `${100 - pourcentageRealise}%` }}></div>
    </div>
  );
}

// Section Équilibre Financier des Spectacles
export function EquilibreFinancier() {
  const spectacles = [
    { nom: "Le Misanthrope", statut: "positif", budget: 80, realise: 100, montant: "+2 300 €" },
    { nom: "Le Nuit des Rois", statut: "positif", budget: 60, realise: 100, montant: "+1 150 €" },
    { nom: "Les Fourberies de Scapin", statut: "positif", budget: 50, realise: 100, montant: "+250 €" },
    { nom: "Le malade imaginaire", statut: "negatif", budget: 40, realise: 100, montant: "-760 €" },
    { nom: "Antigone", statut: "alerte", budget: 22, realise: 100, montant: "-1 200 €", alerte: true },
  ];

  return (
    <div className="bg-[#F8F5EE] rounded-xl p-5 border border-[#EBE5D9]">
      <Heading as="h5" className="mb-6 text-gray-800">Spectacles : équilibre financier (budget / réalisé)</Heading>
      
      <div className="flex flex-col gap-0 border-t border-gray-200">
        {spectacles.map((spec, idx) => (
          <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-200">
            <Text className="text-sm text-gray-800 w-1/3">{spec.nom}</Text>
            
            <div className="flex-1 flex justify-center">
              <BarreBudget 
                pourcentageTotal={spec.budget} 
                pourcentageRealise={spec.realise} 
                couleur={spec.statut === 'positif' ? 'green' : 'red'} 
              />
            </div>
            
            <div className="w-1/3 text-right flex justify-end items-center gap-2">
              {spec.alerte && (
                <span className="text-yellow-500 text-lg" title="Attention budget dépassé">⚠️</span>
              )}
              <Text className="text-sm font-semibold text-gray-900 whitespace-nowrap">{spec.montant}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Section Financements & Subventions
export function FinancementsSubventions() {
  const financements = [
    { organisme: "DRAC Occitanie", spectacle: "Le Misanthrope", montant: "5 000 €", statut: "en attente", type: "attente" },
    { organisme: "Ville d'Albi", spectacle: "Le Nuit des Rois", montant: "1 150 €", statut: "reçu", type: "recu" },
    { organisme: "Conseil départemental", spectacle: "Le malade imaginaire", montant: "750 €", statut: "en attente", type: "attente" },
  ];

  return (
    <div className="bg-[#F8F5EE] rounded-xl p-5 border border-[#EBE5D9]">
      <Heading as="h5" className="mb-4 text-gray-800">Financements & Subventions</Heading>
      
      <div className="flex flex-col gap-3 mb-4">
        {financements.map((fin, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <Text className="font-bold text-sm text-gray-900">{fin.organisme}</Text>
            <Text className="text-xs text-gray-500 mb-2">{fin.spectacle}</Text>
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${fin.type === 'recu' ? 'bg-[#53826A]' : 'bg-[#F2C94C]'}`}></span>
              <span className="font-bold text-gray-900">{fin.montant}</span>
              <span className={fin.type === 'recu' ? 'text-[#53826A]' : 'text-[#F2C94C]'}>{fin.statut}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right">
        <a href="#" className="text-sm text-gray-500 underline hover:text-gray-800">Voir tout</a>
      </div>
    </div>
  );
}
