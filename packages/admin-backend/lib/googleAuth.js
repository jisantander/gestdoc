const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleAuth = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload();

    console.log(`User ${payload.name} verified`);
    console.log(payload)

    const { sub, email, given_name, picture, family_name } = payload;

    const userId = sub;
    //email, name, surname,token_id, picture
    return { userId, email, name : given_name, surname: family_name,  picture }
};

module.exports = googleAuth;