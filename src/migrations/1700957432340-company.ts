import { MigrationInterface, QueryRunner } from 'typeorm';

export class Company1700957432340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE company(
                id INTEGER AUTO_INCREMENT,
                sectorId INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                phone VARCHAR(16),
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                FOREIGN KEY (sectorId) REFERENCES sector(id) 
                ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY (id)
            );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE company;`);
  }
}
