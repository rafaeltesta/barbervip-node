/*
  Warnings:

  - Added the required column `usuarioCd` to the `agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agendamento" ADD COLUMN     "usuarioCd" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "usuario" (
    "cdUser" SERIAL NOT NULL,
    "nome" TEXT,
    "email" TEXT,
    "senha" TEXT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("cdUser")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- RenameForeignKey
ALTER TABLE "agendamento" RENAME CONSTRAINT "fk_servico_barbearia" TO "fk_servico_agendamento";

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_usuario_agendamento" FOREIGN KEY ("usuarioCd") REFERENCES "usuario"("cdUser") ON DELETE RESTRICT ON UPDATE CASCADE;
