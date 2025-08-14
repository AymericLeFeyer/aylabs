---
title: "Mon DASHBOARD sur HOME ASSISTANT !"
description: "Cela fait maintenant 3 mois que j'ai debarqué dans Home Assistant. Dans cette vidéo je vous présente mes différents dashboards : gestion de ma maison connectée, suivi de mes batteries, monitoring de mon homelab... Finalement, je fais pas mal de choses sur Home Assistant !"
pubDate: "Nov 14 2024"
code: "GBd8ngtlAbA"
duration: "15:42"
tags: ["Domotique"]
---

_Ahh le dashboard, c’est la première chose qu’on voit quand on démarre Home Assistant._

Il faut que ce soit pratique, utile (et si possible joli, sinon les personnes qui vivent avec vous ne n’utiliseront pas)

À l’heure où j’écris cette vidéo, ça fait 3 mois que je suis dans Home Assistant. Et en 3 mois, mon dashboard a évolué .. Je le change régulièrement, mais j’ai décidé de vous présenter aujourd’hui une version assez aboutie, avec différents aspects qui pourraient donner des idées.

Ah et aussi, un dashboard c’est personnel, il faut que ça vienne du coeur (j’abuse peut-être un poil). Un dashboard copié/collé c’est bien mais ça matchera peut-être pas tout à fait à votre besoin.

![Dashboard Home Assistant](/videos/dashboard-ha-1.png)

# 🍄 HACS et Mushroom

On va commencer par les prérequis.
**Mon dashboard utilise mushroom, card_mod, un peu bubble_card et plein d’autres.**
Ces dépôts ne sont pas disponible sur le store de Home Assistant, il faut au préalable installer HACS, un store communautaire

Je vous laisse ici un tuto d’installation de HACS

<iframe width="620" height="349" src="https://www.youtube.com/embed/I6laXK6_3PA" title="Home Assistant - Installer HACS 2.0 facilement" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Voici la liste des dépôts que j’ai installé (en lien avec le sujet du jour)

Mushroom

- mini-graph-card
- Bubble Card
- Mushroom Themes
- template-entity-row
- UI Lovelace Minimalist
- Bar Card
- Stack in Card
- auto-entities

Je ne les traiterai pas forcément tous, mais si vous avez un soucis en copiant du code plus bas, **peut-être qu’il vous manque un dépôt !**

# 1️⃣ Tout sur une page

Alors oui et non, je n’ai pas vraiment TOUT sur une page, mais vous allez comprendre …

J’aime bien l’idée que tout se passe sur un unique dashboard, et sur un unique onglet. Je gère ensuite la navigation à partir de la “grosse” page (celle sur le screen ci-dessus)

Mes sous-page sont en fait des onglets cachés (des sous-vue)

J’ai deux types de sous-pages

