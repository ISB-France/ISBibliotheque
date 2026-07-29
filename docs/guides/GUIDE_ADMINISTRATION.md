# Guide d'utilisation — Administration

Ce guide décrit l'utilisation de la page **Administration** (`/admin`,
`apps/frontend/src/pages/Admin.tsx`) du portail ISBibliotheque, réservée aux
comptes disposant du droit `admin_manage_groups`.

Un utilisateur non authentifié est redirigé vers `/login`. Un utilisateur
authentifié mais non-admin (`user.isAdmin === false`) voit un écran
"Non autorisé" (`NotAuthorizedScreen`).

La page est organisée en 4 onglets : **Applications**, **Groupes**,
**Découverte Docker**, **Utilisateurs**.

## 1. Onglet Applications

Liste les applications du portail (table avec nom, statut, actions).

- **Ajouter une application** (bouton "+") → ouvre `AddAppModal`, appelle
  `POST /admin/apps` via `api.admin.createApp`.
- **Modifier** (icône crayon) → édite une application existante,
  `PUT /admin/apps/:id` via `api.admin.updateApp`.
- **Supprimer** (icône corbeille) → demande confirmation (`ConfirmDialog`) puis
  `DELETE /admin/apps/:id` via `api.admin.deleteApp`.
- **Rafraîchir** (icône ↻) → recharge la liste (`fetchApps`).

## 2. Onglet Groupes

Géré par le composant `GroupManager` (`apps/frontend/src/components/GroupManager.tsx`).
Permet de créer/modifier/supprimer des groupes et d'y ajouter ou retirer des
membres. Repose sur les routes `/admin/groups` (voir
`apps/backend/src/routes/admin.ts`, lignes 23-105).

## 3. Onglet Découverte Docker

Géré par le composant `DockerDiscovery`. Permet de scanner un hôte Docker et
de proposer l'ajout automatique d'applications détectées (conteneurs en cours
d'exécution). Voir `api.discovery.scan`.

## 4. Onglet Utilisateurs

Table listant les comptes utilisateurs (nom, email, icône), avec en en-tête
les données chargées via `GET /admin/users` (`api.admin.listUsers`).

### Créer un utilisateur (formulaire unique)

1. Cliquer sur **"+ Ajouter un utilisateur"** (icône `UserPlus`).
2. Renseigner Prénom, Nom, Email dans la modale.
3. Validation : les 3 champs sont requis côté frontend et backend.
   - Si l'email existe déjà → erreur `409 Conflict` (*"Un utilisateur avec cet
     email existe déjà"*).
4. `POST /admin/users` via `api.admin.createUser`.

### Modifier un utilisateur

1. Cliquer sur l'icône crayon d'une ligne.
2. La modale se pré-remplit à partir de `user.name` (découpé en prénom / nom)
   et `user.email`.
3. `PUT /admin/users/:email` via `api.admin.updateUser`.

### Supprimer un utilisateur

1. Cliquer sur l'icône corbeille.
2. Confirmer dans la boîte de dialogue (`ConfirmDialog`).
3. `DELETE /admin/users/:email` via `api.admin.deleteUser`.

### Importer des utilisateurs en masse (CSV)

Voir le guide dédié : [IMPORT_UTILISATEURS_CSV.md](./IMPORT_UTILISATEURS_CSV.md).

Résumé rapide :

1. Cliquer sur **"Importer un CSV"** (icône `Upload`).
2. Sélectionner un fichier `.csv` avec les colonnes `nom`, `prenom`, `email`
   (alias acceptés : `nom`/`lastname`, `prenom`/`prénom`/`firstname`, `email`).
3. Les utilisateurs valides et non-existants sont créés ; les autres lignes
   sont ignorées avec une raison affichée à l'écran (`Champs manquants` ou
   `Email déjà utilisé`).
4. La liste des utilisateurs est rafraîchie automatiquement après import.

## Droits d'accès (backend)

Toutes les routes `/admin/*` sont protégées par le middleware :

```ts
router.use('/admin', requireAuth, requireAction('admin_manage_groups'))
```

(`apps/backend/src/routes/admin.ts`). Un utilisateur sans ce droit reçoit une
erreur d'autorisation sur n'importe quel appel `/admin/*`, y compris la
consultation simple (`GET /admin/users`, `GET /admin/groups`, etc.).

## Points d'API utilisés par cette page

| Action                          | Méthode & route                    |
| -------------------------------- | ----------------------------------- |
| Lister les applications           | `GET /admin/apps`                   |
| Créer une application             | `POST /admin/apps`                  |
| Modifier une application          | `PUT /admin/apps/:id`               |
| Supprimer une application          | `DELETE /admin/apps/:id`            |
| Lister les groupes                | `GET /admin/groups`                 |
| Détail d'un groupe                | `GET /admin/groups/:name`           |
| Créer un groupe                   | `POST /admin/groups`                |
| Modifier un groupe                 | `PUT /admin/groups/:name`           |
| Supprimer un groupe                | `DELETE /admin/groups/:name`        |
| Ajouter un membre à un groupe      | `POST /admin/groups/:name/members`  |
| Retirer un membre d'un groupe      | `DELETE /admin/groups/:name/members/:email` |
| Lister les profils                 | `GET /admin/profiles`               |
| Modifier un profil                 | `PUT /admin/profiles/:email`        |
| Lister les utilisateurs            | `GET /admin/users`                  |
| Créer un utilisateur               | `POST /admin/users`                 |
| Importer des utilisateurs (CSV)    | `POST /admin/users/import`          |
| Modifier un utilisateur            | `PUT /admin/users/:email`           |
| Supprimer un utilisateur           | `DELETE /admin/users/:email`        |
| Scanner un hôte Docker             | via `api.discovery.scan`            |

## Voir aussi

- [IMPORT_UTILISATEURS_CSV.md](./IMPORT_UTILISATEURS_CSV.md) — détail complet de l'import CSV
- [ENTRA_ID_SETUP.md](./ENTRA_ID_SETUP.md) — authentification Microsoft Entra ID
- [BRANCH_CONVENTIONS.md](./BRANCH_CONVENTIONS.md) — conventions de branches et commits
