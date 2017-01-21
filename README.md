# touchmax
A library that lets you control your computer with your phone Touch Bar style.

## Set up
Make sure that you have node installed.

    sudo node app.js
    ifconfig

Then use your phone to go to the address shown in `inet`: `192.168.43.44:5000/volume_control.html` for example.

## API

    function send_event(data_object) {
        if (CONNECTED) {
            socket.emit('phone_event', data_object);
        }
    }

Bread and butter function. Here's what it looks like:


```javascript
    send_event({action: 'run_program', string: `amixer -D pulse set Master ${this.value}%`})
```

Optional `then` attribute:

    send_event({
        action: 'key_press',
        string: 'tab',
        then: ['control', 'shift']
    }) 

`then` will be called like this:

    if (data.then === undefined) {
      function_list[data.action](data.string); 
    }
    else {
      function_list[data.action](data.string, data.then);
    }

`then` is basically additional parameters.

Current function list:

    function_list = {
    'unicode_press': unicode_press,
    'key_press': key_press,
    'mouse_move': mouse_move,
    'run_program': run_program,
    'send_image': receive_image
    }