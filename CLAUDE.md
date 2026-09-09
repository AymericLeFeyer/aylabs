# AyLabs — instructions projet

> Dernière mise à jour : 2026-09-09

Site vitrine de la chaîne AyLabs (domotique, homelab, impression 3D) : vidéos,
produits testés, tutoriels. **React 18 + Vite + TypeScript + Tailwind**, contenu en
fichiers Markdown versionnés. Déploiement par image Docker : `deploy.yml` publie
l'image sur GHCR à chaque push `main`, Portainer la tire. Le déploiement FTP
o2switch a été retiré du workflow le 2026-08-31.

## Workflows

| Workflow | Déclencheur | Effet |
|---|---|---|
| `deploy.yml` | push `main` sauf `tools/content-studio/**`, ou manuel | build Vite + image `ghcr.io/aymericlefeyer/aylabs-site` sur GHCR |
| `content-studio-image.yml` | push `main` sur `tools/content-studio/**` ou `src/content/**`, ou manuel | publie `ghcr.io/aymericlefeyer/aylabs-content-studio` |

Les secrets FTP (`FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_PATH`, `BASE_PATH`)
ne sont plus utilisés par aucun workflow ; ils restent définis dans le dépôt.
Les redirections `go.aylabs.fr` (fichier `redirections`) sont configurées dans le
cPanel o2switch, indépendamment du déploiement : elles survivent à ce changement.

### Image Docker du site

`Dockerfile` (racine) : build Vite puis `nginx:1.27-alpine` sur le port **80**,
config SPA dans `docker/nginx.conf` (fallback `index.html`, cache long sur
`/assets/`, `index.html` et `youtube-stats.json` en `expires -1`).

`docker/portainer-stack.yml` est la stack Portainer des **deux** services tirés de
GHCR : `site` sur `8080:80`, `content-studio` sur `8081:8080` (TLS et domaines
gérés par le reverse proxy). `tools/content-studio/docker-compose.yml` reste le
compose du Studio seul, avec son bloc `build:` pour reconstruire depuis les
sources.

- **Ne pas publier les ports sur `127.0.0.1`** : un reverse proxy conteneurisé
  (NPM, Traefik, Caddy) ne peut pas joindre la boucle locale de l'hôte — la
  connexion part dans son propre namespace réseau et n'arrive jamais. C'est ce
  qui cassait le déploiement avant le 2026-08-31. Le pare-feu du serveur ferme
  8080/8081 depuis l'extérieur.
- Dans `docker/nginx.conf`, ne jamais mettre d'`add_header` dans un `location` :
  cela annule les en-têtes de sécurité hérités du bloc `server`. Utiliser
  `expires` seul pour piloter le cache.
- Les `VITE_*` sont **inlinées au build** par Vite : elles passent en `build-args`
  du workflow, pas en variables d'environnement du conteneur. Changer une clé
  impose de reconstruire l'image.
- Le contenu (`src/content`, `public/youtube-stats.json`) est un **instantané** :
  chaque publication n8n ou fiche ajoutée demande une nouvelle image.
- Le contexte de build est la racine pour les deux images. Le Studio a son propre
  `tools/content-studio/Dockerfile.dockerignore` pour ne pas embarquer les 26 Mo de
  `public/videos-assets`.

## Structure

```
src/
├── components/        # cartes, sections, layout, navigation (navGroups)
├── pages/             # une page par route
├── hooks/             # useMarkdownContent, useYouTubeStats
├── utils/             # markdownLoader (parseur frontmatter), markdownRenderer,
│                      # youtubeStats (banlist + moyennes), analytics
├── types/index.ts     # Video, Product, Tutorial, Article
├── content/           # LE CONTENU — un .md par fiche
│   ├── videos/        # 91 fiches
│   ├── products/      # 48 fiches
│   └── tutorials/
tools/content-studio/  # outil de gestion du contenu — SPA + serveur Node (voir plus bas)
public/youtube-stats.json  # stats de chaîne, alimentées par n8n (15 vidéos récentes)
public/hidden-videos.json  # vidéos exclues des stats, pilotées par le Studio
```

