# Kinect

## Auteur

* [Pierre RAINERO](pierre.rainero@hotmail.fr)

## Description

Ce projet a pour objectif d'intéragir avec une [Kinect](https://fr.wikipedia.org/wiki/Kinect) version 1 pour extraire les informations nécessaires pour démarrer la course de haies et détecter les coureurs tout le long de celle-ci. 

## Utilisation

Une fois une Kinect branchée et l'application lancée (voir [Technologies utilisées](##Technologies%20utilisées)), l'application va reconnaitre jusqu'à **2 joueurs**, respectivement "1" et "2".

1. Elle émettra la liste des joueurs sur le canal  `players` du "backend" sous la forme suivante dès que cette liste changera et tant que la partie n'aura pas démarré :

    ```json
    { "players": [{"id": 1, "state":1}, {"id": 2, "state":1}] }
    ```

2. Pour démarrer la partie il faut que chaque joueur lève sa main droite au-dessus de sa tête (de cette manière le status de chaque joueur passera à "2"). Le "backend" émettra alors un message sur le canal `kinectStartRun` à l'intention de l'application pour passer à la phase de course.

## Technologies utilisées

* [.NETFramework](https://dotnet.microsoft.com/download/dotnet-framework-runtime) 4.6.1
* [WebSocketSharp](https://www.nuget.org/packages/WebSocketSharp) 1.0.4.0
* [Kinect for Windows SDK](https://www.microsoft.com/en-gb/download/details.aspx?id=40278) 1.8
* [Kinect for Windows Developer Toolkit](https://www.microsoft.com/en-gb/download/details.aspx?id=40276) 1.8