import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToSemesters1765000000000 implements MigrationInterface {
    name = 'AddUserIdToSemesters1765000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add userId column if it does not exist (fresh DB + seed already includes it)
        const hasUserId = await queryRunner.hasColumn('semesters', 'userId');
        if (!hasUserId) {
            await queryRunner.query(`ALTER TABLE \`semesters\` ADD COLUMN \`userId\` int NOT NULL`);
        }

        // Ensure existing rows are owned by admin user (id=1) instead of 0/null
        await queryRunner.query(`UPDATE \`semesters\` SET \`userId\` = 1 WHERE \`userId\` IS NULL OR \`userId\` = 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasUserId = await queryRunner.hasColumn('semesters', 'userId');
        if (hasUserId) {
            await queryRunner.query(`ALTER TABLE \`semesters\` DROP COLUMN \`userId\``);
        }
    }
}