## Contenu Markdown — le point le plus sensible

`src/utils/markdownLoader.ts` implémente **son propre parseur YAML**, volontairement
minimal. Toute fiche doit rester dans ce sous-ensemble :

- scalaires (`title: "…"`, `price: 119.99`, `expiresAt: null`) ;
- listes de scalaires, en bloc (`  - "Zigbee"`) ou inline (`["Zigbee"]`) ;
- **un seul niveau** d'objet imbriqué — utilisé uniquement par `promoCode`.

Interdits : blocs multilignes (`|`, `>`), listes d'objets, valeurs sur plusieurs
lignes. Le parseur découpe ligne par ligne et coupe au **premier** `:`.

### Frontmatter vidéo (`src/content/videos/<slug>.md`)

`title`, `description`, `pubDate` (`"Nov 29 2025"`), `pubTime` (`"18:00"`, facultatif),
`code` (id YouTube 11 car.), `duration` (`"10:18"`), `tags[]`. Corps markdown
optionnel, rendu sous la vidéo.

`pubTime` est l'**heure de mise en ligne** (heure locale du visiteur), au format
`HH:MM`. Absente, la fiche sort à minuit — le comportement d'avant son ajout.
Elle n'est **jamais affichée** : elle ne sert qu'à décider de la visibilité.

### Frontmatter produit (`src/content/products/<slug>.md`)

`title`, `image`, `description`, `tags[]`, `protocols[]`, `compatible[]`,
`videoCode`, `buyLinks[]`, `promoCode{code,percent,expiresAt,platform}`,
`promoPrice`, `pubDate`, `category`, `price`, `rating`, `pros[]`, `cons[]`,
`verdict`.

`loadProducts()` **route les `buyLinks` par nom de domaine** vers `amazonLink`,
`domadooLink`, `geekbuyingLink`, `minixLink`, `reolinkLink`, `bambuLink`,
`merossLink` ; tout le reste tombe dans `otherLinks`. Ajouter une plateforme
dédiée impose de modifier **trois** endroits : `markdownLoader.ts`,
`tools/content-studio/src/domain/content/services/buyLinks.ts`, et la table
`STORES` en tête de `src/pages/ProductDetail.tsx` (label + couleur du bouton).
Sans le troisième, le lien part quand même dans `otherLinks`, en bouton noir.

### Points d'attention

- **Mise en ligne différée** : `loadVideos()` (`src/utils/markdownLoader.ts`)
  écarte les fiches dont `pubDate` + `pubTime` ne sont pas passées, via
  `isPublished` de `src/utils/publishDate.ts`. Le filtre est **à la source** :
  listes, recherche, hero, blocs de rebond et accès direct à `/video/<slug>`
  répondent tous « vidéo introuvable ». Ne pas refiltrer dans les pages.
  - Une `pubDate` illisible vaut « non publiée » (fail-closed) : une faute de
    frappe fait disparaître la fiche du site plutôt que de la sortir en avance.
  - Le tri de `loadContentFromFiles` passe aussi par `publishTimestamp`, donc
    deux vidéos du même jour sont ordonnées par leur heure.
  - **Ce filtre est côté client** : le markdown de la fiche programmée est quand
    même dans le bundle JS (`import.meta.glob` eager). Il masque la fiche, il ne
    la protège pas — ne rien commiter qui doive rester secret.
  - Comme le filtre est évalué au chargement, un onglet resté ouvert ne voit
    apparaître la vidéo qu'après rechargement.

- Le **slug vient du nom de fichier**, pas du frontmatter. Une clé `slug` dans le
  frontmatter est ignorée (elle traîne encore dans `roller-shade-driver-e1.md`).
