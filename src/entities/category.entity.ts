import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  // ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Company } from './company.entity';
import { PlanningCategory } from './planning_category.entity';

export enum Type {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

export enum Type {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Type,
  })
  type: Type;

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @ManyToOne(() => Company, (company) => company.category)
  company: Company;

  @OneToMany(
    () => PlanningCategory,
    (PlanningCategory) => PlanningCategory.category,
  )
  hasCategory: PlanningCategory[];
}
