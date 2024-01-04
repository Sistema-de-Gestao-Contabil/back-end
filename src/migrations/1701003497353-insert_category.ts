import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCategory1701003497353 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            INSERT INTO category (name, type, created_at, updated_at)
            VALUES 
            ('Aluguel', 'despesa', NOW(), NOW()),
            ('Equipamentos', 'despesa', NOW(), NOW()),
            ('Supermercado', 'despesa', NOW(), NOW()),
            ('Alimentação', 'despesa', NOW(), NOW()),
            ('Água', 'despesa', NOW(), NOW()),
            ('Internet', 'despesa', NOW(), NOW()),
            ('Salário', 'despesa', NOW(), NOW()),
            ('Cartão de crédito', 'despesa', NOW(), NOW()),
            ('Energia', 'despesa', NOW(), NOW());
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            DELETE FROM category;
            `,
    );
  }
}
