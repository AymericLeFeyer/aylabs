# AyLabs Content Studio

Outil de gestion du contenu du site : création, édition et duplication des fiches
**vidéos** et **produits**. Chaque enregistrement crée un commit sur `main` via
l'API GitHub, ce qui déclenche le workflow de déploiement.

> Les tutoriels ne sont pas gérés par cet outil.

## Démarrer en local

```bash
cd tools/content-studio
npm install
cp .env.example .env.local     # compléter les 3 secrets, voir ci-dessous
npm run dev                    # http://127.0.0.1:5180
```

Le serveur de développement Vite monte le **même code serveur** que la production
(`server/handler.ts`, branché dans `vite.config.ts`) : l'authentification et le
relais GitHub sont donc exercés à l'identique en local.

## Authentification

OAuth App GitHub, *Web Application Flow*. L'accès est réservé aux comptes
disposant du **droit d'écriture** sur `AymericLeFeyer/aylabs` — un compte sans ce
droit peut se connecter, mais l'outil affiche un refus explicite et ne relaie
aucune requête.

Le contrôle d'accès n'est pas une liste d'utilisateurs à maintenir : on demande à
GitHub si le compte connecté a la permission `push` sur le dépôt.

### Créer l'OAuth App

Sur <https://github.com/settings/developers> → **New OAuth App** :

- **Homepage URL** : la valeur d'`APP_URL`
- **Authorization callback URL** : `<APP_URL>/api/auth/callback`

En local : `http://127.0.0.1:5180` et `http://127.0.0.1:5180/api/auth/callback`.
Une OAuth App n'accepte qu'un seul callback : prévois-en une pour le
développement et une pour l'instance déployée.

### Où vit le jeton

Le jeton GitHub **ne quitte jamais le serveur**. Il est stocké dans un cookie de
session `HttpOnly` **chiffré en AES-256-GCM** (pas seulement signé : un cookie
signé resterait lisible côté navigateur, exposant un jeton capable d'écrire sur le
dépôt). Le navigateur n'appelle jamais `api.github.com` directement — tout passe
par le relais `/api/github/*`, qui ajoute l'en-tête `Authorization` côté serveur.

Le relais n'accepte que ce dont l'interface a besoin : `GET` et `PUT` sous
`/repos/<owner>/<name>/`. Tout autre chemin ou méthode est refusé en 403, même
avec une session valide.

Le flux OAuth est protégé contre le CSRF par un `state` aléatoire mémorisé dans un
cookie éphémère et vérifié en temps constant. Session valable 8 h.

## Variables d'environnement

Toutes sont lues **à l'exécution**, jamais au build : la même image sert partout,
et aucun secret n'y est embarqué.

| Variable | Obligatoire | Défaut | Rôle |
|---|---|---|---|
| `APP_URL` | oui | — | URL publique, sans slash final. Doit correspondre au callback déclaré sur GitHub |
| `GITHUB_CLIENT_ID` | oui | — | OAuth App GitHub |
| `GITHUB_CLIENT_SECRET` | oui | — | OAuth App GitHub |
| `SESSION_SECRET` | oui | — | Clé de chiffrement du cookie (`openssl rand -base64 48`) |
| `GITHUB_REPO` | non | `AymericLeFeyer/aylabs` | Dépôt cible, format `owner/nom` |
| `GITHUB_BRANCH` | non | `main` | Branche sur laquelle commiter |
| `PORT` | non | `8080` | Port d'écoute |

Sans une variable obligatoire, le conteneur **refuse de démarrer** avec un message
explicite plutôt que de tomber en marche dégradée.

Changer `SESSION_SECRET` déconnecte tout le monde — c'est le geste à faire en cas
de doute.

## Comment les données circulent

| Étape | Source |
|---|---|
| Affichage immédiat de la liste | fichiers `src/content/**/*.md` compilés dans le bundle (`import.meta.glob`) |
| Réconciliation au chargement | arbre GitHub de la branche : seules les fiches dont le SHA diffère sont téléchargées |
| Enregistrement | `PUT /repos/:owner/:repo/contents/:path` avec le SHA relu juste avant le commit |

