import { MigrationInterface, QueryRunner } from "typeorm"

export class PlanningCategory1701011929542 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            CREATE TABLE planning_category(
                id INTEGER AUTO_INCREMENT,
                planningId INTEGER NOT NULL,
                categoryId INTEGER NOT NULL,
                created_at DATETIME DEFAULT now() NOT NULL,
                updated_at DATETIME DEFAULT now() NOT NULL,
                PRIMARY KEY(id),
                Foreign Key (planningId) REFERENCES planning(id) 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                Foreign Key (categoryId) REFERENCES category(id) 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            DROP TABLE planning_category;
            `
        )
    }

}
