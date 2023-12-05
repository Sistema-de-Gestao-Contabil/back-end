import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Employee } from "./employee.entity";
import { Category } from './category.entity';

@Entity()
export class Company{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @OneToMany(() => Transaction, (transaction) => transaction.company)
    transactions: Transaction[]

    @OneToMany(() => Employee, (employee) => employee.company)
    employee: Employee[]

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string

    @OneToMany(() => Category, (category) => category.company)
    category: Category[]

} 