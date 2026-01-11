/**
 * Utilidades de validación compartidas
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que un string no esté vacío
 * @param {string} str - String a validar
 * @returns {boolean}
 */
function isNotEmpty(str) {
  return str && str.trim().length > 0;
}

/**
 * Valida formato de RUT chileno
 * @param {string} rut - RUT a validar
 * @returns {boolean}
 */
function isValidRUT(rut) {
  if (!rut || typeof rut !== 'string') return false;
  
  // Remover puntos y guión
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  
  if (cleanRut.length < 2) return false;
  
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDV = 11 - (sum % 11);
  const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();
  
  return dv === calculatedDV;
}

/**
 * Valida que un valor sea un ObjectId de MongoDB válido
 * @param {string} id - ID a validar
 * @returns {boolean}
 */
function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

/**
 * Valida rango de fechas
 * @param {Date|string} startDate - Fecha de inicio
 * @param {Date|string} endDate - Fecha de fin
 * @returns {boolean}
 */
function isValidDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}

module.exports = {
  isValidEmail,
  isNotEmpty,
  isValidRUT,
  isValidObjectId,
  isValidDateRange
};
