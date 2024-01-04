import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1703275080570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE user(
              id INTEGER AUTO_INCREMENT,
              email VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL,
              employeeId INTEGER UNIQUE,
              roleId INTEGER NOT NULL,
              created_at DATETIME DEFAULT now() NOT NULL,
              updated_at DATETIME DEFAULT now() NOT NULL,
              FOREIGN KEY (roleId) REFERENCES roles(id) 
              ON DELETE CASCADE ON UPDATE CASCADE,
              FOREIGN KEY (employeeId) REFERENCES employee(id),
              
              PRIMARY KEY (id)
            )
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user;`);
  }
}
