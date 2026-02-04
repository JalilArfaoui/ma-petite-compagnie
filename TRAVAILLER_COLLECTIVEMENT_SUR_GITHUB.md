# Travailler collectivement sur GitHub

Ce guide accompagne le travail en équipe avec Git et GitHub. À 16 sur un même projet, une bonne organisation est indispensable pour éviter le chaos.

---

## Partie 1 : Comprendre Git

### Qu'est-ce qu'une branche ?

Imaginez un arbre généalogique. Le tronc, c'est `main`. Créer une branche, c'est créer une ligne parallèle qui part du tronc à un moment donné.

```
main:                      A---B---C---D---E  (le tronc)
                                \
planning/reservations:           F---G---H   (la branche)
```

- `A`, `B`, `C`... sont des commits (des "photos" du code à un instant T)
- La branche `planning/reservations` est partie de `B`
- 3 commits (`F`, `G`, `H`) ont été faits sans toucher à `main`
- Pendant ce temps, d'autres ont ajouté `D` et `E` sur `main`

**Pourquoi c'est utile ?**

- Possibilité d'expérimenter sans casser le code des autres
- Plusieurs personnes peuvent travailler en parallèle
- Facile d'annuler une fonctionnalité (supprimer la branche)

### Local vs Remote : deux copies du projet

Quand on travaille avec Git et GitHub, il y a **deux copies** du projet :

```
┌─────────────────────┐           ┌─────────────────────┐
│   VOTRE ORDINATEUR  │           │       GITHUB        │
│      (local)        │           │      (remote)       │
│                     │           │                     │
│  - main             │◄──pull────│  - main             │
│  - planning/reservations    │───push───►│  - planning/reservations    │
│                     │           │                     │
│  C'est là qu'on     │           │  C'est là que tout  │
│  modifie le code    │           │  le monde partage   │
└─────────────────────┘           └─────────────────────┘
```

**Vocabulaire important :**

| Terme       | Signification                                              |
| ----------- | ---------------------------------------------------------- |
| `origin`    | Le nom par défaut du remote (GitHub dans notre cas)        |
| `git fetch` | Récupère les infos du remote SANS modifier le code local   |
| `git pull`  | Récupère ET applique les modifications (`fetch` + `merge`) |
| `git push`  | Envoie les commits locaux vers le remote                   |

**Exemple concret :**

```bash
# "Qu'est-ce qui s'est passé sur GitHub depuis la dernière fois ?"
git fetch origin

# "Je veux récupérer les modifications de main depuis GitHub"
git pull origin main

# "J'envoie mes commits sur GitHub"
git push origin planning/reservations
```

### Comprendre `git status`

C'est LA commande à utiliser tout le temps. Elle indique exactement où on en est :

```bash
$ git status

On branch planning/reservations           # Branche courante
Your branch is ahead of 'origin/planning/reservations' by 2 commits.
                                  # 2 commits pas encore pushés

Changes not staged for commit:    # Fichiers modifiés mais pas "git add"
  modified:   src/app/page.tsx

Untracked files:                  # Nouveaux fichiers pas encore suivis
  src/components/Login.tsx
```

**Interprétation :**

- "ahead of origin by 2 commits" → faire `git push`
- "behind origin by 3 commits" → faire `git pull`
- "Changes not staged" → faire `git add` puis `git commit`

---

## Partie 2 : Les branches en pratique

### Créer une branche

```bash
# 1. Se mettre sur main
git checkout main

# 2. Récupérer la dernière version de main
git pull origin main

# 3. Créer et basculer sur une nouvelle branche
git checkout -b production/formulaire-spectacle
```

Le `-b` crée la branche. Sans `-b`, on bascule sur une branche existante.

### Conventions de nommage

Le préfixe de la branche correspond au **groupe fonctionnel** qui travaille dessus :

| Préfixe          | Exemple                           |
| ---------------- | --------------------------------- |
| `production/`    | `production/liste-spectacles`     |
| `planning/`      | `planning/calendrier-repetitions` |
| `finance/`       | `finance/suivi-budget`            |
| `communication/` | `communication/page-contact`      |
| `transverse/`    | `transverse/authentification`     |

Après le préfixe, utiliser un nom court et descriptif en minuscules avec des tirets.

### Naviguer entre les branches

