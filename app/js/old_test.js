/* webSocket polyfill */
window.WebSocket = window.WebSocket || window.MozWebSocket;


// recherche dans le document HTML #tableau
var canva = document.getElementById('screen');
var connection = new WebSocket('ws://localhost:' + socketPort);


// définit le contexte (pour ensuite pouvoir dessiner dans le canva)
var context = canva.getContext('2d');

// variable qui définit si les actions avec la souris sont true / false

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

var minImageSize = 60;

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
  var stepSize = minImageSize;
  src = 'img/' + setOfImage + '/' + imageArray[currentImage] + '.png';

  if (mouse.down == true) drawImage(event.pageX, event.pageY, src);

  if (mouse.down == true) {
    var message = {
      posx: event.pageX,
      posy: event.pageY,
      src: src
    };
    connection.send(JSON.stringify(message));
  }


}

function mouseDown(event) {
  mouse.down = true;
}

function mouseUp(event) {
  mouse.down = false;
}

function drawImage(x, y, src) {
  var image = new Image();
  image.src = src;



  image.onload = function() {

    stepSize = image.width;
    var d = distance(position, mouse);

    var positionX = x - image.width / 2;
    var positionY = y - image.height / 2;
    var angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);
    context.drawImage(image, positionX, positionY, d, d);



    currentImage++;
    if (currentImage > 8) currentImage = 0;
    position.x = position.x + Math.cos(angle) * stepSize;
    position.y = position.y + Math.sin(angle) * stepSize;
  }
}



function distance(pt, pt2) {
  var xs = 0;
  var ys = 0;

  xs = pt2.x - pt.x;
  xs = xs * xs;

  ys = pt2.y - pt.y;
  ys = ys * ys;

  return Math.sqrt(xs + ys);
}



connection.onmessage = function(message) {
  if (mouse.down == false) {
    var json = JSON.parse(message.data);
    try {
      var valeurs = JSON.parse(json.data);
      drawImage(valeurs.posx, valeurs.posy, valeurs.src);
    } catch (e) {}

  }
};


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


connection.onopen = function() {
  connection.send('hello je me connecte');
}









init();