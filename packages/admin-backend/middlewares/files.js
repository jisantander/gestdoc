const multer = require('multer');

const storage = multer.diskStorage({
	destination: './temp',
	filename(req, file, cb) {
		cb(null, `${+new Date()}-${file.originalname}`);
	},
});

module.exports = multer({ storage });
