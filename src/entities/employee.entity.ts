import {
  Column,
  CreateDateColumn,
  Entity,
  // JoinColumn,
  ManyToOne,
  OneToMany,
  // OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { BankAccount } from './bank_account.entity';
import { Transaction } from './transaction.entity';
// import { Wage } from './wage.entity';

export enum EmployeeStatus {
  ATIVO = 'ativo',
  LICENÇA = 'licença',
  RESCISÃO = 'rescisão',
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  office: string;

  @Column('varchar', { length: 14 })
  cpf: string;

  @Column('varchar', { length: 15 })
  phone: string;

  @Column({ name: 'dt_birth', nullable: true })
  dtBirth: Date;

  @Column()
  wage: number;

  @Column('int')
  paymentDay: number;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ATIVO,
  })
  status: EmployeeStatus;

  @ManyToOne(() => Company, (company) => company.employees)
  company: Company;

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.employee)
  bankAccount: BankAccount[];

  // @OneToOne(() => Wage)
  // @JoinColumn()
  // wage: Wage;

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @OneToMany(() => Transaction, (transaction) => transaction.employee)
  transactions: Transaction[];
}
