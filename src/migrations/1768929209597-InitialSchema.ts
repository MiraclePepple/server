import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768929209597 implements MigrationInterface {
    name = 'InitialSchema1768929209597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenant" ("tenant_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "db_name" character varying, "business_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "logo" character varying, "currency" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_fcfc86b77a9706bff4bcc49f8a1" UNIQUE ("db_name"), CONSTRAINT "UQ_5b5d9635409048b7144f5f23198" UNIQUE ("email"), CONSTRAINT "PK_4e7cb4e84f82aa7842a0bafc673" PRIMARY KEY ("tenant_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenant"`);
    }

}
