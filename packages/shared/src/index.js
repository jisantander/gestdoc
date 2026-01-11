/**
 * @gestdoc/shared - Código compartido entre componentes
 */

const validation = require('./utils/validation');
const formatting = require('./utils/formatting');
const constants = require('./constants');

module.exports = {
  // Utilidades
  validation,
  formatting,
  
  // Constantes
  ...constants
};
