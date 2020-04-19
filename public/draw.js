document.addEventListener('DOMContentLoaded', function() {
  var socket = io();

  // Register the current user first
  var username = Math.random().toString(36).slice(2);
  console.log('username =', username)
  socket.emit('new_user', username);

  var mouse = {
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: {},
  };

  var canvas = document.getElementById('board');
  var context = canvas.getContext('2d');
  var height = 400;

  var canvasDiv = document.getElementById('canvas')
  canvas.width = canvasDiv.clientWidth;
  canvas.hegiht = canvasDiv.clientHeight;

  canvas.onmousedown = function(e) {mouse.click = true;}
  canvas.onmouseup = function(e) {mouse.click = false;}
  // Divide the canvas size to normalize the drawing to unit length.
  canvas.onmousemove = function(e) {
    mouse.pos.x = e.offsetX / canvas.width;
    mouse.pos.y = e.offsetY / canvas.height;
    mouse.move = true;
  };

  var allUsers = [];

  socket.on('draw_line', (d) => {
    var line = d.line;
    context.beginPath();
    // Multiply the canvas size to restore from unit length to device canvas
    // size in proportion.
    context.moveTo(line[0].x * canvas.width, line[0].y * canvas.height);
    context.lineTo(line[1].x * canvas.width, line[1].y * canvas.height);
    context.stroke();
  });

  socket.on('new_user', (u) => {
    allUsers = u;
  })

  // Only allow one user to draw at a time. Everyone else are guessing.
  function mainLoop() {
    if (allUsers[username] && mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit('draw_line', {line: [mouse.pos, mouse.pos_prev]});
      mouse.move = false;
    }
    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
    setTimeout(mainLoop, 25);
  }
  mainLoop();
});
