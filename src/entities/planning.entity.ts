import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable,
  ManyToMany,
  OneToMany, OneToOne, PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanningCategory } from './planning_category.entity';
import { Category } from './category.entity';

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

  @CreateDateColumn({name: 'created_at'})
  createAt: string

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
