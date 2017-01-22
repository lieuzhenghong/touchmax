# touchable
A library that lets you control your computer with your phone.
Custom, programmable widgets allow you to:

- Run any shell command with nodejs's `spawn`;
- Send any series of keypresses and mouse movements;
- Send binary data, images, etc;
- Access and modify the clipboard.

I have personally used it as:

- Programmable audio mixer;
- Take and crop screenshots;
- Rudimentary drawing app;
- Custom emoji keyboard;
- Calculator with bigger buttons;
- Many more possibilities.

## Set up
Make sure that you have node installed.

    sudo node app.js
    ifconfig

Then use your phone to go to the address shown in `inet` and the correct pane: `192.168.43.44:5000/panes/volume_control/` for example.

## API

```javascript
    function send_event(data_object) {
        if (CONNECTED) {
            socket.emit('phone_event', data_object);
        }
    }
```

Bread and butter function. Here's what it looks like:


```javascript
    send_event({action: 'run_program', string: `amixer -D pulse set Master ${this.value}%`})
```

Optional `then` attribute:

```javascript
    send_event({
        action: 'key_press',
        string: 'tab',
        then: ['control', 'shift']
    })
```

`then` will be called like this:

```javascript
    if (data.then === undefined) {
      function_list[data.action](data.string); 
    }
    else {
      function_list[data.action](data.string, data.then);
    }
```

`then` is basically additional parameters.

Current function list:

```javascript
    function_list = {
        'unicode_press': unicode_press,
        'key_press': key_press,
        'mouse_move': mouse_move,
        'run_program': run_program,
        'send_image': receive_image,
        'send_clipboard': receive_clipboard
    }
```
