import { AppDataSource } from "../../data-source";
import { Perfil } from "../../entities/Perfil";
import { PerfilVsTransacao } from "../../entities/PerfilVsTransacao";
import { Transacao } from "../../entities/Transacao";

type AutorizacaoCreateData = {
    id_perfil: number;
    id_transacao: number;
    autorizacao: string;
}

type AutorizacaoUpdateData = {
    autorizacao: string;
}

export class AutorizacaoService {
    private autorizacaoRepository = AppDataSource.getRepository(PerfilVsTransacao);

    async create(data: AutorizacaoCreateData): Promise<PerfilVsTransacao> {
        // TypeORM requires the actual entity objects for relations, not just the IDs.
        const perfil = new Perfil();
        perfil.id_perfil = data.id_perfil;

        const transacao = new Transacao();
        transacao.id_transacao = data.id_transacao;

        const autorizacao = this.autorizacaoRepository.create({
            perfil: perfil,
            transacao: transacao,
            autorizacao: data.autorizacao,
        });

        await this.autorizacaoRepository.save(autorizacao);
        return autorizacao;
    }

    async update(id: number, data: AutorizacaoUpdateData): Promise<PerfilVsTransacao | null> {
        const result = await this.autorizacaoRepository.update(id, data);
        if (result.affected === 0) {
            return null;
        }
        return this.autorizacaoRepository.findOneBy({ id: id });
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.autorizacaoRepository.delete(id);
        return result.affected > 0;
    }
}
