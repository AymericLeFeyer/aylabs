---
title: "Améliorer son réseau ZIGBEE très facilement avec ce routeur POE ! (SMLight SLZB-06M)"
description: "Contrôlez vos appareils zigbee via ce coordinateur POE. C'est la promesse de SMLight, et on teste ça aujourd'hui !"
pubDate: "Feb 16 2025"
code: "GmQzxH32xEQ"
duration: "6:25"
tags: ["Domotique"]
---

# Le Zigbee

Pour rappel le zigbee c’est un protocole de communication utilisé en domotique qui permet de faire discuter les appareils entre eux via un système de réseau maillé. Ce mécanisme permet d’avoir une portée plutôt grande.

Si vous voulez plus d’infos, j’ai fais une vidéo un peu plus complète à ce sujet

Personnellement je vis dans une maison d’environ 85 m2 et j’ai 40 appareils zigbee. Le maillage est plutôt bon et je n’ai pas que très peu de perte de lien. A la limite, ça arrive sur mes appareils qui sont littérallement à l’opposé de ma pièce technique, donc vers la salle de bains.

Là bas le réseau est un peu moins bon, mais dans l’ensemble ça reste réactif.

Tous les appareils branchés sur le secteur font office de routeur, sur mes 40 appareils j’en ai peut etre la moitié qui font office de routeur, des prises connectées, des ampoules, des modules encastrés…

# Présentation du produit

![Image du produit](/videos/smlight-1.png)

Aujourd’hui je vous présente l’un d’eux, il s’agit du SMLight SLZB-06M. Sa fonction première est d’assurer le rôle de coordinateur zigbee. Vous l’avez vu dans une autre de mes vidéos, personnellement j’utilise la clé de chez Sonoff que j’avais flashé pour accueillir le ember. Ce SMLight est une très bonne alternative pour plein de raisons.

La première, son antenne énorme… même si bon, c’est pas la taille qui compte… bah en fait un peu quand même. Certains y voient un inconvénient car ça prends de la place, mais en réalité c’est plutôt un avantage selon moi, car cela permet d’avoir une portée excellente pour accueillir un grand réseau d’appareils Zigbee

La seconde raison, c’est sa connexion via le réseau local de votre box. En fait vous n’avez pas besoin de mettre ce dongle au même endroit que votre box domotique, vous pouvez le mettre dans une autre pièce, à un endroit plus stratégique.

Si comme moi vous avez un Home Assistant sur un Proxmox, puisque ce dongle n’est pas conencté directement à la machine, pas besoin de faire de passthrought de port USB, c’est plutôt cool à savoir.

# Fixation

![Fixation velcro](/videos/smlight-2.png)

D’ailleurs petit tips pour la fixation, j’ai découvert ce système d’attache par velcro, et j’en met sur tous mes appareils désormais. Parce que le 3M c’est bien, mais quand faut changer la pile et que le module n’est pas prévu pour être décroché facilement, c’est vite compliqué.

# Alimentation

Côté alimentation, vous pouvez soit l’alimenter en POE, ou en USB C. Petite parenthèse, le POE signifie **Power Over Ethernet**, en gros le dongle est alimenté via un port Ethernet, à condition bien sur que le switch d’origine supporte le POE. Sinon il existe un injecteur POE vendu par SMLight qui fait très bien le job.

Dans le cas où vous n’avez pas de quoi l’alimenter en ethernet, vous pouvez donc utiliser une alimentation USB-C plus classique, et connecter le dongle en Ethernet ou même Wifi. Cependant là je ne recommande pas vraiment cette utilisation. Car le wifi peut vite devenir instable. Je recommanderai plutôt de l’ethernet, même sans POE

Pour récapituler, ce dongle vous devez lui apporter de l’énergie, soit en Ethernet (si compatible POE), soit en Usb-C

et vous devez lui apporter une connexion internet, soit en Ethernet, soit en Wifi.

Donc un mix Ethernet/ USB C est possible !

![Alimentation](/videos/smlight-3.png)

Le troisième point positif selon moi c’est sa multi fonctionnalité. Vous pouvez choisir entre un mode coordinateur, un mode routeur., ou même en pont Matter over Thread

![Zigbee OTA](/videos/smlight-4.png)

Dans mon cas j’avais la flemme de réappairer mes 40 appareils, donc j’ai préféré garder mon Dongle d’origine, et j’ai flashé ce SMLIght en tant que routeur, pour étendre mon réseau.

Vous pouvez flasher l’appareil très facilement via l’adresse slzb-06m.local une fois l’appariel connecté

En parlant de cette interface, elle est très cool, vous avez toutes les infos nécessaires pour configurer Zigbee2MQTT derrière, et plein d’autres options de sécurité et de réseau, mais ça je vous laisserai creuser le sujet si cela vous intéresse.

Un petit point bonus, c’est sa compatibilité Bluetooth ESPHome. On s’y attendait pas spécialement, mais ça reste pratique pour ceux qui font de l’ESP

# Les différents modèles

Ce modèle c’est donc le 06M mais il existe également le 06 et le 06p7

![Différents modèles](/videos/smlight-5.png)

Bon un peu comme le dongle sonoff, ce qui change c’est le SOC zigbee

En gros le 06 c’est recommandé pour faire du Zigbee2MQTT, et supporte le Matter

La version 06p7 c’est la même mais sans le Matter

Et Le 06M supporte aussi le Matter mais n’est pas spécialement recommandé pour Z2M

Perso j’ai le 06M sans avoir fait de recherches au préalable… et j’utilise Z2M, donc je ne respecte absoluement pas les recommandations, mais ça marche quand même. Je ne sais pas quels sont les réels impacts. En tout cas sachez que c’est possible, du moins pour le mode routeur

Côté prix, pour comparer le sonoff est environ à 25€, et celui ci est à 40€. Différence de prix logique vu les fonctionnalités présentes et la portée incroyable que cet adaptateur peux offrir

Cela fait maintenant 1 semaine que je le teste chez moi en tant que routeur et j’en suis très content, cela a supprimé les quelques latences dans ma salle de bain, et a nettement stabilisé les connexions. Comme vous pouvez le voir sur le schema, le SMLight est connecté à une grande partie de mes appareils. Et plus un appareil est connecté à des routeurs, mieux c’est.

![Graphe zigbee](/videos/smlight-6.png)

Si j’avais découvert ce modèle 6 mois plus tôt, j’aurai peut etre opté pour celui ci en tant que coordinateur principal. Si vous voulez vous lancer dans la domotique et que vous n’êtes pas à 15€ près, je vous recommande ce modèle. J’en profite pour vous rappeler que si vous voulez parlez d’une référence de produit en particulier, une section est disponible sur le discord à ce sujet.

Je pense avoir dit tout ce que je voulais vous dire sur ce modèle, un grand merci à Domadoo pour m’avoir envoyé ce produit. Si la vidéo vous a plu n’hésitez pas à vous abonner, le petit pouce le petit commentaire, vous avez l’habitude

C’était Aymeric, salut !
