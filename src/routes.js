// import {AvailableController} from './controllers/AvailableController';
// import {AgendamentoController} from'./controllers/AgendamentoController';

const express = require("express");
const routes = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BarbeiroController = require('./controllers/BarbeiroController');
const BarbeariaController = require('./controllers/BarbeariaController');
const ServicoController = require('./controllers/ServicoController');



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
routes.get("/servico", ServicoController.get);

//Deletar servico
routes.delete("/servico/:cdServico", ServicoController.delete);

//Consultar servico por codigo
routes.get("/servico.details/:cdServico", ServicoController.details);

//Editar servico
routes.put("/servico/:cdServico", ServicoController.update);




// routes.get('/providers/available', AvailableController.index);

// routes.post('/appointments', AgendamentoController.store);


// routes.delete('/appointments/:agendamentoCd', AgendamentoController.delete);


module.exports = routes;


