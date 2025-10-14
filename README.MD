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
docker-compose up --build -d
```

Les services seront accessibles aux adresses suivantes :

- Frontend Web : [http://localhost:3000](http://localhost:3000)
- Backend API : [http://localhost:5000](http://localhost:5000)

---

### Démarrer l’application mobile React Native

1. Ouvrir un émulateur Android via Android Studio

2. Dans le dossier de l’application mobile :

```bash
cd frontendMobile
npm install
npx expo start
```

En cas de probleme, il est possible de débug l'état de l'environnement afin de détecter le manquement d'un prérequis avec:

```bash
npx react-native doctor
```

---

## Remarques

Les dépendances sont normalement compatibles entre elles.

LES PREREQUIS SONT TOUS PRIMORDIAUX POUR LE FONCTIONNEMENT DE L'ENVIRONNEMENT.
