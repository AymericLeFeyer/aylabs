---
title: "Les protocoles DOMOTIQUES: Thread, Zigbee, Wifi, Z-Wave (Sky Connect ZBT-01)"
description: "Dans certaines maisons, on peut retrouver jusqu’à une centaine d’appareils domotiques qui discutent avec l’ordinateur central. Dans cet article, on va voir comment ces appareils communiquent ensemble et quel est aujourd’hui le protocole le plus utilisé sur le marché, et pourquoi."
pubDate: "Dec 4 2024"
code: "ray-9VmMx0M"
duration: "15:42"
tags: ["Domotique"]
---

Dans certaines maisons, on peut retrouver jusqu’à une centaine d’appareils domotiques qui discutent avec l’ordinateur central. Dans cet article, on va voir comment ces appareils communiquent ensemble et quel est aujourd’hui le protocole le plus utilisé sur le marché, et pourquoi.

Dans l’article précédent, je vous ai montré comment installer facilement un **Home Assistant** grâce à une box domotique clé en main, la home assistant green.

Selon moi, un des points négatifs de cette box était la **non-prise en charge de protocole** de manière native. C’est pourquoi aujourd’hui, on va parler protocoles domotiques (les transitions sont folles !)

## 🛜 Wi-Fi

> On dit LE, ou LA wi-fi ?

Le wifi, y’en a partout chez vous, la plupart de vos appareils utilisent ce canal de communication, vos téléphones, ordinateurs, TV, console de jeux enceintes connectées … c’est un **protocole de communication dominant** et grand public. En effet il suffit d’avoir une box internet et le tour est joué.

En domotique, il existe beaucoup d’appareils qui se connectent via le wifi, des prises connectées, des ampoules, toutes sortes de capteurs …

Mais le problème avec les appareils wifi…. **bah c’est le wifi**

> **Plus internet ? Plus de domotique.**

Un réseau qui sature parce que vous regardez un film en 4k sur Netflix ?  
-> La domotique est lente.

Votre film sur Netflix saccade ?  
-> Sûrement parce que vous avez trop d’appareils wifi chez vous.

Vous voyez le soucis ? Les deux utilisent **le même canal** de communication, et c’est bien trop petit.

Le principal avantage des appareils wifi, pour moi le seul, **c’est que tout le monde possède une box internet chez soi** (ou presque), et donc tout le monde possède un **pont** pour connecter ses appareils.

Pas besoin d’acheter une passerelle supplémentaire. C’est par exemple largement suffisant si votre domotique se limite à une ampoule connectée dans la chambre

Je vais donc maintenant vous parler d’autres protocoles, qui continueront de fonctionner même après une coupure internet

## 🐝 Zigbee

Nous voilà donc au zigbee, ce protocole utilisé à 90% dans mon domicile

Le principal avantage du zigbee, c’est son **réseau maillé**. En effet, en zigbee on distingue plusieurs catégories d’appareils

- le **coordinateur** (le pont zigbee)
- les **routeurs** (appareils branchés au courant)
- les **appareils terminaux** (souvent sur pile)

![Schéma en étoile d’un réseau maillé](/videos/protocoles-2.png)

Donc en fin de compte, vous pouvez avoir un manoir, si vous disposez des appareils un peu partout, ça fonctionnera !

Bon c’est possible que l’information soit plus lente si le coordinateur est dans la chambre 42 et l’appareil dans la chambre 27, mais en théorie, ça fonctionnera !

Voici par exemple mon maillage zigbee à la maison. J’ai pour le moment **38 appareils zigbee sur 80 m²**

![Mon maillage zigbee personnel](/videos/protocoles-3.png)

Vous voyez en bleu les **routeurs**, en vert les **appareils terminaux**, et l’étoile c’est le **coordinateur**. Un petit chiffre est présent entre chaque lien, c’est le LQI : la force du signal allant de 0 à 255

> **Un énorme avantage au zigbee, c’est le _prix_ très abordable des produits**

D’ailleurs, si vous cherchez du matériel domotique, vous pouvez consulter :  
👉 [https://aylabs.fr/produits-testes](https://aylabs.fr/produits-testes)  
👉 [https://go.aylabs.fr/domadoo](https://go.aylabs.fr/domadoo)

Le zigbee utilise des ondes 2,4GHz, qui est une norme mondiale. Mais attention : **le wifi aussi** utilise le 2.4GHz -> des interférences peuvent survenir.

## 🧑‍💻 Coordinateur Zigbee Sky Connect

Le coordinateur c’est le cœur du réseau zigbee. Voici la **Sky Connect**, clé USB zigbee officielle de Nabu Casa.

**Dongle Zigbee Sky Connect**

🛒 [https://go.aylabs.fr/domadoo/sky-connect](https://go.aylabs.fr/domadoo/sky-connect)  
🎥 [https://youtu.be/ray-9VmMx0M](https://youtu.be/ray-9VmMx0M)

![Contenu de la boîte](/videos/protocoles-4.png)

Il est **fortement recommandé de déporter le coordinateur** de la box avec une rallonge USB.

![Déport du dongle](/videos/protocoles-5.png)

La Sky Connect se connecte très simplement à Home Assistant, c’est du plug & play. Elle configure automatiquement **ZHA**, le plugin Zigbee natif.

![Début de la configuration](/videos/protocoles-6.png)

Il existe aussi **Zigbee2MQTT** (Z2M), très populaire. Je n’ai pas encore trouvé d’appareil incompatible avec l’un ou l’autre.

## 💤 Z-Wave

Si vous étiez sur Jeedom, vous connaissez sûrement **Z-Wave**.

C’est très similaire au Zigbee :

- réseau maillé
- pas de wifi

Mais :

- **meilleure portée**
- fréquence 868 MHz (pas d’interférences)
- **plus cher** que Zigbee
- fréquence qui change selon le pays

Certains comme **Fibaro** ou **Shelly** continuent à en proposer.

Mais soyons honnêtes : **Z-Wave se fait distancer** par Zigbee.

## 🆕 Matter & Thread

**Matter** : nouveau **standard domotique**, soutenu par **Google**, **Amazon**, etc.  
**Thread** : protocole compatible Matter, surcouche du Zigbee avec une IP par appareil.

En pratique :

- Si c’est Zigbee, c’est **souvent compatible Thread**
- Et donc **souvent compatible Matter**

> Pourquoi c’est à la mode ?
> Parce que **Matter est déjà présent dans plein d’appareils** : enceintes Alexa, Apple TV, Google Home…

➡️ Pas besoin de matériel supplémentaire : on a déjà le pont Matter chez soi sans le savoir.

Et sinon, tu peux aussi flasher un dongle Zigbee (comme la Sky Connect) pour qu’il devienne Thread.

## 🤔 Du coup, lequel choisir ?

- Petits besoins : **Wi-Fi**
- Maison entière :
  - le plus simple ? **Matter & Thread**
  - le plus robuste et complet ? **Zigbee**
- **Z-Wave** ? Trop cher, on oublie 😅