- `pubDate` n'est pas normalisé : quelques fiches utilisent d'autres formats
  (`"8 jun 2026"`). Toujours passer par `toIsoDate` / `toPubDate` du Studio.
- `core.autocrlf=true` sur Windows : le disque est en CRLF, le dépôt en LF (un
  seul blob est commité en CRLF). Comparer des contenus impose de normaliser.
- Certaines fiches ont des guillemets non fermés (`reolink-argus-magicam.md`) : le
  parseur ne s'en plaint pas, il rend une valeur tronquée.
- Les valeurs de tags ne sont pas normalisées : « Mini PC » et « Mini-PC »
  coexistent. Réutiliser l'existant plutôt que d'en créer.

## tools/content-studio — Content Studio

Outil pour créer, éditer et dupliquer vidéos et produits. SPA React + Vite en DDD,
servi par un petit serveur Node qui porte l'authentification (port `5180` en
développement, `8080` en conteneur).
Voir `tools/content-studio/README.md` pour l'usage et l'authentification.

```bash
cd tools/content-studio && npm install && npm run dev
```

- **Accès** : OAuth App GitHub (Web Application Flow) ; la session n'est accordée
  que si `permissions.push` est vrai sur le dépôt. Aucune liste d'utilisateurs.
- **Le jeton GitHub ne quitte jamais le serveur** : cookie `HttpOnly` chiffré en
  AES-256-GCM, et relais `/api/github/*` qui pose l'en-tête `Authorization` côté
  serveur. Le relais n'autorise que `GET`/`PUT` sous `/repos/<owner>/<name>/`.
  `state` aléatoire anti-CSRF, comparé en temps constant. Session de 8 h.
- **Lecture** : `import.meta.glob` sur `src/content/**/*.md` (affichage instantané),
  puis réconciliation avec l'arbre GitHub par comparaison de SHA de blob — seules
  les fiches divergentes sont téléchargées.
- **Écriture** : `PUT /repos/:owner/:repo/contents/:path`, SHA distant relu juste
  avant chaque commit. Messages : `content(video|product): add|update <slug>`.
- **Programmation d'une vidéo** : `VideoDraft.pubTime` (`HH:MM`, vide = minuit)
  est saisi dans l'éditeur vidéo à côté de la date et sérialisé en `pubTime`
  juste après `pubDate`. Le tableau de bord marque « Programmée » les fiches que
  le site ne sert pas encore (`isScheduled` dans `src/shared/date.ts`,
  **réimplémentation** de `src/utils/publishDate.ts` : corriger les deux
  ensemble). `normalizeTime` accepte `18:30`, `18h30`, `9:5` et rend une chaîne
  vide sur une saisie inexploitable.
- **Garde-fou obligatoire** : `npm run check` rejoue les 139 fiches existantes dans
  le sérialiseur et vérifie l'absence de perte. **À lancer après toute modification
  de `frontmatter.ts` ou `mappers.ts`.**

### Couche serveur (`server/`)

Le SPA est servi par un serveur Node maison, sans dépendance runtime (bundlé par
esbuild). **`server/handler.ts` est monté à la fois par le serveur de production
(`server/index.ts`) et par le serveur de développement Vite** (plugin dans
`vite.config.ts`) : il n'existe qu'une seule implémentation de l'authentification.

| Route | Rôle |
|---|---|
| `GET /config.js` | config publique injectée dans `window.__STUDIO_CONFIG__` (dépôt, branche) |
| `GET /api/auth/login` | pose le cookie `state` et redirige vers GitHub |
| `GET /api/auth/callback` | vérifie le `state`, échange le code, ouvre la session |
| `GET /api/auth/me` | session courante, **sans le jeton** |
| `POST /api/auth/logout` | efface la session (POST volontairement, pas GET) |
| `GET/PUT /api/github/*` | relais authentifié, restreint au dépôt configuré |

