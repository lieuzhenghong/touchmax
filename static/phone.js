var CONNECTED = false;
var socket = io();
socket.connect('http://localhost:5000');
socket.on('OK', (data) => {
  CONNECTED = data.success;
});

function unicode_press(key_string) {
  if (CONNECTED) {

    socket.emit('phone_event', 
    {
      action: 'unicode_press',
      string: key_string
    });
  }
}

// Data object:
// action: string
// data: array

function send_event(data_object) {
  if (CONNECTED) {
    socket.emit('phone_event', data_object);
  }
}
