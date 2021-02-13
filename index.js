// --- Express
const app = require('./app');


// --- Config
const config = require('./config');


// --- Database connection
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${config.db}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}, (err) => {
	if (err) return console.error(err);

	console.log("[+]Connect to DB!");

	// const db = mongoose.connection;
	//
	// const questions = db.collection('Questions');
	// questions.find().toArray((err, results) => {
	// 	console.log(results);
	// });
});


// --- Start listening
app.listen(config.port, () => {
	console.log("[+]Server listening on: " + config.port);
});