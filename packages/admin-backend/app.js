'use strict';

var express = require('express');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
const logger = require('morgan');
var LocalStrategy = require('passport-local').Strategy;
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
const Sentry = require('@sentry/node');

var app = express();

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: process.env.SENTRY,
	});
	app.use(Sentry.Handlers.requestHandler());
}

// Cargar rutas
var userRoutes = require('./routes/userRoutes');
var formRoutes = require('./routes/formRoutes');
var bpmnRoutes = require('./routes/bpmnRoutes');
var emailsRoutes = require('./routes/emailsRoutes');
var htmlsRoutes = require('./routes/htmlsRoutes');
var operationRoutes = require('./routes/operationRoutes');
var historyRoutes = require('./routes/historyRoutes');
var usergroupRoutes = require('./routes/usegroupRoutes');
var themedocRoutes = require('./routes/themedocRoutes');
var procedureRoutes = require('./routes/procedureRoutes');
var companyRoutes = require('./routes/companyRoutes');
var previewRoutes = require('./routes/previewRoutes');
var getdocsRoutes = require('./routes/getdocsRoutes');
var reportRoutes = require('./routes/reportRoutes');
var interfaceRoutes = require('./routes/interfaceRoutes');

app.set('trust proxy', 1);
app.use(logger(':method :remote-addr :url :status :response-time'));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.json());

// Configurar cabeceras
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Request-Method'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});

// Rutas Base
app.use('/api', userRoutes);
app.use('/api/form', formRoutes);
app.use('/api/operation', operationRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/usergroup', usergroupRoutes);
app.use('/api/bpmn', bpmnRoutes);
app.use('/api/email', emailsRoutes);
app.use('/api/html', htmlsRoutes);
app.use('/api/docs', themedocRoutes);
app.use('/api/procedure', procedureRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/preview', previewRoutes);
app.use('/api/getdocs', getdocsRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/interface', interfaceRoutes);

const options = {
	swaggerDefinition: {
		info: {
			title: 'REST API GESTDOC ADMIN',
			version: '1.0.0',
			description: 'docs de Gestdoc Admin',
		},
	},
	apis: ['swagger.yaml'],
};

const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.static(path.join(__dirname, 'buildAdmin')));

if (process.env.NODE_ENV === 'production') {
	app.use(Sentry.Handlers.errorHandler());
}

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'buildAdmin', 'index.html'));
});

module.exports = app;
