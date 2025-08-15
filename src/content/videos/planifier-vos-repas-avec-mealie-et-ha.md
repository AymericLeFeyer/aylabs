---
title: "Planifiez vos REPAS avec MEALIE et HOME ASSISTANT"
description: "Sortez vos meilleurs ustensiles : aujourd'hui, on cuisine ! Je vous ai concocté un petit tuto d'installation et d'utilisation de Mealie. Régalez-vous ;) "
pubDate: "Nov 20 2024"
code: "flyDAlxhBSk"
duration: "15:42"
tags: ["Homelab", "Domotique"]
---

# 🧑‍🍳 Planifiez vos REPAS avec MEALIE et HOME ASSISTANT

> _Qu’est-ce qu’on mange ce soir ?_
>
> _J’ai la dalle !_

Vous vous posez souvent cette question ? Peut-être que vous ne planifiez pas vos repas à l’avance, via un système de planning de menus à la semaine, par exemple.

Depuis 3 mois, avec ma conjointe nous passons environ 30 minutes chaque dimanche afin de réaliser cette tâche, et cela nous permet

- d’être plus **efficace** aux courses
- d’être plus **détendu** la semaine, pas de galère pour savoir quoi manger
- de faire des **économies**, car on privilégie les restes pour le lendemain au travail (chose très compliquée si on mange des choses à l’arrache chaque soir)

## 🔍 Trouver l’outil parfait

Si vous me connaissez, vous savez que j’ai un homelab et que j’aime bien tester des services pour répondre à mes besoins. Voici quelques critères importants dans ma recherche de l’outil parfait :

1. Interface soit un minimum acceptable
2. Gratuit, `open-source` et `self-hosted` (désolé, si vous cherchiez un outil clé en main en SaaS, ce ne sera pas aujourd’hui)
3. Accessible depuis `Home Assistant`

