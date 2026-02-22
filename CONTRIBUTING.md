# Guide de contribution

## Workflow Git

### Branches

- `main` : branche principale, toujours stable
- `feature/*` : branches de fonctionnalités

### Créer une branche

```bash
git checkout main
git pull origin main
git checkout -b feature/ma-fonctionnalite
```

### Conventions de nommage des branches

- `feature/nom-fonctionnalite` : nouvelle fonctionnalité
- `fix/description-bug` : correction de bug
- `refactor/description` : refactoring

## Issues

Tout travail commence par une issue.

### Labels obligatoires

Un label de groupe fonctionnel :

- `production`
- `planning`
- `finance`
- `communication`
- `transverse`

### Labels complémentaires

- `bug` : correction de bug
- `feature` : nouvelle fonctionnalité
- `tech` : technique
- `ux` : amélioration UX

## Merge Requests

### Règles de validation

- 2 approvals minimum :
  - 1 approval d'un membre du même groupe
  - 1 approval d'un autre groupe
- L'auteur ne peut pas approuver sa propre MR
- Toutes les discussions doivent être résolues

## Base de données (Prisma)

### Migrations en développement

```bash
npm run db:migrate
```

Cette commande lance `prisma migrate dev`. Elle compare le schéma Prisma avec la base locale, génère une nouvelle migration SQL si nécessaire, l'applique, puis régénère le client Prisma. Elle peut demander confirmation pour des opérations destructives (suppression de colonne, reset de la base...). À utiliser uniquement en local.

### Migrations en production

```bash
npx prisma migrate deploy
```

Cette commande applique les fichiers de migration SQL existants qui n'ont pas encore été joués sur la base cible. Elle ne génère rien, ne demande aucune confirmation et ne risque jamais de réinitialiser la base. Si toutes les migrations sont déjà appliquées, elle ne fait rien.

Elle est exécutée automatiquement lors du build de déploiement (`npm run build`).

## Conventions de code

### Style

- ESLint + Prettier configurés
- Pas de `any` en TypeScript
- Noms de variables et fonctions en français

### Tests

- Écrire des tests pour les nouvelles fonctionnalités
