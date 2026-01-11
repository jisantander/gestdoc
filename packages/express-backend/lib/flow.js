const CryptoJS = require("crypto-js");

function getToSign(data) {
    var textToSign = "";
    var params = new Map();
    for (var name in data) {
        if (name === "s") {
            continue;
        }
        var value = data[name];
        params.set(name, value);
    }
    var sortedKeys = Array.from(params.keys()).sort();
    for (var param of sortedKeys) {
        textToSign += param + params.get(param);
    }
    return textToSign;
}

module.exports = (data) => {
    try {
        const toSign = getToSign(data);
        const hash = CryptoJS.HmacSHA256(toSign, process.env.FLOW_SECRET_KEY);
        return hash.toString();
    } catch (err) {
        console.error("Error", err);
    }
};
