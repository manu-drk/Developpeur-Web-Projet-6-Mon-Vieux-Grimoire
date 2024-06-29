const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.resolve(req.file.destination, filename);

        await sharp(req.file.path)
            .resize(800) // Redimensionner l'image à une largeur maximale de 800 pixels
            .toFile(filepath);

        // Supprimer le fichier original téléchargé
        fs.unlinkSync(req.file.path);

        // Mettre à jour les informations du fichier dans la requête
        req.file.path = filepath;
        req.file.filename = filename;

        next();
    } catch (error) {
        next(error);
    }
};
