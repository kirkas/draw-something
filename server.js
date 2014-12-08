/* Dependencies */
var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var websocketServer = require('websocket').server;
var http = require('http');


/* Variable */
var port = 3000;
var socketPort = 3001;
var app = express();
var root = __dirname + '/app/';


/* Express config */
app.set('views', './app');
app.set('view engine', 'ejs');
app.use(express.static(root));


/* Route */
app.get('/', function(req, res) {
  res.render('index', {
    socketPort: socketPort
  });
});


/* Server */
app.listen(port);


/* WebSocket Server */
var server = http.createServer(app);
var clients = []; // création d'un tableau de clients (utilisateurs)

// initialisation du serveur websocket (ws)
var wsServer = new websocketServer({
  httpServer: server
});

server.listen(socketPort, function() {
  console.log("Server is running !" + socketPort); // message dans la console
});




// ----------------------------------------------------------------------------------------------------------------------------------------
// GESTION PAR LE WS SERVER
// ----------------------------------------------------------------------------------------------------------------------------------------
// se connecte au serveur
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  console.log("le WS server a reçu une request d'initialisation");

  // gestion des clients (utilisateurs)
  var date = new Date();
  // on nomme les clients d'après l'heure (heure, minutes, secondes, millisecondes)
  var clientName = 'client_' + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
  clients[clientName] = connection;

  // message automatiquement envoyé à la connexion d'un utilisateur
  connection.on('message', function(message) {
    console.log(message);

    // pour tous les clients "name" que vous trouvez dans clients
    for (var clientName in clients) {
      clients[clientName].sendUTF(JSON.stringify({
        data: message.utf8Data,
        name: clientName
      }));
    }
  })

});


// se déconnecte du serveur
wsServer.on('close', function(connection) {
  // Client leave
});