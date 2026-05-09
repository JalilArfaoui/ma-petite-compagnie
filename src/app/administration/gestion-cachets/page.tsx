"use client";

import { Button, Card, Table, Heading, Pagination } from "@/components/ui";
import { useState, useEffect } from "react";
import { Prisma } from "@prisma/client";
import {
  getCachetsAction,
  creerCachetAction,
  mettreAJourCachetAction,
  supprimerCachetAction,
  getAllMembresAction,
  getAllSpectaclesAction,
} from "../cachets-actions";
import {
  Cachet,
  MONTANT_CACHET_MINIMUM_LEGAL,
  NOTE_NB_MAX_CARACS,
  PAGE_SIZE,
  STATUT_DICT,
} from "../cachets-partage";
import { StatutCachet } from "@prisma/client";

//type pour représenter le Cachet retourné par Prisma avant transformation
type CachetAvecRelations = Prisma.CachetGetPayload<{
  include: {
    membre: {
      include: {
        user: true;
      };
    };
    spectacle: true;
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
  const [montant, setMontant] = useState<number | null>(null);
  const [spectacleId, setSpectacleId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [statut, setStatut] = useState<StatutCachet>();
  const [editId, setEditId] = useState<number | null>(null);
  const [filtreMembre, setFiltreMembre] = useState<number | null>(null);
  const [filtreSpectacle, setFiltreSpectacle] = useState<number | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<StatutCachet>();
  const [triPar, setTriPar] = useState<
    "none" | "dateCroissante" | "dateDecroissante" | "montantCroissant" | "montantDecroissant"
  >("none");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); //stocker une erreur par champ
  const [isLoading, setIsLoading] = useState(false); //état pour désactiver le bouton pendant l'envoi (sécurité)
  const [page, setPage] = useState(1);

  //fonction helper pour transformer les données de Prisma au format du state local
  function formateCachet(data: CachetAvecRelations): Cachet {
    return {
      ...data,
      date: typeof data.date === "string" ? data.date : data.date.toISOString().split("T")[0],
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
        setIsLoading(false);
      });

    getAllMembresAction()
      .then((result) => {
        if (result.success && result.data) {
          setMembres(result.data);
        }
      })
      .catch(() => setIsLoading(false));

    getAllSpectaclesAction()
      .then((result) => {
        if (result.success && result.data) {
          setSpectacles(result.data);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  function ajouterCachet(e: React.FormEvent<HTMLFormElement>): void {
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
    if (Number(montant) < MONTANT_CACHET_MINIMUM_LEGAL) {
      foundErrors.montant = `Le montant ne peux pas être inférieur au minimum légal (smic horaire * 12, soit ${MONTANT_CACHET_MINIMUM_LEGAL} euros)`;
    }

    //validation obligatoire du spectacle
    if (!spectacleId) {
      foundErrors.spectacle = "Un spectacle doit être choisi";
    }

    //validation obligatoire du statut
    if (!statut) {
      foundErrors.statut = "Un statut doit être choisi";
    }

    //pas forcement nécéssaire puisque déjà géré dans le code de l'input, mais mieux vaut être prévoyant
    if (note.length > NOTE_NB_MAX_CARACS) {
      foundErrors.note = `La note ne peut pas dépasser ${NOTE_NB_MAX_CARACS} caractères`;
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
        montant: montant!,
        spectacleId: spectacleId!,
        statut: statut!,
        note,
      })
        .then((result) => {
          if (result.success && result.data) {
            //mets à jour le cachet dans la liste locale
            setCachets(cachets.map((c) => (c.id === editId ? formateCachet(result.data) : c)));
            setEditId(null);
            resetFormulaire();
          } else {
            setErrors({ submit: result.error || "Erreur lors de la mise à jour" });
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      creerCachetAction({
        membreId: membreId!,
        date,
        montant: montant!,
        spectacleId: spectacleId!,
        statut: statut!,
        note,
      })
        .then((result) => {
          if (result.success && result.data) {
            //ajoute le nouveau cachet à la liste locale
            setCachets([...cachets, formateCachet(result.data)]);
            resetFormulaire();
          } else {
            setErrors({ submit: result.error || "Erreur lors de la création" });
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }

  function resetFormulaire(): void {
    setMembreId(null);
    setDate("");
    setMontant(null);
    setSpectacleId(null);
    setStatut(undefined);
    setNote("");
    setErrors({});
  }

  function supprimerCachet(id: number): void {
    setIsLoading(true);
    supprimerCachetAction(id)
      .then((result) => {
        if (result.success) {
          //supprime le cachet de la liste locale
          setCachets(cachets.filter((c) => c.id !== id));
          if (editId === id) setEditId(null);
        } else {
          setErrors({ submit: result.error || "Erreur lors de la suppression" });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }

  function editerCachet(c: Cachet): void {
    setEditId(c.id);
    setMembreId(c.membreId);
    setDate(c.date);
    setMontant(c.montant);
    setSpectacleId(c.spectacleId);
    setStatut(c.statut);
    setNote(c.note || "");
  }

  //filtrage par membre (prioritaire)
  const cachetsFiltresParMembre = filtreMembre
    ? cachets.filter((c) => c.membreId === filtreMembre)
    : cachets;

  //filtrage par spectacle (agit uniquement sur cachets de membre x)
  const cachetsFiltresParSpectacle = filtreSpectacle
    ? cachetsFiltresParMembre.filter((c) => c.spectacleId === filtreSpectacle)
    : cachetsFiltresParMembre;

  //filtrage par statut (agit uniquement sur cachets de membre x et spectacle y)
  const cachetsFiltresParStatut = filtreStatut
    ? cachetsFiltresParSpectacle.filter((c) => c.statut === filtreStatut)
    : cachetsFiltresParSpectacle;

  //filtrage par date ou montant avec direction croissante/décroissante
  const cachetsTries = [...cachetsFiltresParStatut].sort((a, b) => {
    switch (triPar) {
      case "dateCroissante":
        return a.date.localeCompare(b.date);
      case "dateDecroissante":
        return b.date.localeCompare(a.date);
      case "montantCroissant":
        return a.montant - b.montant;
      case "montantDecroissant":
        return b.montant - a.montant;
      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(cachetsTries.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const cachetsPagines = cachetsTries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
              onChange={(e) => setMembreId(e.target.value ? Number(e.target.value) : null)}
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
              step="0.01"
              min={MONTANT_CACHET_MINIMUM_LEGAL}
              value={montant?.toString() || ""}
              placeholder={`${MONTANT_CACHET_MINIMUM_LEGAL}`}
              onChange={(e) => setMontant(Number(e.target.value))}
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
              onChange={(e) => setSpectacleId(e.target.value ? Number(e.target.value) : null)}
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
              Statut
            </Heading>
            <br />
            {errors.statut && <p className="text-red-600 text-sm">{errors.statut}</p>}
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              id="statut"
              value={statut?.toString() || ""}
              onChange={(e) => setStatut(e.target.value as StatutCachet)}
              disabled={isLoading}
            >
              <option value=""> Choisir un statut </option>
              {Object.entries(StatutCachet)
                .filter(([key]) => isNaN(Number(key))) //filtre les clés numériques de l'enum
                .map(([, value]) => (
                  <option key={value} value={value}>
                    {STATUT_DICT[value as StatutCachet]}
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
              maxLength={NOTE_NB_MAX_CARACS}
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
        <div className="flex flex-wrap justify-between items-end gap-6 w-full">
          <div className="flex flex-col gap-1 flex-1 max-w-xs items-center">
            <label>Filtrer par membre</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={filtreMembre?.toString() || ""}
              onChange={(e) => {
                setFiltreMembre(e.target.value ? Number(e.target.value) : null);
                setPage(1);
              }}
            >
              <option value="">Tous les membres</option>
              {membres.map((membre) => (
                <option key={membre.id} value={membre.id}>
                  {membre.user.prenom} {membre.user.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 max-w-xs items-center">
            <label>Filtrer par spectacle</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={filtreSpectacle?.toString() || ""}
              onChange={(e) => {
                setFiltreSpectacle(e.target.value ? Number(e.target.value) : null);
                setPage(1);
              }}
            >
              <option value="">Tous</option>
              {spectacles.map((spectacle) => (
                <option key={spectacle.id} value={spectacle.id}>
                  {spectacle.titre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 max-w-xs items-center">
            <label>Filtrer par statut</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={filtreStatut?.toString() || ""}
              onChange={(e) => {
                setFiltreStatut(e.target.value as StatutCachet);
                setPage(1);
              }}
            >
              <option value="">Tous</option>
              {Object.entries(StatutCachet)
                .filter(([key]) => isNaN(Number(key))) //filtre les clés numériques de l'enum
                .map(([, value]) => (
                  <option key={value} value={value}>
                    {STATUT_DICT[value as StatutCachet]}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 max-w-xs items-center">
            <label>Options de tri</label>
            <select
              className="p-2 border border-slate-300 rounded-md w-full"
              value={triPar}
              onChange={(e) => {
                setTriPar(e.target.value as typeof triPar);
                setPage(1);
              }}
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
                <Table.Header>Statut</Table.Header>
                <Table.Header>Modifier cachet</Table.Header>
                <Table.Header>Supprimer cachet</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {cachetsPagines.map((c) => (
                <Table.Row key={c.id}>
                  <Table.Cell>
                    {c.membre.user.prenom} {c.membre.user.nom}
                  </Table.Cell>
                  <Table.Cell>{new Date(c.date).toLocaleDateString("fr-FR")}</Table.Cell>
                  <Table.Cell>{c.montant} €</Table.Cell>
                  <Table.Cell>{c.spectacle.titre}</Table.Cell>
                  <Table.Cell>{c.note || "-"}</Table.Cell>
                  <Table.Cell>{STATUT_DICT[c.statut]}</Table.Cell>
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
      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
}
