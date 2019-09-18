const io = require("socket.io")(55555);
const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000);

var turn = false;

//socket.io connect
io.on("connection", socket => {
  socket.on("turn", playerturn => {
    turn = playerturn;
  });

  socket.on("gameBoardposition", data => {
    socket.broadcast.emit("gameBoardpieces", data, turn);
  });
});
