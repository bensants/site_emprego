/**
 * Escapa caracteres especiais de regex para prevenir vulnerabilidades ReDoS
 * @param {string} text
 * @returns {string}
 */
export const escapeRegex = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
