---
title: "DISCORD au cœur de mes NOTIFICATIONS !"
description: "La dernière fois je me faisais la réflexion que Home Assistant commençait de plus en plus à me bombarer de notifications. Notifications que j’ai bien sur, décidé d’envoyer, mais quand même."
pubDate: "Feb 5 2025"
code: "FnmQDWFpkY4"
duration: "15:42"
tags: ["Homelab"]
---

La dernière fois je me faisais la réflexion que Home Assistant commençait de plus en plus à me **bombarer** de notifications. Notifications que j’ai bien sur, décidé d’envoyer, mais quand même.

Des notifications sur mon téléphone, j’en ai pas mal. Et je n’ai pas envie de limiter les notifications Home Assistant dans mes paramètres, car il peut m’envoyer des informations importantes, comme une alerte liée à ma sécurité par exemple.

J’avais donc besoin d’un autre système pour gérer mes notifications, et pourquoi pas même pour ajouter les notifications liées à mes autres applications sur mon homelab.

Pour cela, il existe plusieurs solutions, moi j’ai décidé d’explorer la solution Discord, car c’est une app que j’utilise au quotidien et que j’apprécie.

# Discord

Discord c’est un outil de messagerie instantannée, dédié surtout au gaming, mais c’est tellement facile à prendre en main que n’importe qui peut l’utiliser. D’ailleurs bon, mon serveur AyLabs sur discord, ça parle pas de gaming, mais bien de domotique, homelab, et même la dernière fois ça parlait cuisine…, ils se reconnaitrons

Sur Discord, on peut donc créer des serveurs. J’ai donc personnellement créé le mien « *Behind the AyLabs*« , un p’tit serveur privé, privé dans le sens où je suis le seul humain dedans

Oui oui.. le seul « humain » 😉

Bon allez je vous laisse 2 minutes, créez votre serveur discord, ajoutez quelques salons textuels, histoire de découper les notifications, personnellement j’ai mis « home » pour la domotique « media servers » pour les trucs liés à mon serveur multimédia et « homelab reports » pour toutes les alertes diverses et variées autour du homelab. Vous inquiètez pas, je détaillerais tout ensuite

![](/videos-assets/discord-1.png)

Je sais que la plupart d’entre vous attendent les notifications home assistant, donc c’est parti !

Pour Home Assistant, on va utiliser l’intégration officielle, et on va devoir créer un Bot Discord !

Un bot discord, c’est comme une personne qui va rejoindre votre serveur, et qui aura le droit d’effectuer certaines actions. Dans notre cas, le Bot va juste envoyer des messages.

# Création du Bot Discord

