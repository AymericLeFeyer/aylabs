# AyLabs — instructions projet

> Dernière mise à jour : 2026-08-31

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

`Dockerfile` (racine) : build Vite puis `nginxinc/nginx-unprivileged` sur le port
`8080`, config SPA dans `docker/nginx.conf` (fallback `index.html`, assets `/assets/`
immuables, `youtube-stats.json` en `no-store`). Exemple de stack Portainer dans
`docker/portainer-stack.yml`.

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
├── components/        # cartes, sections, layout
├── pages/             # une page par route
├── hooks/             # useComments, useMarkdownContent, useYouTubeStats
├── utils/             # markdownLoader (parseur frontmatter), markdownRenderer, analytics
├── types/index.ts     # Video, Product, Tutorial, Article, Comment
├── content/           # LE CONTENU — un .md par fiche
│   ├── videos/        # 91 fiches
│   ├── products/      # 48 fiches
│   └── tutorials/
└── lib/supabase.ts    # commentaires
tools/content-studio/  # outil de gestion du contenu — SPA + serveur Node (voir plus bas)
public/youtube-stats.json  # stats de chaîne, alimentées par n8n (10 vidéos récentes)
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

`title`, `description`, `pubDate` (`"Nov 29 2025"`), `code` (id YouTube 11 car.),
`duration` (`"10:18"`), `tags[]`. Corps markdown optionnel, rendu sous la vidéo.

### Frontmatter produit (`src/content/products/<slug>.md`)

`title`, `image`, `description`, `tags[]`, `protocols[]`, `compatible[]`,
`videoCode`, `buyLinks[]`, `promoCode{code,percent,expiresAt,platform}`,
`promoPrice`, `pubDate`, `category`, `price`, `rating`, `pros[]`, `cons[]`,
`verdict`.

`loadProducts()` **route les `buyLinks` par nom de domaine** vers `amazonLink`,
`domadooLink`, `geekbuyingLink`, `minixLink`, `reolinkLink`, `bambuLink`,
`merossLink` ; tout le reste tombe dans `otherLinks`. Ajouter une plateforme
dédiée impose de modifier `markdownLoader.ts` **et**
`tools/content-studio/src/domain/content/services/buyLinks.ts`.

### Points d'attention

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

Image node:22-alpine (~233 Mo), utilisateur non privilégié, écoute sur `8080`,
publiée sur GHCR. **Le contexte de build est la racine du dépôt** : le Dockerfile a
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

### Use cases

| Use case | Signature |
|---|---|
| `SignIn` | `restore()`, `start()`, `signOut()` |
| `LoadCatalog` | `local()`, `synced(): Promise<Catalog>` |
| `SaveDraft` | `execute({kind, draft, isNew, originalSlug})`, `isSlugFree(kind, slug)` |

### Hooks

| Hook | Rôle |
|---|---|
| `useSession` | phases `restoring / anonymous / authenticated / denied` |
| `useCatalog()` | catalogue, suggestions, slugs pris, synchronisation GitHub |
| `useDraftEditor` | état du brouillon, slug auto depuis le titre, validation, commit |

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

## Conventions

- TypeScript strict, DDD dans `tools/`, composants React fonctionnels.
- Design system : Tailwind + `lucide-react`, couleur de marque `#398FBA`.
- Variables d'environnement via `import.meta.env` (`VITE_*`), secrets en GitHub
  Actions.
