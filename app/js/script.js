window.WebSocket = window.WebSocket || window.MozWebSocket;

if (!window.WebSocket) {
  // pour les navigateurs qui n'acceptent pas WS
  alert("Il faut changer de navigateur.");
} else {
  // pour les navigateurs qui acceptent WS

  // TOUT LE CODE VIENT ICI :
  // ------------------------

  // connection au serveur WS
  var connection = new WebSocket('ws://localhost:' + socketPort);

  // message automatiquement envoyé à la connexion d'un utilisateur
  connection.onopen = function() {
    connection.send('hello je me connecte');
  }

  connection.onmessage = function(message) {
    console.log(message);
    var json = JSON.parse(message.data);

    //document.body.innerHTML = json.data;

    try {
      var valeurs = JSON.parse(json.data);
      //document.body.innerHTML += "<br/> posx = "+valeurs.posx;
      //document.body.innerHTML += " posy = "+valeurs.posy;
      if (isLine) {
        ctx.lineTo(valeurs.posx, valeurs.posy);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ff0000';
        ctx.moveTo(valeurs.posx, valeurs.posy);
        isLine = true;
      }
    } catch (e) {
      //alert("Ceci n'est pas un tableau JSON");
    }

    console.log(json);
  };

  var canvas = document.getElementById("screen");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var isLine = false;

  // à chaque clic
  document.body.addEventListener("click", envoiMessage);

  // récupère les coordonnées de la souris et les renvois
  function envoiMessage(e) {
    var message = {
      posx: e.x,
      posy: e.y
    };
    connection.send(JSON.stringify(message));
  }

}