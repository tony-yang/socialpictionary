document.addEventListener('DOMContentLoaded', function() {
  var socket = io();

  var chatForm = document.getElementById('chat-input');
  chatForm.onsubmit = function(e) {
    e.preventDefault();
    var input = document.getElementById('new');
    socket.emit('new_msg', input.value);
    input.value = '';
  };

  socket.on('new_msg', (msg) => {
    var msg_item = document.createElement('li');
    msg_item.innerHTML = msg;
    document.getElementById('messages').appendChild(msg_item);
  });
});
