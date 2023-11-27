import { MigrationInterface, QueryRunner } from "typeorm"

export class Employee1701027935083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            CREATE TABLE employee(
                id INTEGER AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                office VARCHAR(255) NOT NULL,
                cpf VARCHAR(14) NOT NULL,
                companyId INTEGER NOT NULL,
                wageId INTEGER NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                PRIMARY KEY(id),
                Foreign Key (companyId) REFERENCES company(id) 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                Foreign Key (wageId) REFERENCES wage(id) 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            );
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            DROP TABLE employee;
            `
        )
    }

}
