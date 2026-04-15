"use client";

import { Button, Card, Table, Heading } from "@/components/ui";
import { useState, useEffect } from "react";
import { getCachets } from "./actions";

//dois corriger bug symbole € ne s'affichant pas si modification d'un cachet

//seule la note est optionnelle, toutes les autres clés sont obligatoires donc pas de null permis
type Cachet = {
  id: number;
  membreId: number;
  membre: { user: { nom: string | null; prenom: string | null } };
  date: string;
  montant: string;
  spectacleId: number;
  spectacle: { titre: string };
  note?: string | null;
};

export default function PageCachets() {
  const [cachets, setCachets] = useState<Cachet[]>([]);
  const [membreId, setMembreId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [montant, setMontant] = useState("");
  const [spectacleId, setSpectacleId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [filtreMembre, setFiltreMembre] = useState<number | null>(null);
  const [filtreSpectacle, setFiltreSpectacle] = useState<number | null>(null);
  const [tri, setTri] = useState<"date" | "montant">("date");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); //stocker une erreur par champ

  useEffect(() => {
    getCachets().then((cachets) => {
      const cachetFormatted = cachets.map((c) => ({
        ...c,
        //convertit date de type Date en date de type string
        //simplement parce que je prefère utiliser string plutôt que Date pour la clé date
        date: typeof c.date === "string" ? c.date : c.date.toISOString().split("T")[0],
      }));
      setCachets(cachetFormatted);
    });
  }, []);

  function ajouterCachet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const foundErrors: { [key: string]: string } = {};

    //validation obligatoire du membre
    if (!membreId) {
      foundErrors.membre = "Un membre doit être sélectionné";
    }

    //validation obligatoire de la date
    if (!date.trim()) {
      foundErrors.date = "La date est obligatoire";
    }

    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      foundErrors.date = "La date ne peut pas être dans le futur";
    }

    //pas forcement nécéssaire puisque déjà géré dans le code de l'input, mais mieux vaut être prévoyant
    if (Number(montant) < 110) {
      foundErrors.montant =
        "Le montant ne peux pas être inférieur au minimum légal (smic horaire * 12, soit 110 euros)";
    }

    //validation obligatoire du spectacle
    if (!spectacleId) {
      foundErrors.spectacle = "Un spectacle doit être choisi";
    }

    //pas forcement nécéssaire puisque déjà géré dans le code de l'input, mais mieux vaut être prévoyant
    if (note.length > 120) {
      foundErrors.note = "La note ne peut pas dépasser 120 caractères";
    }

    setErrors(foundErrors);

    //erreur(s) trouvée(s)
    if (Object.keys(foundErrors).length > 0) {
      return;
    }

    if (editId !== null) {
      //edition cachet
      // On est sûr que membreId et spectacleId ne sont pas null grâce à la validation au-dessus
      setCachets(
        cachets.map((c) =>
          c.id === editId
            ? { ...c, membreId: membreId!, spectacleId: spectacleId!, date, montant, note }
            : c
        )
      );
      setEditId(null);
    } else {
      //ajout cachet - à implémenter avec une action serveur
      console.log("Création cachet:", { membreId, date, montant, spectacleId, note });
    }

    setMembreId(null);
    setDate("");
    setMontant("");
    setSpectacleId(null);
    setNote("");
  }

  function supprimerCachet(id: number) {
    setCachets(cachets.filter((c) => c.id !== id));
    if (editId === id) setEditId(null);
  }

  function editerCachet(c: Cachet) {
    setEditId(c.id);
    setMembreId(c.membreId);
    setDate(c.date);
    setMontant(c.montant);
    setSpectacleId(c.spectacleId);
    setNote(c.note || "");
  }

  //filtrage par membre (prioritaire)
  const cachetsFiltresParMembre = filtreMembre
    ? cachets.filter((c) => c.membreId === filtreMembre)
    : cachets;

  //filtrage par spectacle (agit uniquement sur cachets de membre x)
  const cachetsFiltres = filtreSpectacle
    ? cachetsFiltresParMembre.filter((c) => c.spectacleId === filtreSpectacle)
    : cachetsFiltresParMembre;

  //filtrage par date (décroissant) ou montant (décroissant), (agit uniquement sur cachets de membre x)
  const cachetsTries = [...cachetsFiltres].sort((a, b) => {
    if (tri === "date") return b.date.localeCompare(a.date);
    if (tri === "montant") return Number(b.montant) - Number(a.montant);
    return 0;
  });

  return (
    <main>
      <Heading as="h3" className="font-extrabold mb-4 pt-6 text-center">
        Gestion des cachets
      </Heading>

      <form onSubmit={ajouterCachet}>
        <div className="mx-auto max-w-4xl rounded-[20px] bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]">
          <div>
            <Heading as="h4" className="font-semibold">
              Membre équipe
            </Heading>
            <br />
            {errors.membre && <p className="text-red-600 text-sm">{errors.membre}</p>}
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              id="membre"
              value={membreId?.toString() || ""}
              onChange={(e) => setMembreId(Number(e.target.value))}
            >
              <option value=""> Choisir un membre équipe </option>
              {[...new Set(cachets.map((c) => c.membreId))].map((id) => {
                const cachet = cachets.find((c) => c.membreId === id);
                return (
                  <option key={id} value={id}>
                    {cachet?.membre.user.prenom} {cachet?.membre.user.nom}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <Heading as="h4" className="font-semibold">
              Date
            </Heading>
            <br />
            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
            <input
              className="flex w-full rounded-[12px] border border-border bg-white px-4 py-3 text-[1rem] text-text-primary font-serif placeholder:text-text-muted transition-all hover:border-border-hover hover:bg-bg-hover focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-bg-disabled focus:border-primary focus:ring-1 focus:ring-primary"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Heading as="h4" className="font-semibold">
              Montant du cachet
            </Heading>
            <br />
            {errors.montant && <p className="text-red-600 text-sm">{errors.montant}</p>}
            <input
              className="flex w-full rounded-[12px] border border-border bg-white px-4 py-3 text-[1rem] text-text-primary font-serif placeholder:text-text-muted transition-all hover:border-border-hover hover:bg-bg-hover focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-bg-disabled focus:border-primary focus:ring-1 focus:ring-primary"
              type="number"
              min={110}
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
            />
          </div>
          <div>
            <Heading as="h4" className="font-semibold">
              Spectacle
            </Heading>
            <br />
            {errors.spectacle && <p className="text-red-600 text-sm">{errors.spectacle}</p>}
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              id="spectacle"
              value={spectacleId?.toString() || ""}
              onChange={(e) => setSpectacleId(Number(e.target.value))}
            >
              <option value=""> Choisir un spectacle </option>
              {[...new Set(cachets.map((c) => c.spectacleId))].map((id) => {
                const cachet = cachets.find((c) => c.spectacleId === id);
                return (
                  <option key={id} value={id}>
                    {cachet?.spectacle.titre}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <Heading as="h4" className="font-semibold">
              Note
            </Heading>
            <br />
            {errors.note && <p className="text-red-600 text-sm">{errors.note}</p>}
            <input
              className="flex w-full rounded-[12px] border border-border bg-white px-4 py-3 text-[1rem] text-text-primary font-serif placeholder:text-text-muted transition-all hover:border-border-hover hover:bg-bg-hover focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-bg-disabled focus:border-primary focus:ring-1 focus:ring-primary"
              value={note}
              maxLength={120}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <Button variant="solid" size="default" type="submit">
            {editId !== null ? "Mettre à jour" : "Ajouter"}
          </Button>
          {editId !== null && (
            <Button
              variant="solid"
              size="default"
              type="button"
              onClick={() => {
                setEditId(null);
                setMembreId(null);
                setDate("");
                setMontant("");
                setSpectacleId(null);
                setNote("");
                setErrors({});
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>

      <Heading as="h3" className="font-semibold mt-9 pb-2 border-b text-center">
        Cachets enregistrés
      </Heading>

      <div className="mx-auto max-w-4xl rounded-[20px] bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-1">
            <label>Filtrer par membre</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={filtreMembre?.toString() || ""}
              onChange={(e) => setFiltreMembre(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Tous les membres</option>
              {[...new Set(cachets.map((c) => c.membreId))].map((id) => {
                const cachet = cachets.find((c) => c.membreId === id);
                return (
                  <option key={id} value={id}>
                    {cachet?.membre.user.prenom} {cachet?.membre.user.nom}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Filtrer par spectacle</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={filtreSpectacle?.toString() || ""}
              onChange={(e) => setFiltreSpectacle(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Tous</option>
              {[...new Set(cachets.map((c) => c.spectacleId))].map((id) => {
                const cachet = cachets.find((c) => c.spectacleId === id);
                return (
                  <option key={id} value={id}>
                    {cachet?.spectacle.titre}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Trier par</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={tri}
              onChange={(e) => setTri(e.target.value as "date" | "montant")}
            >
              <option value="date">Date</option>
              <option value="montant">Montant de cachets</option>
            </select>
          </div>
        </div>
      </div>

      <Card>
        <Card.Body>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Membre équipe</Table.Header>
                <Table.Header>Date</Table.Header>
                <Table.Header>Montant</Table.Header>
                <Table.Header>Spectacle</Table.Header>
                <Table.Header>Note</Table.Header>
                <Table.Header></Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {cachetsTries.map((c) => (
                <Table.Row key={c.id}>
                  <Table.Cell>
                    {c.membre.user.prenom} {c.membre.user.nom}
                  </Table.Cell>
                  <Table.Cell>{new Date(c.date).toLocaleDateString("fr-FR")}</Table.Cell>
                  <Table.Cell>{c.montant}</Table.Cell>
                  <Table.Cell>{c.spectacle.titre}</Table.Cell>
                  <Table.Cell>{c.note || "-"}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editerCachet(c)}
                      aria-label="Modifier cachet"
                    >
                      Modifier
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => supprimerCachet(c.id)}
                      aria-label="Supprimer cachet"
                    >
                      Supprimer
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </main>
  );
}
