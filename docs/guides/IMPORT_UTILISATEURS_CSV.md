# Import en masse d'utilisateurs (CSV)

Cette fonctionnalité permet à un administrateur de créer plusieurs comptes utilisateurs
en une seule opération, à partir d'un fichier CSV, plutôt que de les saisir un par un.

Accès : **Administration → onglet "Utilisateurs" → bouton "Importer un CSV"**
(`apps/frontend/src/pages/Admin.tsx`).

## Format du fichier CSV

- Séparateur : virgule (`,`)
- Encodage : UTF-8
- Première ligne = en-têtes de colonnes (obligatoire)
- Une ligne par utilisateur à créer

### Colonnes attendues

| Colonne  | Alias acceptés (insensible à la casse) | Obligatoire |
| -------- | --------------------------------------- | ----------- |
| Nom      | `nom`, `lastname`                       | Oui         |
| Prénom   | `prenom`, `prénom`, `firstname`         | Oui         |
| Email    | `email`                                 | Oui         |

L'ordre des colonnes n'a pas d'importance : elles sont retrouvées par leur en-tête,
pas par leur position. Si l'une des trois colonnes est absente, l'import est refusé
avec le message *« Colonnes attendues : nom, prenom, email »*.

### Exemple de fichier valide

```csv
nom,prenom,email
Dupont,Marie,marie.dupont@groupe-isb.fr
Martin,Julien,julien.martin@groupe-isb.fr
```

Ou avec les colonnes dans un ordre différent :

```csv
email,prenom,nom
marie.dupont@groupe-isb.fr,Marie,Dupont
```

## Déroulement de l'import

1. L'utilisateur sélectionne un fichier `.csv` via le bouton d'import.
2. Le frontend parse le fichier localement (`parseUsersCsv`, dans `Admin.tsx`) et
   envoie la liste des lignes au backend via `POST /admin/users/import`
   (voir `apps/backend/src/routes/admin.ts`).
3. Le backend traite chaque ligne indépendamment :
   - les champs sont nettoyés (`trim()`) et l'email est normalisé en minuscules ;
   - une ligne est **ignorée** (`skipped`) si :
     - un champ obligatoire est manquant → raison `Champs manquants` ;
     - un utilisateur avec cet email existe déjà en base → raison `Email déjà utilisé` ;
   - sinon l'utilisateur est **créé** (`created`), avec `name = "{prenom} {nom}"`.
4. La réponse contient deux tableaux :

   ```json
   {
     "created": [{ "email": "marie.dupont@groupe-isb.fr", "name": "Marie Dupont" }],
     "skipped": [{ "email": "julien.martin@groupe-isb.fr", "reason": "Email déjà utilisé" }]
   }
   ```

5. Le frontend affiche :
   - un toast de succès avec le nombre d'utilisateurs importés (`created.length`) ;
   - un toast d'erreur listant les lignes ignorées et leurs raisons, s'il y en a ;
   - puis rafraîchit automatiquement la liste des utilisateurs.

**Important** : l'import n'est jamais tout-ou-rien. Les lignes valides sont créées
même si d'autres lignes du même fichier sont invalides ou en doublon.

## Erreurs possibles

| Situation                                   | Comportement                                                        |
| -------------------------------------------- | -------------------------------------------------------------------- |
| Fichier vide ou sans ligne de données         | Toast d'erreur : *« Le fichier CSV ne contient aucune ligne »*        |
| En-têtes manquants ou mal nommés              | Exception levée avant l'envoi au serveur, aucun appel réseau         |
| Ligne avec un champ vide                      | Ligne ignorée, raison `Champs manquants`                              |
| Email déjà présent en base                    | Ligne ignorée, raison `Email déjà utilisé`                            |
| Corps de requête vide ou non-tableau (`users`) | Réponse `400` : *« Aucun utilisateur à importer »*                    |

## Prérequis d'accès

L'ensemble des routes `/admin/*`, y compris l'import, nécessite d'être authentifié
et de disposer du droit `admin_manage_groups` (voir `requireAction` dans
`apps/backend/src/middleware/authorize.js` et `router.use('/admin', requireAuth, requireAction('admin_manage_groups'))`
dans `apps/backend/src/routes/admin.ts`).

## Créer un utilisateur unique

Pour un seul utilisateur, préférer le bouton **"+ Ajouter un utilisateur"** du même
onglet, qui appelle `POST /admin/users` avec les mêmes règles de validation
(champs requis, email déjà utilisé → `409 Conflict`).

## Limites connues / pistes d'amélioration

- Le parsing CSV est simple (`split(',')`) : un champ contenant une virgule ou des
  guillemets n'est pas géré. À réserver à des exports CSV simples (nom, prénom, email).
- Aucune limite de taille de fichier n'est appliquée côté frontend ou backend.
- Aucun mot de passe n'est généré : la création de compte est découplée de
  l'authentification, qui repose sur Microsoft Entra ID (voir
  [`ENTRA_ID_SETUP.md`](./ENTRA_ID_SETUP.md)).
