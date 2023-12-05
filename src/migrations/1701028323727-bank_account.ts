import { MigrationInterface, QueryRunner } from 'typeorm';

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
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
                FOREIGN KEY (employeeId) REFERENCES employee (id) ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY (id)
            );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE bank_account;`);
  }
}
