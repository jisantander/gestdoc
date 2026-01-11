var express = require('express');
var router = express.Router();

const previewDocument = require('../lib/previewDocument');
const signDocument = require('../lib/signDocument');

router.get('/get/:transaction/:doc', async (req, res) => {
	try {
		const { stat, file, name } = await previewDocument(req.params.transaction, req.params.doc);
		res.setHeader('Content-Length', stat.size);
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'inline; filename=' + name);
		file.pipe(res);
	} catch (e) {
		console.error('[preview]', e);
		res.status(500).json({
			message: 'Hubo un error al generar el documento.'
		});
	}
});

router.get('/sign/:transaction/:doc', async (req, res) => {
	try {
		const pdfBuffer = await signDocument(req.params.transaction, req.params.doc);
		res.status(200);
		res.type('pdf');
		res.send(pdfBuffer);
	} catch (e) {
		console.error('[sign]', e);
		res.status(500).json({
			message: 'Hubo un error al firmar el documento.'
		});
	}
});

module.exports = router;
