# Test-Technique-Fallou-SEYE-Les-bons-artisans-


Voici le rendu de mon test technique.

# Page du site: localhost:3000/products/load

# L'ensemble des routes: 
routes/index.js

# Le middleware permettant de créer les produits et le serveur socket.io:
app.js(l.38)

# Le code js et les écoutes socket.io: 
layout.ejs


Je tiens tout d'abord souligner que ce site à été réalisé sans React js car je ne le maitrise pas encore cet outil et le temps restant ne me permettait pas de l'apprendre et de l'utiliser.
Cependant, c'est une technologie qui m'intéresse beaucoup, j'ai envie de l'apprendre à vos côtés et en amont de façon autodidacte avant le stage comme je l'ai fait auparavant avec nodejs.

Néanmoins, afin de vous montrer mes compétences sur Nodejs, plus précisément express js ainsi que socket.io, j'ai remplacé nodejs par un moteur de template ejs.

Voici le fonctionnement:

# API Express JS
Dans un premier temps, je charge le fichier Products.json en session en utilisant express-session ce qui permet d'avoir couramment les produits.
De plus j'utilise quatres routes pour lister( "/products/load"), créer("/products/create"), modifier("/products/edit/:productId") et supprimer("/products/delete/productId") les produits.
Je n'ai pas fait de test de champs sur les formulaires mais je l'aurai fait avec express-session.

# Socket.io
J'ai rajouté un middleware qui permet à socket.io de pouvoir récupérer les connexions, ajouter à une "room" et j'utilise app.set() pour garder le serveur socket.io et envoyer des messages (contenant le produit concerné) à chaque action (ajout modification, suppression).
Du côté client, on reste attentif à chaque message et on recharge la page pour une suppression, on crée et on envoie un formulaire pour l'ajout et la modification, ce qui met à jour de façon "temps réel" chaque page

# Bugs:
Il y a un seul bug que je n'ai pas réussi à corriger, c'est lors de la création, les pages devant se mettre à jour créent deux produits (un quand le message "adding" arrive et cette même route renvoie d'autre message "adding"). Ou c'est le fait d'avoir plusieurs socket connectées.
