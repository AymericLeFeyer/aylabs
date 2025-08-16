---
title: "Installation de Proxmox"
description: "Ce tutoriel vous expliquera comment installer Proxmox sur un ordinateur."
pubDate: "Aug 16 2025"
---

Ce tutoriel vous expliquera comment créer une clé bootable Proxmox, et comment l'installer sur un ordinateur dédié.

[Voir en vidéo](https://www.youtube.com/watch?v=g-k3y-DkPC0?t=305)

### Prérequis

- Avoir un PC inutilisé (ou neuf)
- Avoir une clé USB

### 1 – Création de la clé USB bootable

- [Récupérer l'ISO de Proxmox](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso)
- Installer [Rufus](https://rufus.ie/fr/) (Windows) ou [Balena Etcher](https://etcher.balena.io/) (Mac / Linux)
- Brancher votre clé USB dans l'ordinateur
- L'interface dépend du logiciel, mais en gros vous sélectionnez l'ISO d'une part, la clé USB d'autre part, et vous cliquez sur "Flash"

![Flash de la clé](/tutorials-assets/install-proxmox-1.png)


### 2 – Démarrer sur la clé

- Branchez la clé sur l'ordinateur
- Trouvez la touche qui permet de changer le boot (chez moi, c'était F11)
![Boot Menu](/tutorials-assets/install-proxmox-2.png)


Cette étape diffère selon les ordinateurs, parfois il faut rentrer dans le BIOS, activer le boot par USB, et redémarrer l'opération

### 3 – Installer Proxmox

- Choisissez l'option graphique
![Proxmox install graphical menu](/tutorials-assets/install-proxmox-3.png)

- Acceptez les conditions
- Choisissez le disque à écraser
- Définissez un mot de passe
- Définissez le hostname, en général je met le nom du PC.local, en gros `minix.local` par xemple
- Laissez les IP, Gateway et DNS par défaut si vous n'avez pas de configuration réseau spécifique
- Retenez d'ailleurs l'IP renseignée
- Validez et attendez
- L'ordinateur va redémarrer, vous pouvez enlever la clé USB


### 4 – Accès à Proxmox

- Direction maintenant un autre ordianteur connecté au réseau, et dirigez vous vers `https://<ip>:8006` 
- Cliquez sur votre noeud, et dans Mises à jour > Dépôts
- Ajoutez le dépôt no-subscription
- Désactivez le dépôt entreprise
![Désactivez le dépot entreprise](/tutorials-assets/install-proxmox-4.png)

### 5 – Enjoy !
