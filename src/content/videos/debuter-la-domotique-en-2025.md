---
title: "Débuter la DOMOTIQUE en 2025 (Home Assistant GREEN)"
description: "Vous souhaitez débuter la domotique en 2025 ? Cette vidéo est sûrement faîte pour vous ! Je vous présente la box Home Assistant Green de chez Nabu Casa, une box domotique clé en main avec Home Assistant pré-installé dessus. Parfait pour débuter sans trop de prendre la tête."
pubDate: "Nov 27 2024"
code: "mU639-2jr98"
duration: "15:42"
tags: ["Domotique"]
---

Vous avez toujours rêvés d’avoir des lumières qui s’allument toutes seules quand du mouvement est détecté, des chauffages régulés selon la température de la pièce ou encore des volets qui se ferment en même temps que le soleil se couche ? Tout ça c’est possible avec la domotique, et c’est assez simple à faire.

Aujourd’hui je vous présente une box domotique clé en main qui vous permettra de commencer à connecter votre logement, simplement.

## 🏠 Home Assistant

Laissez-moi vous présenter **Home Assistant**. C’est un logiciel créé en 2013 afin de répondre aux besoins domotique des particuliers. Ce logiciel est open-source, cela veux dire que tout le monde peux voir le code et contribuer à son développement (bien sur il faut que les responsables du logiciel accepte vos contributions ..)

En 2018, **Nabu Casa** voit le jour, c’est une société créée par les fondateurs historiques de Home Assistant avec pour objectif de le rentabiliser, et de pouvoir générer des fonds pour assurer le bon développement du logiciel

![Logo de Nabu Casa](/videos-assets/hagreen-2.png)

Comment font-ils ça ?

- Ils proposent un **service cloud**, permettant aux utilisateurs de payer un abonnement pour accéder à Home Assistant de manière simple, et d’activer les assistant vocaux sans grande configuration
- Ils **vendent des box domotiques** clés en main

Pour résumer, si Home Assistant peux vivre et être le leader des logiciels domotiques aujourd’hui, c’est en partie grâce aux utilisateurs qui ne veulent pas bidouiller les machines, ou qui n’aimes pas titiller les octets

## 💚 Home Assistant Green

La Home Assistant Green est en fait la dernière box de chez Nabu Casa, puisqu’ils ont déjà sorti la Blue en 2020 et la Yellow en 2021. La green est sortie en 2023. Oui, elle date un peu, mais je n’avais pas de chaîne YouTube à l’époque. Je ne vais pas traiter des différences entre les autres box, parce que je les ai pas testés

![En partant de la gauche, Yellow, Green et Blue](/videos-assets/hagreen-3.png)

**Home Assistant Green**

🛒 [https://www.domadoo.fr/fr/produits-compatibles-home-assistant/7046-nabu-casa-box-domotique-home-assistant-green-0860011789703.html?domid=79](https://www.domadoo.fr/fr/produits-compatibles-home-assistant/7046-nabu-casa-box-domotique-home-assistant-green-0860011789703.html?domid=79)

Dans la boîte, on retrouve:

- La box
- Un cable ethernet
- Un cable HDMI
- Un super sticker Home Assistant

![Boîte Home Assistant Green](/videos-assets/hagreen-4.png)

### Premier démarrage

Lorsqu’on branche la box à internet et au courant, elle s’allume automatiquement et … ça y est, home assistant tourne.

Essayez de taper `homeassistant.local:8123`, et voilà !

![Démarrage Home Assistant](/videos-assets/hagreen-5.png)

C’est désormais le moment de créer sa maison connectée

- Nom d’utilisateur
- Mot de passe
- Localisation
- Données partagées à Nabu Casa

On remarque déjà que Home Assistant remonte des choses, chez moi il détecte la freebox, les chromecasts et le dongle sky connect

![Home Assistant détecte déjà des appareils](/videos-assets/hagreen-6.png)

Home Assistant est déjà à jour, c’est parfait

### Spécifications techniques

Si on regarde de plus près la box, ce qu’on voit en premier c’est son énorme **dissipateur de chaleur**. C’est plutôt moche mais je pense que ça fait le taf’. La box utilise donc un système de dissipation de chaleur **passive**, pas de ventilateurs ici, donc pas de bruit !

On remarque d’ailleurs un détail de conception étonnant, la box n’est pas surélevée donc l’air aura un peu de mal a passé.

![Dissipateur de chaleur](/videos-assets/hagreen-7.png)

C’est un détail, puisque le processeur utilisé est un **Cortex A55**, un micro-processeur qui n’est pas ultra puissant, bien que suffisant pour Home Assistant, de part sa petite puissance, il ne chauffe pas beaucoup

![Circuit imprimé arrière](/videos-assets/hagreen-8.png)

Le tout est alimenté via un cable 12v sur un **port DC Jack**, pas d’USB C ici. Le transfo est en **12W**, on peut s’attendre à ce que la box ne consomme pas beaucoup d’énergie, c’est un très bon point !

Ici vous voyez un emplacement pour une pile **CR2032**, c’est pour garder en mémoire l’heure de la machine. Elle n’est pas inclue, mais ce n’est pas grave parce qu’elle n’est pas obligatoire. Si n’en mettez pas, à chaque rédemarrage après une mise hors tension, l’heure se re-calibrera automatiquement via internet

![Emplacement pour la pile CR2032](/videos-assets/hagreen-9.png)

Sur les côtés, on voit un port **HDMI** utilisé pour le diagnostic, et une **carte SD** utilisée pour la récupération et pour réinstaller le système.

Home Assistant est finalement stocké sur **32go de mémoire eMMC**, c’est en fait un SSD soudé. La box tourne avec **4 Go de RAM**

Un **port ethernet** est présent sur la box, pas de wifi possible, une connexion câblée est **nécessaire**.

Les deux ports USB présents seront utilisés pour ajouter des protocoles domotiques comme Zigbee ou Z-Wave. Car en effet comme je l’évoquais tout à l’heure, la box qui est clé en main, **ne l’est pas à 100%** car il faudra acheter un dongle supplémentaire en fonction du protocole désiré.

## 👋 Conclusion

Personnellement je trouve qu’elle est parfaite pour débuter la domotique, ça pourrait d’ailleurs être un cadeau de noel sympa.. voilà je pose ça là, le lien est [juste ici](https://www.domadoo.fr/fr/produits-compatibles-home-assistant/7046-nabu-casa-box-domotique-home-assistant-green-0860011789703.html?domid=79)

Pour quelqu’un qui aimerait débuter la domotique sans trop galérer, ça me semble parfait

De mon côté, je vais l’installer chez mes parents pour voir si elle tient la route car de mon côté j’ai déjà mon système domotique installé sur mon mini pc. Je vous tiendrais au courant sur Discord et pourquoi pas sur la vidéo dans plusieurs mois pour savoir si elle vaux son prix.
