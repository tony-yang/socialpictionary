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
// users store the user id and whether the user is drawing or not
// true == drawing, false == not drawing
var users = {};
// record joint order to decide who will draw next
// only the server needs the jointOrder to decide who's drawing
var jointOrder = []

function registerUser(socket) {
  socket.on('new_user', (u) => {
    console.log('receive new user =', u);
    console.log('users = ', users);
    console.log('users.length =', users.length);
    if (Object.keys(users).length == 0) {
      users[u] = true;
    } else {
      users[u] = false;
    }
    jointOrder.push(u);
    console.log('users =', users);
    console.log('join order =', jointOrder);
    io.emit('new_user', users);
  });
}

io.on('connection', (socket) => {
  registerUser(socket);

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
