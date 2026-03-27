import { Router } from 'express';
import { PerfilController } from '../controllers/perfil.controller';

const router = Router();
const controller = new PerfilController();

router.post('/', controller.create);
router.get('/nome/:nome', controller.findByNome);
router.get('/:id_perfil', controller.findById);
router.patch('/:id_perfil', controller.update);
router.delete('/:id_perfil', controller.delete);

export const perfilRoutes = router;
