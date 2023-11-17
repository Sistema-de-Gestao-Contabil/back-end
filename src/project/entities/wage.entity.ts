import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Wage{
    @PrimaryGeneratedColumn()
    id: number

    @Column('float')
    value: number

    @Column('datetime')
    date: string

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
} 