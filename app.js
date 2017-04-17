const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const robot = require('robotjs');
const spawn = require('child_process').exec;
const fs = require('fs');

//const bodyParser = require('body-parser');

function unicode_press(key_string) {
    // Check for multiple strings

    if (typeof(key_string) === 'string') {
      robot.keyTap('u', ['control', 'shift']);
      robot.typeString(key_string);
      robot.keyTap('space');
    }

    else {
      key_string.forEach((element) => {
        robot.keyTap('u', ['control', 'shift']);
        robot.typeString(element);
        robot.keyTap('enter');
      });
    }
}

function key_press(key, modifier_array) {
  console.log(key, modifier_array);
  if (modifier_array === undefined) {
    robot.keyTap(key);
  }
  else {
    robot.keyTap(key, modifier_array);
  }
}

function mouse_move(mag, dir) {
  robot.scrollMouse(mag, dir);
}

function run_program(program_string, then) {
  console.log('String is:' + program_string);
  fs.unlink((__dirname + '/static/ss.png'), () => {
    spawn(program_string, ()=> {
      if (then !== undefined) {
        fs.readFile(__dirname + '/static/ss.png', (err, buf) => {
          io.emit('image', {image: true, buffer: buf.toString('base64')});
        })
      }
    })
  });
}

function receive_image(blob) {
  console.log('received image');
  console.log(blob);
  fs.unlink((__dirname + '/static/ss.png'), () => {
    fs.writeFile(__dirname + '/static/ss.png', blob, () => {
      spawn ('xclip -selection clipboard -t image/png "' + __dirname + '/static/ss.png"', () => {
        //spawn('xdg-open ' + __dirname + '/static/ss.png', () => {
        //});
      })
    })
  });
}

function receive_clipboard(string) {
  console.log(string);
  spawn(`echo "${string}" > tmp`, () => {
    spawn(`cat tmp | xclip -i -selection clipboard`, () => {
      robot.keyTap('v', 'control');
      fs.unlink((__dirname + '/tmp'), ()=> {
        });
      } )
    });
}

function_list = {
  'unicode_press': unicode_press,
  'key_press': key_press,
  'mouse_move': mouse_move,
  'run_program': run_program,
  'send_image': receive_image,
  'send_clipboard': receive_clipboard
}

app.use(express.static('static'));

app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('OK', { success: true });

  socket.on('phone_event', (data) => {
    console.log(data);

    if (data.then === undefined) {
      console.log(function_list[data.action]);
      function_list[data.action](data.string); 
    }
    else {
      function_list[data.action](data.string, data.then); // Call the function in action
    }
  })
});

server.listen(5000, function(){
  console.log('listening on 5000');
});
