import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Perfil } from './Perfil';
import { Transacao } from './Transacao';

@Entity({ name: 'perfil_vs_transacao', schema: 'sandbox' })
export class PerfilVsTransacao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    autorizacao: string;

    @ManyToOne(() => Perfil, perfil => perfil.perfilVsTransacoes)
    @JoinColumn({ name: 'id_perfil' })
    perfil: Perfil;

    @ManyToOne(() => Transacao, transacao => transacao.perfilVsTransacoes)
    @JoinColumn({ name: 'id_transacao' })
    transacao: Transacao;
}
