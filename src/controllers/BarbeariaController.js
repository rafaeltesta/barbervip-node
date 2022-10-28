const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {

    async create(request, response) {
        const { nome, cnpj } = request.body;

        //Valida se foi passado um nome
        if (!nome) {
            return response.status(400).json({ error: "Necessario um nome!" });
        }
        //Valida se foi passado uma data
        if (!cnpj) {
            return response.status(400).json({ error: "Necessario um cnpj!" });
        }


        //Cadastra o barbearia
        const barbearia = await prisma.barbearia.create({
            data: {
                nome,
                cnpj,
            },
        });

        return response.status(201).json(barbearia);
    },


    //Consultar barbearias
    async get(request, response) {
        const barbearia = await prisma.barbearia.findMany();
        return response.status(200).json(barbearia);
    },


    //Excluir barbearia
    async delete(request, response) {
        const { cdBarbearia } = request.params;

        const intCod = parseInt(cdBarbearia);

        //Valida se foi passado o código do barbearia
        if (!intCod) {
            return response.status(400).json("O Código da barbearia precisa ser inforamdo!");
        }

        //Valida se o barbearia existe
        const barbeariaNaoExiste = await prisma.barbearia.findUnique({ where: { cdBarbearia: intCod } });

        //Retorna erro caso o barbearia não exista
        if (!barbeariaNaoExiste) {
            return response.status(404).json("barbearia não existe!");
        }

        //Deleta o barbearia
        await prisma.barbearia.delete({ where: { cdBarbearia: intCod } });

        return response.status(200).send();
    },


    //Busca barbearia pelo cd
    async details(request, response) {
        const { cdBarbearia } = request.params;

        const intCd = parseInt(cdBarbearia);

        const barbearia = await prisma.barbearia.findUnique({ where: { cdBarbearia: intCd } });
        response.json(barbearia);
    },

    //Editar barbearia
    async update(request, response) {
        const { cdBarbearia, nome, cnpj } = request.body;

        //Verifica se foi passado o código do barbearia
        if (!cdBarbearia) {
            return response.status(400).json("O Código do barbearia precisa ser inforamdo!");
        }

        const intCd = parseInt(cdBarbearia);

        //Busca o barbearia pelo código
        const barbearia = await prisma.barbearia.findUnique({ where: { cdBarbearia: intCd } });

        //Retorna erro caso o barbearia não exista
        if (!barbearia) {
            return response.status(404).json("barbearia não existe!");
        }

        //Faz a atualização do barbearia
        const event = await prisma.barbearia.update({
            where: {
                cdBarbearia: intCd,
            },
            data: {
                nome,
                cnpj,
                endereco
            },
        })
        return response.status(200).json(barbearia);
    },
}