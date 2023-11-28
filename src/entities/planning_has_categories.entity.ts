import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Budget } from "./budget.entity";
import { Planning } from "./planning.entity";
import { Category } from "./category.entity";

@Entity()
export class PlanningHasCategories{
    @PrimaryGeneratedColumn()
    id: number
    
    // @Column('float')
    // valuePerCategory: number

    @ManyToOne(() => Planning, (planning) => planning.hasCategory, {cascade: true})
    planning: Planning;

    @ManyToOne(() => Category, (category) => category.hasCategory, {cascade: true})
    category: Category;
} 