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

  @ManyToOne(() => Sector, (sector) => sector.company, { onDelete: 'CASCADE' })
  sector: Sector;

  @OneToMany(() => Transaction, (transaction) => transaction.company)
  transactions: Transaction[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employee: Employee[];

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
