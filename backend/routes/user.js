const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('express-rate-limit');

// Configuration du rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par windowMs
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});

router.post('/signup', limiter, userCtrl.signup); // Appliquez limiter à la route signup
router.post('/login', limiter, userCtrl.login);   // Appliquez limiter à la route login

module.exports = router;




