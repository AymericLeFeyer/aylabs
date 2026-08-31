# Le contexte de build est la RACINE du dépôt, pas ce dossier :
# le catalogue initial est compilé depuis src/content/**/*.md (import.meta.glob).
#   docker build -f tools/content-studio/Dockerfile -t aylabs-content-studio .

FROM node:22-alpine AS build
WORKDIR /repo/tools/content-studio

COPY tools/content-studio/package.json tools/content-studio/package-lock.json ./
RUN npm ci

COPY tools/content-studio/tsconfig*.json tools/content-studio/vite.config.ts ./
COPY tools/content-studio/tailwind.config.js tools/content-studio/postcss.config.js ./
COPY tools/content-studio/index.html ./
COPY tools/content-studio/public ./public
COPY tools/content-studio/server ./server
COPY tools/content-studio/src ./src

# Instantané du contenu au moment du build : il donne un affichage immédiat,
# puis l'application se réaligne sur GitHub au chargement.
COPY src/content /repo/src/content

# Les secrets (OAuth, SESSION_SECRET) sont lus à l'exécution et non au build :
# aucun n'est nécessaire ici, aucun ne se retrouve dans l'image.
RUN npm run build


FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080 \
    GITHUB_REPO=AymericLeFeyer/aylabs \
    GITHUB_BRANCH=main

# Le serveur est bundlé par esbuild : pas de node_modules à embarquer.
COPY --from=build /repo/tools/content-studio/dist-server ./dist-server
COPY --from=build /repo/tools/content-studio/dist ./dist

# `node` (uid 1000) existe déjà dans l'image officielle : rien à créer.
# Un utilisateur non root ne peut pas écouter sous 1024, d'où le port 8080 —
# c'est le port du conteneur, le reverse proxy publie ce qu'il veut devant.
USER node
EXPOSE 8080

CMD ["node", "dist-server/server.mjs", "dist"]
