import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertCompany1701006035388 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            INSERT INTO company (name, email, password, created_at, updated_at)
            VALUES 
            ('Empresa1', 'empresa1@gmail.com', 'empresa123', NOW(), NOW())
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            DELETE FROM company;
            `
        )
    }

}
