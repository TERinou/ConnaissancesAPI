// --- Express
const app = require('./app');


// --- Config
const config = require('./config');


// --- Database connection
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${config.db}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}, (err, database) => {
	if (err) return console.error(err);
	else console.log("[+]Connect to DB!");
});
mongoose.Promise = global.Promise;


// --- Start listening
app.listen(config.port, () => {
	console.log("[+]Server listening on: " + config.port);
});