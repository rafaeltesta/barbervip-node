-- CreateTable
CREATE TABLE "servico" (
    "cdServico" SERIAL NOT NULL,
    "nome" TEXT,
    "valor" DECIMAL(65,30),
    "barbeiroCd" INTEGER NOT NULL,

    CONSTRAINT "servico_pkey" PRIMARY KEY ("cdServico")
);

-- CreateTable
CREATE TABLE "barbeiro" (
    "cdBarbeiro" SERIAL NOT NULL,
    "nome" TEXT,
    "cpf" TEXT,
    "barbeariaCd" INTEGER NOT NULL,

    CONSTRAINT "barbeiro_pkey" PRIMARY KEY ("cdBarbeiro")
);

-- CreateTable
CREATE TABLE "barbearia" (
    "cdBarbearia" SERIAL NOT NULL,
    "nome" TEXT,
    "cnpj" TEXT,
    "endereco" TEXT,

    CONSTRAINT "barbearia_pkey" PRIMARY KEY ("cdBarbearia")
);

-- CreateTable
CREATE TABLE "agendamento" (
    "cdAgendamento" SERIAL NOT NULL,
    "horario" TIMESTAMP(3),
    "servicoCd" INTEGER NOT NULL,
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "agendamento_pkey" PRIMARY KEY ("cdAgendamento")
);

-- AddForeignKey
ALTER TABLE "servico" ADD CONSTRAINT "fk_barbeiro_servico" FOREIGN KEY ("barbeiroCd") REFERENCES "barbeiro"("cdBarbeiro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barbeiro" ADD CONSTRAINT "fk_barbearia_barbeiro" FOREIGN KEY ("barbeariaCd") REFERENCES "barbearia"("cdBarbearia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "fk_servico_barbearia" FOREIGN KEY ("servicoCd") REFERENCES "servico"("cdServico") ON DELETE RESTRICT ON UPDATE CASCADE;
