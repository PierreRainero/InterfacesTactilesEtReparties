# Course de haies interactive

## Informations sur l'équipe

* Membres :
  * [Julien MAUREILLE](julien.maureille@live.fr)
  * [Gregory MERLET](gregory.merlet@outlook.fr)
  * [Pierre RAINERO](pierre.rainero@hotmail.fr)
  * [Gaulthier TOUSSAINT](gaulthiertoussaint@gmail.com)

## Architecture

![architecture_scheme](doc/imgs/archi.png)

## Scénario (exemple d'utilisation)

1. L’écran de projection affiche un message indiquant que le système est en attente de participants.
2. Les visiteurs peuvent posséder une montre connectée lorsqu’ils arrivent sur l’activité. Dans ce cas, la montre est déjà appairée à un smartphone relié au système de jeu.
3. Les joueurs se placent sur les cercles de couleur situés face au mur de projection : un joueur par cercle.
4. Les joueurs portant des montres connectées doivent, sur la montre, sélectionner la couleur correspondant au cercle sur lequel ils sont positionnés. Ils doivent également accepter ou refuser que leur rythme cardiaque soit affiché au public.
5. L’écran de projection affiche un message indiquant que le système a détecté les joueurs. Il affiche également un message invitant les joueurs à lever la main droite dès qu’ils sont prêt.
6. Chaque joueur lève la main droite.
7. Le personnage virtuel représentant le joueur lève la main
8. Le système détecte le mouvement (Kinect) et lance la partie. L’écran de projection affiche un message “3… 2… 1 C’est parti” et lance le chrono. Les montres connectées émettent une vibration pour indiquer aux joueurs que la course commence. L’écran affiche désormais une vue composée de :

    * Le chronomètre en haut
    * Une vue par joueur à la troisième personne représentant le coureur sur une piste de course avec des haies (écran divisé)
    * Une mini-carte d’avancement en bas à droite

9. Les joueurs doivent alors courir sur place afin de faire avancer leur personnage. Il doivent également sauter pour éviter les haies qui se présentent à eux, les montres connectés émettent une vibration au meilleur moment où le joueur doit sauter.
10. Un joueur virtuel, imitant les performances d’un athlète de haut niveau, court en même temps que les participants. Sa progression est renseignée en temps réel sur la mini-carte.
11. Les participants portant une montre ont accès tout au long de la course à des données biométriques comme leur rythme cardiaque (ceux qui ont accepté que leur rythme cardiaque soit visible par le public voient leur rythme affiché sur l’écran de course, les autres peuvent voir leurs pulsations directement sur la montre).
12. Dès qu’un joueur passe la ligne d’arrivée virtuelle, sa vue à la troisième personne affiche un message “Terminé !” accompagné de son classement. 
13. Lorsque tous les joueurs ont passé la ligne d’arrivée, le dispositif de projection bascule sur l’écran de résultats. Ce dernier affiche pour chaque joueur son classement, sa vitesse moyenne et, si le joueur le souhaite et porte une montre connecté, son rythme cardiaque moyen. Il affiche également à côté les résultats (classement, vitesse moyenne, rythme cardiaque moyen) du joueur virtuel imitant un athlète.
14. Les participants qui n’avaient pas accepté que leur rythme cardiaque soit  visible par le public, peuvent voir un récapitulatif de leur rythme cardiaque directement sur la montre (pulsation max et moyenne).
15. Au bout de 2 minutes, le système est réinitialisé et l’écran de projection affiche un message indiquant que le système est en attente de participants pour une nouvelle partie.
