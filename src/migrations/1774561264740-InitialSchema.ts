import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1774561264740 implements MigrationInterface {
    name = 'InitialSchema1774561264740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sandbox"."transacao" ("id_transacao" SERIAL NOT NULL, "nome_transacao" character varying NOT NULL, CONSTRAINT "UQ_d09b0e4f65033025d878bbc1391" UNIQUE ("nome_transacao"), CONSTRAINT "PK_2048d59eea7774913bff69fb7f0" PRIMARY KEY ("id_transacao"))`);
        await queryRunner.query(`CREATE TABLE "sandbox"."perfil_vs_transacao" ("id" SERIAL NOT NULL, "autorizacao" character varying NOT NULL, "id_perfil" integer, "id_transacao" integer, CONSTRAINT "PK_a5c7d03af6d6d8982ccafad0332" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sandbox"."perfil" ("id_perfil" SERIAL NOT NULL, "nome_perfil" character varying NOT NULL, CONSTRAINT "UQ_0c81a44bffefc5a32c8fa9d53e6" UNIQUE ("nome_perfil"), CONSTRAINT "PK_79181da5d8898aa87d57118dbf1" PRIMARY KEY ("id_perfil"))`);
        await queryRunner.query(`CREATE TABLE "sandbox"."usuarios" ("id_usuario" SERIAL NOT NULL, "nome_usuario" character varying NOT NULL, "email_usuario" character varying NOT NULL, CONSTRAINT "UQ_d6fafb07a27c140e10dec207c11" UNIQUE ("email_usuario"), CONSTRAINT "PK_dfe59db369749f9042499fd8107" PRIMARY KEY ("id_usuario"))`);
        await queryRunner.query(`CREATE TABLE "sandbox"."usuarios_vs_perfil" ("id_usuario" integer NOT NULL, "id_perfil" integer NOT NULL, CONSTRAINT "PK_6c3f3ee28c5384abffd0cad8814" PRIMARY KEY ("id_usuario", "id_perfil"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3128986d5b6ed82eefa2d67ebb" ON "sandbox"."usuarios_vs_perfil" ("id_usuario") `);
        await queryRunner.query(`CREATE INDEX "IDX_17dff1835fcb135215e679c38f" ON "sandbox"."usuarios_vs_perfil" ("id_perfil") `);
        await queryRunner.query(`ALTER TABLE "sandbox"."perfil_vs_transacao" ADD CONSTRAINT "FK_dab9a46ead959d6d9c769855f10" FOREIGN KEY ("id_perfil") REFERENCES "sandbox"."perfil"("id_perfil") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sandbox"."perfil_vs_transacao" ADD CONSTRAINT "FK_0e15c380533f3f89246bb865a2e" FOREIGN KEY ("id_transacao") REFERENCES "sandbox"."transacao"("id_transacao") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sandbox"."usuarios_vs_perfil" ADD CONSTRAINT "FK_3128986d5b6ed82eefa2d67ebb2" FOREIGN KEY ("id_usuario") REFERENCES "sandbox"."usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sandbox"."usuarios_vs_perfil" ADD CONSTRAINT "FK_17dff1835fcb135215e679c38f8" FOREIGN KEY ("id_perfil") REFERENCES "sandbox"."perfil"("id_perfil") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sandbox"."usuarios_vs_perfil" DROP CONSTRAINT "FK_17dff1835fcb135215e679c38f8"`);
        await queryRunner.query(`ALTER TABLE "sandbox"."usuarios_vs_perfil" DROP CONSTRAINT "FK_3128986d5b6ed82eefa2d67ebb2"`);
        await queryRunner.query(`ALTER TABLE "sandbox"."perfil_vs_transacao" DROP CONSTRAINT "FK_0e15c380533f3f89246bb865a2e"`);
        await queryRunner.query(`ALTER TABLE "sandbox"."perfil_vs_transacao" DROP CONSTRAINT "FK_dab9a46ead959d6d9c769855f10"`);
        await queryRunner.query(`DROP INDEX "sandbox"."IDX_17dff1835fcb135215e679c38f"`);
        await queryRunner.query(`DROP INDEX "sandbox"."IDX_3128986d5b6ed82eefa2d67ebb"`);
        await queryRunner.query(`DROP TABLE "sandbox"."usuarios_vs_perfil"`);
        await queryRunner.query(`DROP TABLE "sandbox"."usuarios"`);
        await queryRunner.query(`DROP TABLE "sandbox"."perfil"`);
        await queryRunner.query(`DROP TABLE "sandbox"."perfil_vs_transacao"`);
        await queryRunner.query(`DROP TABLE "sandbox"."transacao"`);
    }

}