Variables d'environnement (lues à l'exécution, jamais au build) : `APP_URL`,
`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET` obligatoires ;
`GITHUB_REPO`, `GITHUB_BRANCH`, `PORT` facultatives. Sans les obligatoires, le
serveur refuse de démarrer. En développement, `vite.config.ts` recopie `.env.local`
dans `process.env` — le code serveur ne lit pas `import.meta.env`.

### Déploiement Docker

Image node:22-alpine, utilisateur `node` de l'image officielle (uid 1000), écoute
sur `8080` (un non-root ne peut pas se lier sous 1024), publiée sur GHCR. **Le contexte de build est la racine du dépôt** : le Dockerfile a
besoin de `src/content` pour compiler l'instantané servi par `import.meta.glob`.

```bash
docker build -f tools/content-studio/Dockerfile -t aylabs-content-studio .
```

- L'app dépend de `@types/node` en devDependency : sans elle, `tsc -b` échoue dans
  le conteneur (en local, les types venaient du `node_modules` du site).
- `server/github.ts` ne peut pas utiliser `cache: 'no-store'` dans `fetch` : cette
  option est une extension Next.js, absente des types Node. Le fetch de Node ne
  met de toute façon rien en cache.

### Domaine `content`

| Élément | Rôle |
|---|---|
| `entities/ContentItem.ts` | `ContentFile`, `VideoDraft`, `ProductDraft`, `PromoCode` |
| `services/frontmatter.ts` | `parseMarkdown` / `serializeFrontmatter` / `buildMarkdown` — miroir du parseur du site |
| `services/mappers.ts` | `ContentFile` ↔ draft, et ordre canonique des clés |
| `services/suggestions.ts` | valeurs existantes (tags, protocoles, compatibilités, catégories) triées par fréquence |
| `services/slug.ts` | `slugify`, `uniqueSlug` |
| `services/buyLinks.ts` | détection des plateformes routées par le site |
| `services/gitSha.ts` | SHA1 de blob git, pour comparer local et GitHub sans télécharger |

### Domaine `stats` (Studio)

Gère la banlist décrite plus haut. Ajouté le 2026-09-08.

| Élément | Rôle |
|---|---|
| `entities/ChannelVideo.ts` | `ChannelVideo`, `HiddenVideo`, `HiddenVideosFile` |
| `services/hiddenVideos.ts` | parse/sérialise les deux fichiers, applique la fenêtre de 10, calcule l'aperçu |
| `repositories/StatsRepository.ts` | interface de lecture/écriture |
| `infrastructure/stats/GitHubStatsRepository.ts` | lit `public/youtube-stats.json`, lit et commite `public/hidden-videos.json` |
| `application/stats/usecases/ManageHiddenVideos.ts` | `load()`, `save(entries)` — relit le SHA distant avant d'écrire |
| `presentation/hooks/useHiddenVideos.ts` | état local, bascule, aperçu des chiffres |
| `presentation/pages/HiddenVideosPage.tsx` | page « Vidéos masquées », accessible depuis la barre du Studio |

Le fichier de banlist n'existe pas forcément : `fetchHiddenVideos` renvoie alors
une liste vide sans `sha`, et le premier enregistrement crée le fichier. Message
de commit : `data(stats): hide N videos` (ou `clear hidden videos`).

### Use cases

| Use case | Signature |
|---|---|
| `SignIn` | `restore()`, `start()`, `signOut()` |
| `LoadCatalog` | `local()`, `synced(): Promise<Catalog>` |
| `SaveDraft` | `execute({kind, draft, isNew, originalSlug})`, `isSlugFree(kind, slug)` |
| `ManageHiddenVideos` | `load()`, `save(entries)` — banlist des statistiques |

### Hooks

| Hook | Rôle |
|---|---|
| `useSession` | phases `restoring / anonymous / authenticated / denied` |
| `useCatalog()` | catalogue, suggestions, slugs pris, synchronisation GitHub |
| `useDraftEditor` | état du brouillon, slug auto depuis le titre, validation, commit |
| `useHiddenVideos` | vidéos de la chaîne, banlist, aperçu des chiffres, commit |

