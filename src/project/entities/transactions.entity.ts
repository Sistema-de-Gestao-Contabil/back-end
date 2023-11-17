import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Company } from "./company.entity";

export enum Type {
    RECEITA = "receita",
    DESPESA = "despesa",
}

@Entity()
export class Transactions{
    @PrimaryGeneratedColumn()
    id: number

    @Column('float')
    value: number

    @Column('varchar',{length: 255})
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

    @OneToOne(() => Category)
    @JoinColumn()
    categoryId: Category

    @ManyToOne(() => Company, (company) => company.transactions)
    company: Company

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
} 