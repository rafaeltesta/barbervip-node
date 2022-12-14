const AvailableController = require('./controllers/AvailableController');
const AgendamentoController = require('./controllers/AgendamentoController');

const express = require("express");
const routes = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BarbeiroController = require('./controllers/BarbeiroController');
const BarbeariaController = require('./controllers/BarbeariaController');
const ServicoController = require('./controllers/ServicoController');
const UserController = require('./controllers/UserController');


//Criar barbeiro
routes.post("/barbeiro", BarbeiroController.create);

//Consultar barbeiro
routes.get("/barbeiro", BarbeiroController.get);

//Deletar barbeiro
routes.delete("/barbeiro/:cdBarbeiro", BarbeiroController.delete);

//Consultar barbeiro por codigo
routes.get("/barbeiro.details/:cdBarbeiro", BarbeiroController.details);

//Editar barbeiro
routes.put("/barbeiro", BarbeiroController.update);

/////////////////////////////////////////////////////

//Criar barbearia
routes.post("/barbearia", BarbeariaController.create);

//Consultar barbearia
routes.get("/barbearia", BarbeariaController.get);

//Deletar barbearia
routes.delete("/barbearia/:cdBarbearia", BarbeariaController.delete);

//Consultar barbearia por codigo
routes.get("/barbearia.details/:cdBarbearia", BarbeariaController.details);

//Editar barbearia
routes.put("/barbearia", BarbeariaController.update);

////////////////////////////////////////////////////
//Criar servico
routes.post("/servico", ServicoController.create);

//Consultar servico
routes.get("/servico/:cdBarbeiro", ServicoController.get);

//Deletar servico
routes.delete("/servico/:cdServico", ServicoController.delete);

//Consultar servico por codigo
routes.get("/servico.details/:cdServico", ServicoController.details);

//Editar servico
routes.put("/servico/:cdServico", ServicoController.update);




routes.get('/providers/available/:barbeiroCd', AvailableController.index);

routes.post('/appointments', AgendamentoController.store);
routes.get('/reservas/:userCd', AgendamentoController.buscaReservas);
routes.get('/agendamentos/:cdBarbeiro', AgendamentoController.buscaAllAgendamentos);
routes.get('/agendamento/:servicoCd/:barbeiroCd', AgendamentoController.confirmAgendamento);
//Deletar agendamento
routes.delete("/agendamento/:cdAgendamento", AgendamentoController.delete);


routes.delete('/appointments/:agendamentoCd', AgendamentoController.delete);

///////////////////////////////////////////////////////////////////////////////////////
//Criar User
routes.post("/user", UserController.create);

//Consultar usuarios
routes.get("/user", UserController.index);

//Consultar usuario por codigo
routes.get("/user.details/:cdUser", UserController.details);

//Deletar Usuario
routes.delete("/user/:cdUser", UserController.delete);

//Editar Usuario
routes.put("/user", UserController.update);

//Login
routes.post("/login", UserController.login);

//Validar token
routes.get("/checktoken/:cdUser", UserController.checkToken);

//Logout
routes.get("/destroytoken", UserController.destroyToken);


module.exports = routes;


