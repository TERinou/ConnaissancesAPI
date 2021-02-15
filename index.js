const fs = require('fs');
const https = require('https');

// --- Express
const app = require('./app');


// --- Config
const config = require('./config');


// --- Database connection
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${config.db}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
  useFindAndModify: false,
}, (err) => {
	if (err) return console.error(err);

	console.log("[+]Connect to DB!");
});


if (process.env.NODE_ENV === "production") {
    const {domain} = config;
    const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`, 'utf8');
    const certificate = fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`, 'utf8');
    const ca = fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, 'utf8');
    https.createServer({
        key: privateKey,
        cert: certificate,
        ca: ca
    }, app).listen(config.port, function () {
        console.log(`Serveur ouvert en mode production sur le port ${config.port}.`);
    });
} else {
    app.listen(config.port, () => {
        console.log("[+]Server listening on: " + config.port);
    });
}
