const parseString = require('xml2js').parseString;

module.exports = (xmlData) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, function(err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
};