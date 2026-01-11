const modelUser = require("../../models/users");
const jwt = require("../../lib/jwt");
const googleAuth = require("../../lib/googleAuth");

module.exports = (app) => {
    app.post("/api/auth/signup", async (req, res, next) => {
        try {
            const usuario = await modelUser.create(req.body);
            res.json(usuario);
        } catch (err) {
            console.error(err.response);
            next(err);
        }
    });

    app.post("/api/auth/forgot_pass", async (req, res, next) => {
        try {
            const usuario = await modelUser.send_invitation_password(req.body);
            if (usuario) {
                res.json({ message: usuario.message });
            }
        } catch (err) {
            console.error(err.response);
            next(err);
        }
    });
    app.post("/api/auth/signin", async (req, res, next) => {
        try {
            const usuario = await modelUser.login(req.body);
            res.json(usuario);
        } catch (err) {
            console.error(err.response);
            next(err);
        }
    });
    app.post("/api/auth/verify", async (req, res, next) => {
        try {
            const { token } = req.body;
            const data = await jwt.verifyToken(token);
            res.json({
                message: "User succesfully logged!",
                ...data,
            });
        } catch (err) {
            console.error("[Login]", err);
            next(err);
        }
    });
    /*
		app.post('/api/auth/google', async (req, res, next) => {
			try {
				const {
					profileObj: { email },
				} = req.body;
				const data = await modelUser.findByEmailLogin(email);
				res.json({
					message: 'User succesfully logged!',
					...data,
				});
			} catch (err) {
				console.error('[Login]', err);
				next(err);
			}
		});
	*/
    app.post("/api/auth/google", async (req, res, next) => {
        try {
            const googleVerification = await googleAuth(req.body.tokenId);
            console.log("googleVerification", googleVerification);
            if (googleVerification) {
                const data = await modelUser.googleLogin(googleVerification);
                res.json(data);
            } else {
                res.json({
                    message: "token invalido",
                });
            }
        } catch (err) {
            console.error("[Login]", err);
            next(err);
        }
    });
};
