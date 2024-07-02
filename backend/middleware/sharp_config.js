const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
    // Si aucun fichier n'a été téléchargé, passe au middleware suivant
    if (!req.file) {
        return next();
    }

    try {
        // Génère un nouveau nom de fichier unique basé sur l'horodatage actuel
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.resolve(req.file.destination, filename);
        // Utilise sharp pour redimensionner l'image à une largeur maximale de 800 pixels
        await sharp(req.file.path)
            .resize(800) 
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
