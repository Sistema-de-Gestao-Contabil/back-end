import { MigrationInterface, QueryRunner } from 'typeorm';

export class Roles1703446937923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE roles(
              id INTEGER AUTO_INCREMENT,
              name VARCHAR(255) NOT NULL UNIQUE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (id)
            );
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            DROP TABLE roles;
            `,
    );
  }
}
