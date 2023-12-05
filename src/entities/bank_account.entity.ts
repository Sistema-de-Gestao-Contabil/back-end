import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 15 })
  numberAccount: string;

  @Column('varchar', { length: 15 })
  agency: string;

  @Column('boolean')
  active: boolean;

  @ManyToOne(() => Employee, (employee) => employee.bankAccount)
  employee: Employee;

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
