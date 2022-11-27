const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const secret = "mysecret";
const bcrypt = require('bcrypt');

module.exports = {

    //Busca todos usuarios cadastrados
    async index(request, response) {
        const usuario = await prisma.usuario.findMany();
        response.json(usuario);
    },

    //Cadastra Usuário
    async create(request, response) {
        const { nome, email, senha, barbeiroCd } = request.body;

        let usuario = await prisma.usuario.findUnique({ where: { email: email } });

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const senhaCypt = bcrypt.hashSync(senha, salt);

        if (!usuario) {
            const usuario = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: senhaCypt,
                    barbeiroCd,
                    
                },
            });

            return response.status(200).json(usuario);
        } else {
            return response.status(400).json({ error: "Erro ao realizar o cadastro!" });
        }
    },

    //Busca usuario pelo código
    async details(request, response) {
        const { cdUser } = request.params;

        const intCd = parseInt(cdUser);

        const usuario = await prisma.usuario.findUnique({ where: { cdUser: intCd } });
        response.json(usuario);
    },

    //Deleta usuário
    async delete(request, response) {
        const { cdUser } = request.params;

        const intCd = parseInt(cdUser);

        if (!intCd) {
            return response.status(400).json("O Código do usuario precisa ser inforamdo!");
        }

        const usuarioNaoExiste = await prisma.usuario.findUnique({ where: { cdUser: intCd } });

        if (!usuarioNaoExiste) {
            return response.status(404).json({ error: "Usuario não existe!" });
        }

        await prisma.usuario.delete({ where: { cdUser: intCd } });
        return response.status(200).send();
    },


    //Editar usuario
    async update(request, response) {
        const { cdUser, nome, email, senha } = request.body;

        if (!cdUser) {
            return response.status(400).json("O Código do usuario precisa ser inforamdo!");
        }

        const intCd = parseInt(cdUser);

        const usuario = await prisma.usuario.findUnique({ where: { cdUser: intCd } });

        if (!usuario) {
            return response.status(404).json("Usuario não existe!");
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const senhaCypt = bcrypt.hashSync(senha, salt);

        const user = await prisma.usuario.update({
            where: {
                cdUser: intCd,
            },
            data: {
                nome,
                email,
                senha: senhaCypt,
            },
        })
        return response.status(200).json(usuario);
    },


    //Fazer login
    async login(request, response) {
        const { email, senha } = request.body;

        const usuario = await prisma.$queryRaw`
        SELECT * 
            FROM usuario
           WHERE EMAIL = ${email}
    `

        if (usuario.length != 1) {
            console.log('a')
            response.status(400).json({ error: "Usuário não cadastrado!" });
        } else {
            bcrypt.compare(senha, usuario[0].senha, async function (err, same) {
                if (err) {
                    response.status(400).json({ error: "Erro no servidor. Por favor tente novamente!" });
                } else if (!same) {
                    response.status(400).json({  error: "Senha incorreta!" });
                } else {
                    const payload = { email };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: 864000
                    })
                    response.cookie('token', token, { httpOnly: true });
                    response.status(200).json({ status: 1, auth: true, token: token, barbeiroCd: usuario[0].barbeiroCd,cdUser: usuario[0].cdUser, userName: usuario[0].nome });
                }
            })
        }
    },

    //Validar Token
    async checkToken(request, response) {
        const token = request.body.token || request.query.token || request.cookies.token || request.headers['x-acess-token'];
        const {cdUser} = request.params;

        const intCod = parseInt(cdUser);

       console.log(intCod)
            const usuario = await prisma.$queryRaw`
            SELECT * 
                FROM usuario
               WHERE "cdUser" = ${intCod}
        `
        
        console.log(usuario)
        if (!token) {
            response.json({ status: 401, msg: 'Não autorizado: Token inexistente!' });
        } else {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    response.json({ status: 401, msg: 'Não autorizado: Token inválido!' });
                } else {

                    response.json({ status: 200,  barbeiroCd: usuario[0].barbeiroCd, cdUser: usuario[0].cdUser, userName: usuario[0].nome});
                }
            })
        }
    },


    //Fazer logout
    async destroyToken(request, response) {
        const token = request.params;

        if (token) {
            response.cookie('token', null, { httpOnly: true });
        } else {
            response.status(401).send("Logout não autorizado!");
        }

        response.send("Sessão finalizada com sucesso!");
    },



}