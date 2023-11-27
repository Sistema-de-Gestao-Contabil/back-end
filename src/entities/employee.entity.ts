import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Company } from "./company.entity";
import { BankAccount } from "./bank_account.entity";
import { Wage } from "./wage.entity";

@Entity()
export class Employee{
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar',{length: 255})
    name: string

    @Column('varchar',{length: 255})
    office: string

    @Column('varchar',{length: 14})
    cpf: string

    @ManyToOne(() => Company, (company) => company.employee)
    company: Company

    @OneToMany(() => BankAccount, (bankAccount) => bankAccount.employee)
    bankAccount: BankAccount[]

    @OneToOne(() => Wage)
    @JoinColumn()
    wage: Wage

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
} 