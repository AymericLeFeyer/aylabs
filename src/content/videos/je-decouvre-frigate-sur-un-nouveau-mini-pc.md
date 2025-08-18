---
title: "Je découvre FRIGATE sur un nouveau MINI-PC ! (Minix Z350-0dB, Proxmox, Home Assistant, 3D Print)"
description: "Aujourd'hui je découvre Frigate, cet outil surpuissant pour gérer ses caméras ! Comme c'est surpuissant, je décide d'installer ça sur un tout nouveau mini-pc, le Minix Z350-0dB. J'en profite pour vous montrer comment installer Proxmox, Docker, et finalement Frigate. Ensuite on passera à la configuration et aux tests en live !"
pubDate: "Aug 18 2025"
code: "g-k3y-DkPC0"
duration: "24:13"
tags: ["Homelab", "Domotique", "Impression 3D"]
---

Dans la vidéo de présentation de la caméra [Reolink E1 Zoom](/video/une-camera-d-interieur-discrete-et-efficace) , j’avais émis l’idée de découvrir Frigate, et vous avez été nombreux à vouloir une vidéo là dessus, et bah vous savez quoi, je vous ai écouté, c’est maintenant !

Bonjour à tous c’est Aymeric et bienvenue dans le AyLabs

# Frigate

Alors bon Frigate c’est quoi ?

