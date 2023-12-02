import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Planning } from "./planning.entity";
import { Category } from "./category.entity";

@Entity()
export class PlanningCategory{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Planning, (planningId) => planningId.hasCategory )
    planningId: Planning;

    @ManyToOne(() => Category, (planningId) => planningId.hasCategory )
    categoryId: Category;

    @Column('float')
    valuePerCategory: number
} 