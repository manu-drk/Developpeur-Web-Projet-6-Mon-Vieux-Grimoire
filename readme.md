Mon Vieux Grimoire - Backend
Ce dépôt contient le backend de l'application Mon Vieux Grimoire : un site web de référencement et de notation de livres.

Il s’agit d’une petite chaîne de librairies qui souhaite ouvrir un site de référencement et de notation de livres : Mon Vieux Grimoire.

Exigence de l’API


API Errors
Les erreurs éventuelles doivent être renvoyées telles qu'elles sont produites, sans modification ni ajout.Si nécessaire, utilisez une nouvelle Error().

API Routes
Toutes les routes pour les livres doivent disposer d’une autorisation (le token est envoyé par le front-end avec l'en-tête d’autorisation « Bearer »). Avant qu’un utilisateur puisse apporter des modifications à la route livre (book),le code doit vérifier si le user ID actuel correspond au user ID du livre. Si le user ID ne correspond pas, renvoyer « 403: unauthorized request ». Cela permet de s'assurer que seul le propriétaire d’un livre puisse apporter des
modifications à celui-ci.

Models
User {
    email : String - adresse e-mail de l’utilisateur [unique]
    password : String - mot de passe haché de l’utilisateur
}
Book {
    userId : String - identifiant MongoDB unique de l'utilisateur qui a créé le livre
    title : String - titre du livre
    author : String - auteur du livre
    imageUrl : String - illustration/couverture du livre
    year: Number - année de publication du livre
    genre: String - genre du livre
    ratings : [
{
    userId : String - identifiant MongoDB unique de l'utilisateur qui a noté le livre
    grade : Number - note donnée à un livre
}
    ] - notes données à un livre
    averageRating : Number - note moyenne du livre
}


Sécurité
● Le mot de passe de l'utilisateur doit être haché.
● L'authentification doit être renforcée sur toutes les routes livre (book) requises.
● Les adresses électroniques dans la base de données sont uniques, et un plugin Mongoose approprié est
utilisé pour garantir leur unicité et signaler les erreurs.
● La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas
empêcher l'application de se lancer sur la machine d'un utilisateur.
● Les erreurs issues de la base de données doivent être remontées.


Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)


Frontend :
Npm install
Npm start

Backend:

Npm install
Nodemon start

liste des dépendances
    "bcrypt"
    "dotenv"
    "email-validator"
    "express"
    "express-rate-limit"
    "helmet"
    "jsonwebtoken"
    "mongoose"
    "mongoose-unique-validator"
    "multer"
    "nodemon"
    "password-validator"
    "sharp"


les mots de passe sont dans un fichier .env

manu.manu@manu.com
Code1234

test@test.fr
Code1234

test3@gmail.fr
Code1234


```
└── 📁backend
    └── .env
    └── app.js
    └── 📁controllers
        └── books.js
        └── user.js
    └── gitignore
    └── 📁images        
    └── 📁middleware
        └── auth.js        
        └── multer-config.js
        └── sharp_config.js
        └── validate-email.js
        └── validate-password.js
    └── 📁models
        └── book.js
        └── user.js
    └── package-lock.json
    └── package.json
    └── 📁routes
        └── books.js
        └── user.js
    └── server.js
```