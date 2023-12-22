import { MigrationInterface, QueryRunner } from 'typeorm';

export class Category1701001215732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE TABLE category (
                id INTEGER AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                companyId INTEGER,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                Foreign Key (companyId) REFERENCES company(id) 
                ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY (id)
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