![Configuration d'une sous-vue](/videos/dashboard-ha-2.png)

## Les groupes d’appareils

J’ai une sous-page par groupe d’appareils (chauffages, volets, sécurité, éclairage, repas (oui)) que je gère via des chips tout en haut de mon dashboard. Ça ne prends pas de place, je sais qu’ils sont là, et ils sont mignons

![Chips pour les groupes d'appareils](/videos/dashboard-ha-3.png)

```yaml
type: entity
entity: person.aymeric
tap_action:
  action: navigate
  navigation_path: /dashboard-maison/chauffages
name: Chauffages
icon: mdi:fire
icon_color: pink
content_info: name
```

L’entity ne sert à rien, puisque de toute façon j’ai décidé qu’au clic, je redirige vers une autre page, ici `/dashboard-maison/chauffages`

## Les pièces

Pour les pièces (de la maison j’entends), j’ai une jolie petite carte avec pleins de petites actions, et au clic .. ça redirige vers une autre sous-vue.

Mais comme c’est un gros morceau .. transition !

# 🛋️ Room Card

![Exemple de ma carte Salon](/videos/dashboard-ha-4.png)

Sur chaque carte, j’associe des chips, sur cet exemple j’ai

- l’état du radiateur (éco)
- l’état du volet (fermé)
- l’état de ma lampe (éteinte)
  J’ai également un badge me permettant de savoir si l’ouvrant (ici la porte d’entrée) est ouverte ou fermée. Et comme il restait de la place, pourquoi ne pas afficher le température ?

> JE VEUX ! DONNE MOI LE CODE !

Minute papillon, laisse moi t’expliquer un peu comment ça marche.

Chaque carte est en fait une vertical-stack-in-card avec deux éléments

### En haut, les informations principales, l’icône, le badge, le texte ..

```yaml
type: custom:mushroom-template-card
# L'entité, j'ai choisi de mettre la température
entity: sensor.thermometer_living_room_temperature
icon: mdi:sofa
primary: Salon
# Attention si vous mettez une autre entité, il faudra changer ceci
secondary: "{{ states(entity) }}°C"
layout: horizontal

# La navigation
tap_action:
  action: navigate
  navigation_path: /dashboard-maison/living

# Le badge
badge_icon: |
  {% if is_state('binary_sensor.open_sensor_living_door_contact', 'on') %}
     mdi:door-open
  {% else %}  
     mdi:door-closed
  {% endif %}

# Et la couleur, le tout est conditionnel
badge_color: |
  {% if is_state('binary_sensor.open_sensor_living_door_contact', 'on') %}
     red
  {% else %}  
     grey
  {% endif %}
```

### En bas, une succession de chips

```yaml
# Le type mushroom pour que ce soit joli
type: custom:mushroom-chips-card
chips:
  - type: template
	  entity: select.heating_desktop_room_pilot_wire_mode

	  # Des conditions pour choisir l'icone de l'élément
    icon: |
      {% if is_state(entity, 'comfort') %} mdi:fire
      {% elif is_state(entity, 'eco') %} mdi:moon-waning-crescent
      {% else %} mdi:heating-coil
      {% endif %}

    # Sa couleur
    icon_color: |
      {% if is_state(entity, 'comfort') %} red
      {% elif is_state(entity, 'eco') %} blue
      {% else %} grey
      {% endif %}

  # Et on répète ça autant de fois qu'on le veux
  - type: template
    entity: cover.shutter_desktop_room
    tap_action:
      action: toggle
    icon: |
      {% if is_state(entity, 'open') %} mdi:window-shutter-open
      {% elif is_state(entity, 'closed') %} mdi:window-shutter
      {% else %} mdi:window-shutter-alert
      {% endif %}
    icon_color: |
      {% if is_state(entity, 'open') %} blue
      {% elif is_state(entity, 'closed') %} grey
      {% else %} orange
      {% endif %}

  - type: template
    entity: light.plug_desktop_light_ambiant
    icon: mdi:coach-lamp
    icon_color: |
      {% if is_state(entity, 'on') %} orange
      {% elif is_state(entity, 'off') %}  grey
      {% else %} grey
      {% endif %}
    tap_action:
      action: toggle

# On aligne les chips à droite
alignment: end
# Et on met un p'tit coup de car_mod
card_mod:
  style: |
    ha-card {
      padding-top: 0px;
      margin-top: -8px;
      padding-bottom: 8px;
      padding-left: 8px;
      padding-right: 8px;
    }
```

![Room Card](/videos/dashboard-ha-5.png)

### Le bloc final (exemple pour salon)

```yaml
type: custom:vertical-stack-in-card
cards:
  - type: custom:mushroom-template-card
    entity: sensor.thermometer_living_room_temperature
    icon: mdi:sofa
    icon_color: |
      {% if is_state(entity, 'on') %}
        #03A9F4
      {% else %}  
        grey
      {% endif %}
    primary: Salon
    secondary: '{{ states("sensor.thermometer_living_room_temperature") }}°C'
    layout: horizontal
    tap_action:
      action: navigate
      navigation_path: /dashboard-maison/living
    badge_icon: |-
      {% if is_state('binary_sensor.open_sensor_living_door_contact', 'on') %}
              mdi:door-open
            {% else %}  
              mdi:door-closed
            {% endif %}
    badge_color: |-
      {% if is_state('binary_sensor.open_sensor_living_door_contact', 'on') %}
              red
            {% else %}  
              grey
            {% endif %}
  - type: custom:mushroom-chips-card
    chips:
      - type: template
        entity: select.heating_living_room_pilot_wire_mode
        icon: |-
          {% if is_state(entity, 'comfort') %} 
            mdi:fire
          {% elif is_state(entity, 'eco') %}
           mdi:moon-waning-crescent
          {% else %}
           mdi:heating-coil
          {% endif %}
        icon_color: |-
          {% if is_state(entity, 'comfort') %} 
            red
          {% elif is_state(entity, 'eco') %}
           blue
          {% else %}
           grey
          {% endif %}
        tap_action:
          action: more-info
      - type: template
        entity: cover.shutter_living_room
        tap_action:
          action: more-info
        icon: |-
          {% if is_state(entity, 'open') %} 
           mdi:window-shutter-open
          {% elif is_state(entity, 'closed') %} 
           mdi:window-shutter
          {% else %}
           mdi:window-shutter-alert
          {% endif %}
        icon_color: |-
          {% if is_state(entity, 'open') %} 
           blue
          {% elif is_state(entity, 'closed') %} 
           grey
          {% else %}
           orange
          {% endif %}
      - type: template
        entity: switch.switch_living_light
        icon: mdi:floor-lamp
        tap_action:
          action: toggle
        icon_color: |-
          {% if is_state(entity, 'on') %} 
           orange
          {% elif is_state(entity, 'off') %} 
           grey
          {% else %}
           grey
          {% endif %}
    alignment: end
    card_mod:
      style: |
        ha-card {
          padding-top: 0px;
          margin-top: -8px;
          padding-bottom: 8px;
          padding-left: 8px;
          padding-right: 8px;
        }
```

Bref, j’ai tout ce qui m’intéresse à un seul endroit et c’est parfait. Vraiment tout ? Bien sûr que non, j’ai d’autres appareils, et pour cela il suffit de cliquer sur la carte pour être redirigé sur la page de la pièce (encore une transition, je le fais exprès ou quoi ?)

# 📄 Page par pièce

Jusqu’à maintenant c’était assez stylé, on va faire une petite pause et passer sur une partie plutôt simple du dashboard

Voilà de quoi je veux parler

![Page par pièce](/videos/dashboard-ha-6.png)

## Entêtes

C’est plutôt sympa et ça permet de mettre en avant (mais pas trop non plus) certaines infos comme la température, la pression etc

```yaml
type: heading
# Le titre
heading: Bureau
heading_style: title
icon: mdi:desktop-classic
# Les infos à afficher
badges:
  - type: entity
    entity: sensor.thermometer_desktop_temperature
  - type: entity
    entity: sensor.thermometer_desktop_humidity
  - type: entity
    entity: sensor.thermometer_desktop_pressure
```

## Les groupe d’appareils

Voilà comment j’ai groupé mes appareils

- **Pièce** – les trucs importants (radiateurs, volets)
- **Éclairage** – les lights
- **Appareils** – si j’ai des prises connectés, des choses qui remontent une consommation ..
- **Sécurité** – ouvrants, détecteur fumée, O2
- **Multimédia** – apple tv, enceinte connectée
- **Caméra** – bah, les caméras

J’aime bien ce système car j’ai repris les mêmes entêtes / groupes d’appareils sur chaque pièce, ça me permet de facilement retrouver un appareil, et de facilement ajouter un nouvel appareil au dashboard lorsqu’en ai appairé un nouveau

# 📈 Monitoring Homelab / HA

On retourne sur quelque chose de stylé et un peu compliqué ?

Je vous présente mes cartes pour monitorer mon Homelab & Home Assistant !

![Monitoring Homelab](/videos/dashboard-ha-7.png)
![Monitoring HA](/videos/dashboard-ha-8.png)

Ces dashboards sont découpées en deux parties, les chips, et les cartes

## Chips

Pour ma première ligne de chips, ça ressemble à ça, ce n’est rien de plus que de simples chips

J’ai décidé d’afficher certaines informations que proxmox me remonte

```yaml
type: horizontal-stack
cards:
  - type: custom:mushroom-chips-card
    chips:
      - type: entity
        entity: binary_sensor.node_proxmox_status
        icon_color: green
        name: NURyzen 5 PRO
        content_info: state
      - type: entity
        entity: sensor.node_proxmox_last_boot
        icon_color: deep-purple
        icon: mdi:calendar-clock
      - type: entity
        entity: update.proxmox_ve_update
```

## Cartes

Okay, là ça devient sérieux

![Carte](/videos/dashboard-ha-9.png)

Il y a plusieurs paramètres pour cette carte

- L’icone
- La couleur
- Le titre de la carte
- Le sous-titre
- L’entité qu’on souhaite monitorer
  Une fois ces éléments en tête, voici le code

```yaml
# Installez Mushroom, Stack in Card, Card Mod, Mini graph card !

type: custom:stack-in-card
cards:
  - type: custom:mushroom-entity-card
    # L'entité qu'on souhaite monitorer
    entity: sensor.node_proxmox_memory_used_percentage
    # Le titre
    primary_info: state
    secondary_info: name
    # Le sous-titre
    name: Charge RAM (16 Gio)
    # L'icone
    icon: mdi:chip
    # La couleur
    icon_color: "#badc58"
    card_mod:
      style: |
        ha-card {
          z-index: 1;
          --ha-card-border-width: 0;
        }
  - type: custom:mini-graph-card
    entities:
      - entity: sensor.node_proxmox_memory_free
        # On reporte la couleur ici
        color: "#badc58"
    # Un peu de configuration si vous le souhaitez
    height: 100
    hours_to_show: 8
    points_per_hour: 20
    line_width: 1
    # Ça c'est tout joli
    animate: true
    show:
      name: false
      icon: false
      state: false
      legend: false
      fill: fade
    card_mod:
      style: |
        ha-card {
          position: absolute !important;
          height: 100%;
          width: 80%;
          right: 0px;
          bottom: 0px;
          --ha-card-border-width: 0;
        }
        ha-card:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, var(--card-background-color), transparent);
          --ha-card-border-width: 0;
        }
card_mod:
  style: |
    ha-card {
    --ha-card-border-width: 0;
     }
```

## Construction de la pile verticale

Le tout est géré dans une pile verticale

J’ai ici deux lignes de chips, et ensuite une ligne par carte à monitorer

![Pile verticale](/videos/dashboard-ha-10.png)

# 🫶 Auto Entities

Je viens d’aller faire un tour sur le github de card-mod, et beaucoup d’erreurs liées à la MàJ 3.5 https://github.com/thomasloven/lovelace-card-mod/issues

Si vous avez mis à jour, vous pouvez supprimer card-mod et le réinstaller en 3.4.3

——

J’utilise les auto entities pour monitorer rapidement mes batteries et la consommation de mes appareils.

C’est historique car désormais je monitore surtout ma consommation via le dashboard énergie, que j’ai d’ailleurs présenté dans une autre vidéo

<iframe width="620" height="349" src="https://www.youtube.com/embed/ax3IRIACARQ" title="⚡️ Suivre sa CONSOMMATION ÉLECTRIQUE sur HOME ASSISTANT ! (Lixee ZLinky TIC)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> C’est quoi auto entities ?

C’est un ensemble d’entities qui remonte dans une grille en suivant un filtre. Par exemple pour mes batteries, lorsque j’ai un nouvel appareil, il s’ajoute automatiquement dans ma liste

![Batteries](/videos/dashboard-ha-11.png)
![Consommation](/videos/dashboard-ha-12.png)

> Comment ça marche ?

Une fois auto-entities installé (voir la première partie), il est possible de créer une carte auto entities

![Rechercher dans les cartes](/videos/dashboard-ha-13.png)

Personnellement, je suis passé par une grille, pour pouvoir mettre un titre et le nombre de colonnes souhaité

![Configuration de la carte](/videos/dashboard-ha-14.png)

Auto-entities propose une interface graphique, super ! Voyons cela ensemble (le code complet est à la fin de ce paragraphe)

# Les filtres

![Les filtres](/videos/dashboard-ha-15.png)

Ici on met tous les filtres souhaités, dans mon cas :

- Je filtre l’entity ID sur `^sensor.*battery$`
  C’est du regex, ça signifie que toutes les entités qui respectent ce pattern seront prises en comptes, par exemple
  sensor.curtain_living_door_battery

- Je filtre sur le state et je demande qu’il soit inférieur à 100, pour ne pas afficher mes batteries pleines

# Le tri

![Les tris](/videos/dashboard-ha-16.png)

Ici je trie mes résultats via un tri numérique (en gros du plus petit au plus grand)

Vous avez ici l’option pour inverser ceci. Par exemple pour les consommations énergétiques, j’ai inversé pour afficher les plus grosses consommations en premier

# La carte

Ce sera plus simple via du code, je vous propose de passer sur l’éditeur pour cette partie. Vous pouvez aussi essayer via l’interface si vous le souhaitez

```yaml
type: custom:auto-entities
card:
	# Pensez à installer bar-card
  type: custom:bar-card
  title_position: inside
  height: 38
  positions:
    icon: inside
    indicator: inside
    name: inside
    value: inside
  show_icon: true
  align: split
  columns: "1"
  max: 100
  unit_of_measurement: "%"
  # Ici on définit l'icône et la couleur de la barre, en fonction du % restant
  severity:
    - color: "#d11e1e"
      icon: mdi:battery-10
      from: 0
      to: 5
    - color: "#cf2d11"
      icon: mdi:battery-10
      from: 6
      to: 10
    - color: "#cc3900"
      icon: mdi:battery-20
      from: 11
      to: 15
    - color: "#c84400"
      icon: mdi:battery-20
      from: 16
      to: 20
    - color: "#c44d00"
      icon: mdi:battery-30
      from: 21
      to: 25
    - color: "#bf5600"
      icon: mdi:battery-30
      from: 26
      to: 30
    - color: "#b95f00"
      icon: mdi:battery-40
      from: 31
      to: 35
    - color: "#b36600"
      icon: mdi:battery-40
      from: 36
      to: 40
    - color: "#ac6e00"
      icon: mdi:battery-50
      from: 41
      to: 45
    - color: "#a57500"
      icon: mdi:battery-50
      from: 46
      to: 50
    - color: "#9d7b00"
      icon: mdi:battery-60
      from: 51
      to: 55
    - color: "#948100"
      icon: mdi:battery-60
      from: 56
      to: 60
    - color: "#8b8700"
      icon: mdi:battery-70
      from: 61
      to: 65
    - color: "#818d00"
      icon: mdi:battery-70
      from: 66
      to: 70
    - color: "#769200"
      icon: mdi:battery-80
      from: 71
      to: 75
    - color: "#6a9700"
      icon: mdi:battery-80
      from: 76
      to: 80
    - color: "#5d9c00"
      icon: mdi:battery-90
      from: 81
      to: 85
    - color: "#4da100"
      icon: mdi:battery-90
      from: 86
      to: 90
    - color: "#39a500"
      icon: mdi:battery-check
      from: 91
      to: 95
    - color: "#15a911"
      icon: mdi:battery-check
      from: 96
      to: 100
  # Pensez à installer card_mod
  card_mod:
    style: |
      bar-card-currentbar, bar-card-current, bar-card-backgroundbar {
          height: 5px !important;
          margin-top: 30px;
      }

      bar-card-iconbar {
          margin-bottom: 10px;
      }

filter:
	# Vous pouvez exclure ici des entities
  exclude:
    - entity_id: sensor.iphone_daymeric_watch_battery
  # Cette partie a été gérée via l'interface
  include:
    - entity_id: ^sensor.*_battery$
      state: <100
# Cette partie a été gérée via l'interface
sort:
  numeric: true
  reverse: false
  ip: false
  ignore_case: false
  method: state
show_empty: false
```

## Pour la consommation ?

Comme je suis gentil, voici le code la consommation

```yaml
type: custom:auto-entities
card:
  type: custom:bar-card
  title_position: inside
  height: 38
  positions:
    icon: inside
    indicator: inside
    name: inside
    value: inside
  show_icon: true
  align: split
  columns: "1"
  unit_of_measurement: W
  severity:
    - color: gray
      from: 0
      to: 5
    - color: pink
      from: 5
      to: 49
    - color: yellow
      from: 50
      to: 200
  card_mod:
    style: |
      bar-card-currentbar, bar-card-current, bar-card-backgroundbar {
          height: 5px !important;
          margin-top: 30px;
      }
      bar-card-iconbar {
          margin-bottom: 10px;
      }
filter:
  exclude:
    - entity_id: sensor.switch_desktop_watch_charger_power
  include:
    - entity_id: ^sensor.*power$
sort:
  numeric: true
  reverse: true
  ip: false
  ignore_case: false
  method: state
show_empty: false
```

# 🫧 Bubble Card

Vous n’aimez pas les champignons ?

Pas de soucis, il existe un autre dépôt assez stylé pour faire vos cartes, il s’agit de **Bubble Card** ! En voilà un exemple

![Bubble card](/videos/dashboard-ha-17.png)

Je suis encore au tout début, mais je voulais vous partager un comportement que je trouve génial, les **pop-ups** !

Concrètement, ça c’est mon écran avec les pièces

![Pièces](/videos/dashboard-ha-18.png)

Et quand je clique sur une pièce, ça s’affiche dans une pop-up !

![Popup carte cuisine](/videos/dashboard-ha-19.png)

Pour gérer cela, il faut

- créer une pile verticale
- le premier élément est la pop-up
- les autres éléments sont les informations de la carte

![Configuration carte](/videos/dashboard-ha-20.png)

Ensuite il faut associer le #kitchen sur le bouton qui doit lancer la pop-up

_Vous n’êtes pas obligé d’utiliser une carte Bubble pour cela, mais je préfère pour garder de la cohérence_

![Configuration carte](/videos/dashboard-ha-21.png)

# 👋 Conclusion

Les dashboards, c’est bien pratique, et si c’est beau, c’est mieux !

Copier/coller des dashboards, pourquoi pas mais gardez en tête comment cela fonctionne derrière pour pouvoir facilement les modifier et les adapter à vos situations.
