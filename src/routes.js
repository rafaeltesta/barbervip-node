const express = require("express");
const routes = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import BarbeiroController  from './controllers/BarbeiroController'


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



module.exports = routes;


