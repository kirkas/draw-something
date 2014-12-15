/* webSocket polyfill */
window.WebSocket = window.WebSocket || window.MozWebSocket;


// recherche dans le document HTML #tableau
var canva = document.getElementById('screen');



// définit le contexte (pour ensuite pouvoir dessiner dans le canva)
var context = canva.getContext('2d');

// variable qui définit si les actions avec la souris sont true / false
var isDrawing = false;

var setOfImage = '01';
var imageArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
var currentImage = 0;

var position = {
  x: 0,
  y: window.innerHeight / 2
};

var mouse = {
  x: 0,
  y: 0,
  down: false
}
var minImageSize = 5;

function init() {
  canva.width = window.innerWidth;
  canva.height = window.innerHeight;
  canva.addEventListener('mousemove', mouseMove, false);
  canva.addEventListener('mousedown', mouseDown, false);
  canva.addEventListener('mouseup', mouseUp, false);
  canva.addEventListener('mouseout', mouseUp, false);
}

function mouseMove(event) {
  mouse.x = event.pageX;
  mouse.y = event.pageY;
  if (isDrawing == true) drawImage(event.pageX, event.pageY);
}

function mouseDown(event) {
  isDrawing = true;
}

function mouseUp(event) {
  isDrawing = false;
}

function drawImage(x, y) {
  var image = new Image();
  image.src = 'img/' + setOfImage + '/' + imageArray[currentImage] + '.png';

  image.onload = function() {
    var positionX = x - image.width / 2;
    var positionY = y - image.height / 2;
    context.drawImage(image, positionX, positionY);
    currentImage++;
    if (currentImage > 8) currentImage = 0;
  }

}

/* Keyboard Logic */
function keyEvent(e) {
  if (e.keyCode == "32") {
    if (setOfImage == '01') {
      setOfImage = '02';
    } else if (setOfImage == '02') {
      setOfImage = '01';
    }
  }
}

window.addEventListener("keydown", keyEvent, false);


/* Socket logic */
function initWebSocket() {

  var connection = new WebSocket('ws://localhost:' + socketPort);
  connection.onopen = function() {
    connection.send('hello je me connecte');
  }

  connection.onmessage = function(message) {
    // console.log(message);
    if (isDrawing == false) {
      var json = JSON.parse(message.data);

      try {
        var valeurs = JSON.parse(json.data);
        currentImage = valeurs.currentImage;
        setOfImage = valeurs.setOfImage;
        drawImage(valeurs.posx, valeurs.posy);

      } catch (e) {
        //alert("Ceci n'est pas un tableau JSON");
      }
    }
  };

  // à chaque clic
  document.body.addEventListener("mousemove", function(e) {
    if (isDrawing) {
      var message = {
        posx: e.x,
        posy: e.y,
        setOfImage: setOfImage,
        currentImage: currentImage,
      };
      connection.send(JSON.stringify(message));
    }
  });
}








init();

if (!window.WebSocket) {
  // pour les navigateurs qui n'acceptent pas WS
  alert("Il faut changer de navigateur.");
} else {
  initWebSocket();
}