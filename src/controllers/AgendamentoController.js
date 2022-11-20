const { startOfHour, parseISO, isBefore, format, subHours } =  require('date-fns');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



module.exports = {
    
    async store(req, res) {
      

        const { horario, servicoCd, barbeiroCd, userCd } = req.body;


        // -> Chegagem de Horarios
        //
        // parseIso tranforma a string repassada em um objeto em um date do javascript
        // o startofhour pega o inicio da hora, se tiver 19:30 ele vai pegar 19:00..
        const hourStart = startOfHour(parseISO(horario));
        // -> hourStart esta antes da data atual?
        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ error: 'Datas anteriores não são permitidas' });
        }
        //
        // -> Agendamento no mesmo horario?
        const checkAvailability = await prisma.agendamento.findMany({
            where: {
                canceled_at: null,
                horario: hourStart,
            },
        });

        console.log(horario)
        const horarioTemp = parseISO(horario);
        const intCodServico = parseInt(servicoCd);
        const intCodBarbeiro = parseInt(barbeiroCd);
        console.log(checkAvailability)
        // -> se ele encontrou o agendamento significa que o horarios NÃO está vago..
        if (checkAvailability.length === 1) {
            return res
                .status(400)
                .json({ error: 'A data do agendamento não está disponível.' });
        }
        //

        console.log(horarioTemp)
        // -> Se passou por todas as validacoes agora sim é criado o agendamento
        const appointment = await prisma.agendamento.create({
            data: {
                horario: horarioTemp,
                servicoCd: intCodServico,
                barbeiroCd: intCodBarbeiro,
                userCd: userCd
            }
        });
        //

        return res.json(appointment);
    },

    async delete(request, response) {
        const { cdAgendamento } = request.params;

        const intCod = parseInt(cdAgendamento);

        //Valida se foi passado o código do agendamento
        if (!intCod) {
            return response.status(400).json("O Código do agendamento precisa ser inforamdo!");
        }

        //Valida se o agendamento existe
        const agendamentoNaoExiste = await prisma.agendamento.findUnique({ where: { cdAgendamento: intCod } });

        //Retorna erro caso o agendamento não exista
        if (!agendamentoNaoExiste) {
            return response.status(404).json("Agendamento não existe!");
        }

        //Deleta o agendamento
        await prisma.agendamento.delete({ where: { cdAgendamento: intCod } });

        return response.status(200).send();
    },


    async buscaReservas(req, res) {

        const { userCd } = req.params;

        const intCod = parseInt(userCd);

        const reservas = await prisma.$queryRaw`
        SELECT AGENDAMENTO."cdAgendamento",
               SERVICO.NOME SERVICO,
	           AGENDAMENTO.HORARIO,
	           BARBEIRO.NOME BARBEIRO
          FROM SERVICO, AGENDAMENTO, BARBEIRO
         WHERE AGENDAMENTO."canceled_at" IS NULL
           AND AGENDAMENTO."userCd" = ${intCod}
           AND BARBEIRO."cdBarbeiro" = AGENDAMENTO."barbeiroCd"
		   AND SERVICO."cdServico" = AGENDAMENTO."servicoCd"
        `
        return res.json(reservas);
    },

    async buscaAllAgendamentos(req, res) {

        const { cdBarbeiro } = req.params;

        const intCod = parseInt(cdBarbeiro);

        const reservas = await prisma.$queryRaw`
        SELECT AGENDAMENTO."cdAgendamento",
               SERVICO.NOME SERVICO,
	           AGENDAMENTO.HORARIO,
	           BARBEIRO.NOME BARBEIRO
          FROM SERVICO, AGENDAMENTO, BARBEIRO
         WHERE AGENDAMENTO."canceled_at" IS NULL
           AND BARBEIRO."cdBarbeiro" = AGENDAMENTO."barbeiroCd"
		   AND SERVICO."cdServico" = AGENDAMENTO."servicoCd"
           AND AGENDAMENTO."barbeiroCd" = ${intCod}
        `
        return res.json(reservas);
    },

    async confirmAgendamento(req, res) {

        const { servicoCd, barbeiroCd } = req.params;

        const intCodServico = parseInt(servicoCd);
        const intCodBarbeiro = parseInt(barbeiroCd);

        const confirm = await prisma.$queryRaw`
            SELECT BARBEIRO.NOME BARBEIRO,
                   SERVICO.NOME  SERVICO
              FROM BARBEIRO, SERVICO
             WHERE BARBEIRO."cdBarbeiro" = ${intCodBarbeiro}
               AND  SERVICO."cdServico" = ${intCodServico}
        `
        return res.json(confirm);
    },
}
