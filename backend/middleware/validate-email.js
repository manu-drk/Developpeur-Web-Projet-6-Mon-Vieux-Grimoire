const emailValidator = require('email-validator');

// Ce middleware utilise le package email-validator pour valider si une adresse e-mail est valide
const validateEmail = (req, res, next) => {
    const { email } = req.body;

    // Vérification si l'adresse e-mail est absente ou invalide
    if (!email || !emailValidator.validate(email)) {
        return res.status(400).json({ error: 'Adresse e-mail invalide' });
    }
    next();
};

module.exports = validateEmail;