# AyLabs Website

Site web officiel d'AyLabs - Domotique, Homelab & Tech

## 🚀 Technologies utilisées

- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **React Router** (navigation)
- **Supabase** (base de données)

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/aylabs-website.git
cd aylabs-website

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase et YouTube

# Lancer en développement
npm run dev
```

## 🔧 Configuration

Créez un fichier `.env` avec :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_supabase
VITE_YOUTUBE_API_KEY=votre_cle_youtube_api
VITE_YOUTUBE_CHANNEL_ID=votre_id_chaine_youtube
```

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages de l'application
├── hooks/              # Hooks personnalisés
├── utils/              # Utilitaires
├── types/              # Types TypeScript
├── lib/                # Configuration (Supabase)
└── content/            # Contenu markdown
    ├── products/       # Produits testés
    ├── tutorials/      # Tutoriels
    └── videos/         # Vidéos
```

## 🎯 Fonctionnalités

- ✅ **Vidéos YouTube** : Intégration avec l'API YouTube
- ✅ **Produits testés** : Reviews détaillées avec filtres
- ✅ **Tutoriels** : Guides pratiques en markdown
- ✅ **Commentaires** : Système de commentaires avec Supabase
- ✅ **Media Kit** : Statistiques en temps réel
- ✅ **Recherche** : Recherche globale dans tout le contenu

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## 📝 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Contact

- **YouTube** : [@ay_labs](https://youtube.com/@ay_labs)
- **Discord** : [AyLabs Community](https://discord.gg/aylabs)
- **Email** : contact@aylabs.fr