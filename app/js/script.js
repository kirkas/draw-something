window.WebSocket = window.WebSocket || window.MozWebSocket;


var connection = new WebSocket('ws://localhost:' + socketPort);

// Application variables
var position = {
  x: 0,
  y: window.innerHeight / 2
};

var counter = 0;
var minFontSize = 3;
var letters = "There was a table set out under a tree in front of the house, and the March Hare and the Hatter were having tea at it: a Dormouse was sitting between them, fast asleep, and the other two were using it as a cushion, resting their elbows on it, and talking over its head. 'Very uncomfortable for the Dormouse,' thought Alice; 'only, as it's asleep, I suppose it doesn't mind.'";

// Drawing variables
var canvas;
var context;
var mouse = {
  x: 0,
  y: 0,
  down: false
}

var setOfImage = '01';
var imageArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
var currentImage = 0;


function init() {
  canvas = document.getElementById('screen');
  context = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener('mousemove', mouseMove, false);
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mouseout', mouseUp, false);
  canvas.addEventListener('dblclick', doubleClick, false);

  window.addEventListener("keydown", keyEvent, false);

  window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

function keyEvent(e) {
  if (e.keyCode == "32") {
    if (setOfImage == '01') {
      setOfImage = '02';
    } else if (setOfImage == '02') {
      setOfImage = '01';
    }
  }
}

function mouseMove(event) {
  mouse.x = event.pageX;
  mouse.y = event.pageY;
  draw();
}

function draw() {
  if (mouse.down) {
    var d = distance(position, mouse);
    var fontSize = minFontSize + d / 2;
    var angle;
    var stepSize;
    var image = new Image();
    var src = 'img/' + setOfImage + '/' + imageArray[currentImage] + '.png';

    image.src = 'img/' + setOfImage + '/' + imageArray[currentImage] + '.png';

    image.onload = function() {
      var letter = letters[counter];
      var stepSize = imageWidth(letter, fontSize);
      var angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);
      var positionX = position.x - d / 2;
      var positionY = position.y - d / 2;
      var angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);

      drawImage(image, position, d);
      sendMessage(src, position, d);

      currentImage++;
      if (currentImage > 8) currentImage = 0;

      position.x = position.x + Math.cos(angle) * stepSize;
      position.y = position.y + Math.sin(angle) * stepSize;
    }
  }
}

function sendMessage(image, position, d) {
  if (mouse.down) {
    var message = {
      image: image,
      posx: position.x,
      posy: position.y,
      size: d
    };
    connection.send(JSON.stringify(message));
  }
}

function drawImage(image, position, size) {
  context.save();
  // context.translate(position.x, position.y);
  // context.rotate(angle);
  context.drawImage(image, position.x, position.y, size, size);
  context.restore();
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

function mouseDown(event) {
  mouse.down = true;
  position.x = event.pageX;
  position.y = event.pageY;
}

function mouseUp(event) {
  mouse.down = false;
}

function doubleClick(event) {
  canvas.width = canvas.width;
}

function imageWidth(string, size) {
  context.font = size + "px Georgia";

  if (context.fillText) {
    return context.measureText(string).width;
  } else if (context.mozDrawText) {
    return context.mozMeasureText(string);
  }

};


init();



/* Socket logic */

connection.onopen = function() {
  connection.send('hello je me connecte');
}

connection.onmessage = function(message) {
  // console.log(message);
  if (mouse.down == false) {
    var json = JSON.parse(message.data);

    try {
      var valeurs = JSON.parse(json.data);
      console.log(valeurs);

      var image = new Image();
      image.src = valeurs.image;
      var tempsPosition = {
        x: valeurs.posy,
        y: valeurs.posy,
      }

      drawImage(image, tempsPosition, valeurs.size);
    } catch (e) {
      //alert("Ceci n'est pas un tableau JSON");
    }
  }
};





if (!window.WebSocket) {
  // pour les navigateurs qui n'acceptent pas WS
  alert("Il faut changer de navigateur.");
} else {
  // initWebSocket();
}