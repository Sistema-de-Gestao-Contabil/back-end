import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

//As entities representam as tabelas do banco de dados. Por exemplo a entities da tabela users abaixo
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @OneToOne(() => Employee)
  @JoinColumn()
  employee: Employee;

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
