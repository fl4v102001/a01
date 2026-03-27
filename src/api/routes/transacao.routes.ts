import { Router } from 'express';
import { TransacaoController } from '../controllers/transacao.controller';

const router = Router();
const controller = new TransacaoController();

router.post('/', controller.create);
router.get('/nome/:nome', controller.findByNome);
router.get('/:id_transacao', controller.findById);
router.patch('/:id_transacao', controller.update);
router.delete('/:id_transacao', controller.delete);

export const transacaoRoutes = router;
