import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transactions } from "./transactions.entity";
import { Employee } from "./employee.entity";

@Entity()
export class Company{
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar',{length: 255})
    name: string

    @Column('varchar',{length: 255})
    email: string

    @Column('varchar',{length: 255})
    password: string

    @OneToMany(() => Transactions, (transactions) => transactions.company)
    transactions: Transactions[]

    @OneToMany(() => Employee, (employee) => employee.company)
    employee: Employee[]

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
} 