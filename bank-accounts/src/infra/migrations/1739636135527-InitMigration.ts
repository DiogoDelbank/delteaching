import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1739636135527 implements MigrationInterface {
    name = 'InitMigration1739636135527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "BankAccounts"."Balances" (
                "bankAccountId" integer NOT NULL,
                "availableAmount" numeric(18, 2) NOT NULL,
                "blockedAmount" numeric(18, 2) NOT NULL,
                CONSTRAINT "PK_c96cc9ecdbcd8ba755c12ec897a" PRIMARY KEY ("bankAccountId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "BankAccounts"."BankAccounts" (
                "id" SERIAL NOT NULL,
                "branch" character varying(5) NOT NULL,
                "number" character varying(10) NOT NULL,
                "type" integer NOT NULL,
                "holderName" character varying(200) NOT NULL,
                "holderEmail" character varying(200) NOT NULL,
                "holderDocument" character varying(14) NOT NULL,
                "holderType" integer NOT NULL,
                "status" integer NOT NULL DEFAULT '1',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_df49e9300c23cf4c1b2ed944f32" UNIQUE ("number"),
                CONSTRAINT "PK_d9e001450b0c4099d29e2d9e32b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "BankAccounts"."Transactions" (
                "id" SERIAL NOT NULL,
                "type" integer NOT NULL,
                "amount" numeric(18, 2) NOT NULL,
                "counterpartyBankCode" character varying(3) NOT NULL,
                "counterpartyBankName" character varying(200) NOT NULL,
                "counterpartyBranch" character varying(5) NOT NULL,
                "counterpartyAccountNumber" character varying(10) NOT NULL,
                "counterpartyAccountType" integer NOT NULL,
                "counterpartyHolderName" character varying(200) NOT NULL,
                "counterpartyHolderType" integer NOT NULL,
                "counterpartyHolderDocument" character varying(14) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "bankAccountId" integer,
                CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "BankAccounts"."Balances"
            ADD CONSTRAINT "FK_c96cc9ecdbcd8ba755c12ec897a" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccounts"."BankAccounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "BankAccounts"."Transactions"
            ADD CONSTRAINT "FK_8f0144d3728faf4ecb048804cec" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccounts"."BankAccounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "BankAccounts"."Transactions" DROP CONSTRAINT "FK_8f0144d3728faf4ecb048804cec"
        `);
        await queryRunner.query(`
            ALTER TABLE "BankAccounts"."Balances" DROP CONSTRAINT "FK_c96cc9ecdbcd8ba755c12ec897a"
        `);
        await queryRunner.query(`
            DROP TABLE "BankAccounts"."Transactions"
        `);
        await queryRunner.query(`
            DROP TABLE "BankAccounts"."BankAccounts"
        `);
        await queryRunner.query(`
            DROP TABLE "BankAccounts"."Balances"
        `);
    }

}