Le SHA distant est toujours relu avant d'écrire : l'outil ne pousse jamais
par-dessus une version de `main` qu'il n'a pas vue. Si des fiches diffèrent de
l'instantané, un bandeau le signale sur le tableau de bord.

Messages de commit générés : `content(video): add <slug>`, `content(product): update <slug>`.

## Confort de saisie

- **Duplication** — l'icône *Dupliquer* d'une fiche pré-remplit un nouveau
  formulaire en conservant la structure (tags, protocoles, catégorie) et en
  repartant à neuf sur l'identité (slug, image, vidéo, liens, date).
- **Tags, protocoles, compatibilités** — les listes proposées sont extraites du
  contenu réel, les valeurs les plus utilisées en tête, pour éviter les doublons
  du type « Mini PC » / « Mini-PC ». Création libre possible.
- **Image produit** — aperçu dès la saisie de l'URL, avec dimensions réelles et
  détection des liens morts.
- **Code vidéo** — bouton *Parcourir* pour choisir parmi les vidéos déjà publiées
  sur le site, miniature YouTube en aperçu, et extraction automatique de
  l'identifiant si une URL complète est collée.
- **Liens d'achat** — la plateforme est détectée et signalée quand le site ne sait
  pas la router vers un bouton dédié.
- **Slug** — dérivé du titre, vérifié contre les fiches existantes.
- **Aperçu du fichier** — le `.md` exact qui sera commité est consultable avant
  d'enregistrer.

## Image Docker

Node 22 Alpine, ~233 Mo, utilisateur non privilégié, écoute sur `8080`. Le serveur
est bundlé par esbuild : aucun `node_modules` dans l'image finale.

Le workflow `.github/workflows/content-studio-image.yml` publie sur GHCR à chaque
push `main` touchant `tools/content-studio/**` ou `src/content/**`, ainsi qu'à la
demande (`workflow_dispatch`).

```bash
docker run -d -p 8081:8080 \
  -e APP_URL=https://studio.exemple.fr \
  -e GITHUB_CLIENT_ID=... \
  -e GITHUB_CLIENT_SECRET=... \
  -e SESSION_SECRET="$(openssl rand -base64 48)" \
  ghcr.io/aymericlefeyer/aylabs-content-studio:latest
```

Ou via la stack `docker-compose.yml` fournie, prévue pour Portainer : les valeurs
sont saisies dans l'onglet « Environment variables », rien à éditer en SSH.

Build local — **le contexte est la racine du dépôt**, car l'image embarque un
instantané de `src/content` :

```bash
docker build -f tools/content-studio/Dockerfile -t aylabs-content-studio .
```

Le conteneur est sans état : aucun volume, tout vit dans le dépôt Git et dans le
cookie de session. Il s'expose derrière un reverse proxy qui assure le TLS —
`APP_URL` en `https://` suffit à passer les cookies en `Secure`.

> L'image contient un instantané du contenu figé au build. Ce n'est qu'un cache
> d'affichage : la réconciliation GitHub au chargement corrige tout écart. Une
> image ancienne se traduit seulement par plus de fiches à retélécharger.

## Garde-fou

```bash
npm run check
```

Rejoue les 139 fiches existantes dans le sérialiseur du Studio et vérifie qu'aucune
donnée n'est perdue au passage. À exécuter après toute modification de
`domain/content/services/frontmatter.ts` ou `mappers.ts`.

Normalisations assumées par l'outil : `pubDate` reformaté en `Nov 29 2025`, espaces
de fin de valeur supprimés, clé `slug` redondante en frontmatter abandonnée (le site
dérive le slug du nom de fichier).

## Contraintes de format

Le frontmatter doit rester lisible par `src/utils/markdownLoader.ts`, qui
implémente un sous-ensemble de YAML : scalaires, listes de scalaires, et **un seul
niveau** d'objet imbriqué (`promoCode`). Pas de bloc multiligne, pas de liste
d'objets. Le sérialiseur écrit en LF, comme le dépôt.
