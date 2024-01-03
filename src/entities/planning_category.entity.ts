import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Planning } from './planning.entity';
import { Category } from './category.entity';

@Entity()
export class PlanningCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Planning, (planningId) => planningId.hasCategory)
  planning: Planning;

  @ManyToOne(() => Category, (categoryId) => categoryId.hasCategory)
  category: Category;

  @Column('float')
  valuePerCategory: number;
}
