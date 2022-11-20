/*
  Warnings:

  - You are about to drop the column `usuarioCd` on the `agendamento` table. All the data in the column will be lost.
  - Added the required column `barbeiroCd` to the `agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "agendamento" DROP CONSTRAINT "fk_usuario_agendamento";

-- AlterTable
ALTER TABLE "agendamento" DROP COLUMN "usuarioCd",
ADD COLUMN     "barbeiroCd" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_barbeiro_agendamento" FOREIGN KEY ("barbeiroCd") REFERENCES "barbeiro"("cdBarbeiro") ON DELETE RESTRICT ON UPDATE CASCADE;
