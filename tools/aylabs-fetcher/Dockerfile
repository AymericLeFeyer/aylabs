# Le contexte de build est ce dossier :
#   docker build -t aylabs-fetcher tools/aylabs-fetcher
#
# Aucune dépendance à l'exécution : Node exécute le TypeScript directement.
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
COPY src ./src

USER node

CMD ["node", "src/index.ts"]
