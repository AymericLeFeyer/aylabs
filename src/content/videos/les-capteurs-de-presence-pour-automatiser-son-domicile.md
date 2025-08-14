---
title: "Les capteurs de PRÉSENCE pour AUTOMATISER son domicile (SNZB-06P)"
description: "Aujourd'hui on parle de détecteurs de présence et des automatisations possibles grâce à ce type de module !"
pubDate: "Jan 8 2025"
code: "GhyDieJhD9c"
duration: "7:15"
tags: ["Domotique"]
---

Quand je rentre dans mon bureau, ma maison me détecte, allume la lumière s’il fait sombre et le chauffage s’allume s’il fait froid.

Mon installation domotique ça commence à devenir sérieux chez moi, les éléments commencent à s’inter-connecter entre eux.

Aujourd’hui, Utilisons la puissance d’Home Assistant et la simplicité d’installation des détecteurs de présence. C’est parti !

Vous l’avez compris, aujourd’hui on va parler détection de présence pour booster vos automatisations sur Home Assistant.

Pour détecter la présence, il faut ……. un détecteur de présence ! Bien joué !

# Détecteurs de présence ou mouvements ?

Détecteur de présence, ou détecteur de mouvement ?

Le détecteur de mouvement détecte le mouvement. Si vous ne bougez plus, il ne vous détecte plus

Le détecteur de présence détecte donc la présence dans une pièce, même si vous ne bougez pas le temps d’un film, il vous détectera toujours

Parenthèse terminée, retournons à nos détecteurs de présences donc

# Review du SNZB-06P

J’ai reçu des boîtes oranges de chez Domadoo, 18€ unité hors promotion, c’est pas très cher, et tant mieux car je veux en mettre partout ! Ce sont donc les Sonoff SNZB-06. Ca marche avec une technologie Radar de micro ondes. Donc ça marche même la nuit

Dans la boîte on retrouve un cable d’alimentation en USB-C, en effet ce module ne fonctionne pas sur pile. Ce qui veux dire qu’il faudra cacher le cable pour pas que ce soit trop moche.

Le détecteur fait donc office de router zigbee puisque branché en permanence

Le détecteur c’est en fait deux parties, une soucoupe aimantée, qui fait office de base. Et le module en lui même en forme de boule qui se pose sur la soucoupe. Je trouve ça très ingénieux car grace à la forme du module, on peux facilement orienter comme on le souhaite

On retrouve également de quoi installer la base, soit avec du 3M, ou avec des chevilles

![Unboxing](/videos/snzb06p-1.png)

# Fausses détections

Sonoff indique que des fausses détections peuvent survenir, si vous avez des animaux, des aspirateurs robots, du vent qui souffle sur une plante… Tout ça pourrait donc enclencer la présence du détecteur et créer des faux positifs. Donc si vous avez des animaux, je vous conseille d’en essayer 1 seul, et si ça marche achetez les autres

![Fausses détections](/videos/snzb06p-2.png)

# Ça donne quoi ?

Bon, on teste ça ?

Je branche… Il se met tout seul en mode appairage, hop c’est détecté

J’aime bien donner des noms identifiables, pour ma part ce sera human-sensor_bedroom, car celui là ira dans la chambre

Les informations remontées sont :

![Screen de Zigbee2MQTT](/videos/snzb06p-3.png)

- Occupancy, savoir si le détecteur détecte quelqu’un
- Timeout, je l’ai mis à 30s, ça me semble déjà bien assez
- Sensitivity, je l’ai mis à low dans le bureau et à high dans le salon, ça dépend de comment est placé le détecteur, à vous de voir
- Illumination, rien à voir avec les minions, c’est pour connaître la luminosité de votre pièce. Attention la valeur n’est mis à jour que lorsque quelqu’un est détecté
- LinkQuality, comme d’habitude, le petit lien de connexion
  On va tout de suite le mettre dans Home Assistant, via une card mushroom assez simple, et c’est parti pour les tests

Je remarque tout de suite qu’il me détecte très bien ,voir trop bien parfois, c’est pour ça que j’ai mis la sensibilité à low dans le bureau car il me détecte parfois derrière la porte

![Sensibilité](/videos/snzb06p-4.png)

Dans le salon, je l’ai mis derrière un pot de fleur, et ça marche quand même très bien..

![Photo du capteur dans mon salon](/videos/snzb06p-5.png)

Comme ça on le voit pas, et il fait l’affaire quand même. Bien sûr si je l’avais mis en hauteur avec un bon angle de vue, ça aurait été parfait. Mais dans mon cas, je voulais surtout détecter si quelqu’un était dans le salon, et non dans le salon + salle à manger + cuisine (car oui, il aurait tout détecter)

# Retours à long terme

Après presque 1 mois d’utilisation, j’ai quelques retours à faire

- Le premier c’est le réglage de la sensibilité. Dans mon cas j’ai du le régler plusieurs fois dans mon bureau pour avoir le moins de faux positifs possibles
- Il faut toujours s’attendre à avoir des faux positifs, donc attention à ce que vous déclencher avec ce genre de dispositif
- Dans l’ensemble ça marche très bien et c’est satisfaisant. Cela Peut etre très pratique pour de la sécurité, mais aussi des automatisation

Je l’utilise donc déjà depuis 1 mois dans mon bureau, quand j’y rentre, la lumière s’allume automatiquement s’il fait sombre, et le chauffage s’il fait froid. Le mode télétravail se met en route Quand je quitte mon bureau, tout s’éteint et on retourne en mode Maison

Dans le salon, pour l’instant ça ne me sert à rien car je n’ai pas encore trouvé la bonne utilisation. Je pense quelque chose en rapport avec l’éclairage, je dois encore réfléchir

Dans la chambre, quand on y rentre, le chauffage s’éteint tout seul, une petite lampe s’allume et le mode nuit s’enclenche. Ainsi le lendamin matin quand plus personne n’est dans la chambre, le mode Maison se met en route

Enfin dans ma salle de bains, lorsqu’on s’y trouve, la VMC se met en mode boost. Quand on y sort, le chauffage s’éteint et la VMC se remet en mode normal 15min plus tard

Vous voyez, tout ça dépend surtout de votre usage et de votre imagination. Mais dans mon cas, ça me beaucoup me servir !

# Conclusion

Pour conclure, regardons les différents Point négatif et positifs de ce produit

**Positif**

- Détection assez fiable
- Sur secteur, pas de piles
- Routeur zigbee
- Facile à installer sur Home Assistant
- Prix relativement accessible

**Négatif**

- Pas très esthétique
- Minimum 30s de timeout
- Me détecte parfois derrière les murs
- Câble USB

Selon les détecteurs de présences peuvent jouer un rôle crucial dans les automatisations de son domicile. Ce modèle ou un autre, peu importe. Dîtes moi en commentaire si vous avez l’habitude d’utiliser un autre modèle, et pourquoi, et à nous dire quels sont les usages que vous en faites

C’est tout pour moi, merci d’avoir suivi la vidéo jusqu’au bout, le petit pouce, le petit commentaire, l’abonnement vous avez l’habitude,

En attendant moi , je vous dit à la prochaine, c’était Aymeric, Salut !
