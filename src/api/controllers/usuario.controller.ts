import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuario.service';

export class UsuarioController {
    private usuarioService = new UsuarioService();

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usuario = await this.usuarioService.create(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_usuario as string);
            const usuario = await this.usuarioService.findById(id);
            if (!usuario) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.json(usuario);
        } catch (error) {
            next(error);
        }
    };

    findByNome = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usuarios = await this.usuarioService.findByNome(req.params.nome as string);
            res.json(usuarios);
        } catch (error) {
            next(error);
        }
    };

    findByEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usuario = await this.usuarioService.findByEmail(req.params.email as string);
            if (!usuario) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.json(usuario);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_usuario as string);
            const usuario = await this.usuarioService.update(id, req.body);
            if (!usuario) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.json(usuario);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_usuario as string);
            const success = await this.usuarioService.delete(id);
            if (!success) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    addPerfil = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id_usuario } = req.params;
            const { id_perfil } = req.body;
            const usuario = await this.usuarioService.addPerfil(parseInt(id_usuario as string), id_perfil);
             if (!usuario) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.json(usuario);
        } catch (error) {
            next(error);
        }
    };

    removePerfil = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id_usuario, id_perfil } = req.params;
            const usuario = await this.usuarioService.removePerfil(parseInt(id_usuario as string), parseInt(id_perfil as string));
            if (!usuario) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.json(usuario);
        } catch (error) {
            next(error);
        }
    };
}
