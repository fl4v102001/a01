import { AppDataSource } from "../../data-source";
import { Perfil } from "../../entities/Perfil";
import { Usuario } from "../../entities/Usuario";
import { ILike } from "typeorm";

type UsuarioCreateData = {
    nome_usuario: string;
    email_usuario: string;
}

type UsuarioUpdateData = Partial<UsuarioCreateData>;

export class UsuarioService {

    private usuarioRepository = AppDataSource.getRepository(Usuario);
    private perfilRepository = AppDataSource.getRepository(Perfil);

    async create(data: UsuarioCreateData): Promise<Usuario> {
        const usuario = this.usuarioRepository.create(data);
        await this.usuarioRepository.save(usuario);
        return usuario;
    }

    async findById(id: number): Promise<Usuario | null> {
        return this.usuarioRepository.findOne({
            where: { id_usuario: id },
            relations: {
                perfis: {
                    perfilVsTransacoes: {
                        transacao: true
                    }
                }
            }
        });
    }

    async findByNome(nome: string): Promise<Usuario[]> {
        return this.usuarioRepository.find({
            where: { nome_usuario: ILike(`%${nome}%`) },
            relations: {
                perfis: {
                    perfilVsTransacoes: {
                        transacao: true
                    }
                }
            }
        });
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        return this.usuarioRepository.findOne({
            where: { email_usuario: email },
            relations: {
                perfis: {
                    perfilVsTransacoes: {
                        transacao: true
                    }
                }
            }
        });
    }

    async update(id: number, data: UsuarioUpdateData): Promise<Usuario | null> {
        const result = await this.usuarioRepository.update(id, data);
        if (result.affected === 0) {
            return null;
        }
        return this.usuarioRepository.findOneBy({ id_usuario: id });
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.usuarioRepository.delete(id);
        return result.affected > 0;
    }

    async addPerfil(id_usuario: number, id_perfil: number): Promise<Usuario | null> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id_usuario },
            relations: ['perfis'],
        });

        if (!usuario) {
            return null; // Usuário não encontrado
        }

        const perfil = await this.perfilRepository.findOneBy({ id_perfil });
        if (!perfil) {
            throw new Error('Perfil não encontrado');
        }

        usuario.perfis.push(perfil);
        await this.usuarioRepository.save(usuario);
        return usuario;
    }

    async removePerfil(id_usuario: number, id_perfil: number): Promise<Usuario | null> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id_usuario },
            relations: ['perfis'],
        });

        if (!usuario) {
            return null;
        }

        usuario.perfis = usuario.perfis.filter(p => p.id_perfil !== id_perfil);
        await this.usuarioRepository.save(usuario);
        return usuario;
    }

    async listAllUsers(): Promise<Usuario[]> {
        return AppDataSource.getRepository(Usuario).find({
            relations: {
                perfis: {
                    perfilVsTransacoes: {
                        transacao: true
                    }
                }
            }
        });
    }
}
