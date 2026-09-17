import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  curtir,
} from '../controllers/comunidadeController.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/:id/curtir', curtir);

export default router;
