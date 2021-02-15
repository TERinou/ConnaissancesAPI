const express = require("express");
const app = express();
const routes = require('./routes');
const helmet = require('helmet');

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Content-type', 'application/json');
	next();
});

app.use(helmet());
app.use(express.json());
app.set('json spaces', 4);
app.use('/v1', routes);

module.exports = app;
