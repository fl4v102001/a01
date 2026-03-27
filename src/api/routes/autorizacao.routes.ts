import { Router } from 'express';
import { AutorizacaoController } from '../controllers/autorizacao.controller';

const router = Router();
const controller = new AutorizacaoController();

router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export const autorizacaoRoutes = router;
