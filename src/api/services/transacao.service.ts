import { AppDataSource } from "../../data-source";
import { Transacao } from "../../entities/Transacao";
import { ILike } from "typeorm";

type TransacaoCreateData = {
    nome_transacao: string;
}

type TransacaoUpdateData = Partial<TransacaoCreateData>;

export class TransacaoService {
    private transacaoRepository = AppDataSource.getRepository(Transacao);

    async create(data: TransacaoCreateData): Promise<Transacao> {
        const transacao = this.transacaoRepository.create(data);
        await this.transacaoRepository.save(transacao);
        return transacao;
    }

    async findById(id: number): Promise<Transacao | null> {
        return this.transacaoRepository.findOneBy({ id_transacao: id });
    }

    async findByNome(nome: string): Promise<Transacao[]> {
        return this.transacaoRepository.findBy({ nome_transacao: ILike(`%${nome}%`) });
    }

    async update(id: number, data: TransacaoUpdateData): Promise<Transacao | null> {
        const result = await this.transacaoRepository.update(id, data);
        if (result.affected === 0) {
            return null;
        }
        return this.transacaoRepository.findOneBy({ id_transacao: id });
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.transacaoRepository.delete(id);
        return result.affected > 0;
    }
}