```bash
# Voir toutes les branches
git branch -a

# Basculer sur une autre branche
git checkout main
git checkout planning/reservations

# ⚠️ ATTENTION : avec des modifications non commitées,
# Git peut refuser de changer de branche ou les perdre !
# Solution : commiter ou utiliser git stash
```

### Supprimer une branche

```bash
# Supprimer une branche locale (après merge)
git branch -d planning/reservations

# Forcer la suppression (si pas mergée)
git branch -D planning/reservations
```

---

## Partie 3 : Merge vs Rebase

C'est LE sujet qui embrouille tout le monde. Voici une explication claire.

### Le problème

On travaille sur `planning/reservations`. Pendant ce temps, `main` a avancé :

```
main:                      A---B---C---D---E
                                \
planning/reservations:           F---G
```

On veut intégrer les nouveautés de `main` (commits `C`, `D`, `E`) dans la branche. Deux options : **merge** ou **rebase**.

### Option 1 : Merge (recommandé pour les débutants)

```bash
git checkout planning/reservations
git merge main
```

Résultat :

```
main:                      A---B---C---D---E
                                \           \
planning/reservations:           F---G-------M  (M = commit de merge)
```

**Avantages :**

- Simple à comprendre
- Préserve l'historique exact
- Facile à annuler

**Inconvénients :**

- Crée un commit de merge supplémentaire
- L'historique peut devenir touffu

### Option 2 : Rebase (pour utilisateurs avancés)

```bash
git checkout planning/reservations
git rebase main
```

Résultat :

```
main:                      A---B---C---D---E
                                            \
planning/reservations:                       F'---G'  (commits "rejoués")
```

Le rebase "rejoue" les commits (`F`, `G`) comme s'ils avaient été faits APRÈS `E`.

**Avantages :**

- Historique linéaire et propre
- Pas de commit de merge

**Inconvénients :**

- Réécrit l'historique (dangereux si déjà pushé)
- Plus complexe en cas de conflits
- **NE JAMAIS faire sur une branche partagée**

### Quelle option choisir ?

| Situation                                           | Recommandation                                |
| --------------------------------------------------- | --------------------------------------------- |
| Débutant avec Git                                   | **Merge**                                     |
| Plusieurs personnes travaillent sur la même branche | **Merge**                                     |
| Travail seul sur sa branche                         | Merge ou Rebase                               |
| Historique propre souhaité avant de merger          | **Rebase** puis `git push --force-with-lease` |

**Conseil : en cas de doute, utiliser merge.**

---

## Partie 4 : Se mettre à jour de `main`

### Pourquoi c'est important

Sans synchronisation régulière :

- Le retard sur `main` s'accumule
- Les conflits deviennent de plus en plus complexes
- La PR sera difficile à merger

### Comment faire (méthode merge)

```bash
# 1. Finir et commiter le travail en cours
git add src/components/MonComposant.tsx
git commit -m "Ajoute le composant MonComposant"

# 2. Récupérer les dernières modifications de main
git fetch origin main

# 3. Merger main dans la branche courante
git merge origin/main
```

**Bonne pratique :** Faire des petits commits réguliers permet de toujours avoir un état propre avant de se synchroniser. Pas besoin de "mettre de côté" du travail si on commite souvent.

Si tout va bien :

```
Updating abc123..def456
Fast-forward
 src/app/page.tsx | 10 +++++-----
 1 file changed, 5 insertions(+), 5 deletions(-)
```

S'il y a des conflits, voir la section "Résoudre les conflits".

### Quand se synchroniser ?

- **Au minimum** : avant de créer la PR
- **Idéalement** : une fois par jour si la branche dure plusieurs jours
- **Obligatoirement** : si `main` a beaucoup bougé

---

## Partie 5 : Les Pull Requests (PR)

### C'est quoi une PR ?

Une Pull Request, c'est une **demande de fusion** d'une branche vers `main`. C'est l'occasion pour l'équipe de :

- Relire le code
- Poser des questions
- Suggérer des améliorations
- Valider que ça fonctionne

### Cycle de vie d'une PR

```
Créer la branche → Coder → Pousser → Créer la PR → Reviews → Corrections → Merge
       │                                  │            │
       │                                  │            └─ Peut boucler plusieurs fois
       │                                  │
       └── En local ─────────────────────►└── Sur GitHub
```

