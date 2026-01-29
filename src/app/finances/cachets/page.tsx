"use client";

import { useState } from "react";
import styles from "./page.module.css";

const TYPE_CATEGORIE = [
  { value: "repetition", label: "Répétition" },
  { value: "formation", label: "Formation" },
  { value: "autre", label: "Autre" },
] as const;

type Cachet = {
  id: number;
  date: string;
  nombre: number;
  categorie: string;
  note?: string;
};

export default function PageCachets() {
  const [cachets, setCachets] = useState<Cachet[]>([]);
  const [date, setDate] = useState("");
  const [nombre, setNombre] = useState(1);
  const [categorie, setCategorie] = useState("");
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [filtreCategorie, setFiltreCategorie] = useState("");
  const [tri, setTri] = useState<"date" | "nombre">("date");
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
    if (nombre > 999) {
      setErreur("Il ne doit pas y avoir plus de 999 cachets dans le même emplacement");
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
        cachets.map((c) => (c.id === editId ? { ...c, date, nombre, categorie, note } : c))
      );
      setEditId(null);
    } else {
      //ajout cachet
      const nouveauCachet: Cachet = {
        id: Date.now(),
        date,
        nombre,
        categorie,
        note,
      };
      setCachets([...cachets, nouveauCachet]);
    }

    setDate("");
    setNombre(1);
    setCategorie("");
    setNote("");
  }

  function supprimerCachet(id: number) {
    setCachets(cachets.filter((c) => c.id !== id));
    if (editId === id) setEditId(null);
  }

  function editerCachet(c: Cachet) {
    setEditId(c.id);
    setDate(c.date);
    setNombre(c.nombre);
    setCategorie(c.categorie);
    setNote(c.note || "");
  }

  //filtrage par catégorie
  const cachetsFiltres = filtreCategorie
    ? cachets.filter((c) => c.categorie === filtreCategorie)
    : cachets;

  //tri par date de publication ou par nombre de cachets
  const cachetsTries = [...cachetsFiltres].sort((a, b) => {
    if (tri === "date") return a.date.localeCompare(b.date);
    if (tri === "nombre") return b.nombre - a.nombre;
    return 0;
  });

  const totalCachets = cachetsFiltres.reduce((acc, c) => acc + c.nombre, 0);

  return (
    <main className={styles.container}>
      <h1>Gestion des cachets</h1>

      <form onSubmit={ajouterCachet}>
        {erreur && <div>{erreur}</div>}
        <div>
          <label>Date</label>
          <br />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label>Nombre de cachets</label>
          <br />
          <input
            type="number"
            min={1}
            value={nombre}
            max={999}
            onChange={(e) => setNombre(Number(e.target.value))}
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
              setDate("");
              setNombre(1);
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
        <select value={tri} onChange={(e) => setTri(e.target.value as "date" | "nombre")}>
          <option value="date">Date</option>
          <option value="nombre">Nombre de cachets</option>
        </select>
      </div>

      <h2>Cachets enregistrés</h2>

      <ul className={styles.list}>
        {cachetsTries.map((c) => (
          <li key={c.id} className={styles.item}>
            <div className={styles.main}>
              <span className={styles.date}>{c.date}</span>
              <span className={styles.category}>{c.categorie || "Sans catégorie"}</span>
              <span className={styles.quantity}>
                {c.nombre} cachet{c.nombre > 1 ? "s" : ""}
              </span>
            </div>

            {c.note && <div className={styles.note}>{c.note}</div>}

            <div>
              <button onClick={() => editerCachet(c)} aria-label="Éditer">
                ✎
              </button>
              <button
                className={styles.delete}
                onClick={() => supprimerCachet(c.id)}
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total :</strong> {totalCachets} cachet{totalCachets > 1 ? "s" : ""}
      </p>
    </main>
  );
}
