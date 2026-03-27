import { Request, Response, NextFunction } from 'express';
import { PerfilService } from '../services/perfil.service';

export class PerfilController {
    private perfilService = new PerfilService();

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const perfil = await this.perfilService.create(req.body);
            res.status(201).json(perfil);
        } catch (error) {
            next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_perfil as string);
            const perfil = await this.perfilService.findById(id);
            if (!perfil) {
                res.status(404).json({ message: 'Perfil não encontrado' });
                return;
            }
            res.json(perfil);
        } catch (error) {
            next(error);
        }
    };

    findByNome = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const perfis = await this.perfilService.findByNome(req.params.nome as string);
            res.json(perfis);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_perfil as string);
            const perfil = await this.perfilService.update(id, req.body);
            if (!perfil) {
                res.status(404).json({ message: 'Perfil não encontrado' });
                return;
            }
            res.json(perfil);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_perfil as string);
            const success = await this.perfilService.delete(id);
            if (!success) {
                res.status(404).json({ message: 'Perfil não encontrado' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
