import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Planning{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    value: number

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[]

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
} 