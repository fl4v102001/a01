import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PerfilVsTransacao } from './PerfilVsTransacao';

@Entity({ name: 'transacao', schema: 'sandbox' })
export class Transacao {
    @PrimaryGeneratedColumn()
    id_transacao: number;

    @Column({ unique: true })
    nome_transacao: string;

    @OneToMany(() => PerfilVsTransacao, pvt => pvt.transacao)
    perfilVsTransacoes: PerfilVsTransacao[];
}
