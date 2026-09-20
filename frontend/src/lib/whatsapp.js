/**
 * Gera um link direto do WhatsApp (wa.me) formatado
 * @param {string} phone - Número de telefone no padrão brasileiro ou com DDD
 * @param {string} message - Mensagem pré-formatada inicial
 * @returns {string} Link clicável do WhatsApp
 */
export const getWhatsAppLink = (phone, message = '') => {
  if (!phone) return null;
  // Remove todos os caracteres que não forem dígitos
  let cleaned = phone.replace(/\D/g, '');

  if (!cleaned) return null;

  // Se tem 10 ou 11 dígitos (DDD + número), adiciona o DDI do Brasil (55)
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = `55${cleaned}`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleaned}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};
