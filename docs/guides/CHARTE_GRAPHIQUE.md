# Charte graphique — ISBibliotheque

Ce document decrit le systeme visuel du portail applicatif ISBibliotheque, tel qu'implemente
dans `apps/frontend`. Il sert de reference pour garder une coherence visuelle entre les pages
et les composants.

## Logo

- Fichiers : `apps/frontend/src/assets/Logo_isb_whitemode.png` (mode sombre) et
  `Logo_isb_darkmode.png` (mode clair), affiches via le composant `ISBLogo`.
- Le logo bascule automatiquement selon le theme actif (clair/sombre).
- Taille par defaut dans le header : 36px.

## Typographie

Deux familles de police, chargees depuis Google Fonts (`index.css`) :

| Usage | Police | Poids disponibles |
|---|---|---|
| Titres (`font-heading`) | Plus Jakarta Sans | 400, 500, 600, 700, 800 |
| Texte courant (`font-sans`, par defaut) | DM Sans | 300, 400, 500, 600 |

Echelle de tailles observee dans l'UI :

| Usage | Taille | Poids |
|---|---|---|
| Titre de page (H1) | 28px | extrabold (800), `font-heading` |
| Titre de section / modal | 20px | bold, `font-heading` |
| Titre de carte | 15px | semibold |
| Corps de texte | 14px | normal |
| Texte secondaire / labels | 13px | medium/semibold |
| Texte tertiaire (metadonnees) | 11-12px | normal |

## Couleurs

Le systeme de couleurs repose sur des variables CSS HSL (`--background`, `--foreground`,
`--primary`, etc.), definies dans `apps/frontend/src/styles/index.css` et reprises dans
`tailwind.config.ts`. Cela permet un theming dynamique complet (voir plus bas).

### Palette semantique (valeurs par defaut, theme "ISB")

| Token | Valeur HSL | Usage |
|---|---|---|
| `--background` | `36 100% 97%` | Fond de page |
| `--foreground` | `36 100% 12%` | Texte principal, marron ISB |
| `--primary` | `36 100% 12%` | Boutons/actions principales |
| `--primary-foreground` | `46 100% 50%` | Jaune ISB, texte sur fond primary |
| `--secondary` | `36 100% 93%` | Fonds secondaires, badges |
| `--muted` | `36 16% 88%` | Fonds discrets, icones de cartes |
| `--muted-foreground` | `36 18% 48%` | Texte discret |
| `--accent` | `36 16% 88%` | Survols, fonds actifs |
| `--destructive` | `0 84% 60%` | Erreurs, suppression |
| `--border` | `36 100% 88%` | Bordures |
| `--radius` | `0.75rem` | Rayon de bordure de base |

### Alias historiques (Tailwind)

Ces classes `isb-*` restent disponibles pour compatibilite mais pointent vers les memes
variables que ci-dessus :

`isb-brown` (= foreground), `isb-yellow` (= primary-foreground), `isb-sand-light` (= secondary),
`isb-sand-mid` (= muted), `isb-terracotta` (= muted-foreground), `isb-coral` (= destructive),
`isb-blush` (= accent), `isb-muted` (= muted-foreground).

### Themes de couleur

L'utilisateur peut choisir une teinte differente dans ses preferences
(`ColorThemeContext.tsx`). Chaque theme ne change que la teinte (hue) de base et si le mode est
sombre ou clair ; la saturation/luminosite de chaque token est recalculee automatiquement.

**Themes clairs** : ISB (36°, marron/jaune), Bleu (220°), Vert (142°), Violet (270°), Rouge (0°),
Teal (180°), Rose (330°).

**Themes sombres** : Ardoise (220°), Minuit (240°), Charbon (30°), Foret (140°), Prune (280°),
Marine (220°), Vin (350°).

Le theme choisi est persiste dans `localStorage` (`isb-color-theme`) et applique en modifiant les
variables CSS sur `document.documentElement`.

## Rayon de bordure

- Base : `--radius: 0.75rem` (12px)
- Cartes / modals : `rounded-2xl` (16px)
- Boutons / champs / badges : `rounded-xl` (12px)
- Petits elements (icones, puces) : `rounded-lg` / `rounded-md`

## Composants UI

Bibliotheque de composants dans `apps/frontend/src/components/ui/` (style shadcn/ui) :
`avatar`, `badge`, `button`, `card`, `dialog`, `input`, `select`, `separator`, `table`.

### Carte d'application (`AppCard`)

- Fond blanc, bordure tres discrete (`rgba(59,40,0,0.08)`), ombre douce.
- Au survol : leger soulevement (`-translate-y-0.5`) + illumination (glow) autour de la carte.
- Au clic : leger enfoncement (`active:scale-[0.97]`).
- Icone dans un badge carre arrondi (`w-14 h-14`, fond `muted`, icone `foreground`).

### Boutons

- `default` : fond `primary`, texte `primary-foreground`.
- `outline` : bordure visible, fond transparent.
- `ghost` : pas de fond, hover discret.
- Variante destructive pour les actions de suppression (fond `destructive`).

## Effets d'interaction

- Transitions systematiques a 200ms (`transition-all duration-200` / `transition-colors`).
- Etats de chargement : squelettes animes (`animate-pulse`) pour les listes, spinners
  (`animate-spin`) pour les actions en cours.
- Feedback utilisateur via toasts (librairie `sonner`).

## Iconographie

- Bibliotheque : [Lucide](https://lucide.dev) (`lucide-react`).
- Taille standard : 14-18px dans l'UI courante, 22-26px pour les icones d'application.
- Trait (`strokeWidth`) : 1.5 a 1.8 selon le contexte.
- Le nom d'icone Lucide (ex. `Globe`, `Server`) est stocke tel quel dans le manifest d'app
  (`icon` field) et resolu via `getLucideIcon()` (`apps/frontend/src/lib/utils.ts`).

## Avatars utilisateur

- Peut etre une image uploadee (`/uploads/...` ou URL http), ou un emoji choisi dans le profil.
- Fallback : initiales du nom (2 lettres majuscules) sur fond `primary`.

## Favicon

- `apps/frontend/public/favicon.ico`, reference avec un parametre de version
  (`?v=2`) dans `index.html` pour forcer le rechargement cote navigateur (le favicon
  est mis en cache tres agressivement par les navigateurs).

---

*Document genere a partir de l'etat du code au 2026-07-23. A mettre a jour si le systeme de
theming ou les tokens de couleur evoluent.*
