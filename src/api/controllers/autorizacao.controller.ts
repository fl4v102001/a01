import { Request, Response, NextFunction } from 'express';
import { AutorizacaoService } from '../services/autorizacao.service';

export class AutorizacaoController {
    private autorizacaoService = new AutorizacaoService();

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const autorizacao = await this.autorizacaoService.create(req.body);
            return res.status(201).json(autorizacao);
        } catch (error) {
            return next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const autorizacao = await this.autorizacaoService.update(id, req.body);
            if (!autorizacao) {
                return res.status(404).json({ message: 'Autorização não encontrada' });
            }
            return res.json(autorizacao);
        } catch (error) {
            return next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const success = await this.autorizacaoService.delete(id);
            if (!success) {
                return res.status(404).json({ message: 'Autorização não encontrada' });
            }
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}
