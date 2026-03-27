import { Router } from 'express';
import { usuarioRoutes } from './usuario.routes';
import { perfilRoutes } from './perfil.routes';
import { transacaoRoutes } from './transacao.routes';
import { autorizacaoRoutes } from './autorizacao.routes';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/perfis', perfilRoutes);
router.use('/transacoes', transacaoRoutes);
router.use('/autorizacoes', autorizacaoRoutes);

export const apiRoutes = router;
