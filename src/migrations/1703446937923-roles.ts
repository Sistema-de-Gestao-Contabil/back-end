import { MigrationInterface, QueryRunner } from "typeorm"

export class Roles1703446937923 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            CREATE TABLE roles(
                id INTEGER AUTO_INCREMENT,
                type ENUM('admin', 'gestor', 'contador') NOT NULL,
                employeeId INTEGER NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                Foreign Key (employeeId) REFERENCES employee(id) 
                ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY (id)
            );
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            DROP TABLE roles;
            `
        )
    }

}
