const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {

    async create(request, response) {
        const { nome, cpf, endereco, barbeariaCd } = request.body;

        //Valida se foi passado um nome
        if (!nome) {
            return response.status(400).json({ error: "Necessario um nome!" });
        }
        //Valida se foi passado uma data
        if (!cpf) {
            return response.status(400).json({ error: "Necessario um CPF!" });
        }
        //Valida se foi passado um local
        if (!endereco) {
            return response.status(400).json({ error: "Necessario um endereço!" });
        }


        //Cadastra o barbeiro
        const barbeiro = await prisma.barbeiro.create({
            data: {
                nome,
                cpf,
                endereco,
                barbeariaCd
            },
        });

        return response.status(201).json(barbeiro);
    },


    //Consultar barbeiros
    async get(request, response) {
        const barbeiro = await prisma.barbeiro.findMany();
        return response.status(200).json(barbeiro);
    },


    //Excluir barbeiro
    async delete(request, response) {
        const { cdBarbeiro } = request.params;

        const intCod = parseInt(cdBarbeiro);

        //Valida se foi passado o código do barbeiro
        if (!intCod) {
            return response.status(400).json("O Código do barbeiro precisa ser inforamdo!");
        }

        //Valida se o barbeiro existe
        const barbeiroNaoExiste = await prisma.barbeiro.findUnique({ where: { cdBarbeiro: intCod } });

        //Retorna erro caso o barbeiro não exista
        if (!barbeiroNaoExiste) {
            return response.status(404).json("Barbeiro não existe!");
        }

        //Deleta o barbeiro
        await prisma.barbeiro.delete({ where: { cdBarbeiro: intCod } });

        return response.status(200).send();
    },


    //Busca barbeiro pelo cd
    async details(request, response) {
        const { cdBarbeiro } = request.params;

        const intCd = parseInt(cdBarbeiro);

        const barbeiro = await prisma.barbeiro.findUnique({ where: { cdBarbeiro: intCd } });
        response.json(barbeiro);
    },

    //Editar barbeiro
    async update(request, response) {
        const { cdBarbeiro, nome, cpf, endereco } = request.body;

        //Verifica se foi passado o código do barbeiro
        if (!cdBarbeiro) {
            return response.status(400).json("O Código do barbeiro precisa ser inforamdo!");
        }

        const intCd = parseInt(cdBarbeiro);

        //Busca o barbeiro pelo código
        const barbeiro = await prisma.barbeiro.findUnique({ where: { cdBarbeiro: intCd } });

        //Retorna erro caso o barbeiro não exista
        if (!barbeiro) {
            return response.status(404).json("barbeiro não existe!");
        }

        //Faz a atualização do barbeiro
        const event = await prisma.barbeiro.update({
            where: {
                cdBarbeiro: intCd,
            },
            data: {
                nome,
                cpf,
                endereco,
            },
        })
        return response.status(200).json(barbeiro);
    },
}