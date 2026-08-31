# Image du site AyLabs : build Vite puis service statique par nginx.
# Le contexte de build est la racine du dépôt :
#   docker build -t aylabs .
#
# Les variables VITE_* sont injectées AU BUILD (Vite les inline dans le bundle) :
# elles ne peuvent pas être changées au démarrage du conteneur. Elles sont déjà
# publiques côté navigateur — ne jamais y mettre autre chose qu'une clé publique.

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig*.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
COPY public ./public
COPY src ./src

ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ARG VITE_GA_ID=""
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_GA_ID=$VITE_GA_ID

RUN npm run build


# nginx-unprivileged : écoute sur 8080 en utilisateur non root, sans bricoler
# les droits sur /var/cache/nginx et /var/run.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
