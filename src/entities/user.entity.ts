import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//As entities representam as tabelas do banco de dados. Por exemplo a entities da tabela users abaixo
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 255})
    name: string

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
}
