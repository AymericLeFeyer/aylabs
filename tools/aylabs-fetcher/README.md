# aylabs-fetcher

Petit service qui remplace le workflow n8n « YouTube Stats Fetcher » : toutes les
4 h (00, 04, 08, 12, 16 et 20 h UTC), il lit la chaîne et ses 50 dernières vidéos
sur l'API YouTube, commite `public/youtube-stats.json` sur `main`, puis notifie
Discord. Un commit sur ce fichier déclenche `deploy.yml`, donc une nouvelle image
du site.

## Configuration

Voir [.env.example](.env.example). `FETCHER_GITHUB_TOKEN` doit être un jeton
fine-grained limité au dépôt, avec **Contents : Read and write**.

## Utilisation

```bash
npm install
npm test
npm run typecheck
npm run dry-run   # affiche le JSON, sans commit ni Discord
npm run once      # un passage réel
npm start         # boucle sur le planning
```

Le conteneur attend le prochain créneau : pour forcer un passage,
`docker exec aylabs-fetcher node src/index.ts --once`.

Quota YouTube : 102 unités par passage (dont 100 pour `search`), soit 612 par jour
sur les 10 000 offerts.
