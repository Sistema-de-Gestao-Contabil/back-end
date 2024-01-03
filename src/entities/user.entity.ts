import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './roles.entity';
import { Employee } from './employee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @ManyToOne(() => Roles, (role) => role.users)
  roles: Roles;
  // @ManyToOne(() => Roles, (role) => role.user)
  // @JoinColumn({ name: 'role_id' }) // Adicionando uma coluna de chave estrangeira
  // role: Roles;
  @OneToOne(() => Employee)
  @JoinColumn()
  employee: Employee;

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
