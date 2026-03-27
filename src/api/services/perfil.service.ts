import { AppDataSource } from "../../data-source";
import { Perfil } from "../../entities/Perfil";
import { ILike } from "typeorm";

type PerfilCreateData = {
    nome_perfil: string;
}

type PerfilUpdateData = Partial<PerfilCreateData>;

export class PerfilService {
    private perfilRepository = AppDataSource.getRepository(Perfil);

    async create(data: PerfilCreateData): Promise<Perfil> {
        const perfil = this.perfilRepository.create(data);
        await this.perfilRepository.save(perfil);
        return perfil;
    }

    async findById(id: number): Promise<Perfil | null> {
        return this.perfilRepository.findOneBy({ id_perfil: id });
    }

    async findByNome(nome: string): Promise<Perfil[]> {
        return this.perfilRepository.findBy({ nome_perfil: ILike(`%${nome}%`) });
    }

    async update(id: number, data: PerfilUpdateData): Promise<Perfil | null> {
        const result = await this.perfilRepository.update(id, data);
        if (result.affected === 0) {
            return null;
        }
        return this.perfilRepository.findOneBy({ id_perfil: id });
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.perfilRepository.delete(id);
        return result.affected > 0;
    }
}