Si on fait une soupe avec tous ces critères … on obtient [Mealie](https://mealie.io) !

![Interface d’un menu sur Mealie](/videos-assets/mealie-1.png)

Mealie est assez complet, et est mis à jour [plusieurs fois par an](https://github.com/mealie-recipes/mealie/tags)

## 🤔 Que permet de faire Mealie ?

Voici quelques unes des fonctionnalités de Mealie :

- Ajouter des recettes
  - Spécifier des ingrédients
  - Illustrer avec une image
- Préparer des menus
  - À la semaine par défaut, mais possible d’étendre
- Préparation de la liste de course
  - En fonction des ingrédients spécifiés sur les recettes
- Ajouter des utilisateurs
  - Associer des recettes préférées
  - Mettre des commentaires sur les recettes
- Trouver une recette aléatoire
- Filtrer et trier les recettes
  - Par exemple, pour afficher les recettes les moins cuisinées

## 🧑‍💻 Comment ça s’installe ?

Le seul pré-requis pour installer Mealie, est de savoir comment démarrer une image `docker` (ou un `docker-compose`)

Dans mon cas, j’utilise Portainer, l’installation se fait .. **très simplement**

Voici le docker-compose que j’ai utilisé pour installer mealie. Pensez à **mettre à jour l’image** de votre côté de temps en temps

```yaml
version: "3"

services:
  app:
    container_name: mealie
    image: hkotel/mealie:v2.2.0
    restart: unless-stopped
    volumes:
      - mealie_data:/app/data
    ports:
      - "9925:9000"

volumes:
  mealie_data:
```

Une fois lancé, Mealie sera donc accessible sur

```
<ip de votre portainer>:9925
```

## 🫶 Conseils d’utilisation

Si vous êtes arrivés jusque là, félicitations. Vous avez maintenant une instance de Mealie toute fraîche !

Il n’y a plus qu’à .. **ajouter toutes vos recettes** !

C’est clairement le plus long et le plus **fastidieux**. Je vous conseille de le faire un peu chaque semaine. Vous profiterez donc pleinement de Mealie d’ici quelques semaines/mois

Selon moi, le plus important est de **mettre des photos sur les plats** (soit depuis Internet, soit par vous une fois le plat préparé). Cela permettra d’avoir un **meilleur rendu** sur Mealie et sur Home Assistant.

Si vous souhaitez utiliser la fonctionnalité de **liste de course**, il sera alors impératif d’activer les quantité sur les ingrédients. Par défaut c’est désactivé

![Activer les quantités](/videos-assets/mealie-2.png)

## 💾 Une petite back-up ?

Petit bonus par rapport à la vidéo : les back-ups.

Pensez à en faire une de temps en temps, et sauvegarder l’extract dans un endroit sûr.

![Faire une backup](/videos-assets/mealie-3.png)

## 🏠 Intégration à Home Assistant

La première chose à faire, est de récupérer votre **jeton d’accès API**

![Jeton API](/videos-assets/mealie-4.png)

Une fois cela fait, direction Home Assistant et **ajoutez l’intégration Mealie** (native dans Home Assistant)

```yaml
URL: <ip de votre mealie>
Jeton d'API: <ce qu'on vient de récupérer>
```

Si tout se passe bien, vous devriez avoir **un tas d’informations**

![Entités Home Assistant](/videos-assets/mealie-5.png)

Les plus importantes sont les **calendriers** :

- `calendar.mealie_petit_dejeuner`
- `calendar.mealie_dejeuner`
- `calendar.mealie_diner`
- `calendar.mealie_accompagnement`

Ces calendriers peuvent être mis dans une carte Calendrier pour avoir un rendu de ce type :

![Carte Calendrier](/videos-assets/mealie-6.png)

```yaml
type: calendar
initial_view: listWeek
title: Menus de la semaine
entities:
  - calendar.mealie_accompagnement
  - calendar.mealie_petit_dejeuner
  - calendar.mealie_dejeuner
  - calendar.mealie_diner
```

## 🍕 Ajouter les images des plats du jour

Pour avoir un rendu de ce type :

![Carte des repas](/videos-assets/mealie-7.png)

Il faut :

- Faire une requête HTTP à votre mealie pour récupérer l’ID des repas du jour
- Créer une caméra générique pour afficher l’image en temps réel
- Les afficher dans une belle carte caméra

### Requête HTTP

⚠️ Depuis Mealie v2, l’endpoint a changé !

```
.../groups/mealplans/today -> .../households/mealplans/today
```

Ajoutez ces capteurs :

```yaml
- platform: rest
  name: Mealie today lunch meal id
  ...
- platform: rest
  name: Mealie today dinner meal id
  ...
```

![Redémarrage config](/videos-assets/mealie-8.png)

Vous pouvez ensuite **redémarrer** la configuration de manière **sécurisée**

Nouvelles entités :

- `sensor.mealie_today_lunch_meal_id`
- `sensor.mealie_today_dinner_meal_id`
- `sensor.mealie_today_lunch_meal_name`
- `sensor.mealie_today_dinner_meal_name`

### Création des caméras génériques

L’URL ressemble à ça :

```
http://<ip>:9925/api/media/recipes/{{states('sensor.mealie_today_lunch_meal_id')}}/images/min-original.webp
```

![Caméra générique](/videos-assets/mealie-9.png)

> **URL d’image fixe** : on met l’url ci-dessus en adaptant le sensor_id

### Affichage des caméras et création de la page Repas

Direction votre dashboard, et créez une **pile horizontale** pour afficher vos deux caméras

![Pile horizontale](/videos-assets/mealie-10.png)
![Carte caméra](/videos-assets/mealie-11.png)

```yaml
type: horizontal-stack
cards:
  - show_state: true
    show_name: true
    camera_view: auto
    type: picture-entity
    entity: sensor.mealie_today_lunch_meal_name
    name: Ce midi
    camera_image: camera.mealie_today_lunch
  - show_state: true
    show_name: true
    camera_view: auto
    type: picture-entity
    entity: sensor.mealie_today_dinner_meal_name
    name: Ce soir
    camera_image: camera.mealie_today_dinner
```

> Plus qu’à faire la même chose pour le soir, et c’est bon !

## 👋 Conclusion

Vous avez toutes les cartes en main, il ne vous reste plus qu’à ajouter toutes vos recettes, y associer les images et les ingrédients. Le plus dur reste à faire.
