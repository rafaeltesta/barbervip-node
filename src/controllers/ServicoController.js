const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {

    async create(request, response) {
        const { nome, valor, barbeiroCd } = request.body;

        //Valida se foi passado um nome
        if (!nome) {
            return response.status(400).json({ error: "Necessario um nome!" });
        }
        //Valida se foi passado uma data
        if (!valor) {
            return response.status(400).json({ error: "Necessario um valor!" });
        }


        //Cadastra o servico
        const servico = await prisma.servico.create({
            data: {
                nome,
                valor,
                barbeiroCd
            },
        });

        return response.status(201).json(servico);
    },


    //Consultar servicos
    async get(request, response) {

        const { cdBarbeiro } = request.params;

        const intCod = parseInt(cdBarbeiro);

        const servico = await prisma.servico.findMany({ where: { barbeiroCd: intCod } });
        return response.status(200).json(servico);
    },


    //Excluir servico
    async delete(request, response) {
        const { cdServico } = request.params;

        const intCod = parseInt(cdServico);

        //Valida se foi passado o código do servico
        if (!intCod) {
            return response.status(400).json({ error: "O Código do serviço precisa ser inforamdo!"});
        }

        //Valida se o servico existe
        const servicoNaoExiste = await prisma.servico.findUnique({ where: { cdServico: intCod } });

        //Retorna erro caso o servico não exista
        if (!servicoNaoExiste) {
            return response.status(404).json({ error: "Servico não existe!"});
        }

        //Deleta o servico
        await prisma.servico.delete({ where: { cdServico: intCod } });

        return response.status(200).send();
    },


    //Busca servico pelo cd
    async details(request, response) {
        const { cdServico } = request.params;

        const intCd = parseInt(cdServico);

        const servico = await prisma.servico.findUnique({ where: { cdServico: intCd } });
        response.json(servico);
    },

    //Editar servico
    async update(request, response) {
        const { cdServico } = request.params;
        const {  nome, valor } = request.body;

        //Verifica se foi passado o código do servico
        if (!cdServico) {
            return response.status(400).json({ error: "O Código do servico precisa ser inforamdo!"});
        }

        if (!nome || !valor) {
            return response.status(400).json({ error: "Insira os dados!"});
        }

        const intCd = parseInt(cdServico);

        //Busca o servico pelo código
        const servico = await prisma.servico.findUnique({ where: { cdServico: intCd } });

        //Retorna erro caso o servico não exista
        if (!servico) {
            return response.status(404).json({ error: "servico não existe!"});
        }

        //Faz a atualização do servico
        const event = await prisma.servico.update({
            where: {
                cdServico: intCd,
            },
            data: {
                nome,
                valor
            },
        })
        return response.status(200).json(servico);
    },
}