import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany, OneToOne, PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanningCategory } from './planning_category.entity';
import { Category } from './category.entity';
import { Company } from './company.entity';

@Entity()
export class Planning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: string

  @Column('float')
  value: number

// @ManyToMany(() => Category)
// @JoinTable()
// categories: Category[]

  @OneToMany(() => PlanningCategory, PlanningCategory => PlanningCategory.planning)
  hasCategory: PlanningCategory[]

  @ManyToOne(() => Company, (company) => company.transactions)
  company: Company;

  @CreateDateColumn({name: 'created_at'})
  createAt: string

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
