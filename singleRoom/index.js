var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

var usernames = {};

io.on('connection', (socket) => {
  socket.on('adduser',  (uname, fn) => {
    // 返回所有客户端 添加的用户名列表
    usernames[uname] = uname;
    // 当前客户端连接的用户名
    socket.uname = uname // socket.uname 为保存客户端断开连接时的uname
    io.emit('updateuser', usernames);
    // 在客户端发送添加用户名事件后,  服务端向所有客户端显示(除了sender) 用户名:xxx已连接
    socket.broadcast.emit('updatechat', 'server:', `${uname} has connected`);
    // 在客户端发送添加用户名事件后, 服务端向当前客户端(只发给sender) 你已连接
    socket.emit('updatechat', 'server:', `you has connected`);
    fn('server callback value');
  })

  socket.on('sendchat', (message) => {
    // 服务端向除了sender以外的客户端发 xxx:  xxx的消息
    socket.broadcast.emit('updatechat', `${socket.uname} :`, message );
    // 服务端向当前客户端发you: xxx
    socket.emit('updatechat', 'you :', message);
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



http.listen(1111, () => {
  console.log('listen 1111 port');
})
