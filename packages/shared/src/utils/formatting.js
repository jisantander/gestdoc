/**
 * Utilidades de formateo compartidas
 */

const moment = require('moment');

/**
 * Formatea RUT chileno con puntos y guión
 * @param {string} rut - RUT sin formato
 * @returns {string} RUT formateado
 */
function formatRUT(rut) {
  if (!rut) return '';
  
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  // Agregar puntos
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedBody}-${dv}`;
}

/**
 * Formatea fecha a formato chileno (DD/MM/YYYY)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string}
 */
function formatDateCL(date) {
  if (!date) return '';
  return moment(date).format('DD/MM/YYYY');
}

/**
 * Formatea fecha y hora a formato chileno
 * @param {Date|string} date - Fecha a formatear
 * @returns {string}
 */
function formatDateTimeCL(date) {
  if (!date) return '';
  return moment(date).format('DD/MM/YYYY HH:mm');
}

/**
 * Formatea número como moneda chilena
 * @param {number} amount - Monto a formatear
 * @returns {string}
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '$0';
  return `$${amount.toLocaleString('es-CL')}`;
}

/**
 * Formatea bytes a tamaño legible
 * @param {number} bytes - Tamaño en bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Capitaliza primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Trunca texto a longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string}
 */
function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

module.exports = {
  formatRUT,
  formatDateCL,
  formatDateTimeCL,
  formatCurrency,
  formatFileSize,
  capitalize,
  truncate
};
