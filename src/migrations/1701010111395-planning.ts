import { MigrationInterface, QueryRunner } from 'typeorm';

export class Planning1701010111395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE TABLE planning (
                id INTEGER AUTO_INCREMENT,
                companyId INTEGER NOT NULL,
                month VARCHAR(255) NOT NULL UNIQUE,
                value DECIMAL(10,2) NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                PRIMARY KEY(id),
                Foreign Key (companyId) REFERENCES company(id) 
                ON DELETE CASCADE ON UPDATE CASCADE
            );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            DROP TABLE planning;
            `,
    );
  }
}
