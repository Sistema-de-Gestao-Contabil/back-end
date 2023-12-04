import { MigrationInterface, QueryRunner } from "typeorm"

export class Planning1701010111395 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            CREATE TABLE planning (
                id INTEGER AUTO_INCREMENT,
                value DECIMAL(10,2) NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                PRIMARY KEY(id)
            );
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            DROP TABLE planning;
            `
        )
    }

}