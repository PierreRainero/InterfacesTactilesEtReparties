# Kinect

## Description

Ce projet a pour objectif d'intéragir avec une [Kinect](https://fr.wikipedia.org/wiki/Kinect) version 1 pour extraire les informations nécessaires pour démarrer la course de haies et détecter les coureurs tout le long de celle-ci.  
Une fois une Kinect branchée et l'application lancée (voir [Technologies utilisées](##Technologies%20utilisées)), l'application va reconnaitre jusqu'à **2 joueurs**, respectivement "blue" et "red". Pour démarrer la partie il faut que chaque joueur lève sa main droite au-dessus de sa tête. L'application émettra alors un message sur le chanel `start` du "backend" de la forme suivante :

```json
{ "players": [{"color": "blue"}, {"color": "red"}] }
```

## Déployement

## Technologies utilisées

- [.NETFramework](https://dotnet.microsoft.com/download/dotnet-framework-runtime) 4.6.1
- [WebSocketSharp](https://www.nuget.org/packages/WebSocketSharp) 1.0.4.0
- [Kinect for Windows SDK](https://www.microsoft.com/en-gb/download/details.aspx?id=40278) 1.8
- [Kinect for Windows Developer Toolkit](https://www.microsoft.com/en-gb/download/details.aspx?id=40276) 1.8