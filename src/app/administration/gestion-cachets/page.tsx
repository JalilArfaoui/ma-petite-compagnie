"use client";

import { Button, Card, Table, Heading } from "@/components/ui";
import { useState, useEffect } from "react";
import { Prisma } from "@prisma/client";
import {
  getCachetsAction,
  creerCachetAction,
  mettreAJourCachetAction,
  supprimerCachetAction,
  getAllMembresAction,
  getAllSpectaclesAction,
} from "./actions";

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

//type pour représenter le Cachet retourné par Prisma avant transformation
//cela permet d'éviter l'erreur pointé par lint à la ligne: (function formatCachetFromDB(data: CachetWithRelations): Cachet {)
type CachetAvecRelations = Prisma.CachetGetPayload<{
  include: {
    spectacle: true;
    membre: {
      include: {
        user: true;
      };
    };
  };
}>;

export default function PageCachets() {
  const [cachets, setCachets] = useState<Cachet[]>([]);
  const [membres, setMembres] = useState<
    Array<{ id: number; user: { nom: string | null; prenom: string | null } }>
  >([]);
  const [spectacles, setSpectacles] = useState<Array<{ id: number; titre: string }>>([]);
  const [membreId, setMembreId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [montant, setMontant] = useState("");
  const [spectacleId, setSpectacleId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [filtreMembre, setFiltreMembre] = useState<number | null>(null);
  const [filtreSpectacle, setFiltreSpectacle] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<
    "none" | "dateCroissante" | "dateDecroissante" | "montantCroissant" | "montantDecroissant"
  >("none");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); //stocker une erreur par champ
  const [isLoading, setIsLoading] = useState(false); //état pour désactiver le bouton pendant l'envoi (sécurité)

  //fonction helper pour transformer les données de Prisma au format du state local
  function formateCachet(data: CachetAvecRelations): Cachet {
    //supprime le symbole € si déjà présent
    const montantNettoye = data.montant.replace(/[^\d.,-]/g, "").trim();

    return {
      ...data,
      date: typeof data.date === "string" ? data.date : data.date.toISOString().split("T")[0],
      montant: montantNettoye,
    };
  }

  useEffect(() => {
    getCachetsAction()
      .then((result) => {
        if (result.success && result.data) {
          const cachetFormattes = result.data.map((c) => formateCachet(c));
          setCachets(cachetFormattes);
        } else if (!result.success) {
          console.error(result.error);
          setErrors({ global: result.error || "Une erreur est survenue" });
        }
      })
      .catch((error) => {
        console.error("Erreur non gérée:", error);
        setErrors({ global: "Une erreur inattendue s'est produite" });
      });

    getAllMembresAction().then((result) => {
      if (result.success && result.data) {
        setMembres(result.data);
      }
    });

    getAllSpectaclesAction().then((result) => {
      if (result.success && result.data) {
        setSpectacles(result.data);
      }
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

    //lance l'opération asynchrone avec la BDD
    setIsLoading(true);

    if (editId !== null) {
      mettreAJourCachetAction(editId, {
        //on est sur que membreId et spectacleId ne sont pas null grâce à la validation au-dessus
        membreId: membreId!,
        date,
        montant,
        spectacleId: spectacleId!,
        note,
      }).then((result) => {
        if (result.success && result.data) {
          //mets à jour le cachet dans la liste locale
          setCachets(cachets.map((c) => (c.id === editId ? formateCachet(result.data) : c)));
          setEditId(null);
          resetFormulaire();
        } else {
          setErrors({ submit: result.error || "Erreur lors de la mise à jour" });
        }
        setIsLoading(false);
      });
    } else {
      creerCachetAction({
        membreId: membreId!,
        date,
        montant,
        spectacleId: spectacleId!,
        note,
      }).then((result) => {
        if (result.success && result.data) {
          //ajoute le nouveau cachet à la liste locale
          setCachets([...cachets, formateCachet(result.data)]);
          resetFormulaire();
        } else {
          setErrors({ submit: result.error || "Erreur lors de la création" });
        }
        setIsLoading(false);
      });
    }
  }

  function resetFormulaire() {
    setMembreId(null);
    setDate("");
    setMontant("");
    setSpectacleId(null);
    setNote("");
    setErrors({});
  }

  function supprimerCachet(id: number) {
    setIsLoading(true);
    supprimerCachetAction(id).then((result) => {
      if (result.success) {
        //supprime le cachet de la liste locale
        setCachets(cachets.filter((c) => c.id !== id));
        if (editId === id) setEditId(null);
      } else {
        setErrors({ submit: result.error || "Erreur lors de la suppression" });
      }
      setIsLoading(false);
    });
  }

  function editerCachet(c: Cachet) {
    setEditId(c.id);
    setMembreId(c.membreId);
    setDate(c.date);
    setMontant(c.montant.replace(/[^\d.,-]/g, ""));
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

  //filtrage par date ou montant avec direction croissante/décroissante
  const cachetsTries = [...cachetsFiltres].sort((a, b) => {
    switch (sortBy) {
      case "dateCroissante":
        return a.date.localeCompare(b.date);
      case "dateDecroissante":
        return b.date.localeCompare(a.date);
      case "montantCroissant":
        const aNum1 = parseFloat(a.montant.replace(/[^\d.,-]/g, "").replace(",", "."));
        const bNum1 = parseFloat(b.montant.replace(/[^\d.,-]/g, "").replace(",", "."));
        return aNum1 - bNum1;
      case "montantDecroissant":
        const aNum2 = parseFloat(a.montant.replace(/[^\d.,-]/g, "").replace(",", "."));
        const bNum2 = parseFloat(b.montant.replace(/[^\d.,-]/g, "").replace(",", "."));
        return bNum2 - aNum2;
      default:
        return 0;
    }
  });

  return (
    <main>
      <Heading as="h2" className="font-extrabold mb-4 pt-6 text-center">
        Gestion des cachets
      </Heading>

      <form onSubmit={ajouterCachet}>
        <div className="mx-auto max-w-4xl rounded-[20px] bg-hover p-[20px] border-none shadow-sm transition-shadow flex flex-col gap-[20px]">
          {errors.submit && <p className="text-red-600 text-sm font-semibold">{errors.submit}</p>}
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
              disabled={isLoading}
            >
              <option value=""> Choisir un membre équipe </option>
              {membres.map((membre) => (
                <option key={membre.id} value={membre.id}>
                  {membre.user.prenom} {membre.user.nom}
                </option>
              ))}
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
              disabled={isLoading}
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
              placeholder="110"
              onChange={(e) => setMontant(e.target.value)}
              disabled={isLoading}
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
              disabled={isLoading}
            >
              <option value=""> Choisir un spectacle </option>
              {spectacles.map((spectacle) => (
                <option key={spectacle.id} value={spectacle.id}>
                  {spectacle.titre}
                </option>
              ))}
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
              disabled={isLoading}
            />
          </div>
          <Button variant="solid" size="default" type="submit" disabled={isLoading}>
            {isLoading ? "Envoi en cours..." : editId !== null ? "Mettre à jour" : "Ajouter"}
          </Button>
          {editId !== null && (
            <Button
              variant="solid"
              size="default"
              type="button"
              onClick={() => {
                resetFormulaire();
                setEditId(null);
              }}
              disabled={isLoading}
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
              {membres.map((membre) => (
                <option key={membre.id} value={membre.id}>
                  {membre.user.prenom} {membre.user.nom}
                </option>
              ))}
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
              {spectacles.map((spectacle) => (
                <option key={spectacle.id} value={spectacle.id}>
                  {spectacle.titre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label>Options de triage</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="none">Aucun tri</option>
              <option value="dateCroissante">Date croissante</option>
              <option value="dateDecroissante">Date décroissante</option>
              <option value="montantCroissant">Montant croissant</option>
              <option value="montantDecroissant">Montant décroissant</option>
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
                <Table.Header>Modifier cachet</Table.Header>
                <Table.Header>Supprimer cachet</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {cachetsTries.map((c) => (
                <Table.Row key={c.id}>
                  <Table.Cell>
                    {c.membre.user.prenom} {c.membre.user.nom}
                  </Table.Cell>
                  <Table.Cell>{new Date(c.date).toLocaleDateString("fr-FR")}</Table.Cell>
                  <Table.Cell>{c.montant} €</Table.Cell>
                  <Table.Cell>{c.spectacle.titre}</Table.Cell>
                  <Table.Cell>{c.note || "-"}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editerCachet(c)}
                      aria-label="Modifier cachet"
                      disabled={isLoading}
                    >
                      ✏️ Modifier
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => supprimerCachet(c.id)}
                      aria-label="Supprimer cachet"
                      disabled={isLoading}
                    >
                      🗑️ Supprimer
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
