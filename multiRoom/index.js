var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

var usernames = {}
var rooms = ['room1', 'room2', 'room3'];

io.on('connection', (socket) => {
  socket.on('adduser', (uname) => {
    // 保存当前登录的用户名已区别不同的客户端
    socket.uname = uname;
    // 添加完用户事件后 默认连接到room1房间
    socket.join('room1');
    // 保存当前客户端的房间信息
    socket.room = 'room1';
    // 添加完用户事件后 在默认的room1显示xxx 已连接
    socket.broadcast.to('room1').emit('updatechat', 'server:', `${socket.uname} has connected`);
    socket.to('room1').emit('updatechat', 'server :', 'you has connected');
  })
  // 切换room事件
  socket.on('switchRoom', (newroom) => {
    // 离开原来的房间
    socket.leave(socket.room);
    socket.join(newroom);
    socket.room = newroom;
    // 向当前room发送 you connect room;
    socket.to(newroom).emit('updatechat', 'server: ', `you has connect ${room}`);
    // 向其他客户端发 用户：xxx connect room;
    socket.broadcast.to(newroom).emit('updatechat', 'server', `${socket.uname} has connect ${room}`);
  })

  socket.on('sendchat', (message) => {
    socket.to(socket.room).emit('updatechat', `you:`, message);
    socket.broadcast.to(socket.room).emit('updatechat', `${socket.uname}: `, message);
  })

  socket.on('disconnect', () => {
    // 断开连接时 从所有连接的客户端中删掉退出的当前user
    delete usernames[socket.uname];
    console.log('usernames', usernames);
    io.emit('updateuser', usernames);
    // 在关闭客户端后既断开连接时, 服务端向所有客户端显示(除了sender) 用户名:xxx(断开连接时用户名) 已断开连接
    socket.broadcast.emit('updatechat', 'server:', `${socket.uname} has disconnected`);
  })
})

http.listen(2222, () => {
  console.log('listen 2222 port');
})
