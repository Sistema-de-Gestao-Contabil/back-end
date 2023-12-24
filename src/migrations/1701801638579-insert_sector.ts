import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSector1701801638579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            INSERT INTO sector (name, created_at, updated_at)
            VALUES 
            ('Setor Varejista', NOW(), NOW()),
            ('Setor Jurídico', NOW(), NOW()),
            ('Setor de Tecnologia da Informação (TI)', NOW(), NOW()),
            ('Setor de Saúde', NOW(), NOW()),
            ('Setor Automotivo', NOW(), NOW()),
            ('Setor Alimentício', NOW(), NOW()),
            ('Setor Financeiro', NOW(), NOW()),
            ('Setor Educacional', NOW(), NOW()),
            ('Setor de Construção Civil', NOW(), NOW()),
            ('Setor de Logística e Transporte', NOW(), NOW());
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM sector;`);
  }
}
