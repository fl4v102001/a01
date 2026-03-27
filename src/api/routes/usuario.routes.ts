import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';

const router = Router();
const controller = new UsuarioController();

router.post('/', controller.create);
router.get('/nome/:nome', controller.findByNome);
router.get('/email/:email', controller.findByEmail);
router.get('/:id_usuario', controller.findById);
router.patch('/:id_usuario', controller.update);
router.delete('/:id_usuario', controller.delete);

// Rotas para relacionamento com Perfil
router.post('/:id_usuario/perfis', controller.addPerfil);
router.delete('/:id_usuario/perfis/:id_perfil', controller.removePerfil);


export const usuarioRoutes = router;
