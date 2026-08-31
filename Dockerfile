# Image du site AyLabs : build Vite puis service statique par nginx.
# Le contexte de build est la racine du dépôt :
#   docker build -t aylabs-site .
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


# nginx standard sur le port 80 : c'est ce qu'attend un reverse proxy (et toute
# la chaîne d'outils Docker) sans configuration particulière.
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist ./

EXPOSE 80

