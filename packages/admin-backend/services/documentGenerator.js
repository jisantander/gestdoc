'use strict';

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');

function generateDocument(data, template) {

  var data_default = {
    first_name: 'John',
    last_name: 'Doe',
    phone: '0652455478',
    description: 'New Website'
  };

  var documentData = data ? JSON.parse(JSON.stringify(data)) : data_default;

  for (var index in documentData) {
    if (documentData.hasOwnProperty(index)) {
      if (documentData[index].constructor == Array) {
        for (var i = 0; i < documentData[index].length; i++) {
          if (documentData[index][i].constructor == Object) {
            documentData[index][i].index = i + 1;
          }
        };
      }
      /*
            if (index.indexOf('fecha_') !== -1) {
                var auxDate = new Date(documentData[index]);
                documentData[index] = auxDate.toLocaleString('es-CL', options);
            }*/
      if (index.indexOf('monto_') !== -1) {
        var auxAmount = parseInt(documentData[index]);
        documentData[index] = auxAmount.toLocaleString('es-CL') + '.-';
      }
    }
  }

  var template_default = {
    inputFile: 'input.docx',
    outputFile: 'output.docx',
    outputDirectory: '/../reports'
  };

  template = template ? template : template_default;

  var templateDirectory = '/../templates';

  //Load the docx file as a binary
  var content = fs
    .readFileSync(path.resolve(__dirname + templateDirectory, template.inputFile), 'binary');

  var zip = new JSZip(content);

  var doc = new Docxtemplater();
  doc.loadZip(zip);

  //set the templateVariables
  doc.setData(documentData);

  try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render();
  }
  catch (error) {
    var e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties
    };
    //    console.log(JSON.stringify({error: e}));
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    return false;
    //throw error;
  }

  var buf = doc.getZip().generate({ type: 'nodebuffer' });

  // Create directory if doesn't exists
  if (!fs.existsSync(__dirname + template.outputDirectory)) {
    fs.mkdirSync(__dirname + template.outputDirectory);
  }

  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync(path.resolve(__dirname + template.outputDirectory, template.outputFile), buf);

  return true;
}

module.exports = {
  generateDocument
};