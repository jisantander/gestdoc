const cleanBase64 = require("./cleanBase64");
const sendNotification = require("./sendNotification");
const cleanEcert = require("./cleanEcert");
const cleanTrash = require("./cleanTrash");

module.exports = () => {
    cleanBase64();
    sendNotification();
    cleanEcert();
    cleanTrash();
};
