"use client";

import { useState } from "react";

const TYPE_CATEGORIE = [
  { value: "repetition", label: "Répétition" },
  { value: "formation", label: "Formation" },
  { value: "autre", label: "Autre" },
] as const;

const MEMBRES_TROUPE = [
  "Alice Dupont",
  "Bernard Martin",
  "Claire Durand",
  "David Lefevre",
  "Emma Moreau",
];

type Cachet = {
  id: number;
  membre: string;
  date: string;
  montant: number;
  categorie: string;
  note?: string;
};

export default function PageCachets() {
  const [cachets, setCachets] = useState<Cachet[]>([]);
  const [membre, setMembre] = useState("");
  const [membreSearch, setMembreSearch] = useState("");
  const [membreOpen, setMembreOpen] = useState(false); //liste membres affichée ou pas
  const [date, setDate] = useState("");
  const [montant, setMontant] = useState(1);
  const [categorie, setCategorie] = useState("");
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [filtreMembre, setFiltreMembre] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("");
  const [tri, setTri] = useState<"date" | "montant">("date");
  const [erreur, setErreur] = useState<string | null>(null);

  function ajouterCachet(e: React.FormEvent) {
    e.preventDefault();

    setErreur(null);

    //validation obligatoire de la date
    if (!date.trim()) {
      setErreur("La date est obligatoire");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      setErreur("La date ne peut pas être dans le futur");
      return;
    }

    //pas forcement nécéssaire puisque déjà géré dans le code de l'input, mais mieux vaut être prévoyant
    if (montant < 0) {
      setErreur("Le montant ne peux pas être négatif");
      return;
    }

    //validation obligatoire de la catégorie
    if (!categorie.trim()) {
      setErreur("La catégorie est obligatoire");
      return;
    }

    //pas forcement nécéssaire puisque déjà géré dans le code de l'input, mais mieux vaut être prévoyant
    if (note.length > 200) {
      setErreur("La note ne peut pas dépasser 200 caractères");
      return;
    }

    if (editId !== null) {
      //edition cachet
      setCachets(
        cachets.map((c) => (c.id === editId ? { ...c, date, montant, categorie, note } : c))
      );
      setEditId(null);
    } else {
      //ajout cachet
      const nouveauCachet: Cachet = {
        id: Date.now(),
        membre,
        date,
        montant,
        categorie,
        note,
      };
      setCachets([...cachets, nouveauCachet]);
    }

    setMembre("");
    setDate("");
    setMontant(1);
    setCategorie("");
    setNote("");
  }

  function supprimerCachet(id: number) {
    setCachets(cachets.filter((c) => c.id !== id));
    if (editId === id) setEditId(null);
  }

  function editerCachet(c: Cachet) {
    setEditId(c.id);
    setMembre(c.membre);
    setMembreSearch(c.membre);
    setDate(c.date);
    setMontant(c.montant);
    setCategorie(c.categorie);
    setNote(c.note || "");
  }

  const membresFiltres = MEMBRES_TROUPE.filter(
    (
      m //pour champ de recherche uniquement
    ) => m.toLowerCase().includes(membreSearch.toLowerCase())
  );

  //filtrage par membre (prioritaire)
  const cachetsFiltresParMembre = filtreMembre
    ? cachets.filter((c) => c.membre === filtreMembre)
    : cachets;

  //filtrage par catégorie (agit uniquement sur cachets de membre x)
  const cachetsFiltres = filtreCategorie
    ? cachetsFiltresParMembre.filter((c) => c.categorie === filtreCategorie)
    : cachetsFiltresParMembre;

  //filtrage par date (décroissant) ou montant (décroissant), (agit uniquement sur cachets de membre x)
  const cachetsTries = [...cachetsFiltres].sort((a, b) => {
    if (tri === "date") return b.date.localeCompare(a.date);
    if (tri === "montant") return b.montant - a.montant;
    return 0;
  });

  return (
    <main>
      <h1>Gestion des cachets</h1>

      <form onSubmit={ajouterCachet}>
        {erreur && <div>{erreur}</div>}
        <div>
          <label>Membre</label>
          <br />
          <input
            type="text"
            value={membreSearch}
            placeholder="Rechercher un membre"
            onFocus={() => setMembreOpen(true)}
            onChange={(e) => {
              setMembreSearch(e.target.value);
              setMembreOpen(true);
            }}
          />

          {membreOpen && (
            <ul>
              {membresFiltres.length === 0 && <li>Aucun membre trouvé</li>}

              {membresFiltres.map((nom) => (
                <li
                  key={nom}
                  onClick={() => {
                    setMembre(nom);
                    setMembreSearch(nom);
                    setMembreOpen(false);
                  }}
                >
                  {nom}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Date</label>
          <br />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label>montant du cachet</label>
          <br />
          <input
            type="number"
            min={1}
            value={montant}
            onChange={(e) => setMontant(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="categorie">Catégorie</label>
          <br />
          <select id="categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            <option value="">— Choisir une catégorie —</option>
            {TYPE_CATEGORIE.map((categorie) => (
              <option key={categorie.value} value={categorie.value}>
                {" "}
                {categorie.label}{" "}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Note</label>
          <br />
          <input value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} />
        </div>

        <button type="submit">{editId !== null ? "Mettre à jour" : "Ajouter"}</button>
        {editId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setMembre("");
              setMembreSearch("");
              setMembreOpen(false);
              setDate("");
              setMontant(1);
              setCategorie("");
              setNote("");
              setErreur(null);
            }}
          >
            Annuler
          </button>
        )}
      </form>

      <div>
        <label>Filtrer par membre: </label>
        <select value={filtreMembre} onChange={(e) => setFiltreMembre(e.target.value)}>
          <option value="">Tous les membres</option>
          {MEMBRES_TROUPE.map((nom) => (
            <option key={nom} value={nom}>
              {nom}
            </option>
          ))}
        </select>

        <label>Filtrer par catégorie: </label>
        <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)}>
          <option value="">Toutes</option>
          {TYPE_CATEGORIE.map((categorie) => (
            <option key={categorie.value} value={categorie.value}>
              {categorie.label}
            </option>
          ))}
        </select>

        <label>Trier par: </label>
        <select value={tri} onChange={(e) => setTri(e.target.value as "date" | "montant")}>
          <option value="date">Date</option>
          <option value="montant">Montant de cachets</option>
        </select>
      </div>

      <h2>Cachets enregistrés</h2>

      <ul>
        {cachetsTries.map((c) => (
          <li key={c.id}>
            <div>
              <span>{c.date}</span>
              <span>{c.categorie || "Sans catégorie"}</span>
              <span>{c.montant} euros</span>
            </div>

            {c.note && <div>{c.note}</div>}

            <div>
              <button onClick={() => editerCachet(c)} aria-label="Éditer">
                ✎
              </button>
              <button
                onClick={() => supprimerCachet(c.id)}
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
