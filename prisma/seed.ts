import "dotenv/config";
import {
  PrismaClient,
  Compagnie,
  CategorieObjet,
  TypeObjet,
  Objet,
  Lieu,
  Spectacle,
  Representation,
  OperationFinanciere,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // --- Compagnies (si aucune n'existe) ---
  const compagniesData = [
    { nom: "Les Étoiles du Théâtre" },
    { nom: "La Troupe du Soleil" },
    { nom: "Compagnie des Arts Vivants" },
  ];

  const compagnies: Compagnie[] = [];
  for (const c of compagniesData) {
    const existing = await prisma.compagnie.findFirst({ where: { nom: c.nom } });
    if (existing) {
      compagnies.push(existing);
    } else {
      compagnies.push(await prisma.compagnie.create({ data: c }));
    }
  }
  console.log(`✅ ${compagnies.length} compagnies`);

  // --- Catégories d'objets ---
  const categoriesData = [
    "Costume",
    "Accessoire",
    "Décor",
    "Matériel technique",
    "Mobilier",
    "Éclairage",
    "Son",
    "Maquillage",
    "Marionnette",
    "Textile",
  ];

  const categories: CategorieObjet[] = [];
  for (const nom of categoriesData) {
    const existing = await prisma.categorieObjet.findFirst({ where: { nom } });
    if (existing) {
      categories.push(existing);
    } else {
      categories.push(await prisma.categorieObjet.create({ data: { nom } }));
    }
  }
  console.log(`✅ ${categories.length} catégories d'objets`);

  // --- Types d'objets (~20) ---
  const typesObjetsData = [
    { nom: "Chaise en bois", categorieId: categories[4].id },
    { nom: "Table ronde", categorieId: categories[4].id },
    { nom: "Robe victorienne", categorieId: categories[0].id },
    { nom: "Chapeau haut-de-forme", categorieId: categories[1].id },
    { nom: "Épée en mousse", categorieId: categories[1].id },
    { nom: "Rideau rouge", categorieId: categories[2].id },
    { nom: "Panneau de fond", categorieId: categories[2].id },
    { nom: "Projecteur LED", categorieId: categories[5].id },
    { nom: "Micro sans fil", categorieId: categories[6].id },
    { nom: "Enceinte portable", categorieId: categories[6].id },
    { nom: "Perruque blonde", categorieId: categories[7].id },
    { nom: "Masque vénitien", categorieId: categories[1].id },
    { nom: "Marionnette à fil", categorieId: categories[8].id },
    { nom: "Costume de pirate", categorieId: categories[0].id },
    { nom: "Banc de jardin", categorieId: categories[4].id },
    { nom: "Drap de scène", categorieId: categories[9].id },
    { nom: "Couronne dorée", categorieId: categories[1].id },
    { nom: "Arbre artificiel", categorieId: categories[2].id },
    { nom: "Machine à fumée", categorieId: categories[3].id },
    { nom: "Câble XLR 10m", categorieId: categories[3].id },
  ];

  const typesObjets: TypeObjet[] = [];
  for (const t of typesObjetsData) {
    const existing = await prisma.typeObjet.findFirst({ where: { nom: t.nom } });
    if (existing) {
      typesObjets.push(existing);
    } else {
      typesObjets.push(await prisma.typeObjet.create({ data: t }));
    }
  }
  console.log(`✅ ${typesObjets.length} types d'objets`);

  // --- Objets  ---

  const objetsData = [
    // Chaises en bois - 4 exemplaires
    {
      typeObjetId: typesObjets[0].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[0].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[0].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Pied légèrement bancal",
    },
    {
      typeObjetId: typesObjets[0].id,
      etat: "CASSE" as const,
      estDisponible: false,
      compagnieId: compagnies[0].id,
      commentaire: "Dossier cassé, à réparer",
    },
    // Tables rondes - 2 exemplaires
    {
      typeObjetId: typesObjets[1].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[1].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    // Robe victorienne - 3 exemplaires
    {
      typeObjetId: typesObjets[2].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[1].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[2].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[1].id,
      commentaire: "Couture décousue au niveau de la manche",
    },
    {
      typeObjetId: typesObjets[2].id,
      etat: "CASSE" as const,
      estDisponible: false,
      compagnieId: compagnies[1].id,
      commentaire: "Tissu déchiré irréparable",
    },
    // Chapeau haut-de-forme
    {
      typeObjetId: typesObjets[3].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[1].id,
      commentaire: null,
    },
    // Épée en mousse - 3
    {
      typeObjetId: typesObjets[4].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[4].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[4].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Mousse un peu enfoncée",
    },
    // Rideau rouge
    {
      typeObjetId: typesObjets[5].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[2].id,
      commentaire: null,
    },
    // Projecteur LED - 2
    {
      typeObjetId: typesObjets[7].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[2].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[7].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[2].id,
      commentaire: "Filtre couleur manquant",
    },
    // Micro sans fil
    {
      typeObjetId: typesObjets[8].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[2].id,
      commentaire: null,
    },
    // Masque vénitien - 2
    {
      typeObjetId: typesObjets[11].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[1].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[11].id,
      etat: "CASSE" as const,
      estDisponible: false,
      compagnieId: compagnies[1].id,
      commentaire: "Fissure au niveau du front",
    },
    // Machine à fumée
    {
      typeObjetId: typesObjets[18].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[2].id,
      commentaire: null,
    },
    // Costume de pirate
    {
      typeObjetId: typesObjets[13].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[13].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Boutons manquants",
    },
    // Arbre artificiel
    {
      typeObjetId: typesObjets[17].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[2].id,
      commentaire: null,
    },
    // Câble XLR
    {
      typeObjetId: typesObjets[19].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[2].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[19].id,
      etat: "CASSE" as const,
      estDisponible: false,
      compagnieId: compagnies[2].id,
      commentaire: "Connecteur cassé",
    },
    // --- Extra objects for compagnie 1 ---
    // Rideau rouge (compagnie 1)
    {
      typeObjetId: typesObjets[5].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[5].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Légèrement décoloré",
    },
    // Panneau de fond (compagnie 1)
    {
      typeObjetId: typesObjets[6].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[6].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Fond forêt enchantée",
    },
    // Projecteur LED (compagnie 1)
    {
      typeObjetId: typesObjets[7].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[7].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[7].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Ventilateur bruyant",
    },
    // Micro sans fil (compagnie 1)
    {
      typeObjetId: typesObjets[8].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[8].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Batterie faible",
    },
    // Enceinte portable (compagnie 1)
    {
      typeObjetId: typesObjets[9].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    // Perruque blonde (compagnie 1)
    {
      typeObjetId: typesObjets[10].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    // Masque vénitien (compagnie 1)
    {
      typeObjetId: typesObjets[11].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    // Marionnette à fil (compagnie 1)
    {
      typeObjetId: typesObjets[12].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[12].id,
      etat: "ABIME" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Fil emmêlé",
    },
    // Banc de jardin (compagnie 1)
    {
      typeObjetId: typesObjets[14].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    // Drap de scène (compagnie 1)
    {
      typeObjetId: typesObjets[15].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[15].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: "Blanc 6x4m",
    },
    // Couronne dorée (compagnie 1)
    {
      typeObjetId: typesObjets[16].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    // Machine à fumée (compagnie 1)
    {
      typeObjetId: typesObjets[18].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    // Câble XLR (compagnie 1)
    {
      typeObjetId: typesObjets[19].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
    {
      typeObjetId: typesObjets[19].id,
      etat: "NEUF" as const,
      estDisponible: true,
      compagnieId: compagnies[0].id,
      commentaire: null,
    },
  ];

  // Delete existing objects to avoid duplicates on re-seed
  await prisma.reservationObjet.deleteMany({});
  await prisma.objet.deleteMany({});

  const objets: Objet[] = [];
  for (const o of objetsData) {
    objets.push(await prisma.objet.create({ data: o }));
  }
  console.log(`✅ ${objets.length} objets`);

  // --- Lieux (si aucun n'existe) ---
  const lieuxData = [
    {
      libelle: "Théâtre Municipal",
      adresse: "12 rue des Arts",
      ville: "Paris",
      idCompagnie: compagnies[0].id,
    },
    {
      libelle: "Salle Gaveau",
      adresse: "45 rue La Boétie",
      ville: "Paris",
      idCompagnie: compagnies[1].id,
    },
    {
      libelle: "Le Hangar",
      adresse: "8 quai de la Gare",
      ville: "Lyon",
      idCompagnie: compagnies[2].id,
    },
    {
      libelle: "Espace Culturel Molière",
      adresse: "3 place du Théâtre",
      ville: "Marseille",
      idCompagnie: compagnies[0].id,
      numero_salle: "Salle A",
    },
    {
      libelle: "La Fabrique",
      adresse: "22 avenue Jean Jaurès",
      ville: "Toulouse",
      idCompagnie: compagnies[0].id,
    },
  ];

  const lieux: Lieu[] = [];
  for (const l of lieuxData) {
    const existing = await prisma.lieu.findFirst({ where: { libelle: l.libelle } });
    if (existing) {
      lieux.push(existing);
    } else {
      lieux.push(await prisma.lieu.create({ data: l }));
    }
  }
  console.log(`✅ ${lieux.length} lieux`);

  // --- Spectacles ---
  const spectaclesData = [
    {
      titre: "Le Songe d'une nuit d'été",
      type: "THEATRE" as const,
      statut: "EN_TOURNEE" as const,
      compagnieId: compagnies[0].id,
      budget_initial: 15000,
    },
    {
      titre: "Carmen revisitée",
      type: "DANSE" as const,
      statut: "EN_REPETITION" as const,
      compagnieId: compagnies[0].id,
      budget_initial: 20000,
    },
    {
      titre: "Pestacle",
      type: "MUSIQUE" as const,
      statut: "EN_CREATION" as const,
      compagnieId: compagnies[0].id,
      budget_initial: 10000,
    },
    {
      titre: "Lumière noire",
      type: "CIRQUE" as const,
      statut: "EN_CREATION" as const,
      compagnieId: compagnies[2].id,
      budget_initial: 12000,
    },
    {
      titre: "Les Misérables — Acte I",
      type: "THEATRE" as const,
      statut: "EN_CREATION" as const,
      compagnieId: compagnies[0].id,
      budget_initial: 25000,
    },
    {
      titre: "Valse des ombres",
      type: "DANSE" as const,
      statut: "EN_TOURNEE" as const,
      compagnieId: compagnies[0].id,
      budget_initial: 18000,
    },
    {
      titre: "Circus Absurdum",
      type: "CIRQUE" as const,
      statut: "EN_REPETITION" as const,
      compagnieId: compagnies[0].id,
      budget_initial: 22000,
    },
  ];

  const spectacles: Spectacle[] = [];
  for (const s of spectaclesData) {
    const existing = await prisma.spectacle.findFirst({ where: { titre: s.titre } });
    if (existing) {
      spectacles.push(existing);
    } else {
      spectacles.push(await prisma.spectacle.create({ data: s }));
    }
  }
  console.log(`✅ ${spectacles.length} spectacles`);

  // --- Représentations ---
  const repsData = [
    { date: new Date("2026-04-15T20:00:00"), spectacleId: spectacles[0].id, lieuId: lieux[0].id },
    { date: new Date("2026-04-22T20:00:00"), spectacleId: spectacles[0].id, lieuId: lieux[2].id },
    { date: new Date("2026-05-10T19:30:00"), spectacleId: spectacles[1].id, lieuId: lieux[1].id },
    { date: new Date("2026-06-01T21:00:00"), spectacleId: spectacles[2].id, lieuId: lieux[2].id },
    { date: new Date("2026-05-03T20:30:00"), spectacleId: spectacles[0].id, lieuId: lieux[3].id },
    { date: new Date("2026-05-18T19:00:00"), spectacleId: spectacles[4].id, lieuId: lieux[0].id },
    { date: new Date("2026-06-12T20:00:00"), spectacleId: spectacles[5].id, lieuId: lieux[4].id },
    { date: new Date("2026-06-20T21:00:00"), spectacleId: spectacles[6].id, lieuId: lieux[3].id },
    { date: new Date("2026-07-05T20:30:00"), spectacleId: spectacles[1].id, lieuId: lieux[4].id },
  ];

  const representations: Representation[] = [];
  for (const r of repsData) {
    const existing = await prisma.representation.findFirst({
      where: { date: r.date, spectacleId: r.spectacleId },
    });
    if (existing) {
      representations.push(existing);
    } else {
      representations.push(await prisma.representation.create({ data: r }));
    }
  }
  console.log(`✅ ${representations.length} représentations`);

  // --- Réservations d'objets ---
  const reservationsData = [
    // Représentation 0: Le Songe — Théâtre Municipal
    { objetId: objets[0].id, representationId: representations[0].id },
    { objetId: objets[1].id, representationId: representations[0].id },
    { objetId: objets[4].id, representationId: representations[0].id },
    // Représentation 1: Le Songe — Le Hangar
    { objetId: objets[10].id, representationId: representations[1].id },
    // Représentation 2: Carmen — Salle Gaveau
    { objetId: objets[13].id, representationId: representations[2].id },
    // Représentation 3: Pestacle — Le Hangar
    { objetId: objets[14].id, representationId: representations[3].id },
    // Représentation 4: Le Songe — Espace Culturel Molière
    { objetId: objets[25].id, representationId: representations[4].id },
    { objetId: objets[27].id, representationId: representations[4].id },
    // Représentation 5: Les Misérables — Théâtre Municipal
    { objetId: objets[29].id, representationId: representations[5].id },
    { objetId: objets[30].id, representationId: representations[5].id },
    { objetId: objets[35].id, representationId: representations[5].id },
    // Représentation 6: Valse des ombres — La Fabrique
    { objetId: objets[32].id, representationId: representations[6].id },
    { objetId: objets[36].id, representationId: representations[6].id },
    // Représentation 7: Circus Absurdum — Espace Culturel Molière
    { objetId: objets[40].id, representationId: representations[7].id },
    { objetId: objets[42].id, representationId: representations[7].id },
  ];

  for (const r of reservationsData) {
    await prisma.reservationObjet.create({ data: r });
  }
  console.log(`✅ ${reservationsData.length} réservations d'objets`);

  // --- Opérations financières (données issues de test_data.ts) ---
  // Nettoyage pour éviter les doublons
  await prisma.operationFinanciere.deleteMany({});

  // Helper pour trouver un spectacle par titre (parmi ceux du seed)
  const findSpectacle = (titre: string) => spectacles.find((s) => s.titre === titre);

  const operationsData = [
    // ── Recettes ──
    {
      nom: "Fonds de roulement initial",
      montant: 10600.83,
      date: new Date("2025-12-01"),
      type: "RECETTE" as const,
      categorie: "financement",
      statut: "paye",
      compagnieId: compagnies[0].id,
      spectacles: [],
    },
    {
      nom: "Théâtre municipal des Lices",
      montant: 750.5,
      date: new Date("2026-01-27"),
      type: "RECETTE" as const,
      categorie: "facture",
      statut: "paye",
      compagnieId: compagnies[0].id,
      spectacles: ["Le Songe d'une nuit d'été"],
    },
    {
      nom: "Mairie Gaillac",
      montant: 300.25,
      date: new Date("2026-01-17"),
      type: "RECETTE" as const,
      categorie: "facture",
      statut: "paye",
      compagnieId: compagnies[0].id,
      spectacles: [],
    },
    {
      nom: "Théâtre de Cordes",
      montant: 450,
      date: new Date("2026-02-10"),
      type: "RECETTE" as const,
      categorie: "facture",
      statut: "en_attente",
      compagnieId: compagnies[0].id,
      spectacles: ["Carmen revisitée", "Pestacle"],
    },
    {
      nom: "DRAC Occitanie",
      montant: 5000,
      date: new Date("2026-01-10"),
      type: "RECETTE" as const,
      categorie: "financement",
      statut: "en_attente",
      compagnieId: compagnies[0].id,
      spectacles: ["Le Songe d'une nuit d'été"],
    },
    {
      nom: "Ville d'Albi",
      montant: 1150,
      date: new Date("2026-01-15"),
      type: "RECETTE" as const,
      categorie: "financement",
      statut: "paye",
      compagnieId: compagnies[0].id,
      spectacles: ["Carmen revisitée"],
    },
    {
      nom: "Conseil départemental",
      montant: 750,
      date: new Date("2026-01-20"),
      type: "RECETTE" as const,
      categorie: "financement",
      statut: "en_attente",
      compagnieId: compagnies[0].id,
      spectacles: ["Pestacle"],
    },
    // ── Dépenses ──
    {
      nom: "Décorations scène",
      montant: 400,
      date: new Date("2026-01-22"),
      type: "DEPENSE" as const,
      categorie: null,
      statut: "paye",
      compagnieId: compagnies[0].id,
      spectacles: ["Pestacle"],
    },
    {
      nom: "Loyer local de répét",
      montant: 128,
      date: new Date("2026-01-22"),
      type: "DEPENSE" as const,
      categorie: null,
      statut: "paye",
      compagnieId: compagnies[0].id,
      spectacles: [],
    },
  ];

  const operations: OperationFinanciere[] = [];
  for (const op of operationsData) {
    const { spectacles: spectacleTitres, ...opData } = op;
    const spectacleConnections = spectacleTitres
      .map((titre) => findSpectacle(titre))
      .filter(Boolean)
      .map((s) => ({ id: s!.id }));

    operations.push(
      await prisma.operationFinanciere.create({
        data: {
          ...opData,
          spectacles: {
            connect: spectacleConnections,
          },
        },
      })
    );
  }
  console.log(`✅ ${operations.length} opérations financières`);

  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