### Endpoints GitHub utilisés

| Méthode | Endpoint | Usage |
|---|---|---|
| GET | `/user` | identité du compte connecté (**serveur seulement**) |
| GET | `/repos/:o/:r` | vérification de `permissions.push` (**serveur seulement**) |
| GET | `/repos/:o/:r/git/trees/:branch?recursive=1` | liste des fiches + SHA, en un appel |
| GET | `/repos/:o/:r/git/blobs/:sha` | contenu d'une fiche divergente |
| GET | `/repos/:o/:r/contents/:path?ref=:branch` | SHA courant avant écriture |
| PUT | `/repos/:o/:r/contents/:path` | commit de la fiche |
| POST | `github.com/login/oauth/access_token` | échange du code OAuth (**serveur seulement**) |

Les quatre appels non marqués passent par le relais `/api/github/*`.

Les tutoriels ne sont pas gérés par le Studio.

## Design du site

Refonte du 2026-09-08 : navbar en volets, hero « pile de vidéos », et reprise des
sections de la page d'accueil.

### Jetons Tailwind (`tailwind.config.js`)

| Jeton | Valeur | Usage |
|---|---|---|
| `brand` | `#398FBA` | couleur de marque, boutons, états actifs |
| `brand-bright` | `#5FB6DE` | accents sur fond sombre, halo, survols |
| `brand-deep` | `#2a6d94` | survol des boutons pleins |
| `ink` | `#0C1319` | fond du header, du hero et du footer |
| `ink-soft` | `#141F27` | panneaux déroulants, cartes sur fond sombre |
| `ink-line` | `#22323D` | toutes les bordures sur fond sombre |
| `font-display` | Bricolage Grotesque | titres (`h1..h3` par défaut via `index.css`) |
| `font-sans` | Figtree | corps de texte |

**Les couches décoratives (`bg-grid`, halos floutés) doivent toutes porter
`pointer-events-none`** : posées en `absolute inset-0`, elles recouvrent tout leur
bloc et interceptent les clics. C'est ce qui a rendu le bouton d'adhésion de la
page Soutien inopérant le 2026-09-08.

Les deux polices viennent de Google Fonts, chargées dans `index.html` (avec
`preconnect`). L'utilitaire `.bg-grid` (`src/index.css`) dessine la trame du hero.
`prefers-reduced-motion` est respecté globalement depuis `src/index.css`.

### En-tête de page — `src/components/PageHeader.tsx`

Toutes les pages ouvrent sur ce composant (titre, description, `eyebrow` au-dessus
du titre, contenu optionnel en dessous) sur le même fond `ink` que la barre de
navigation. Les fiches produit s'en servent aussi : le nom du produit y tient lieu
de titre, avec le lien de retour en `eyebrow` et les badges en enfants. **Ne pas réintroduire les
en-têtes bleus** (`bg-[#398FBA]` ou `bg-gradient-to-br from-[#398FBA]`) : ils ont
tous été convertis le 2026-09-08.

### Navigation — `src/components/navigation.ts`

**Source unique** des entrées de menu : la navbar desktop, le menu mobile et le
footer se construisent tous depuis `navGroups` et `standaloneItems`. Trois volets :
**Contenu** (Vidéos, Tutoriels), **Produits** (Produits testés, Bonnes affaires),
**Plus** (Docs, Setup). `standaloneItems` (**Réseaux**, **Me soutenir**) reste hors
des volets, visible en permanence — c'est voulu, ne pas les replier dans un menu.

Ordre voulu dans la barre : `Contenu ▾  Produits ▾  Réseaux  Me soutenir  Plus ▾
[recherche]`. Il vient du drapeau `trailing: true` sur le groupe **Plus**, qui le
rend après les entrées directes (desktop comme mobile). Ajouter une entrée = un objet `NavItem`,
rien d'autre à toucher.

