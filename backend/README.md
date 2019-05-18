# Coeur applicatif

## Auteurs

* [Julien MAUREILLE](julien.maureille@live.fr)
* [Gregory MERLET](gregory.merlet@outlook.fr)
* [Pierre RAINERO](pierre.rainero@hotmail.fr)
* [Gaulthier TOUSSAINT](gaulthiertoussaint@gmail.com)

## Description

Ce projet est responsable de la logique commune à toutes les parties de la course de haies. Il expose une interface de communication :  
**API port** : 3000  

**[Socket.io](https://socket.io/) port** : 8282  
**Canaux :**  

* `kinectConnected` : écoute les messages entrant pour établir une communication avec une Kinect (voir [Kinect](../kinect)).
* `players` : écoute les messages pour définir les joueurs disponibles pour la prochaine partie (ainsi que leur état).

## Déploiement

Il faut dans un premier temps récupérer tous les packages [npm](https://www.npmjs.com/) nécessaires au projet, pour cela il faut disposer de [node.js](https://nodejs.org/en/) et lancer la commande `npm i`.  
Il faut ensuite démarrer le server à l'aide de la commande `npm start` (l'URI du serveur sera alors "localhost").  
Il est possible d'ajouter un label aux métriques de chaque course avec l'option : `npm start -- --label monlabel`.  

## Technologies utilisées

* [npm](https://www.npmjs.com/) 6.4.1
* [express](https://expressjs.com/fr/) 4.16.0
* [socket.io](https://socket.io/) 2.2.0