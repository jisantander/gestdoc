'use strict';

const { config } = require('./config/index');
const mongoose = require('mongoose');
const app = require('./app');
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const dbURi = config.dbURi;

/*
DB_USER=sebastian
DB_PASSWORD=hFjKJJy9qB9r40g5
DB_HOST=cluster0-hhnei.mongodb.net
DB_NAME=gestdoc
NODE_ENV=localhost
*/

//const uri = "mongodb+srv://sebastian:<password>@cluster0-hhnei.mongodb.net/<dbname>?retryWrites=true&w=majority";
//mongodb://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}=Cluster0-shard-0&authSource=test&retryWrites=true&w=majority

//var uri = "mongodb://${USER}:${PASSWORD@cluster0-shard-00-00-hhnei.mongodb.net:27017,cluster0-shard-00-01-hhnei.mongodb.net:27017,cluster0-shard-00-02-hhnei.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"

//const dbURi = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

/*const dbURi =
	'mongodb://' +
	USER +
	':' +
	PASSWORD +
	'@cluster0-shard-00-00-hhnei.mongodb.net:27017,cluster0-shard-00-01-hhnei.mongodb.net:27017,cluster0-shard-00-02-hhnei.mongodb.net:27017/' +
	DB_NAME +
	'?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';*/

console.log('sdbURi', dbURi);
mongoose.Promise = require('bluebird');

mongoose.connect(
	dbURi,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err) => {
		if (err) {
			throw err;
			process.exit();
		}
		console.log('DB successfully Connected!');

		app.listen(config.port, function () {
			console.log('Server is now active. Port: ' + config.port);
		});
	}
);