- `match` liste les préfixes de route qui rendent l'entrée active (`/video` couvre
  `/videos` **et** `/video/:id`).
- `hardNav: true` force un `<a href>` au lieu d'un `<Link>` — c'est le cas de
  `/videos`, qui était déjà en navigation dure avant la refonte : **ne pas le
  passer en `Link`** sans vérifier pourquoi.
- `external: true` ouvre dans un nouvel onglet (`docs.aylabs.fr`, `setup.aylabs.fr`).
- **Les URL sont figées** : `/videos`, `/tutoriels`, `/produits-testes`, `/deals`,
  `/reseaux`, `/support`. Elles sont référencées par le contenu et l'extérieur.

`src/components/NavDropdown.tsx` est le volet desktop : ouverture au survol comme
au clic, fermeture sur Échap / clic extérieur / changement de route, `aria-expanded`
et `aria-controls` posés. Un seul volet ouvert à la fois (état `openGroup` dans
`Layout`).

### Hero — `src/components/Hero.tsx` + `VideoStack.tsx`

Deux colonnes (5/7) sur fond `ink` : identité et CTA à gauche, **pile des 5
dernières vidéos** à droite (`VideoStack`). Les vidéos viennent de `useVideos()`
(déjà trié du plus récent au plus ancien et débarrassé des fiches programmées
par `loadVideos`). Les stats (abonnés / vues / vidéos) viennent de
`useYouTubeStats`.

La zone titre sous la pile réserve la hauteur de deux lignes (`min-h` + 
`line-clamp-2`) pour que rien ne saute quand on change de vidéo.

`VideoStack` monte **toutes** les cartes et les positionne par leur distance à la
carte du dessus (`cardStyle`) : décalage, échelle, flou et opacité croissants vers
le fond, et la carte qui vient de passer repart vers la gauche en tournant. Elles
restent montées d'un cran à l'autre — c'est ce qui donne le glissement plutôt
qu'un remplacement d'image ; **ne pas remettre l'index dans la `key`**. Le bloc
titre/date rejoue `animate-swap` (`src/index.css`) à chaque changement grâce à sa
`key`. **Défilement manuel uniquement** — flèches, points et compteur ; jamais
d'autoplay. Seule la carte du dessus est cliquable et focusable
(`pointer-events-none` + `tabIndex={-1}` sur les autres). La miniature tente
`maxresdefault.jpg` et retombe sur `hqdefault.jpg` via `onError` — les vieilles
vidéos n'ont pas de maxres.

Le `useEffect` de défilement vers l'ancre (`/#media-kit` depuis le footer) vit
**dans le Hero** : le déplacer casse les liens d'ancre de la page d'accueil.

### Sections de la page d'accueil

`Home.tsx` enchaîne `Hero`, `ProductSections`, `PartnersSection`, `MediaKitSection`.
L'ancienne `VideoSection` (« Mes dernières vidéos ») a été **supprimée** le
2026-09-08 : la pile du hero fait le travail. L'ancre `#videos` n'existe donc plus
sur la page d'accueil.

- **`ProductsSection`** : un produit en vedette (2/3 de largeur) et, à droite,
  une grille de **6 vignettes purement visuelles** (pas de texte, le nom vit dans
  `aria-label` et `title`). **Un clic sur une vignette envoie ce produit au
  centre** et le sortant reprend sa place dans la grille (`featuredSlug`, `null` =
  le plus récent). 7 produits chargés au total ; la section tient en une seule
  bande, sans rangée de cartes en dessous. Elle lit `verdict` et retombe sur
  `description` si le champ est vide.
