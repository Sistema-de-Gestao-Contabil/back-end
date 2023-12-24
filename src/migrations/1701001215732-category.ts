import { MigrationInterface, QueryRunner } from 'typeorm';

export class Category1701001215732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE TABLE category (
                id INTEGER AUTO_INCREMENT,
                companyId INTEGER,
                name VARCHAR(255) NOT NULL,
                type ENUM('receita', 'despesa') NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (companyId) REFERENCES company(id) 
                ON DELETE CASCADE ON UPDATE CASCADE
            );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            DROP TABLE category;
            `,
    );
  }
}
