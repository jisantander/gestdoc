var express = require('express');
var router = express.Router();
var operationController = require('../controllers/operationController.js');

/*
 * GET
 */
router.get('/getdocs/:id', operationController.resultTemplateGestDocExpress);

/*
 * GET
 */
router.get('/fileSign/:id', operationController.docxQr);

module.exports = router;
