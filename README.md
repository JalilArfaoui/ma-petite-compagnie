# Ma Petite Compagnie

Application web de gestion pour compagnie de théâtre.

## Prérequis

- Node.js 22+
- Docker (pour PostgreSQL)

## Installation

```bash
# Cloner le dépôt
git clone git@sources.univ-jfc.fr:techno-web/ma-petite-compagnie.git
cd ma-petite-compagnie

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer la base de données
npm run db:start

# Appliquer les migrations
npm run db:migrate

# Générer le client Prisma
npm run db:generate
```

## Développement

```bash
# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Lance le serveur de développement        |
| `npm run build`      | Compile l'application pour la production |
| `npm run start`      | Démarre l'application en production      |
| `npm run lint`       | Vérifie le code avec ESLint              |
| `npm run format`     | Formate le code avec Prettier            |
| `npm run test`       | Lance les tests                          |
| `npm run test:watch` | Lance les tests en mode watch            |
| `npm run db:start`   | Démarre PostgreSQL via Docker            |
| `npm run db:stop`    | Arrête PostgreSQL                        |
| `npm run db:migrate` | Applique les migrations Prisma           |
| `npm run db:studio`  | Ouvre Prisma Studio                      |

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Tests** : Vitest + Testing Library
- **Système de composants** : Chakra UI

## Licence

Ce projet est sous licence [AGPL-3.0](LICENSE).
