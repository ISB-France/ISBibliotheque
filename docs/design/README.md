# Design — ISBibliotheque

## Lien Figma

[Ouvrir dans Figma &rarr;](https://www.figma.com/make/bzkq5nIFc8uMZU5GWfe2U3/ISBibliotheque)

---

## Design System

### Palette

| Token              | Valeur    | Usage                         |
| ------------------ | --------- | ----------------------------- |
| `--isb-yellow`     | `#FFDD00` | Accent principal, CTA         |
| `--isb-brown`      | `#3B2800` | Texte, structures, fondations |
| `--isb-sand-light` | `#FEEAD3` | Fonds secondaires, filtres    |
| `--isb-sand-mid`   | `#FDD5A5` | Squelettes, hover states      |
| `--isb-terracotta` | `#D19571` | Accents chauds, catégories    |
| `--isb-coral`      | `#F08159` | Erreurs, alertes, catégories  |
| `--isb-blush`      | `#F8BBAB` | Accents doux                  |
| Page background    | `#FDFAF5` | Fond général (creamy)         |

### Typographie

- **Display / Titres** : Plus Jakarta Sans (400, 500, 600, 700, 800)
- **Corps de texte** : DM Sans (300, 400, 500, 600)
- Taille de base : 16px

### Composants

- **shadcn/ui** (Radix UI primitives) — 40+ composants dans `src/app/components/ui/`
- **AppCard** — Carte d'application avec icône, catégorie, hover animation
- **ISBLogo** — Logo ISB en SVG inline
- **AddAppModal** — Modal d'ajout d'application (admin)
- **LoadingScreen** — Squelette de chargement (grille animée)
- **ErrorScreen** — Écran d'erreur avec bouton réessayer
- **NotAuthorizedScreen** — Écran accès refusé (403)

### Breakpoints

Baseline responsive : grille `auto-fill, minmax(260px, 1fr)`.

---

## Assets

Les icônes applicatives proviennent de **Lucide Icons** (librarie SVG React).
Les assets exportés (SVG/PNG) sont dans `src/assets/`.
Le logo ISB est un SVG inline dans `ISBLogo.tsx`.

---

## Règles de contribution design

1. Toute modification de couleur doit être faite dans `theme.css` et `Guidelines.md`.
2. Les nouveaux composants doivent respecter les tokens existants.
3. Les écrans d'état (loading, error, 403) sont dans `src/app/components/`.
