const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        // Extraction du token JWT de l'en-tête Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Vérification et décodage du token JWT avec la clé secrète
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        // Extraction de l'ID utilisateur du token décodé
        const userId = decodedToken.userId;
        // Ajout de l'ID utilisateur à l'objet req.auth pour une utilisation ultérieure
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentification échouée : Token invalide' });
    }
};