L’intégration Discord pour Home Assistant : [https://www.home-assistant.io/integrations/discord/](https://www.home-assistant.io/integrations/discord/)

Le lien pour créer une application Discord : [https://discord.com/developers/applications](https://discord.com/developers/applications)

- Commencez par créer une application
- Mettez de côté l’**application_id** et la **public key**
- Dans l’onglet BOT, créez un bot
- Récupérez le **token**
- En bas de la page, vous avez un outil vous permettant de connaître la valeur de la permission pour votre bot. Si vous souhaitez juste envoyer un message, c’est **2048**
- Ouvrez ce lien en ayant au préalable injecté l’**application_id** et la **valeur de la permission**

  https://discordapp.com/api/oauth2/authorize?client_id=[APPLICATION_ID]&scope=bot&permissions=[PERMISSIONS_INTEGER]

- Cela va ouvrir Discord, ajoutez le Bot à votre serveur
- Il devrait apparaître dans les membres

![](/videos-assets/discord-2.png)

- Sur Home Assistant, ajoutez l’intégration **Discord**
- Le jeton à entrer dans le champ, c’est le **token** récupéré plus haut
- Désormais, vous avez accès à une nouvelle action **notify** avec le nom de votre Bot. Dans mon cas, c’est `notify.homeassistant`

# Message test

Créez un nouveau script, et cherchez « notify with <le nom de votre bot> »

- content : votre message
- target : la liste des salons sous la forme

```yaml
- "<id>"
```

Pour récupérer l’id du salon, activez le mode développeur sur discord, puis cliquez droit sur un salon > Copier l’identifiant du salon

![](/videos-assets/discord-3.png)

# Personnalisation du message

Vous pouvez utilisez les **embeds**, cette documentation explique plutôt bien [https://www.home-assistant.io/integrations/discord/#discord-action-data](https://www.home-assistant.io/integrations/discord/#discord-action-data)

# Envoyer une image des caméras

Script super pratique pour prendre une photo de vos caméras et les envoyer sur Discord

- Automatisations et scripts
- Créer un nouveau script
- Modifier en YAML

```yaml
  sequence:

  - action: camera.snapshot
    metadata: {}
    data:
    filename: /media/cams/living.jpg
    target:
    entity_id: camera.192_168_1_89

  - action: notify.homeassistant
    metadata: {}
    data:
    message: 📸 Salon
    target: - "1325448727309320256"
    data:
    images: - /media/cams/living.jpg

  alias: Take snapshot and send them in Discord
  description: ""
```

# Daily reports

Vous pouvez créer une automatisation qui se lancera tous les jours à une certaine heure, afin d’envoyer des rapports quotidiens.

Voici les bouts de codes associés

### Average entities

Vous aurez besoin de créer de nouveaux sensors si vous souhaitez avoir des valeurs moyennes comme sur les daily reports (par exemple pour le CPU moyen sur une journée).

- Pour cela allez dans les fichiers de HA (sur VS Code par exemple)
- Si vous avez **sensors.yaml**, ajoutez cette ligne à la fin

```yaml
- platform: average
  name: "Average RAM OptiPlex"
  duration:
  days: 1
  entities:
    - sensor.node_optiplex_memory_used_percentage
```

- Si vous n’avez pas ce fichier, je vous invite à le créer, et à ajouter dans **configurations.yaml** cette ligne

```yaml
sensor: !include sensors.yaml
```

### Home Assistant

![](/videos-assets/discord-4.png)

[https://github.com/AyLabsCode/home-assistant-automations/blob/main/daily-reports/home-assistant.yaml](https://github.com/AyLabsCode/home-assistant-automations/blob/main/daily-reports/home-assistant.yaml)

### Proxmox

![](/videos-assets/discord-5.png)

[https://github.com/AyLabsCode/home-assistant-automations/blob/main/daily-reports/proxmox.yaml](https://github.com/AyLabsCode/home-assistant-automations/blob/main/daily-reports/proxmox.yaml)

### Synology

![](/videos-assets/discord-6.png)

[https://github.com/AyLabsCode/home-assistant-automations/blob/main/daily-reports/synology.yaml](https://github.com/AyLabsCode/home-assistant-automations/blob/main/daily-reports/synology.yaml)

# Webhooks

Chez moi, Home Assistant c’était le plus compliqué à configurer, car tous les autres services utilisent le système de webhook pour fonctionner, et c’est très simple à faire sur Discord.

Un webhook, c’est litérallement un croché de l’internet. J’adore cette traduction

Imaginez une lettre que vous envoyez par voie postale. Vous devez renseigner une adresse, mettre un timbre et à l’intérieur de l’enveloppe, y glisser votre message. Si tout est bien respecté, le facteur comprendra où livrer votre lettre, et le destinataire sera ravi de recevoir votre message.

C’est exactement pareil avec le webhook. Notre serveur discord possède une adresse, concrètement les salons textuels possèdent eux aussi une adresse. Il suffit donc de récupérer cette adresse pour pouvoir envoyer un message dans le salon. Cette adresse est construire dans le webhook, en gros votre adresse ce sera `discord.com/api/webhooks/un truc super long qui correspond à l'adresse de votre salon>`

Bon déjà parenthèse, ne laissez pas traîner vos webhooks, sinon n’importe qui pourra vous envoyer des lettres.

On a l’adresse c’est super, maintenant le timbre ! Bon sur Discord y’a pas besoin d’aposer de timbre sur vos lettres. Mais sachez que le principe de webhook, c’est utilisé par de nombreuses applications, j’en utilise régulièrement dans mon métier de développeur et sur certains webhooks, on doit s’autentifier dans un header. Mais bref on s’écarte, retenez juste que sur Discord, pas besoin de timbre !

Bon et le message maintenant, on met ce qu’on veux dans l’enveloppe ? Nan !

Il faut respecter un certain format, il y a plein d’options possible mais en gros vous devez au moins

- content
- embeds
- attachments

Voir ceci pour plus d’informations : [https://www.home-assistant.io/integrations/discord/#discord-action-data](https://www.home-assistant.io/integrations/discord/#discord-action-data)

# Créer un webhook

Pour créer un webhook discord, il suffit d’aller les paramètres du serveur, intégrations et là vous verrez l’option pour ajouter un webhook, vous pouvez mettre une image et bien sur choisir le salon sur lequel le webhook aura le droit d’envoyer les messages. Il faut donc faire un webhook pour chaque service qui doit communiquer avec votre discord.

![](/videos-assets/discord-7.png)

Dans mon cas, j’ai Proxmox, Overseerr, qBittorrent, UptimeKuma, Tautulli et DSM

J’vais donc vous faire un mini tuto pour ces 5 là.

La documentation est souvent bien expliquée

### Proxmox

- Sur votre centre de données, allez dans Notifications

![](/videos-assets/discord-8.png)

- Désactivez le **mail-to-root** si ce n’est pas configuré

![](/videos-assets/discord-9.png)

- Créez un nouveau webhook, nommez le **Discord**
- Méthode et URL : POST + votre webhook
- En-têtes

```yaml
  - `Content-Type` : `application/json`
  - `Accept` : `application/json`
```

- Corps

````json
{
  "content": null,
  "embeds": [
    {
      "title": "```{{ escape title }}```",
      "description": "```{{ escape message }}```",
      "color": null,
      "footer": { "text": "Proxmox" }
    }
  ],
  "attachments": []
}
````

- Vous pouvez faire un **Test** pour être sûr
- C’est tout !

### Synology DSM

- Dans **Panneau de configuration**
- Cliquez sur **Notification**
- Onglet **Webhooks**

![](/videos-assets/discord-10.png)

- Ajouter
  - Fournisseur : Personnalisé
  - Règle : All
- Configuration
  - Nom du fournisseur : Discord
  - Object : comme vous voulez
  - URL : votre URL
- Suivant

### Uptime Kuma

Dans les paramètres de n’importe quelle sonde, vous pouvez personnaliser les notifications

- Ajoutez Discord
- Collez l’URL du webhook
- Voilà 🙂

### Overseerr

Dans les paramètres d’Overseerr

- Paramètres
- Notifications
- Discord
- Activer l’agent
- Colles l’URL du webhook
- Voilà 🙂

### Tautulli

- Paramètres
- Notification Agents
- Add a new notification Agent

# Conclusion

Vous savez maintenant tout sur mon système de notifications via Discord, c’est très pratique, je pourrais même imaginer ajouter d’autres personnes dans ce salon, mais je doute que ma conjointe en ait quelque chose à faire

Si vous avez des questions n’hésitez pas à les poser en commentaire ou sur .. Discord et ouais on parle beaucoup de Discord aujourd’hui.

[https://go.aylabs.fr/discord](https://go.aylabs.fr/discord)

Allez je m’arrête là pour aujourd’hui, Portez-vous bien, et à la prochaine, c’était Aymeric. Salut !
