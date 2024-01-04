import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Type {
  ADMIN = 'admin',
  GESTOR = 'gestor',
  CONTADOR = 'contador',
}

//As entities representam as tabelas do banco de dados. Por exemplo a entities da tabela users abaixo
@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.roles)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
