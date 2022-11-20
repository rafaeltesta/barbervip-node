/*
  Warnings:

  - You are about to drop the column `tipo` on the `usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "tipo",
ADD COLUMN     "barbeiroCd" INTEGER;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_barbeiro_usuario" FOREIGN KEY ("barbeiroCd") REFERENCES "barbeiro"("cdBarbeiro") ON DELETE SET NULL ON UPDATE CASCADE;
