import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterCategorys1701547705532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(

            `
                DELETE FROM category;

            `
        )

        queryRunner.query(

            ` 
                ALTER TABLE category ADD COLUMN 
                companyId INTEGER, 
                ADD Foreign Key (companyId) REFERENCES company(id) 
                ON DELETE CASCADE
                ON UPDATE CASCADE
                ;
            `)

        queryRunner.query(

            `
            INSERT INTO category (name,  created_at, updated_at, companyId)
                VALUES 
                    ('Aluguel', NOW(), NOW(), NULL),
                    ('Equipamentos', NOW(), NOW(), NULL),
                    ('Supermercado', NOW(), NOW(), NULL),
                    ('Alimentação', NOW(), NOW(), NULL),
                    ('Água', NOW(), NOW(), NULL),
                    ('Internet', NOW(), NOW(), NULL),
                    ('Salário', NOW(), NOW(), NULL),
                    ('Cartão de crédito', NOW(), NOW(), NULL),
                    ('Energia', NOW(), NOW(), NULL);        
            `
        )         
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
        `
            ALTER TABLE category DROP COLUMN companyId;
         
        `
        )
        queryRunner.query(
            `
                DELETE FROM category;
            `
        )
    }

}
