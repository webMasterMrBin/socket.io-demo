const app = require("../app");
const http = require("http").Server(app);
const debug = require("debug")("http");
const io = require("socket.io")(http);

io.on("connection", socket => {
  socket.emit("connect", { msg: "now connect" });
  console.log("user connected");

  socket.on("sendchat", data => {
    console.log("data", data);
    io.emit("sendchat", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnect");
  });
});

http.listen(4000, () => {
  console.log("NODE_ENV", process.env.NODE_ENV);
});

http.on("listening", () => {
  debug("listening on 4000");
});
