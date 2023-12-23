import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Employee } from './employee.entity';
import { Sector } from './sector.entity';
import { Category } from './category.entity';
import { Planning } from './planning.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'cash_balance' })
  cashBalance: number;

  @ManyToOne(() => Sector, (sector) => sector.company)
  sector: Sector;

  @OneToMany(() => Transaction, (transaction) => transaction.company)
  transactions: Transaction[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  @OneToMany(() => Planning, (planning) => planning.company)
  plannings: Planning[];

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @OneToMany(() => Category, (category) => category.company)
  category: Category[];
}
