import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'obidos_connect_secret_key_2026_jwt_token_auth';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso não autorizado. Faça login para continuar.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-senha');
    if (!user || !user.ativo) {
      return res.status(401).json({ message: 'Usuário inválido ou inativo.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }
    return res.status(401).json({ message: 'Token de autenticação inválido.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-senha');
      if (user && user.ativo) {
        req.user = user;
      }
    }
  } catch {
    // Ignora erro se for opcional
  }
  next();
};
