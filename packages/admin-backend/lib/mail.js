const mailgun = require('mailgun-js')({
	apiKey: process.env.MAILGUN_KEY,
	domain: process.env.MAILGUN_DOMAIN,
});

module.exports = {
	email_generic: (data) => {
		return new Promise(async (resolve, reject) => {
			mailgun.messages().send(data, (err, data) => {
				if (err) {
					reject(err);
				} else {
					console.log(data); // successful response
					resolve(data);
				}
			});
		});
	},
};