- **`PartnersSection`** : bande sombre (`ink`), une carte par partenaire avec sa
  couleur portée par la variable CSS `--partner` posée en style inline. Chaque
  partenaire accepte un champ optionnel `logo` (URL distante ou fichier de
  `public/`, par exemple `/partners/domadoo.png`) affiché à la place du
  monogramme ; l'image est contenue dans un carré de 32 px. **Tailwind ne sait pas appliquer d'opacité à une couleur en variable
  CSS** (`bg-[var(--x)]/15` ne produit rien) : utiliser la variable en couleur
  pleine, et un calque séparé pour les teintes.
- **`MediaKitSection`** : trois chiffres clés, `ViewsChart`, trois indicateurs
  secondaires, puis le bloc collaboration sombre.

### Commentaires — supprimés

La fonctionnalité de commentaires a été **entièrement retirée** le 2026-09-08 :
`Comments.tsx`, `AvatarImage.tsx`, `ArticleCard.tsx`, `hooks/useComments.ts`,
`lib/supabase.ts`, le type `Comment`, les compteurs sur les cartes, le bandeau de
consentement aux cookies (il ne servait qu'à mémoriser le nom du commentateur) et
les dépendances `@supabase/supabase-js`, `js-cookie`, `@types/js-cookie`.
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` ont disparu du `Dockerfile`, de
`deploy.yml`, du `README` et de `.env.example` — **les deux secrets restent
définis dans le dépôt GitHub**, ils ne sont simplement plus lus. Les commentaires
déjà écrits sont toujours dans Supabase, mais plus rien ne les affiche.

Le mot « commentaires » qui reste dans le Media Kit désigne ceux de **YouTube**
(taux d'engagement), pas ceux du site.

### Statistiques de chaîne et banlist

`public/youtube-stats.json` (écrit par n8n) contient **15 vidéos** depuis le
2026-09-08. `public/hidden-videos.json` liste les vidéos à exclure des calculs :

```json
{ "hidden": [{ "code": "9B4vS9Gbx60", "title": "Unboxing…", "hiddenAt": "2026-09-08" }] }
```

La règle, dans `src/utils/youtubeStats.ts` : **on retire les vidéos de la banlist,
puis on garde les 10 plus récentes de ce qui reste** (`STATS_WINDOW`). Sans vidéo
masquée, cela revient exactement aux 10 dernières publications.

- Les valeurs `averageViews`, `engagementRate` et `recentVideosCount` du JSON sont
  calculées par n8n **sur toutes les vidéos** : le site les **recalcule** sur les
  vidéos retenues. Elles ne servent plus que de repli si aucune vidéo n'est
  exploitable. Vérifié le 2026-09-08 : à banlist vide, le recalcul redonne
  exactement les chiffres de n8n (6005 vues de moyenne, 3,6 % d'engagement, 4).
- `recentVideosCount` compte les publications des **30 derniers jours glissants**
  (`RECENT_WINDOW_DAYS`), pas le mois calendaire — c'est ce que faisait déjà n8n,
  malgré l'ancien libellé « ce mois », corrigé en « ces 30 jours ».
- `stats.videoCount` (total de la chaîne, affiché en gros) vient de l'API YouTube
  et **n'est pas affecté** par la banlist : on ne connaît que les 15 dernières
  vidéos, en déduire les masquées donnerait un total faux.
- La banlist est un fichier du `public/` : comme `youtube-stats.json`, elle n'est
  prise en compte **qu'après reconstruction de l'image**.
- **La même règle est réimplémentée dans le Studio**
  (`domain/stats/services/hiddenVideos.ts`) pour l'aperçu avant commit : toute
  correction ici doit y être reportée, et inversement.

### Pages liste et détail

- **`FilterSection`** (Vidéos et Produits testés) : barre collante sous la
  navigation, recherche, volets à cases à cocher, compteur de résultats, et une
  ligne de **filtres actifs retirables un par un**. Fermeture au clic extérieur et
  à Échap, comme `NavDropdown`.
- **`VideoDetail`** : lecteur en haut sur fond `ink`, puis l'article sur blanc.
  Deux blocs de rebond en bas — **les produits testés dans cette vidéo**
  (`product.videoCode === code de la vidéo`, 50 fiches sont reliées ainsi) et
  « À voir ensuite » (vidéos partageant un tag, sinon les plus récentes).
- **`ProductDetail`** : `PageHeader` sombre (retour, nom, accroche, catégorie et
  date), puis visuel et **fiche technique** à gauche, **carte d'achat collante**
  (`lg:sticky`) à droite, puis le bilan, le verdict, la vidéo de test et les
  produits de la même catégorie. Les huit blocs de boutons boutique dupliqués ont
  été remplacés par la table `STORES`.
  - La fiche technique est un `dl` en **colonnes** (`specs`, une par famille :
    Type, Protocoles, Compatible avec), séparées par des filets verticaux et
    empilées sous `sm`. Les étiquettes sont **toutes de la même couleur** — les
    trois teintes précédentes (bleu / vert / indigo) donnaient un arc-en-ciel.
    Le nombre de colonnes passe par la table `SPEC_COLUMNS` : Tailwind ne génère
    pas une classe `grid-cols-${n}` interpolée.
  - Le bilan tient dans **une seule carte** coupée par un filet vertical, items
    sur fond teinté clair.
  - Le **verdict** est traité comme le mot de la fin : bloc sombre pleine largeur,
    photo (`public/aylabs.jpg`), citation en grand corps. Les 52 verdicts existants
    sont des phrases simples sans markdown, d'où le gros corps de texte ; les
    variants `[&_a]` et `[&_p:last-child]` rattrapent un éventuel lien.
- Le champ `rating` du frontmatter n'est **pas affiché** : seules 3 fiches sur 48
  le renseignent, et il est absent du type `Product`.

### `ViewsChart` — vues des dernières vidéos

Une seule série, donc pas de légende : des colonnes en `brand`, un repère de
moyenne en pointillés, une infobulle au survol (miniature, titre, vues, date), et
un `<table class="sr-only">` qui répète les données pour les lecteurs d'écran.
**La dernière vidéo publiée** (la colonne la plus à droite, le tri étant
chronologique) est mise en avant en permanence : couleur pleine et vues affichées
au-dessus de sa barre. Le graphique ne signale pas les vidéos masquées par la
banlist — c'est le rôle du Studio.

Sous les barres, une rangée de **miniatures** tient lieu d'étiquettes d'axe : même
`flex-1` et même `gap-2` que les colonnes, sinon l'alignement casse. Le survol est
piloté par un état React (`active`) partagé entre la barre et sa miniature. Ces
miniatures pointent vers **YouTube** (`youtu.be/<code>`) : le champ `id` du fichier
de stats est le code YouTube, **pas** le slug d'une fiche du site — un lien
`/video/<id>` serait mort.

La carte s'étire sur la hauteur de la colonne voisine (`flex h-full flex-col` +
`flex-1` sur la seule zone des barres), pour finir à la même hauteur que la pile
des trois indicateurs.

**Piège n8n** : dans `public/youtube-stats.json`, chaque entrée de `videos` est
enveloppée dans `{ json: …, pairedItem: … }`. `useYouTubeStats` la déballe via
`normalizeVideos` (qui accepte aussi la forme plate). Le type `YouTubeVideo`
mentait sur ce champ avant le 2026-09-08 — personne ne l'utilisait.

## Conventions

- TypeScript strict, DDD dans `tools/`, composants React fonctionnels.
- Design system : Tailwind + `lucide-react`, couleur de marque `#398FBA`
  (voir la section Design du site pour les jetons).
- Cartes de contenu (`ProductCard`, `VideoCard`) : bordure fine, coins `rounded-xl`,
  élévation au survol, **toute la carte est le lien** — pas de bouton d'action
  redondant à l'intérieur. `TutorialCard` n'a pas encore été reprise.
- Variables d'environnement via `import.meta.env` (`VITE_*`), secrets en GitHub
  Actions.
