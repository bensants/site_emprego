import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/contratoController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', optionalAuth, create);
router.put('/:id', optionalAuth, update);
router.delete('/:id', optionalAuth, remove);

export default router;
