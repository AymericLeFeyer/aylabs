---
title: "La place du NAS dans mon HOMELAB (Synology DS923+)"
description: "Quand on commence à héberger chez soi différents services, quelque chose vient vite à l’esprit : avoir un NAS."
pubDate: "Jan 1 2025"
code: "UWF84xQW-4U"
duration: "15:42"
tags: ["Homelab"]
---

Quand on commence à héberger chez soi différents services, quelque chose vient vite à l’esprit : avoir un NAS.

Pouvoir stocker des données de manière sécurisée, chez soi et de partout dans le monde. C’est à ça que sert un NAS.

Il y a quelques jours j’ai reçu mon premier NAS, et dans cette vidéo je vous raconte à quoi cela va me servir, et pourquoi c’était indispensable selon moi.

## 💾 Un NAS ?

Déjà NAS ça veux dire **Network Attached Storage**, en bon français : Serveur de stockage en réseau.

Voyez ça comme un disque dur central, disposé chez vous et accessible de partout.

Un peu comme un Google Drive, mais où les données sont dans votre salon.

Ok, ça fait rêver, mais il y a quand même plusieurs choses à prendre en compte et à surveiller :

- la taille de vos volumes
- la redondance de vos données
- l’état de santé de vos disques

Je vais essayer de vous expliquer un maximum de choses aujourd’hui, du moins ce que j’en ai compris car je débute dans le monde merveilleux des NAS

## 🏠 Un NAS fait maison

Un NAS, ce n’est rien de plus qu’un ordinateur avec des disques dedans. Vous pouvez créer votre propre NAS avec TrueNAS Scale par exemple, c’est ce que je vous avait présenté dans ma vidéo sur le homelab

En fait TrueNAS Scale c’est un système d’exploitation à mettre sur un ordinateur, dans mon cas c’était une machine virtuelle sur mon ordinateur central.

A cet ordinateur j’avais branché un petit disque dur externe de 256Go pour tester la puissance du stockage en réseau. Et ça marchait super bien ! Jusqu’au jour ou mon disque dur externe vieux de 15 ans a rendu l’âme. Et là plus rien ne marchait.

Je m’y attendais, c’était pour faire des tests

## 🔑 Un NAS clé en main

Chez moi, je n’ai pas la place pour me créer un NAS personnalisé avec des racks, et j’avais envie d’essayer une solution clé en main, mais qui offre quand même pas mal de possibilités, c’est pourquoi je me suis tourné vers Synology.

Synology, c’est un des piliers dans le domaine du stockage en réseau.

Personnellement je me suis tourné vers le modèle DS923+, un NAS 2 coeurs avec 4 go de ram extensible.

