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


FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080 \
    GITHUB_REPO=AymericLeFeyer/aylabs \
    GITHUB_BRANCH=main

# Utilisateur non privilégié : rien dans cet outil n'a besoin de root.
RUN addgroup --system --gid 1001 studio \
  && adduser --system --uid 1001 studio

# Le serveur est bundlé par esbuild : pas de node_modules à embarquer.
COPY --from=build --chown=studio:studio /repo/tools/content-studio/dist-server ./dist-server
COPY --from=build --chown=studio:studio /repo/tools/content-studio/dist ./dist

USER studio
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist-server/server.mjs", "dist"]
