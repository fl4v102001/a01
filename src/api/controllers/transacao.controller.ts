import { Request, Response, NextFunction } from 'express';
import { TransacaoService } from '../services/transacao.service';

export class TransacaoController {
    private transacaoService = new TransacaoService();

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transacao = await this.transacaoService.create(req.body);
            return res.status(201).json(transacao);
        } catch (error) {
            return next(error);
        }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_transacao as string);
            const transacao = await this.transacaoService.findById(id);
            if (!transacao) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            return res.json(transacao);
        } catch (error) {
            return next(error);
        }
    };

    findByNome = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transacoes = await this.transacaoService.findByNome(req.params.nome as string);
            return res.json(transacoes);
        } catch (error) {
            return next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_transacao as string);
            const transacao = await this.transacaoService.update(id, req.body);
            if (!transacao) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            return res.json(transacao);
        } catch (error) {
            return next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id_transacao as string);
            const success = await this.transacaoService.delete(id);
            if (!success) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}
