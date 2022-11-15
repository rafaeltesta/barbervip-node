const { startOfHour, parseISO, isBefore, format, subHours } =  require('date-fns');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



module.exports = {
    
    async store(req, res) {
      

        const { horario, servicoCd } = req.body;


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
        const checkAvailability = await prisma.agendamento.findUnique({
            where: {
                canceled_at: null,
                horario: hourStart,
            },
        });
        // -> se ele encontrou o agendamento significa que o horarios NÃO está vago..
        if (checkAvailability) {
            return res
                .status(400)
                .json({ error: 'A data do agendamento não está disponível.' });
        }
        //
        // -> Se passou por todas as validacoes agora sim é criado o agendamento
        const appointment = await Appointment.create({
            horario,
            servicoCd
        });
        //

        return res.json(appointment);
    },

    async delete(req, res) {
        // -> Busca o agendamento usando o id passado pelo parametro E inclui no retorno da listagem o provedor de servico tambem
        // pois sera usado para enviar o email
        const appointment = await prisma.agendamento.findByPk(req.params.id, {
           
        });
       
        // -> se estiver tudo certo
        appointment.canceled_at = new Date();
        await appointment.save();



        return res.json(appointment);
    }
}
