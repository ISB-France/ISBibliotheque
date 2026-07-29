# Exemples de fichiers CSV — import d'utilisateurs

Fichiers d'exemple pour l'import en masse d'utilisateurs, voir
[../../IMPORT_UTILISATEURS_CSV.md](../../IMPORT_UTILISATEURS_CSV.md) pour la
documentation complète.

| Fichier                                                                       | Contenu                                                                 | Résultat attendu                                                                 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [`exemple-valide.csv`](./exemple-valide.csv)                                   | 3 utilisateurs, colonnes `nom,prenom,email`                              | 3 utilisateurs créés                                                                |
| [`exemple-colonnes-inversees.csv`](./exemple-colonnes-inversees.csv)           | 2 utilisateurs, colonnes dans l'ordre `email,prenom,nom`                 | 2 utilisateurs créés (l'ordre des colonnes n'a pas d'importance)                    |
| [`exemple-avec-lignes-ignorees.csv`](./exemple-avec-lignes-ignorees.csv)       | 1 ligne valide, 1 prénom manquant, 1 email déjà existant (`admin@admin.fr`) | 1 utilisateur créé, 2 lignes ignorées (`Champs manquants`, `Email déjà utilisé`)     |
| [`exemple-en-tetes-invalides.csv`](./exemple-en-tetes-invalides.csv)           | En-têtes `first_name,last_name,email` (non reconnus)                     | Import refusé avant tout appel réseau : *« Colonnes attendues : nom, prenom, email »* |

## Utilisation rapide

1. Ouvrir **Administration → Utilisateurs → Importer un CSV**.
2. Sélectionner l'un de ces fichiers (ou un fichier `.csv` respectant le même format).
3. Observer le toast de résultat (créés / ignorés) et la liste des utilisateurs mise à jour.
