import { MigrationInterface, QueryRunner } from 'typeorm';

export class Employee1701027935083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            CREATE TABLE employee(
                id INTEGER AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                office VARCHAR(255) NOT NULL,
                cpf VARCHAR(14) NOT NULL,
                phone VARCHAR(16) NOT NULL,
                dt_birth VARCHAR(255),
                wage DECIMAL(10, 2) NOT NULL,
                paymentDay INT NOT NULL,
                status ENUM('ativo', 'licença', 'rescisão') NOT NULL,
                companyId INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
                FOREIGN KEY (companyId) REFERENCES company (id) ON DELETE CASCADE ON UPDATE CASCADE,
                PRIMARY KEY (id)
            );
            
            `,
      // type ENUM('receita', 'despesa') NOT NULL,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `
            DROP TABLE employee;
            `,
    );
  }
}
