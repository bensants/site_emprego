import express from 'express';
import {
  create,
  getMinhas,
  getByOportunidade,
  updateStatus,
  agendarEntrevista,
  cancelar,
} from '../controllers/candidaturaController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, create);
router.get('/minhas', requireAuth, getMinhas);
router.get('/oportunidade/:oportunidadeId', requireAuth, getByOportunidade);
router.patch('/:id/status', requireAuth, updateStatus);
router.post('/:id/agendar-entrevista', requireAuth, agendarEntrevista);
router.delete('/:id', requireAuth, cancelar);

export default router;
