const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port et s'assurer qu'il est valide
const normalizePort = val => {
    const port = parseInt(val, 10);

    // Si la valeur n'est pas un nombre, la retourner telle quelle
    if (isNaN(port)) {
        return val;
    }
    // Si le port est un nombre valide, le retourner
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestionnaire d'erreurs pour le serveur HTTP
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    // Déterminer si l'adresse est une chaîne ou un numéro de port
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

// Enregistrement des gestionnaires d'événements pour le serveur
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
