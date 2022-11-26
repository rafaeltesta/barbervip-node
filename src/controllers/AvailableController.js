const {
    startOfDay,
    endOfDay,
    setHours,
    setMinutes,
    setSeconds,
    format,
    isAfter,
} = require('date-fns');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {

    async index(req, res) {

        const { date } = req.query;
        const { barbeiroCd } = req.params;

        if (!date) {
            return res.status(404).json({ error: 'Data não encontrado' });
        }

        const searchDate = Number(date);
        const intCod = parseInt(barbeiroCd);

        const appointments = await prisma.$queryRaw`
            SELECT * 
              FROM agendamento
             WHERE canceled_at IS NULL
               AND horario BETWEEN ${startOfDay(searchDate)} AND ${endOfDay(searchDate)}
               AND "barbeiroCd" = ${intCod}
        `

        // -> Todos os Horários disponíveis
        const schedule = [
            '08:00',
            '08:30', // 2020-07-13 08:00:00
            '09:00',
            '09:30', // 2020-07-13 09:00:00
            '10:00',
            '10:30', // 2020-07-13 10:00:00
            '11:00',
            '11:30', // ...
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:70',
            '18:00',
            '18:30'
        ];


        const available = schedule.map(time => {

            const [hour, minute] = time.split(':');

            const value = setSeconds(
                setMinutes(setHours(searchDate, hour), minute),
                0
            );

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ss.xxxx"),
                available:
                    isAfter(value, new Date()) &&
            
                    !appointments.find(a => format(a.horario, 'HH:mm' ) === time),
            };
        });

        return res.json(available);
    }

}

