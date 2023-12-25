import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanningCategory } from './planning_category.entity';

@Entity()
export class Planning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: string;

  @Column('float')
  value: number;

  // @ManyToMany(() => Category)
  // @JoinTable()
  // categories: Category[]

  @OneToMany(
    () => PlanningCategory,
    (PlanningCategory) => PlanningCategory.planning,
  )
  hasCategory: PlanningCategory[];

  @CreateDateColumn({ name: 'created_at' })
  createAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
