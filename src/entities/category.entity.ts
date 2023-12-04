import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Company } from "./company.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

    @Column()
    name: string
    
    @Column()
    companyId: number

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

    @OneToMany(() => Transaction, (transaction) => transaction.category)
    transactions: Transaction[]

    @ManyToOne(() => Company, (company) => company.category)
    company: Company
} 