### Créer une PR pas à pas

**1. Pousser la branche sur GitHub**

```bash
# La première fois (crée la branche sur GitHub)
git push -u origin production/formulaire-spectacle

# Les fois suivantes
git push
```

**2. Sur GitHub, créer la PR**

- Aller sur le repo GitHub
- Cliquer sur "Compare & pull request" (bandeau jaune) ou "New pull request"
- Sélectionner la branche

**3. Remplir la PR**

```markdown
## Titre

Ajoute le formulaire de création de spectacle

## Description

- Ajoute un formulaire avec les champs nom, date, lieu
- Validation côté client
- Sauvegarde en base

## Lien avec l'issue

Closes #42

## Comment tester

1. Aller sur /spectacles/nouveau
2. Remplir le formulaire
3. Vérifier que le spectacle apparaît dans la liste
```

**4. Attendre les reviews**

La PR doit être approuvée par au moins 2 personnes (1 du même groupe + 1 d'un autre groupe). Soit attendre que des reviewers passent, soit assigner des personnes spécifiques pour solliciter leur relecture.

### Mettre à jour une PR après des retours

Quand quelqu'un fait un commentaire et qu'une correction est nécessaire :

```bash
# 1. Faire les modifications demandées
# 2. Commiter
git add .
git commit -m "Corrige la validation du formulaire"

# 3. Pousser
git push
```

La PR se met à jour automatiquement.

### Merger une PR

Une fois approuvée :

1. Cliquer sur "Merge pull request" (ou "Squash and merge")
2. Confirmer
3. Supprimer la branche (GitHub propose de le faire)

**Localement, nettoyer :**

```bash
git checkout main
git pull origin main
git branch -d production/formulaire-spectacle
```

---

## Partie 6 : Les conflits

### Pourquoi ça arrive ?

Un conflit survient quand **deux personnes ont modifié la même partie du même fichier**.

```
Alice sur production/billetterie :     Modifie ligne 10 de fichier.tsx
Bob sur finance/tarifs :               Modifie aussi ligne 10 de fichier.tsx

Bob merge en premier → OK
Alice essaie de merger → CONFLIT (Git ne sait pas quelle version garder)
```

### Comment éviter les conflits

1. **Petites PR** : moins de fichiers touchés = moins de risque
2. **Se synchroniser souvent** : `git merge origin/main` régulièrement
3. **Communiquer** : prévenir si on travaille sur un fichier sensible
4. **Découper le travail** : éviter que deux personnes touchent aux mêmes fichiers

### Reconnaître un conflit

Quand on fait `git merge` ou `git pull` :

```
Auto-merging src/app/page.tsx
CONFLICT (content): Merge conflict in src/app/page.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

`git status` montre :

```
Unmerged paths:
  both modified:   src/app/page.tsx
```

### Résoudre un conflit pas à pas

**1. Ouvrir le fichier en conflit**

Des marqueurs apparaissent :

```tsx
function Page() {
  return (
    <div>
<<<<<<< HEAD
      <h1>Bienvenue sur Ma Petite Compagnie</h1>
      <p>Gestion de votre troupe de théâtre</p>
=======
      <h1>Ma Petite Compagnie</h1>
      <Spectacles />
>>>>>>> origin/main
    </div>
  );
}
```

**2. Comprendre les marqueurs**

```
<<<<<<< HEAD
(code de la branche courante)
=======
(code de l'autre branche, ici main)
>>>>>>> origin/main
```

**3. Choisir ce qu'on garde**

Trois options :

- Garder uniquement le code de la branche courante
- Garder uniquement le code de main
- Fusionner les deux intelligemment

Exemple de fusion :

```tsx
function Page() {
  return (
    <div>
      <h1>Bienvenue sur Ma Petite Compagnie</h1>
      <p>Gestion de votre troupe de théâtre</p>
      <Spectacles />
    </div>
  );
}
```

**4. Supprimer les marqueurs**

Enlever les lignes `<<<<<<<`, `=======`, `>>>>>>>`.

**5. Marquer comme résolu et commiter**

```bash
git add src/app/page.tsx
git commit -m "Résout le conflit sur page.tsx"
```

### En cas de panique

```bash
# Annuler le merge en cours et revenir à l'état d'avant
git merge --abort
```

Puis demander de l'aide.

---

## Partie 7 : Bonnes pratiques de travail en équipe

### Communiquer avant de coder

Plusieurs outils sont à disposition pour éviter que deux personnes travaillent sur la même chose en parallèle :

- **Les issues GitHub** : permettent de décrire ce qu'il y a à faire et de s'assigner dessus
- **Les commentaires sur les issues** : pour signaler qu'on commence à travailler sur un sujet
- **Discord** : pour prévenir l'équipe, surtout sur les sujets transverses ou importants

Plus la communication est claire en amont, moins il y aura de conflits et de travail en double.

### Une PR = une seule chose

**Pas deux, pas trois. Une.**

| Bonne PR                                        | Mauvaise PR                       |
| ----------------------------------------------- | --------------------------------- |
| "Ajoute le formulaire de création de spectacle" | "Ajoute plein de trucs"           |
| "Corrige l'affichage de la date sur mobile"     | "Formulaire + fix date + refacto" |
| "Renomme les routes `/shows` en `/spectacles`"  | "Diverses améliorations"          |

### Finaliser ses PR rapidement

**Objectif : une PR ne devrait pas rester ouverte plus d'une semaine.**

Une PR qui traîne = conflits + charge mentale + code qui diverge.

### Relire les PR des autres

C'est aussi important que de coder !

- **Être constructif** : expliquer le problème ET proposer une solution
- **Poser des questions** en cas d'incompréhension
- **Approuver** quand c'est bon, ne pas laisser traîner

**Dur avec le code, bienveillant avec les personnes.**

### Prendre en compte les retours

Quand des commentaires arrivent sur une PR :

1. **Les lire attentivement** (y compris ceux de l'IA)
2. **Répondre** à chaque commentaire (même juste "Corrigé !")
3. **Corriger** ce qui doit l'être
4. **Discuter** en cas de désaccord (c'est ok)

---

## Aide-mémoire

### Cheatsheet interactif

Pour visualiser comment les commandes Git déplacent les fichiers entre les différentes zones (stash, workspace, index, local, remote) :

**[Git Cheatsheet interactif](http://www.ndpsoftware.com/git-cheatsheet.html)**

### Commandes quotidiennes

```bash
# Voir où on en est
git status

# Voir l'historique
git log --oneline -10

# Créer une branche et basculer dessus
git checkout -b communication/newsletter

# Changer de branche
git checkout main

# Récupérer les nouveautés de GitHub
git pull origin main

# Envoyer les commits sur GitHub
git push
```

### Workflow type

```bash
# 1. Nouvelle feature
git checkout main
git pull origin main
git checkout -b communication/newsletter

# 2. Travailler
# ... modifier des fichiers ...
git add src/components/MonComposant.tsx
git commit -m "Ajoute MonComposant"

# 3. Se synchroniser avec main (à faire régulièrement)
git fetch origin main
git merge origin/main

# 4. Pousser et créer la PR
git push -u origin communication/newsletter
# → Aller sur GitHub créer la PR

# 5. Après le merge, nettoyer
git checkout main
git pull origin main
git branch -d communication/newsletter
```

### En cas de problème

| Situation                                              | Solution                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| "J'ai fait des modifs mais je veux changer de branche" | `git stash` puis `git stash pop` après                       |
| "J'ai commité sur la mauvaise branche"                 | `git reset HEAD~1` (garde les modifs)                        |
| "Je veux annuler mon dernier commit"                   | `git reset HEAD~1`                                           |
| "Je veux annuler un merge en cours"                    | `git merge --abort`                                          |
| "J'ai tout cassé"                                      | `git checkout -- .` (annule TOUTES les modifs non commitées) |
| "J'ai VRAIMENT tout cassé"                             | Demander de l'aide !                                         |

---

## En résumé

1. **Communiquer** avant de commencer à travailler
2. **Petites branches, petites PR** = moins de conflits, reviews plus rapides
3. **Se synchroniser** régulièrement avec `main`
4. **Finaliser** les PR en moins d'une semaine
5. **Relire** les PR des autres
6. **Demander de l'aide** en cas de blocage

**Ne jamais hésiter à poser des questions. Mieux vaut demander que de tout casser.**
