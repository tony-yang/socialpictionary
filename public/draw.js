document.addEventListener('DOMContentLoaded', function() {
  var socket = io();

  var mouse = {
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: {},
  };

  var canvas = document.getElementById('board');
  var context = canvas.getContext('2d');
  var width = 500;
  var height = 500;

  canvas.width = width;
  canvas.hegiht = height;

  canvas.onmousedown = function(e) {mouse.click = true;}
  canvas.onmouseup = function(e) {mouse.click = false;}
  canvas.onmousemove = function(e) {
    mouse.pos.x = e.offsetX;
    mouse.pos.y = e.offsetY;
    mouse.move = true;
  };

  socket.on('draw_line', (d) => {
    var line = d.line;
    context.beginPath();
    context.moveTo(line[0].x, line[0].y);
    context.lineTo(line[1].x, line[1].y);
    context.stroke();
  });

  function mainLoop() {
    if (mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit('draw_line', {line: [mouse.pos, mouse.pos_prev]});
      mouse.move = false;
    }
    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
    setTimeout(mainLoop, 25);
  }
  mainLoop();
});
