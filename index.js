const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const port = 12345;

app.use(express.static(path.join(__dirname, 'public')));
http.listen(port, () => {
  console.log('Server listening on :%s', port)
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname , 'public/index.html'));
});

var lines = [];
var messages = [];
io.on('connection', (socket) => {
  for (let l of lines) {
    socket.emit('draw_line', {line: l});
  }
  for (let m of messages) {
    socket.emit('new_msg', m)
  }

  socket.on('draw_line', (d) => {
    lines.push(d.line);
    io.emit('draw_line', {line: d.line});
  });

  socket.on('new_msg', (msg) => {
    messages.push(msg);
    io.emit('new_msg', msg);
  });
});
