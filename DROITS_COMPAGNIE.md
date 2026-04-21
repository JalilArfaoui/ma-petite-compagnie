# Droits des membres d'une compagnie

## Récupérer la session et les droits

**Côté client** (composant avec `"use client"`) :

```ts
const { data: session } = useSession();
const rights = session.rights; // droits de la compagnie active
```

**Côté serveur** (server action ou server component) :

```ts
const session = await auth();
const userId = Number(session.user.id);
```

---

## Droits disponibles (`session.rights`)

Les droits sont ceux de l'utilisateur sur sa **compagnie active**.

| Champ                        | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `droitAccesDetailsCompagnie` | Voir la page de détails de la compagnie (`/compagnie/[id]`) |
| `droitModificationCompagnie` | Modifier le nom de la compagnie                             |
| `droitSuppressionCompagnie`  | Supprimer la compagnie                                      |
| `droitAjoutMembre`           | Ajouter des membres                                         |
| `droitSuppressionMembre`     | Retirer des membres                                         |
| `droitGestionDroitsMembres`  | Modifier les droits des membres                             |
| `droitAccesPlanning`         | Accéder au planning                                         |
| `droitGestionPlanning`       | Modifier le planning                                        |

> **Note :** `droitAccesDetailsCompagnie` est automatiquement accordé à quiconque possède au moins un autre droit.

---

## Protéger une server action

Pattern à suivre dans `src/app/(auth)/company-actions.ts` ou toute autre server action :

```ts
export async function maAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté" };

  const compagnieId = Number(formData.get("compagnieId"));

  const member = await prisma.companyMember.findUnique({
    where: { userId_compagnieId: { userId: Number(session.user.id), compagnieId } },
  });

  if (!member?.droitXxx) return { error: "Vous n'avez pas les droits nécessaires" };

  // ... logique métier
}
```

---

## Ajouter un nouveau droit

Suivre ces étapes dans l'ordre :

**1. Schéma Prisma** — ajouter le champ dans `prisma/schema.prisma` sur le modèle `CompanyMember` :

```prisma
model CompanyMember {
  // ...
  droitXxx Boolean @default(false)
}
```

**2. Migration** :

```bash
npx prisma migrate dev --name add_droit_xxx
```

**3. Type TypeScript** — ajouter le champ dans `src/types/next-auth.d.ts` :

```ts
export type CompanyRights = {
  // ...
  droitXxx: boolean;
};
```

**4. Session** — inclure le champ dans le callback de session dans `src/auth.ts` :

```ts
session.rights = {
  // ...
  droitXxx: m0.droitXxx,
};
```

**5. Création de compagnie** — accorder le droit par défaut au créateur dans `createCompany` (`src/app/(auth)/company-actions.ts`) :

```ts
membres: {
  create: {
    // ...
    droitXxx: true,
  },
},
```

**6. Page de gestion** — ajouter le label dans `RIGHTS_LABELS` dans `src/app/compagnie/[id]/CompagnieDetailClient.tsx` :

```ts
const RIGHTS_LABELS = [
  // ...
  { key: "droitXxx", label: "Description du droit" },
];
```

Le nouveau droit apparaîtra automatiquement dans les cartes membres et dans le formulaire d'ajout de membre.
