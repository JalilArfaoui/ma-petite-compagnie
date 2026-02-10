# Travailler avec Prisma

## Qu'est-ce que Prisma ?

Prisma est un **ORM** (Object-Relational Mapping) pour Node.js et TypeScript. Il fait le lien entre le code TypeScript et la base de données PostgreSQL. Concrètement, il permet de :

- Décrire la structure de la base de données dans un fichier de schéma (`prisma/schema.prisma`)
- Générer un client TypeScript typé pour lire et écrire dans la base
- Gérer l'évolution de la base via des migrations SQL versionnées

On n'écrit donc pas de SQL à la main pour les opérations courantes : Prisma génère les requêtes à partir d'appels TypeScript.

## Organisation dans le projet

```
prisma/
├── schema.prisma              # Schéma : définit les tables et relations
└── migrations/
    ├── 20260120103405_evenement/
    │   └── migration.sql      # SQL généré automatiquement
    ├── 20260203103330_adding_spectacle/
    │   └── migration.sql
    └── ...

src/lib/prisma.ts              # Instance du client Prisma, partagée dans l'app
```

## Le schéma (`prisma/schema.prisma`)

C'est la **source de vérité** pour la structure de la base. On y déclare les modèles (tables), leurs champs (colonnes), et les relations entre eux.

Exemple :

```prisma
model Spectacle {
  id             Int              @id @default(autoincrement())
  titre          String
  description    String?                          // champ optionnel
  statut         StatutSpectacle                  // enum
  budget_initial Float            @default(0)     // valeur par défaut
}
```

Quand on modifie ce fichier, il faut créer une migration pour que la base de données suive (voir section suivante).

## Le client Prisma

Le client est importé depuis `@/lib/prisma` et offre une API typée pour chaque modèle du schéma :

```typescript
import { prisma } from "@/lib/prisma";

// Lire tous les spectacles
const spectacles = await prisma.spectacle.findMany();

// Créer un spectacle
await prisma.spectacle.create({
  data: { titre: "Hamlet", type: "Théâtre", statut: "EN_CREATION", troupe: "Troupe A" },
});

// Chercher avec un filtre
const enTournee = await prisma.spectacle.findMany({
  where: { statut: "EN_TOURNEE" },
});
```

L'autocomplétion fonctionne dans l'IDE car le client est généré à partir du schéma.

## Les migrations

Les migrations sont des fichiers SQL qui font évoluer la base de données de manière incrémentale. Chaque migration est un dossier horodaté contenant un fichier `migration.sql`.

### Deux commandes, deux usages

|                       | `prisma migrate dev`                                                                                             | `prisma migrate deploy`                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Usage**             | En développement local                                                                                           | En production / déploiement                                            |
| **Ce qu'elle fait**   | Compare le schéma avec la base, génère une nouvelle migration SQL si besoin, l'applique, puis régénère le client | Applique les migrations existantes pas encore jouées sur la base cible |
| **Génère du SQL ?**   | Oui, si le schéma a changé                                                                                       | Non, jamais                                                            |
| **Interactive ?**     | Oui (peut demander confirmation pour des opérations destructives)                                                | Non                                                                    |
| **Risque de reset ?** | Oui, si la base a divergé du schéma                                                                              | Non                                                                    |
| **Script npm**        | `npm run db:migrate`                                                                                             | Exécutée automatiquement par `npm run build`                           |

### Workflow typique

1. **Modifier le schéma** dans `prisma/schema.prisma` (ajouter un modèle, un champ, une relation...)

2. **Générer la migration** en local :

   ```bash
   npm run db:migrate
   ```

   Prisma demande un nom pour la migration (ex: `ajout_spectacle`), génère le SQL correspondant dans `prisma/migrations/`, l'applique sur la base locale et régénère le client.

3. **Committer le fichier de migration** avec le code. Le dossier `prisma/migrations/` fait partie du code versionné.

4. **Au déploiement**, `prisma migrate deploy` est lancé automatiquement et applique les nouvelles migrations sur la base de production.

### Règles importantes

- **Ne jamais modifier un fichier de migration déjà commité.** Si la migration a été appliquée sur d'autres environnements, la modifier causera des erreurs. Créer plutôt une nouvelle migration corrective.
- **Toujours commiter les migrations.** Le dossier `prisma/migrations/` doit être versionné dans Git. C'est lui qui permet à `prisma migrate deploy` de fonctionner en production.
- **Ne pas utiliser `prisma db push` sauf pour du prototypage rapide.** Cette commande synchronise la base avec le schéma sans créer de migration, ce qui rend l'évolution non reproductible.

## Régénérer le client

Si l'autocomplétion semble désynchronisée ou après un `git pull` qui contient des changements de schéma :

```bash
npm run db:generate
```

Cette commande est aussi exécutée automatiquement à chaque `npm install` (via le script `postinstall`).

## Commandes de référence

| Commande              | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `npm run db:start`    | Démarrer la base PostgreSQL locale (Docker)            |
| `npm run db:stop`     | Arrêter la base PostgreSQL locale                      |
| `npm run db:migrate`  | Créer et appliquer une migration en développement      |
| `npm run db:generate` | Régénérer le client Prisma                             |
| `npm run db:studio`   | Ouvrir l'interface web pour explorer la base           |
| `npm run db:reset`    | Réinitialiser la base et rejouer toutes les migrations |

## Pour aller plus loin

- [Documentation Prisma](https://www.prisma.io/docs)
- [Référence du schéma Prisma](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
- [Guide des migrations](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/overview)
