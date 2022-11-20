/*
  Warnings:

  - Added the required column `userCd` to the `agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agendamento" ADD COLUMN     "userCd" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_usuario_agendamento" FOREIGN KEY ("userCd") REFERENCES "usuario"("cdUser") ON DELETE RESTRICT ON UPDATE CASCADE;
