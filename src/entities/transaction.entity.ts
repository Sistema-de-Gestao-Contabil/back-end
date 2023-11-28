import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Company } from "./company.entity";

export enum Type {
    RECEITA = "receita",
    DESPESA = "despesa",
}

@Entity()
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number

    @Column('decimal')
    value: number

    @Column()
    description: string

    @Column('datetime')
    date: string

    @Column({
        type:"enum",
        enum: Type,
        default: Type.RECEITA
    })
    type: Type

    @Column('boolean')
    status: boolean

    @ManyToOne(() => Category, (category) => category.transactions )
    //@JoinColumn({name: 'id'})
    category: Category

    @ManyToOne(() => Company, (company) => company.transactions)
    company: Company

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
} 