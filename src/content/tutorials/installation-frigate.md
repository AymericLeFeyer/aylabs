---
title: "Installation de Frigate"
description: "Ce tutoriel vous expliquera comment installer Frigate sur un container Proxmox (ou Docker)"
pubDate: "Aug 16 2025"
---

Ce tutoriel vous expliquera comment installation Frigate sur un Proxmox, ou même sur Docker

[Voir en vidéo](https://www.youtube.com/watch?v=g-k3y-DkPC0?t=444)

### Prérequis

- Avoir un Proxmox ou un Portainer dédié

### 1 – Installation Docker et Portainer

- La méthode la plus simple est d'ouvrir le shell de votre noeud et de lancer ce script ([source](https://community-scripts.github.io/ProxmoxVE/scripts?id=docker-vm))
```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/vm/docker-vm.sh)"
```
- Passez en mode "avancé"

![Mode avancé](/tutorials-assets/install-frigate-1.png)
- Passez en mode Privilégié afin de pouvoir y connecter ensuite votre NAS
![Mode avancé](/tutorials-assets/install-frigate-2.png)
- Avancez jusqu'au bout en sélectionnant la RAM et les cores à mettre, mais vous pouvez toujours le renseigner plus tard si besoin
- Mettez au moins 8Go de stockage 
- Le script va demander à installer docker compose et portainer, acceptez

### 2 – Installation de Frigate

- Rendez-vous sur `https://<ip-portainer>:9443` 
- Définissez un mot de passe
- Cliquez sur Get Started
- Environments > Local
- Stacks
- Add Stack
- Partez de cette base
```
services:
  frigate:
    container_name: frigate
    privileged: true 
    restart: unless-stopped
    stop_grace_period: 30s 
    image: ghcr.io/blakeblackshear/frigate:stable
    shm_size: "512mb"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /frigate/config:/config
      - /mnt/nas:/media/frigate
      - type: tmpfs 
        target: /tmp/cache
        tmpfs:
          size: 1000000000
    ports:
      - "8971:8971"
      - "5000:5000" 
      - "8554:8554" 
      - "8555:8555/tcp" 
      - "8555:8555/udp" 
    environment:
      FRIGATE_RTSP_PASSWORD: "xxx"
```
- Si vous n'avez pas de NAS, remplacez `/mnt/nas:/media/frigate` par `/frigate:/media/frigate`
- Vous pouvez choisir un mot de passe Frigate RTSP, mais on ne l'abordera pas dans le tuto
- Cliquez sur Deploy
- Si vous avez un NAS, pouvez suivre ce [tutoriel](/tutoriel/faire-le-lien-nas-lxc) pour créer le point de montage entre votre NAS et le LXC

### 3 – Configurer Frigate

- Accédez à `http://<ip-portainer>:5000`
- Cliquez sur l'engrenage en bas à gauche > Configurations editor
- Vous pouvez partir de cette base
```
mqtt:
  host: 192.168.x.x
  user: x
  password: x

record:
  enabled: true
  retain:
    days: 7
    mode: motion
  alerts:
    retain:
      days: 30
  detections:
    retain:
      days: 30

snapshots:
  enabled: true
  retain:
    default: 30

cameras:
  camera_1:
    enabled: true
    ffmpeg:
      inputs:
        - path: 
            rtsp://admin:xxx@192.168.x.x:554/live
          roles:
            - detect
            - record
    detect:
      enabled: true
      width: 1280
      height: 720
    objects:
      track:
        - person
```
- Remplacez le serveur MQTT par votre vrai serveur, cela sera utile pour connecter ensuite à Home Assistant. Si vous n'avez pas besoin, mettez ceci
```
mqtt:
    enabled: False
```
- Renseignez votre flux RTSP (lisez la documentation de vos caméras)
- Ajoutez autant de caméras que nécessaire
- Validez, avec Save & Restart

### 4 – Enjoy !
