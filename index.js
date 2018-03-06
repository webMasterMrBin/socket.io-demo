
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nsp = io.of('/my-namespace');
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.to('room42');

io.on('connection', function(socket){
  console.log('a user connected');

  // socket.join('room 237', () => {
  //   let rooms = Object.keys(socket.rooms);
  //   console.log(rooms); // [ <socket.id>, 'room 237' ]
  //   //io.to('room 237', 'a new user has joined the room'); // broadcast to everyone in the room
  // });

  socket.on('hello', (msg) => {
    console.log('from 4444', msg);
  })

  socket.on('client-event', (msg) => {
    console.log(msg);
    io.sockets.emit('server-event', msg);
  })

  // 获取连接WS的所有客户端
  io.clients((error, clients) => {
    console.log('clients', clients);
  })
  // socket.use((msg, next) => {
  //   console.log('msg', msg);
  //   next(`中间件${msg}`)
  // })

  // console.log('socket.id', socket.id);
  // console.log('socket.rooms', socket.rooms);
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });
});

nsp.on('connection', function(socket){
  console.log('someone connected');
  socket.on('client-event', (msg) => {
    console.log(msg);
    io.emit('server-event', `my-namespace${msg}`);
  })
});


http.listen(3333, function(){
  console.log('listening on *:3333');
});
