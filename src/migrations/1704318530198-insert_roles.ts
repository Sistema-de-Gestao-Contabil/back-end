import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRoles1704318530198 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
              INSERT INTO roles (name, created_at, updated_at)
              VALUES 
              ('ROLE_ADMIN', NOW(), NOW()),
              ('ROLE_MANAGER', NOW(), NOW()),
              ('ROLE_COUNTER', NOW(), NOW());
              `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
              DELETE FROM roles;
              `,
    );
  }
}
