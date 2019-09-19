const io = require("socket.io")(55555);
const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.get("/", (req, res) => {
  res.render("room", { rooms: rooms });
});

app.post("/room", (req, res) => {
  if (rooms[req.body.room] !== null) {
    rooms[req.body.room] = { users: {} };
    res.redirect(req.body.room);
  } else {
    res.redirect("/");
  }
});

app.get("/:room", (req, res) => {
  res.render("index", { roomName: req.params.room });
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
    socket.to(data.roomName).broadcast.emit("gameBoardpieces", data, turn);

    //橫
    for (let i = 0; i < 5; i++) {
      if (xpos + i - 4 >= 0) {
        if (
          gameboard[ypos][xpos + i - 4] == 1 &&
          gameboard[ypos][xpos + i - 3] == 1 &&
          gameboard[ypos][xpos + i - 2] == 1 &&
          gameboard[ypos][xpos + i - 1] == 1 &&
          gameboard[ypos][xpos + i] == 1
        ) {
          socket.emit("blackwin", blackWin);
          socket.to(data.roomName).broadcast.emit("blackwin", blackWin);
        } else if (
          gameboard[ypos][xpos + i - 4] == 2 &&
          gameboard[ypos][xpos + i - 3] == 2 &&
          gameboard[ypos][xpos + i - 2] == 2 &&
          gameboard[ypos][xpos + i - 1] == 2 &&
          gameboard[ypos][xpos + i] == 2
        ) {
          socket.emit("whitewin", whiteWin);
          socket.to(data.roomName).broadcast.emit("whitewin", whiteWin);
        }
      }
    }

    // 直

    for (let i = 0; i < 5; i++) {
      if (ypos + i - 4 >= 0) {
        if (
          gameboard[ypos + i - 4][xpos] == 1 &&
          gameboard[ypos + i - 3][xpos] == 1 &&
          gameboard[ypos + i - 2][xpos] == 1 &&
          gameboard[ypos + i - 1][xpos] == 1 &&
          gameboard[ypos + i][xpos] == 1
        ) {
          socket.emit("blackwin", blackWin);
          socket.to(data.roomName).broadcast.emit("blackwin", blackWin);
        } else if (
          gameboard[ypos + i - 4][xpos] == 2 &&
          gameboard[ypos + i - 3][xpos] == 2 &&
          gameboard[ypos + i - 2][xpos] == 2 &&
          gameboard[ypos + i - 1][xpos] == 2 &&
          gameboard[ypos + i][xpos] == 2
        ) {
          socket.emit("whitewin", whiteWin);
          socket.to(data.roomName).broadcast.emit("whitewin", whiteWin);
        }
      }
    }

    //負斜率
    for (let i = 0; i < 5; i++) {
      if (ypos + i - 4 >= 0 && xpos + i - 4 >= 0) {
        if (
          gameboard[ypos + i - 4][xpos + i - 4] == 1 &&
          gameboard[ypos + i - 3][xpos + i - 3] == 1 &&
          gameboard[ypos + i - 2][xpos + i - 2] == 1 &&
          gameboard[ypos + i - 1][xpos + i - 1] == 1 &&
          gameboard[ypos + i][xpos + i] == 1
        ) {
          socket.emit("blackwin", blackWin);
          socket.to(data.roomName).broadcast.emit("blackwin", blackWin);
        } else if (
          gameboard[ypos + i - 4][xpos + i - 4] == 2 &&
          gameboard[ypos + i - 3][xpos + i - 3] == 2 &&
          gameboard[ypos + i - 2][xpos + i - 2] == 2 &&
          gameboard[ypos + i - 1][xpos + i - 1] == 2 &&
          gameboard[ypos + i][xpos + i] == 2
        ) {
          socket.emit("whitewin", whiteWin);
          socket.to(data.roomName).broadcast.emit("whitewin", whiteWin);
        }
      }
    }

    //正斜率
    for (let i = 0; i < 5; i++) {
      if (
        ypos - i + 4 >= 0 &&
        xpos + i - 4 >= 0 &&
        ypos - i + 4 < gameboard.length &&
        xpos + i - 4 < gameboard.length
      ) {
        if (
          gameboard[ypos - i + 4][xpos + i - 4] == 1 &&
          gameboard[ypos - i + 3][xpos + i - 3] == 1 &&
          gameboard[ypos - i + 2][xpos + i - 2] == 1 &&
          gameboard[ypos - i + 1][xpos + i - 1] == 1 &&
          gameboard[ypos - i][xpos + i] == 1
        ) {
          socket.emit("blackwin", blackWin);
          socket.to(data.roomName).broadcast.emit("blackwin", blackWin);
        } else if (
          gameboard[ypos - i + 4][xpos + i - 4] == 2 &&
          gameboard[ypos - i + 3][xpos + i - 3] == 2 &&
          gameboard[ypos - i + 2][xpos + i - 2] == 2 &&
          gameboard[ypos - i + 1][xpos + i - 1] == 2 &&
          gameboard[ypos - i][xpos + i] == 2
        ) {
          socket.emit("whitewin", whiteWin);
          socket.to(data.roomName).broadcast.emit("whitewin", whiteWin);
        }
      }
    }
  });
  socket.on("msgSend", obj => {
    socket.to(obj.roomName).broadcast.emit("sendMsg", obj.userName, obj.msg);
  });

  socket.on("Newuser", obj => {
    socket.join(obj.roomName);
    rooms[obj.roomName].users[socket.id] = obj.roomName;
    socket.to(obj.roomName).broadcast.emit("userjoin", obj.userName);
    if (Object.keys(rooms[obj.roomName].users).length > 2) {
      socket.emit("fullroom", "/");
    }
  });

  socket.on("disconnect", () => {
    getuserRooms(socket).forEach(room => {
      socket
        .to(room)
        .broadcast.emit(
          "disconnected",
          `${rooms[room].users[socket.id]} disconnected`
        );
      delete rooms[room].users[socket.id];
    });
  });
});

function getuserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) {
      names.push(name);
    }
    return names;
  }, []);
}
