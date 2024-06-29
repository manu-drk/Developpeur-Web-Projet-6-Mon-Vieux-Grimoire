const Book = require("../models/book");
const fs = require("fs");
const path = require("path");
console.log("Book model:", Book);

exports.createBook = (req, res, next) => {
  console.log("req.file:", req.file);
  // Vérifie si le paramètre 'book' est une chaîne de caractères
  if (typeof req.body.book === "string") {
    try {
      // Parse la chaîne JSON 'book' en objet JavaScript
      const bookObject = JSON.parse(req.body.book);
      console.log("bookObject:", bookObject);
      // Supprime les clés '_id' et '_userId'
      delete bookObject._id;
      delete bookObject._userId;

      // Crée un nouvel objet Book avec les données du livre
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });

      // Enregistre le livre dans la base de données
      book
        .save()
        .then(() => res.status(201).json({ message: "Livre enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
    } catch (error) {
      console.error("Erreur lors de la création du livre :", error);
      res
        .status(400)
        .json({ error: "Les données JSON du livre sont invalides" });
    }
  } else {
    res
      .status(400)
      .json({
        error: 'Le paramètre "book" est manquant ou invalide dans la requête',
      });
  }
};

// Récupérer un livre spécifique
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

//  Modifier un livre

exports.modifyBook = (req, res, next) => {
const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
        }`,
    }
    : { ...req.body };

delete bookObject._userId;

Book.findOne({ _id: req.params.id })
    .then((book) => {
    if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request" });
    } else {
        const filename = book.imageUrl.split("/images/")[1];
        if (req.file) {
        const imagePath = path.join(__dirname, "..", "images", filename);
        fs.unlink(imagePath, (err) => {
            if (err) console.log(err);
        });
        }
        Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
        )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    }
    })
    .catch((error) => res.status(404).json({ error }));
};

//  Supprimer un livre

exports.deleteBook = (req, res, next) => {
Book.findOne({ _id: req.params.id })
    .then((book) => {
    if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
    } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(401).json({ error }));
        });
    }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupérer tous les livres

exports.getAllBooks = (req, res, next) => {
  // Renvoie un tableau contenant tous les Books de la base de données
Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

//  créer une évaluation 


exports.createRating = (req, res, next) => {
const rating = req.body.rating;

if (rating >= 0 && rating <= 5) {
    // Stockage de la requête dans une constante
    const ratingObject = { userId: req.auth.userId, grade: rating };

    // Récupération du livre auquel on veut ajouter une note
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (!book) {
        return res.status(404).json({ message: "Book not found" });
        }

        // Vérifier que l'utilisateur n'a jamais donné de note au livre en question
        const userAlreadyRated = book.ratings.some(
        (rating) => rating.userId === req.auth.userId
        );
        if (userAlreadyRated) {
        return res.status(403).json({ message: "Not authorized" });
        }

        // Ajout de la note
        book.ratings.push(ratingObject);

        // Calcul de la moyenne des notes
        const totalGrades = book.ratings.reduce(
        (acc, rating) => acc + rating.grade,
        0
        );
        const averageGrades = totalGrades / book.ratings.length;
        book.averageRating = averageGrades.toFixed(1);

        // Si c'est la première note, initialiser averageRating
        if (book.ratings.length === 1) {
        book.averageRating = rating;
        }

        // Enregistrer les modifications
        book
        .save()
        .then((updatedBook) => res.status(200).json(updatedBook))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
} else {
    res
    .status(400)
    .json({ message: "La note doit être comprise entre 0 et 5" });
}
};

// GET => Récupération des 3 livres les mieux notés

exports.getBestRating = (req, res, next) => {
  // Récupération de tous les livres
  // Puis tri par rapport aux moyennes dans l'ordre décroissant, limitation du tableau aux 3 premiers éléments
Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};
