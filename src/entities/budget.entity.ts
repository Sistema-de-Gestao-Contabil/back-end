import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Budget{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    month: string

    @Column('float')
    value: number

    @CreateDateColumn({name: 'created_at'})
    createAt: string

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:string
} 