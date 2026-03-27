import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Perfil } from './Perfil';

@Entity({ name: 'usuarios', schema: 'sandbox' })
export class Usuario {
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column()
    nome_usuario: string;

    @Column({ unique: true })
    email_usuario: string;

    @ManyToMany(() => Perfil, perfil => perfil.usuarios)
    @JoinTable({
        name: 'usuarios_vs_perfil',
        schema: 'sandbox',
        joinColumn: {
            name: 'id_usuario',
            referencedColumnName: 'id_usuario',
        },
        inverseJoinColumn: {
            name: 'id_perfil',
            referencedColumnName: 'id_perfil',
        },
    })
    perfis: Perfil[];
}
