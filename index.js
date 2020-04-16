const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 12345;

app.use(express.static(path.join(__dirname, 'public')));
http.listen(port, () => {
  console.log('Server listening on :12345')
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname , 'public/index.html'));
});

var lines = [];
io.on('connection', (socket) => {
  for (var i in lines) {
    socket.emit('draw_line', {line: lines[i]});
  }

  socket.on('draw_line', (d) => {
    lines.push(d.line);
    io.emit('draw_line', {line: d.line});
  });
});
