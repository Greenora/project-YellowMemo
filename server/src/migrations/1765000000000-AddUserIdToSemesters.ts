import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToSemesters1765000000000 implements MigrationInterface {
    name = 'AddUserIdToSemesters1765000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add userId column to semesters table
        await queryRunner.query(`ALTER TABLE \`semesters\` ADD COLUMN \`userId\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove userId column
        await queryRunner.query(`ALTER TABLE \`semesters\` DROP COLUMN \`userId\``);
    }
}
