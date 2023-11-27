import { MigrationInterface, QueryRunner } from "typeorm"

export class BankAccount1701028323727 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            CREATE TABLE bank_account(
                id INTEGER AUTO_INCREMENT,
                employeeId INTEGER NOT NULL,
                numberAccount VARCHAR(15) NOT NULL,
                agency VARCHAR(15) NOT NULL,
                active BOOLEAN NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                PRIMARY KEY(id),
                Foreign Key (employeeId) REFERENCES employee(id) 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            );
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            DROP TABLE bank_account;
            `
        )
    }

}
