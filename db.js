const config = require('./config');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 * @param {String} dbName 
 */
module.exports.connect = async (dbName) => {

	let uri = '';
	if (dbName) uri = `mongodb://localhost/${dbName}`;
	else uri = await mongod.getUri();

	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	};

	await mongoose.connect(uri, mongooseOpts, (err) => {
		if (err) console.error(err);
	});
};

/**
 * Drop database, close the connection and stop mongod.
 * @param {Boolean} drop 
 */
module.exports.close = async (drop = true) => {
	if (drop) await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clear = async () => {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany();
	}
};