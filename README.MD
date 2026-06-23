# Projet d'étude

Ce projet regroupe trois environnements distincts :

- **Application mobile** : React Native (frontend mobile)
- **Application web** : React.js (frontend web)
- **Backend** : Node.js (API REST)

L'ensemble est assemblé avec **Docker**, à l'exception de l'application mobile qui reste exécutée localement.

---

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) version 22.20 (LTS)
- [Docker](https://www.docker.com/) et Docker Compose
- [Android Studio](https://developer.android.com/studio) pour l’émulateur mobile
<!-- - [Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)  
  > Pensez à modifier la variable d’environnement système `Path` si une autre version est déjà installée.  
  > Par défaut, le chemin de la version 17 est : `C:/Program Files/Java/jdk-17/bin`.
- Variable d’environnement `ANDROID_HOME` à définir  
  > La valeur se trouve dans Android Studio : **Tools > SDK Manager > Android SDK Location**
- [Android SDK] version 35 (Android 15.0 "VanillaIceCream")
  >  Cette version n'est pas a installer. Elle est à indiquer au meme emplacement que la valeur d'`ANDROID_HOME`. -->

---

## Lancement du projet

### Démarrer les services web et backend avec Docker

À la racine du projet :

```bash
docker compose -f docker-compose.dev.yml up
```

Les services seront accessibles aux adresses suivantes :

- Frontend Web : [http://localhost:3000](http://localhost:3000)
- Backend API : [http://localhost:5000](http://localhost:5000)
- Postgres : [http://localhost:5432](http://localhost:5432)
- PgAdmin : [http://localhost:8080/login?next=/](http://localhost:8080)

En cas d'erreur docker similaire à :
Error response from daemon: failed to set up container networking: network 70912c50ec4dce775a3a42b72bcab1610c1ee5947789e7233ffb86524b8bd805 not found

```bash
docker compose -f docker-compose.dev.yml down -v
docker network prune -f
docker system prune -f
docker compose -f docker-compose.dev.yml up --build```

---

### Démarrer l’application mobile React Native

1. Dans le dossier de l’application mobile :

```bash
cd frontendMobile
npm install
npx expo start```

---

## Remarques

Les dépendances sont normalement compatibles entre elles.

LES PREREQUIS SONT TOUS PRIMORDIAUX POUR LE FONCTIONNEMENT DE L'ENVIRONNEMENT.
