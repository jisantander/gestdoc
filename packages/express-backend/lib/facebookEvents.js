const axios = require("axios");
const moment = require("moment");
const { createHash } = require("crypto");

function hash(string) {
    return createHash("sha256").update(string).digest("hex");
}

const sendPixelEvent = ({ amount = 0, transaction = "", procedure = "", ip = "0.0.0.0", agent, email = "" }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dataToSend = {
                data: [
                    {
                        event_name: "Purchase",
                        event_time: moment().unix(),
                        user_data: {
                            em: hash(email),
                            client_ip_address: ip,
                            client_user_agent: agent,
                        },
                        custom_data: {
                            currency: "clp",
                            value: parseFloat(amount),
                            contents: [
                                {
                                    id: procedure,
                                    quantity: 1,
                                },
                            ],
                        },
                        event_source_url: `https://admin.gestdoc.cl/app/BpmnBuilder/${procedure}`,
                        action_source: "website",
                    },
                ],
                access_token: process.env.FB_TOKEN,
            };
            const { data } = await axios.post(
                `https://graph.facebook.com/v17.0/${process.env.FB_PIXEL}/events?access_token=${process.env.FB_TOKEN}`,
                dataToSend
            );
            console.log("fb", { data });
            resolve(data);
        } catch (err) {
            reject(err?.response?.data);
        }
    });
};

module.exports = {
    sendPixelEvent,
};
