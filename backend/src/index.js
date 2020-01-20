const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://kaualima:kauabonitao@cluster0-92sws.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

// Métodos HTTP: GET, POST, PUT, DELETE

/*Tipos de parâmetros:

Query params (Geralmente utilizado em GET): request.query (Filtros, Ordenação, Paginação, ...)
Route params (Geralmente utilizado em PUT ou DELETE): request.params (Identificar um recurso na alteração ou remoção)
Body (Geralmente utilzado em post e put) request.body (Dados para a criação ou alteração de um registro) 
*/

// MongoDB (Não-Relacional)

server.listen(3333);