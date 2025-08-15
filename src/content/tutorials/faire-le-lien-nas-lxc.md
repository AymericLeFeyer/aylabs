---
title: "Faire le lien entre son NAS et un LXC Proxmox"
description: "Ce tutoriel vous expliquera comment relier un dossier partagé de votre NAS et le rendre accessible sur un container Proxmox."
pubDate: "Jan 28 2025"
---

Ce tutoriel vous expliquera comment relier un dossier partagé de votre NAS et le rendre accessible sur un container Proxmox.

Très utile par exemple pour relier son dossier multimédia, à un serveur Plex sous Proxmox

### Prérequis

- Avoir un NAS
- Le LXC est privilégié
- Les deux machines sont connectées à Internet

### 1 – Création de l’utilisateur Proxmox

Sur votre NAS, créez un utilisateur Proxmox.  
Sur DSM, ça se passe dans **Panneau de configuration** > **Utilisateur et groupe**

![](/tutorials-assets/nas-lxc-1.png)

### 2 – Donnez les droits d’accès au volume souhaité

Sur DSM, ça se passe dans

- Panneau de configuration
- Dossier partagé
- Clic droit sur un dossier
- Permissions
- Cocher **Lecture / Écriture** sur votre utilisateur proxmox

![](/tutorials-assets/nas-lxc-2.png)

### 3 – LXC Privilégié

Assurez-vous que le LXC soit privilégié

![](/tutorials-assets/nas-lxc-3.png)

Non privilégié : Non -> **C’est privilégié** (vive les doubles négations)

### 4 – Création du fichier d’authentification

Parce qu’on est pas des bourrins, on va créer un fichier pour y stocker le nom d’utilisateur et le mot de passe de l’utilisateur Proxmox créé **à l’étape 1**

```yaml
nano /home/.smbcredentials
```

Dans le fichier qui viens de s’ouvrir, ajouter-y ces lignes

```yaml
username=proxmox
password=<votre mot de passe>
domain=WORKGROUP
```

### 5 – Création du dossier de montage

Préparez le dossier pour y accueillir vos données

```yaml
mkdir /mnt/nas
```

### 6 – Création du point de montage

Modifiez le fichier fstab avec une nouvelle entrée

```yaml
nano /etc/fstab
```

Ajoutez-y cette ligne

```yaml
//<ip du nas>/<dossier partagé>/<sous dossiers> /mnt/nas/ cifs credentials=/home/.smbcredentials 0 0
```

Chez moi, ça ressemble à `//192.168.1.71/Multimedia/plex /mnt/nas/ cifs credentials=/home/.smbcredentials 0 0`

### 7 – Installation de cifs-utils

Si le LXC est tout frais, il est probable que vous ayez besoin d’installer cifs-utils

```yaml
apt install cifs-utils
```

### 8 – On teste ?

Au reboot, le point de montage est censé se faire tout seul, mais vous pouvez faire cette commande pour demander le montage immédiat

```yaml
mount -a
```

Si on vous demande de redémarrer le deamon, faîtes la commande indiquée.

Désormais, allez dans le dossier /mnt/nas et lister les fichiers, votre NAS est désormais accessible sur votre LXC !

```yaml
cd /mnt/nas
ls
```

### 9 – Enjoy !
