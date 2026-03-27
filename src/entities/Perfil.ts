import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';
import { PerfilVsTransacao } from './PerfilVsTransacao';

@Entity({ name: 'perfil', schema: 'sandbox' })
export class Perfil {
    @PrimaryGeneratedColumn()
    id_perfil: number;

    @Column({ unique: true })
    nome_perfil: string;

    @ManyToMany(() => Usuario, usuario => usuario.perfis)
    usuarios: Usuario[];

    @OneToMany(() => PerfilVsTransacao, pvt => pvt.perfil)
    perfilVsTransacoes: PerfilVsTransacao[];
}
