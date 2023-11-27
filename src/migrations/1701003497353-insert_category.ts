import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertCategory1701003497353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            INSERT INTO category (name, created_at, updated_at)
            VALUES 
            ('Aluguel', NOW(), NOW()),
            ('Equipamentos', NOW(), NOW()),
            ('Supermercado', NOW(), NOW()),
            ('Alimentação', NOW(), NOW()),
            ('Água', NOW(), NOW()),
            ('Internet', NOW(), NOW()),
            ('Salário', NOW(), NOW()),
            ('Cartão de crédito', NOW(), NOW()),
            ('Energia', NOW(), NOW());
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            DELETE FROM category;
            `
        )
    }

}
