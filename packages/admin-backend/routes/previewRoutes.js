const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const reviewUpload = require('../lib/reviewUpload');
const reviewDocs = require('../lib/reviewDocs');
const awsDownload = require('../lib/awsDownload');

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

AWS.config.update({
	accessKeyId: S3_KEY,
	secretAccessKey: S3_SECRET,
	region: S3_REGION
});

router.get('/aws/:transaction/:doc', async (req, res) => {
	try {
		const pdfBuffer = await reviewDocs(req.params.transaction, req.params.doc);
		res.status(200);
		res.type('pdf');
		res.send(pdfBuffer);
	} catch (err) {
		console.error('[try uploaded]', err.response);
		next(err);
	}
});

/*
 * GET
 */
router.get('/uploaded/:transaction', async (req, res, next) => {
	try {
		const pdfBuffer = await reviewUpload(req.params.transaction);
		res.status(200);
		res.type('pdf');
		res.send(pdfBuffer);
	} catch (err) {
		console.error('[try uploaded]', err.response);
		next(err);
	}
});

router.get('/rescue/:pdfUrl', async (req, res) => {
	try {
		const pdfBuffer = await awsDownload(req.params.pdfUrl);
		res.status(200);
		res.type('pdf');
		res.send(pdfBuffer);
	} catch (err) {
		console.error('[try uploaded]', err.response);
		next(err);
	}
});

/*
 * GET
 */
router.get('/:transaction/:doc', async (req, res, next) => {
	try {
		const { transaction, doc } = req.params;

		/* Obtenemos el pdf desde S3 */
		const s3 = new AWS.S3();
		const params = {
			Bucket: S3_BUCKET,
			Key: `${transaction}-${doc}.pdf`
		};
		s3.headObject(params, function (err, data) {
			if (err) {
				// an error occurred
				console.error('[s3 preview]', err);
				return next(err);
			}
			const stream = s3.getObject(params).createReadStream();

			// forward errors
			stream.on('error', function error(err) {
				//continue to the next middlewares
				return next(err);
			});

			//Add the content type to the response (it's not propagated from the S3 SDK)
			res.set('Content-Type', 'application/pdf');
			res.set('Content-Length', data.ContentLength);
			res.set('Last-Modified', data.LastModified);
			res.set('ETag', data.ETag);

			stream.on('end', () => {
				console.log('Served by Amazon S3: ' + `${transaction}-${doc}.pdf`);
			});
			//Pipe the s3 object to the response
			stream.pipe(res);
		});
	} catch (err) {
		console.error('[try preview]', err.response);
		next(err);
	}
});

router.use((err, req, res, next) => {
	res.status(500).send(`<div style="width:100vh;height:100vh;color:red;text-align:center;">
			<p>Hubo un error al obtener el documento. Por favor, notifique a su administrador de sistemas.</p>
		</div>`);
});

module.exports = router;
