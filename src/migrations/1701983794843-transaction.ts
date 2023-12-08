import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1701983794843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE TABLE transaction (
                id INTEGER AUTO_INCREMENT,
                categoryId INTEGER NOT NULL,
                companyId INTEGER NOT NULL,
                employeeId INTEGER,
                value DECIMAL(10,2) NOT NULL,
                description TEXT NOT NULL,
                date DATETIME NOT NULL,
                type ENUM('receita', 'despesa') NOT NULL,
                status BOOLEAN NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (employeeId) REFERENCES employee(id) 
                ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (categoryId) REFERENCES category(id) 
                ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (companyId) REFERENCES company(id) 
                ON DELETE CASCADE ON UPDATE CASCADE
            );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            DROP TABLE transaction;
            `,
    );
  }
}
