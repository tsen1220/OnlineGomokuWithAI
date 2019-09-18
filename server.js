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
var gameboard = [];
var xpos = Number();
var ypos = Number();
var blackWin = "Black Win";
var whiteWin = "White Win";

//socket.io connect
io.on("connection", socket => {
  socket.on("turn", playerturn => {
    turn = playerturn;
  });

  socket.on("gameBoardposition", data => {
    gameboard = data.gameBoard;
    xpos = data.xpos;
    ypos = data.ypos;
    socket.broadcast.emit("gameBoardpieces", data, turn);

    //橫
    for (let i = 0; i < 5; i++) {
      if (
        gameboard[ypos][xpos + i - 4] == 1 &&
        gameboard[ypos][xpos + i - 3] == 1 &&
        gameboard[ypos][xpos + i - 2] == 1 &&
        gameboard[ypos][xpos + i - 1] == 1 &&
        gameboard[ypos][xpos + i] == 1
      ) {
        console.log(blackWin);
        console.log(gameboard);
      } else if (
        gameboard[ypos][xpos + i - 4] == 2 &&
        gameboard[ypos][xpos + i - 3] == 2 &&
        gameboard[ypos][xpos + i - 2] == 2 &&
        gameboard[ypos][xpos + i - 1] == 2 &&
        gameboard[ypos][xpos + i] == 2
      ) {
        console.log(whiteWin);
        console.log(gameboard);
      }
    }
  });
});