🛒 [Acheter le NAS](https://go.aylabs.fr/amazon/synology-ds923plus)  
🎥 [Voir la vidéo](https://youtu.be/UWF84xQW-4U)

Ce modèle a 4 baies, il a en fait 4 emplacements de disques durs HDD. Ce DS923+ coute environ 600€ selon les sites et les disponibilités.

Mais attention, 600€ tout nu, sans les disques.

Dans mon cas, j’ai pris un pack avec 4 disques de 4 To, ce me donne donc un espace théorique de 16 To, mais ça on en reviendra tout à l’heure.

L’installation des disques se fait très simplement. Suffit de visser les disques et de les insérer dans la machine. Et… voilà

Pour faire le lien avec TrueNAS Scale, dans un Synology on retrouve DiskStation Manager, ou DSM pour les intimes.

C’est le système qui fait tourner le NAS. Je vous met à l’écran certaines images de ce système très simple à prendre en main.

DSM vous indique l’état de santé de vos disques, ainsi que beaucoup de métriques de monitoring. Et moi j’adore ça, d’ailleurs pour l’occasion j’ai refait (encore) mon dashboard, si ça vous intéresse, voici le code

## Le nouveau dashboard Home Assistant

```yaml
title: Home
sections:
  - type: grid
    cards:
      - type: heading
        icon: mdi:server
        heading: Homelab
        heading_style: title
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: update.proxmox_ve_update
            icon: phu:proxmox
            icon_color: orange
            primary: Proxmox
            secondary: Homelab's heart
            layout: horizontal
            tap_action:
              action: url
              url_path: "https://192.168.1.80:8006/#v1:0:18:4:::::::"
            badge_icon: ""
            badge_color: ""
            hold_action:
              action: none
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.node_proxmox_disk_used_percentage
              - type: entity
                entity: sensor.node_proxmox_containers_running
                icon: mdi:cube-outline
              - type: entity
                entity: sensor.node_proxmox_virtual_machines_running
                icon: mdi:laptop
              - type: entity
                entity: binary_sensor.disk_proxmox_512gb_ssd_dev_nvme0n1_health
              - type: entity
                entity: sensor.disk_proxmox_512gb_ssd_dev_nvme0n1_power_on_hours
              - type: entity
                entity: sensor.node_proxmox_last_boot
              - type: entity
                entity: update.proxmox_ve_update
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.switch_living_homelab_power
                icon: mdi:lightning-bolt
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.disk_proxmox_512gb_ssd_dev_nvme0n1_temperature
                icon: mdi:thermometer
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.node_proxmox_cpu_used
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.node_proxmox_memory_used_percentage
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: sensor.ayplex
            icon: phu:nas-v2
            icon_color: blue
            primary: NAS Synology
            secondary: Homelab's memory
            layout: horizontal
            tap_action:
              action: url
              url_path: http://192.168.1.71:5000
            badge_icon: ""
            badge_color: ""
            hold_action:
              action: url
              url_path: xxx
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.aynas_volume_1_volume_utilise
              - type: entity
                entity: sensor.aynas_volume_2_volume_utilise
              - type: entity
                entity: sensor.aynas_drive_1_etat
                name: "1"
                content_info: state
              - type: entity
                entity: sensor.aynas_drive_2_etat
                name: "2"
                content_info: state
              - type: entity
                entity: sensor.aynas_drive_3_etat
                name: "3"
                content_info: state
              - type: entity
                entity: sensor.aynas_debit_de_telechargement
              - type: entity
                entity: sensor.aynas_debit_de_transfert
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.aynas_volume_1_temperature_moyenne_du_disque
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.aynas_utilisation_du_processeur_totale
                icon: mdi:cpu-64-bit
              - type: entity
                entity: sensor.aynas_utilisation_de_la_memoire_reelle
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: update.pi_hole_core_update_available
            icon: mdi:pi-hole
            icon_color: red
            primary: Pi-Hole
            secondary: Homelab's guardian
            layout: horizontal
            tap_action:
              action: url
              url_path: http://192.168.1.161/admin/login.php
            badge_icon: ""
            badge_color: ""
            hold_action:
              action: url
              url_path: https://app.plex.tv/desktop/#!/
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: switch.pi_hole
              - type: entity
                entity: sensor.pi_hole_publicites_bloquees_aujourdhui
              - type: entity
                entity: sensor.pi_hole_domaines_bloques
              - type: entity
                entity: update.pi_hole_core_update_available
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                entity: sensor.lxc_pi_hole_102_cpu_used
              - type: entity
                entity: sensor.lxc_pi_hole_102_memory_used_percentage
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: sensor.eaton_charge
            icon: phu:nut
            icon_color: amber
            primary: Eaton
            secondary: Homelab's energy
            layout: horizontal
            badge_icon: ""
            badge_color: ""
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.eaton_etat
              - type: entity
                entity: sensor.eaton_autonomie_de_la_batterie
              - type: entity
                entity: sensor.eaton_charge_de_la_batterie
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top:8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: update.portainer_update
            icon: phu:portainer
            icon_color: blue
            primary: Portainer
            secondary: All of simple docker images
            layout: horizontal
            tap_action:
              action: url
              url_path: https://192.168.1.35:9443/#!/init/admin
            badge_icon: ""
            badge_color: ""
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.portainer_endpoints_local
                icon: mdi:sail-boat
              - type: entity
                entity: update.portainer_update
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_docker_103_cpu_used
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_docker_103_memory_used_percentage
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: sensor.ayplex
            icon: mdi:vpn
            icon_color: orange
            primary: Open-VPN
            secondary: For beeing at home from anywhere
            layout: horizontal
            badge_icon: ""
            badge_color: ""
          - type: custom:mushroom-chips-card
            chips: []
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_open_vpn_101_cpu_used
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_open_vpn_101_memory_used_percentage
      - type: heading
        icon: mdi:video
        heading: Multimedia
        heading_style: title
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: sensor.ayplex
            icon: mdi:plex
            icon_color: orange
            primary: Plex
            secondary: For watching movies & more
            layout: horizontal
            tap_action:
              action: url
              url_path: http://192.168.1.76:32400/web
            badge_icon: ""
            badge_color: ""
            hold_action:
              action: url
              url_path: https://app.plex.tv/desktop/#!/
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.ayplex
              - type: entity
                entity: update.plex_media_server_ayplex
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_plex_112_cpu_used
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_plex_112_memory_used_percentage
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: sensor.ayplex
            icon: phu:qbittorrent
            icon_color: blue
            primary: QBittorrent
            secondary: Adding some sources to Plex
            layout: horizontal
            tap_action:
              action: url
              url_path: http://192.168.1.26:8090/
            badge_icon: ""
            badge_color: ""
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.qbittorrent_statut
              - type: entity
                entity: sensor.qbittorrent_torrents_actifs
                icon: mdi:movie
              - type: entity
                entity: sensor.qbittorrent_vitesse_de_telechargement
              - type: entity
                entity: sensor.qbittorrent_vitesse_de_telechargement_montant
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_qbittorrent_108_cpu_used
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_qbittorrent_108_memory_used_percentage
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: update.playstation_network_update
            icon: mdi:sony-playstation
            icon_color: blue
            primary: PS5
            secondary: Video games
            layout: horizontal
            badge_icon: ""
            badge_color: ""
            tap_action:
              action: navigate
              navigation_path: /lovelace/playstation
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: media_player.aypics_ps5_console
              - type: entity
                entity: sensor.aypics_status
              - type: entity
                entity: sensor.aypics_trophy_level
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: sensor.aymeric_abonnes
            icon: mdi:youtube
            icon_color: red
            primary: YouTube
            secondary: AyLabs
            layout: horizontal
            tap_action:
              action: url
              url_path: https://go.aylabs.fr/youtube
            badge_icon: ""
            badge_color: ""
            hold_action:
              action: url
              url_path: https://app.plex.tv/desktop/#!/
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.aymeric_abonnes
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
      - type: heading
        icon: mdi:home
        heading: Home automation
        heading_style: title
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: update.home_assistant_core_update
            icon: mdi:home-assistant
            icon_color: blue
            primary: Home Assistant
            secondary: Home's brain
            layout: horizontal
            tap_action:
              action: url
              url_path: http://192.168.1.122:8123/dashboard-homelab/0?edit=1
            badge_icon: ""
            badge_color: ""
            hold_action:
              action: url
              url_path: xxx
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: update.home_assistant_core_update
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.monitoring_utilisation_du_processeur
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.monitoring_utilisation_de_la_memoire
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: binary_sensor.zigbee2mqtt_bridge_connection_state_2
            icon: phu:zigbee2mqtt
            icon_color: amber
            primary: Zigbee2MQTT
            secondary: Zigbee HQ
            layout: horizontal
            tap_action:
              action: url
              url_path: http://192.168.1.131:8081/#/
            badge_icon: ""
            badge_color: ""
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: binary_sensor.zigbee2mqtt_bridge_connection_state_2
              - type: entity
                entity: switch.zigbee2mqtt_bridge_permit_join_2
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_zigbee2mqtt_110_cpu_used
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_zigbee2mqtt_110_memory_used_percentage
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: sensor.portainer_local_mealie
            icon: phu:mealie
            icon_color: orange
            primary: Mealie
            secondary: Recipe management
            layout: horizontal
            tap_action:
              action: url
              url_path: http://192.168.1.35:9925/g/home
            badge_icon: ""
            badge_color: ""
          - type: custom:mushroom-chips-card
            chips:
              - type: entity
                entity: sensor.mealie_recettes
              - type: entity
                entity: sensor.portainer_local_mealie_2
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
      - type: custom:vertical-stack-in-card
        cards:
          - type: custom:mushroom-template-card
            entity: update.mosquitto_broker_update
            icon: phu:mosquitto
            icon_color: purple
            primary: MQTT
            secondary: Message broker
            layout: horizontal
            badge_icon: ""
            badge_color: ""
          - type: custom:mushroom-chips-card
            chips: []
            alignment: end
            card_mod:
              style: |
                ha-card {
                  padding-top: 0px;
                  margin-top: 8px;
                  padding-bottom: 8px;
                  padding-left: 8px;
                  padding-right: 8px;
                }
          - type: heading
            icon: ""
            heading_style: title
            badges:
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_mqtt_109_cpu_used
                icon: mdi:cpu-64-bit
              - type: entity
                show_state: true
                show_icon: true
                entity: sensor.lxc_mqtt_109_memory_used_percentage
    column_span: 4
type: sections
max_columns: 4
cards: []
theme: waves
icon: mdi:server
```

## ⚡️ Redondance des données

On va attaquer une partie très importante, la redondance des données. Tout à l’heure, je vous disait que mon mini disque dur avait rendu l’âme.

Et en fait c’est pas si rare que ça. Un disque dur c’est assez fragile. Une coupure de courant mal maîtrisée, et le disque en prends un sacré coup. Si vous déplacez le NAS en foncitonnement, pareil.

Bref c’est fragile.

J’ai sans hésité branché le NAS à mon onduleur para..foudré ?, d’ailleurs je vous le présente dans cette vidéo https://youtu.be/CATvxyRoQS8

Mais il existe des systèmes de sécurité supplémentaires, on appelle ça les RAID (Redundant Array of Independant Disks), en gros une gestion de redondance pour des disques indépendants, en gros c’est pour gérer le cas où si votre disque 1 meurt, le disque 2 prends le relai, par exemple. Cela permet aussi dans certains cas d’améliorer la sécurité, ou les performances.

Il existe plein de types de RAID, mais pour le bien de cet article, je vais vous en expliquer 3

### BASIC / JBOD

Pour commencer, on a le BASIC, pour cela vous avez besoin d’un seul disque, et il tolère 0 panne ……..

Donc si vous avez compris, celui là ne sert à rien, le BASIC c’est ce qu’on a tous sur nos disques durs, aucune redondance

Si vous ne souhaitez pas de redondance, je vous conseille le JBOD, c’est comme le BASIC sauf que vous pouvez combiner plusieurs disques dans un seul volume, donc c’est plutôt pratique pour étendre la capacité d’un volume de manière invisible, juste en ajoutant un deuxième disque

Dans cet exemple, si vous avez 3 disques de 4 To en BASIC ou JBOD, vous aurez un volume de 12 To. Mais si un disque tombe en panne, les données de ce disque sont perdues

### RAID 1

Le RAID 1, vous pouvez choisir le nombre de disque, mais c’est au moins 2 disques. Ce qu’il se passe avec le RAID 1, c’est que toutes vos données sont en mirroir. Si vous attribuez 3 disques, vos 3 disques ont les mêmes informations, et donc vous pouvez en perdre 2 tragiquement, aucune donnée ne sera perdue.

Attention cependant, il faut que tous les disques aient la même taille, sinon ce sera le plus disque qui définira la taille du RAID.

De plus, le RAID1 permet de bonnes performances en lecture, puisque au moins 2 disques seront disponibles pour vous fournir la donnée. Par contre l’écriture sera normale

Le RAID1 c’est selon moi la solution idéale pour les particuliers.

Dans cet exemple, si vous avez 3 disques de 4 To en RAID1, vous aurez un volume de 4 To, mais vous pourrez tolérer 2 disques cassés

### RAID 5

Pour donner un autre exemple, Le RAID 5 a besoin de 3 disques, et tolère 1 panne. Cela fonctionne par morceaux de volumes dans chaque disque. Chaque morceau peut être recalculé grâce aux blocs de parités dans les autres disques. je ne vais pas trop rentrer dans les détails car je n’ai pas encore expérimenté ce type de RAID, mais avec ce type de Raid, si vous avez 3 disques de 4 To, vous aurez un volume de 8 To, avec une tolérance d’ 1 seul disque en panne

Il existe d’autres types de RAIDS, 6, 10 , F1. Je vous laisse vous renseigner si cela vous intéresse

Vous avez compris, vous pouvez choisir votre type de RAID selon votre utilisation.

### Mon utilisation

Dans mon cas, j’ai 4 disques

Les deux premiers sont en RAID1, ils contiennent toutes mes données importantes, comme mes photos, mes documents, mes backups proxmox et home assistant.. Tout plein de trucs que je ne veux pas perdre, et tout ça commence à peser trop lourd pour un Google Drive, sans devoir payer un abonnement excessif

Mon disque numéro 3 est en JBOD, dessus j’ai mis mes différents films et séries. Si le disque tombe en panne, tant pis, mon Plex sera indisponible, ce n’est pas crucial pour moi d’avoir une sauvegarde sur ce disque là

Mon disque numéro 4 pour l’instant ne sert pas, je prévois de l’utiliser pour étendre mon volume multimédia si jamais cela devient nécessaire. En attendant je l’ai enlevé du NAS afin qu’il ne s’use pas pour rien.

Voyons si vous avez bien suivi, combien de To sont disponibles avec ma configurations ? En sachant que les 4 disques ont donc une taille de 4 To ?

Bon c’est assez simple à calculer, les deux premiers disques sont en mirroir, donc le volume 1 fait 4 To

Le disque 3 est brut, donc 4 To

Et le disque 4 n’est pas utilisé, donc le total est de 8 To, mais extensible rapidement à 12 To si nécessaire.

**Total = 8 To utilisés, extensibles à 12 To**.

## ☀️ 3-2-1 soleil !

Il reste un cas que je n’ai pas encore géré, une faille de sécurité énorme, que personne ne souhaite avoir.

Un incendie ou un vol du NAS. En effet dans mon cas j’ai 2 disques en miroir, mais ces 2 disques sont à côtés. Donc si ça brule, j’ai tout perdu, peu importe le nombre de disques dans le RAID.

Pour cela il est recommandé d’appliquer la règle du 3-2-1

Avoir 3 copies des données

Sur 2 supports différents

Avec au moins 1 copie hors site

Concrètement dans mon cas je devrait idéalement placer 1 disque chez un ami, afin de faire toujours du RAID1, mais avec 3 disques. Les trois disques seront en miroir, deux disques seront à la maison pour un accès rapide, et le troisième chez un ami histoire de sécuriser les choses en cas de gros problèmes.

J’ai vu que Synology proposait un service de cloud qui permettrait de remplacer cet “ami”, mais je trouve ça dommage, l’idée c’est quand même de garder les données chez soi.

D’ailleurs, ça m’intéresse d’avoir l’avis des plus expérimentés en commentaire, vous respectez cette règle des 3-2-1 ?

## ⛔️ L’accès aux données

Passons maintenant à un autre sujet très important, l’accès aux données. Parce que oui, c’est un système de stockage en réseau, mais réseau comment ?

Comme pour les raids, il existe plusieurs types d’accès aux données. Les trois plus connues selon moi est le SMB, NFS et FTP

### SMB

Le SMB, vous pouvez l’utiliser depuis votre explorateur de fichier, et grâce à votre nom d’utilisateur et votre mot de passe, vous avez accès aux données. C’est aussi simple que ça

### NFS

Le NFS, quant à lui est utilisé grâce aux adresses IP. Vous pouvez autoriser certaines adresses IP à accéder à votre serveur. Je pense que c’est une des solutions les plus sécurisées.

Voici un exemple concret. Imaginez que le NAS soit sur l’adresse ip 192.168.10.1, et que mon Home Assistant soit sue l’adresse ip 192.168.10.2.

J’ai pu configuré mon volume pour AUTORISER l’ip de Home Assistant à écrire sur le volume. Dans mon cas c’est utilisé pour stocker les sauvegardes. Personne d’autre que Home Assistant ne peux donc écrire dans ce dossier, c’est exactement ce que je souhaitais

J’ai la même chose pour les backups proxmox.

D’ailleurs Si vous le souhaitez, je peux faire une vidéo sur le sujet si ça vous intéresse

### FTP

Le FTP vous l’avez sûrement rencontré pour upload des fichiers sur un serveur web, via FileZilla par exemple. C’est aussi très utilisé, mais pour moi ça ne vaux pas la simplicité du SMB

## 👨‍💻 Mon Homelab a évolué

![Schéma du Homelab](/videos/nas-2.png)

- Proxmox stocke ses backups dans le NAS
- Home Assistant stocke ses backups dans le NAS
- QBittorrent viens ajouter de nouveaux médias dans le NAS
- Plex lit les médias dans le NAS
  Bien sûr, j’utilise aussi le NAS à des fins personnelles, pour stocker mes documents et mes photos. Mais ça, aucun rapport avec le homelab 😀

## ➡️ Et maintenant ?

’ai encore beaucoup de sujets autour du NAS, comme la partie Synology Drive et Synology Photos, les histoires de backups.

Si le domaine vous intéresse, n’hésitez pas à manifester votre envie avec des pouces et des commentaires.

Le discord communautaire (https://go.aylabs.fr/discord) est toujours disponible pour discuter de tout ce qui touche à ce qu’on fait sur la chaîne. Un lien affilié vers le NAS est disponible en description si cela vous intéresse, cela permet de soutenir la chaîne de manière transparente pour vous.

En attendant la prochaine vidéo, je vous souhaite encore à tous une très bonne année, et à la prochaine, salut !

## Ressources utilisées

- [Disk icons](https://www.flaticon.com/free-icons/disk) by Payungkead
- [Folder icons](https://www.flaticon.com/free-icons/folder) by Freepik
- [Gallery icons](https://www.flaticon.com/free-icons/gallery) by Freepik
- [Backup icons](https://www.flaticon.com/free-icons/backup) by Smashicons
- [Movie icons](https://www.flaticon.com/free-icons/movie) by iconixar
- [Sport team icons](https://www.flaticon.com/free-icons/sport-team) by Freepik