![Logo Frigate](https://repository-images.githubusercontent.com/167694194/7e73b000-3ab3-11eb-9a3a-bb923650172b)

Chez vous, vous pouvez avoir des caméras de surveillance intérieure ou extérieure, regarder le flux et parfois recevoir une notification quand un mouvement est détecté par exemple, selon les modèles.

Il existe des systèmes pour gérer toutes ses caméras, qu’on appelle NVR. En gros c’est un système intelligent pour centraliser les alertes, les enregistrements, les détections, les flux vidéos des caméras

Il en existe plein, par exemple pour les pros on peut parler de Hikvision ou Dahua Technology, pour les particuliers on peut avoir du Reolink qui propose un NVR vraiment cool avec son hub, Annke ou Swann.

En général les NVR ça coute cher, car il faut stocker toutes les alertes, et il faut une certaine puissance de calcul pour les détections.

Vous me voyez surement venir, Frigate c’est justement un NVR, open source que vous pouvez installer chez vous sur un PC.

Avec Frigate, vous pouvez connecter toutes vos caméras IP, et les gérer depuis un seul endroit.

La force de Frigate c’est aussi sa capacité de détection par IA, on peut tracker différents objets
https://docs.frigate.video/configuration/objects/

Pour installer Frigate, vous pouvez le faire directement dans Home Assistant, il y a un module complémentaire.

Mais c’est pas forcément ce que je vous recommanderai, car Frigate ça demande énormément de puissance, surtout si vous avez plusieurs caméras, et donc je vous conseillerai plutôt de l’installer sur un PC dédié, si possible assez puissant

# Minix NEO Z350-0dB

Et ça tombe bien, Minix m’a contacté pour tester un de leur mini PC, le NEO Z350-0dB, oui 0dB car il est 100% silencieux.

[Plus d'informations sur le produit](/produit/minix-z350-0db)

![Image du PC](/videos-assets/minix-frigate-1.png)

Je ne suis pas payé pour en parler, mais j’ai reçu le produit gratuitement. Je suis libre de dire ce que je veux, et si le produit vous intéresse, je vous met des liens affiliés en description.

Maintenant que la barrière de la transparence est tombée, je vous propose de passer à l’unboxing

Dans la boîte on retrouve le mini PC, des adapteurs qui conviendront à la plupart des régions du monde, l’alimentation et un support VESA. Pas trop besoin de plus je pense

![Adaptateurs](/videos-assets/minix-frigate-2.png)


Sur la façace principale, celle avec le bouton POWER, on retrouve un port carte SD, USB-C 3.2 Gen 2, deux ports USB-A 3.2 Gen 2 aussi, une prise jack
![Façade principale](/videos-assets/minix-frigate-3.png)

De l’autre côté, la prise d’alimentation 12V/4A, deux ports USB-A 2.0, un port ethernet 2.5G, et deux ports HDMI 2.1 4k 60Hz
![Façade arrière](/videos-assets/minix-frigate-4.png)

Vous avez sûrement remarqué les petites antennes, c’est pour améliorer la qualité du Wi-Fi 6, et du bluetooth 5.2, c’est facultatif, mais les antennes sont fournies.
![Antennes](/videos-assets/minix-frigate-5.png)

Et tout à l’heure je vous disait que le PC était silencieux, c’est le cas puisqu’il n’y a aucun ventillateur. Ca utilise un système de refroidissement passif, par le haut du PC

À l’intérieur de la bête, on retrouve un processeur Intel Core i3-N350 qui monte à 3.9GHz, un GPU Intel UHD Graphics intégré, 16G de ram DDR4-3200 MHz en SO-DIMM, il n’y a qu’un seul slot mais on peut étendre à 32GB si besoin
![Specs techniques](/videos-assets/minix-frigate-6.png)

En stockage on a un SSD de 512Go, c’est du M.2 2280 PCIe 3.0 x 4 en NVMe

Ici aussi on a qu’un slot, mais on peut étendre à 4TB

Ok voilà j’ai déballé la fiche technique, mais voyons ce qu’il a dans le ventre.

Plutôt cool Windows est déjà installé sur la machine, enfin cool si vous aimez Windows bien sûr
![Windows install](/videos-assets/minix-frigate-7.png)

Ca va me permettre de faire quelques petits tests avant de tout écraser pour un bon vieux Proxmox.

Bon je vous passe la configuration de base de windows, c’est pas le plus intéressant

Je test pour commencer la carte WiFi, on monte à 500MBs. J’ai fait le même test en ethernet et on monte à 900 MBs, en sachant que de toute façon mon cable éthernet limite à 1GBs
![Speed test](/videos-assets/minix-frigate-8.png)

Maintenant je fais genre je suis un testeur chevronné d’ordinateurs et je lance un benchmark, j’ai choisis PassMark, les tests se passent et on a un score de 2100.
![PassMark](/videos-assets/minix-frigate-9.png)

Donc c’est pas ouf, mais de toute façon c’est un Mini-PC qui coute 330€ sur Amazon en ce moment, donc difficile de rivaliser avec les plus gros

Pour faire une petite photo j’ai touché le PC, et attention les doigts, ça brûle ! Je ne rigole pas, le PC monte facilement à 60 à 70°C. Pas de ventilateurs ok, mais pour le coup c’est presque dangereux je trouve.
![Température](/videos-assets/minix-frigate-10.png)
C’est un point essentiel je pense que pour l’achat de ce PC, faut choisir entre soit silencieux, soit froid.

# Installation de proxmox

Bon allez j’suis resté trop longtemps sur Windows je commence a attraper des boutons bleus, je vais préparer une clé bootable Proxmox.

[Vous pouvez retrouver mon tuto d'installation de proxmox sur le site !](/tutoriel/installation-proxmox)

Je vous ai passé l’étape où j’ai rejoint le minix dans mon cluster car c’est un peu avancé et ça ne vous concerne pas si vous n’avez qu’un seul PC, mais à partir de maintenant, on a pareil

On retrouve donc le résumé du PC, 16Go de RAM, 8 Coeurs etc

# Installation de Frigate

Installons maintenant Frigate.

[Vous pouvez retrouver mon tuto d'installation de Frigate sur le site !](/tutoriel/installation-frigate)

# Configuration de Frigate

Le tuto d'installation vous explique comment modifier la configuration

La documentation de Frigate est assez claire, mais on va voir ensemble ce qu’il faut renseigner, déjà pour une caméra

Premièrement, mqtt. Si vous prévoyez de connecter avec Home Assistant, ce que je vous conseille, c’est d’activer mqtt, de mettre le host, user et mot de passe de votre serveur mosquitto par exemple

Ensuite on passe aux caméras

Pour chaque caméra, il faudra trouver le chemin du flux. Moi j’ai utilisé RTSP car mes 3 caméras le proposent, ça c’est un vous de voir. Sur la E1 Zoom de la dernière fois, j’ai donc mis ce chemin pour avoir accès à ma caméra

On ajoute des rôles, pour dire ce que la caméra doit faire. Ici c’est detect et record

On peut choisir des masques pour ne pas surveiller certains endroits par exemple

Ensuite on peut mettre la liste des objets à tracker, les personnes ça marche super, j’ai essayé des livres et les couteaux, mais il me détecte surtout moi, et pas les objets en question, donc à voir

Notez que selon la puissance de votre ordinateur, vous serez plus ou moins limité sur le nombre de caméras et sur la pertinence des détections.

Vous pouvez ajouter un Google Coral par exemple, c’est un truc qui se branche par exemple sur un port USB et qui ajoute de la puissance pour l’IA de détection de Frigate.

J’ai essayé d’en acheter une mais c’est en rupture de stock, et les revendeurs se gavent sur les prix, alors je vais attendre un peu.

En tout cas si vous avez un truc de ce genre, c’est aussi dans ce fichier qu’il faut le préciser, mais pour le coup, je vous redirige vers la documentation

Si tout va bien maintenant vous devriez voir votre flux caméra

Jettez un oeil aux options, y’a pas mal de choses sympa

Je ne peux que vous conseiller de regarder la documentation, et de croiser les articles et les vidéos pour vraiment approfondir la chose.

Perso j’ai réussi à y ajouter ma caméra Reolink mais aussi mes 2 caméras EzViz, donc c’est impec

On a pas mal d’options pour revoir les détections passées, c’est franchement très complet

Et un dernier petit détail, en terme de consommation électrique on est sur du 14/15W quand il ne passe rien, ça monte un peu plus quand il y a beaucoup de mouvements à détecter, vers 20W. Notez de la consommation maximale théorique est de 48W

Notez qu’actuellement avec ma configuration, le CPU est lent pour détecter, même si honnetemnet ça reste OK. Pour 3 caméras, le CPU n’a jamais dépassé les 50%, c’est bon signe pour la suite

# Home Assistant

J’imagine que maintenant vous voulez savoir comment ajouter Frigate à Home Assistant

Directions HACS pour installer l’intégraton Frigate.
![Frigate HACS](/videos-assets/minix-frigate-11.png)

Attention il ne faut pas confondre module complémentaire et intégration

Module complémentaire c’est pour installer Frigate directement sur la machine de Home Assistant, comme je le disais en intro, je le recommande pas trop

Intégration c’est pour relier Frigate à Home Assistant. Donc bref vous installer l’intégration, vous devrez mettre l’adresse ip de frigate et c’est tout, il va automatiquement détecter vos caméras

![Ajouter l'intégration Frigate](/videos-assets/minix-frigate-12.png)

Si vous avez bien configuré le mqtt, vous aurez plein d’entitées en plus du flux caméra, et ça on va les utiliser pour faire une automatisation sympa. Si tout est indisponible, c’est que votre mqtt est sûrement mal configuré

![Screen de Frigate](/videos-assets/minix-frigate-13.png)

Je vous propsoe donc une automatisation qui va vous envoyer une photo sur discord à chaque fois qu’un élément que vous avez décider de tracker est détecté

Pour ça directions les automatisations donc

La condition pour lancer l’automatisation, c’est si la caméra détecte quelque chose.
Pour ça j’ai utilisé le nombre de personne detéctée, et si ça change et que ça devient supérieur à 0, ça s’enclenche. Vous pouvez adapter en fonction de ce que vous voulez détecter

Dans les actions, je commence par prendre une photo de la caméra, que je stocke dans `/media/cams/cuisine.jpg`

Ensuite j’envoie ma notification sur Discord. Si vous voulez plus d’informations je vous redirige vers ma vidéos sur les [notifs Home Assistant grace à Discord](/video/discord-au-coeur-de-mes-notifications). Mais donc il me suffit de remettre le même chemin

L’avantage de ça, c’est qu’à chaque nouvelle détection, un screenshot sera fait, mais écrasé par le suivant, ce qui permet de pas enregistrer trop de photos inutiles
Discord se chargera de se souvenir de l’historique. Et sinon, vous pouvez bien sur tout retrouver dans Frigate

![Automatisation](/videos-assets/minix-frigate-14.png)
```
alias: Caméra cuisine / Personne detectée
description: ""
triggers:
  - type: value
    device_id: f5fcab64dfd8dda9d0d369d300259a97
    entity_id: 457933e220a070e47a217632509a1ff3
    domain: sensor
    trigger: device
    above: 0
conditions: []
actions:
  - action: camera.snapshot
    metadata: {}
    data:
      filename: /media/cams/cuisine.jpg
    target:
      entity_id:
        - camera.cuisine_2
  - action: notify.homeassistant
    metadata: {}
    data:
      message: 📸 Personne détectée
      target:
        - "1403512629343031306"
      data:
        images:
          - /media/cams/cuisine.jpg
mode: single
```

# Impression 3D pour le rack

Bon, le PC est toujours aussi brulant, mais j’ai envie de le mettre dans le rack que j’ai imprimé [la dernière fois](/video/j-ai-imprime-un-rack-3d). J’ai un peu peur car il est lourd, et chaud donc j’ai peur que le PLA des faces latérales se déforment. 

J’ai cherché sur internet mais aucun modèle 3D n’existe donc pas le choix, je vais le modéliser moi même

![Modélisation](/videos-assets/minix-frigate-15.png)

Je suis parti du même principe qu’une autre étagère pour le Beelink, en deux parties

Le fichier est dispo sur [MakerWorld](https://makerworld.com/fr/models/1704273-minix-neo-z350-0db-10-rack-mount#profileId-1807680)

La partie qui va soutenir le tout sera en ABS de chez Sunlu, première fois que j’utilise ce filament, normalement il faut le sécher avant utilisation, je ne l’ai pas fait, et donc j’ai certaines couches qui se décollent, j’espère que ça ira

La partie qui fera office de panneau est en PLA Ice Blue et Silk Black & Blue, toujours la même bobine que pour le rack, je vous met les liens en description, n’oubliez pas le code AyLabs si vous passez commande !

[Achetez votre filament sur SUNLU, tout en soutenant mon travail](https://go.aylabs.fr/sunlu)

J’avais prévu la place pour installer des écrous M5 mais j’ai pas du tout penser à la tolérance et à la déformation légère, bref ça ne rentre pas du tout

J’ai pas de M4 sous la main mais j’ai des M3 donc ça fera l’affaire, c’est léger, j’espère que ça va pas tomber

Comme la chaleur monte, je décide de mettre le Minix tout en haut, et je décale le Beelink

![Placement dans le rack](/videos-assets/minix-frigate-16.png)

Et comme j’ai peur que tout se casse la figure, j’ai imprimé un petit renfort que j’ai placé entre les deux appareils, histoire de soutenir davantage, on verra si ça tient !

J’ai placé un petit capteur de température à l’intérieur pour voir la différence, et bah oui il chauffe le coquin. 
Actuellement mon rack est à 29°C là où ma pièce est à 26°C, si j’éteint le mini PC et que j’attends, le rack retombe à 26°C

![Température rack](/videos-assets/minix-frigate-17.png)

J’ai bien fait de le mettre tout en haut et de faire une grille en nid d’abeille, sinon je pense que mon PLA se serait déformé

# Conclusion

Bon ! La vidéo était assez dense en informations, surtout n’hésitez pas à revenir sur les passages qui vous intéresse grâce au chapitrage de la vidéo.

Personnelement je suis content d’avoir mis Frigate, j’ai envie d’avoir encore plus de caméras pour tout surveiller maintenant

Le Mini PC est franchement sympa aussi, encore une fois attention à la chaleur si vous le laissez à l’air libre, ou à la portée d’enfants.

![Température SSD](/videos-assets/minix-frigate-18.png)


S’il vous manque quelque chose ou si vous avez tout simplement adoré, dans tous les cas n’hésitez pas à mettre des commentaires ça fait toujours plaisir. Et si mon contenu vous plaît, n’hésitez pas à vous abonner.

Allez moi je vous laisse, c’était Aymeric, salut !
