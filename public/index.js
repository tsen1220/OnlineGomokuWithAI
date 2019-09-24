const socket = io("http://localhost:55555");

//game set var
var board = document.getElementById("board");
var position = document.getElementById("position");
var blank_size = 37.5;
var blank_length = 15;
var piece_size = 18;
var board_size_start = 38;
var board_size_finish = 563;
var turn = true;
var border_start = 0;
var boarder_finish = 16;
var watchingGame = true;
var resetmessage = "5秒後重設棋盤";
var restartmsg = "輸方先下";
var startMsg = "遊戲開始";
var disconnectedresetmsg = "有玩家離線，於五秒後重置棋盤，請重新等待新玩家";
//17 * 17
var gameBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

//room set(with chat)
const chatbox = document.getElementById("chatbox");
const msgInput = document.getElementById("msg-input");
const msgContainer = document.getElementById("msg-container");
if (chatbox !== null) {
  var userName = prompt("Who are you?");

  while (!userName || userName == "null" || userName == "undefined") {
    userName = prompt("This name is invalid. Please Input again! ");
  }
  socket.emit("Newuser", { roomName: roomName, userName: userName });

  appendMsg(`You joined`);
  socket.on("waiting", waitmessage => {
    appendMsg(waitmessage);
  });
  socket.on("startMsg", msg => {
    appendMsg(msg);
    appendMsg("You 先攻 為黑方");
  });
}

socket.on("userjoin", name => {
  appendMsg(`${name} join`);
  appendMsg(startMsg);
  appendMsg(`${name} 先攻 為黑方`);
});

chatbox.addEventListener("submit", evt => {
  evt.preventDefault();
  socket.emit("msgSend", {
    roomName: roomName,
    userName: userName,
    msg: msgInput.value
  });
  appendMsg("You:" + msgInput.value);
});

socket.on("sendMsg", (name, msg) => {
  appendMsg(name + ":" + msg);
});

socket.on("fullroom", url => {
  alert("This room is full!!");
  window.location.href = url;
});

socket.on("disconnected", msg => {
  appendMsg(msg);
  appendMsg(disconnectedresetmsg);
  setTimeout(() => {
    cleanBoard();
    boardDraw();
    watchingGame = true;
    turn = true;
  }, 5000);
});

function appendMsg(message) {
  var div = document.createElement("div");
  div.width = "300px";
  div.overflow = "hidden";
  var textnode = document.createTextNode(message);
  div.appendChild(textnode);
  msgContainer.appendChild(div);
  msgInput.value = " ";
}

//click to trigger event

socket.on("gameCanStart", gameStart => {
  watchingGame = gameStart;
});

//賽局控制
socket.on("watchGame", watch => {
  watchingGame = watch;
});

board.addEventListener(
  "click",
  evt => {
    if (watchingGame) {
      return;
    } else {
      cv = board;
      var pos = getMousePos(cv, evt);
      position.innerHTML = `X position: ${Math.floor(
        pos.x
      )} <br/>  Y position: ${Math.floor(pos.y)}`;

      var xpos = Math.round(Math.floor(pos.x) / blank_size);
      var ypos = Math.round(Math.floor(pos.y) / blank_size);
      if (
        xpos != border_start &&
        ypos != border_start &&
        xpos != boarder_finish &&
        ypos != boarder_finish
      ) {
        if (gameBoard[ypos][xpos] == 0) {
          if (turn) {
            socket.emit("turn", roomName, turn);
            drawPiece(xpos, ypos, 1);
            gameBoard[ypos][xpos] = 1;
            turn = false;
          } else {
            socket.emit("turn", roomName, turn);
            drawPiece(xpos, ypos, 2);
            gameBoard[ypos][xpos] = 2;
            turn = true;
          }
        }
      }

      socket.emit("gameBoardposition", {
        gameBoard: gameBoard,
        xpos: xpos,
        ypos: ypos,
        roomName: roomName
      });
    }
  },
  false
);

//receive game data from server
socket.on("gameBoardpieces", (data, playerturn) => {
  gameBoard = data.gameBoard;
  if (
    data.xpos != border_start &&
    data.ypos != border_start &&
    data.xpos != boarder_finish &&
    data.ypos != boarder_finish
  ) {
    if (gameBoard[data.ypos][data.xpos] == 1) {
      if (playerturn == true) {
        drawPiece(data.xpos, data.ypos, 1);
        turn = false;
      }
    } else if (gameBoard[data.ypos][data.xpos] == 2) {
      if (playerturn == false) {
        drawPiece(data.xpos, data.ypos, 2);
        turn = true;
      }
    }
  }
});

//gamewatch
socket.on("blackwin", (victory, gameControll) => {
  victorymsg(victory);
  appendMsg(victory);
  appendMsg(resetmessage);
  watchingGame = true;
  setTimeout(() => {
    cleanBoard();
    boardDraw();
    appendMsg(restartmsg);
    watchingGame = gameControll;
  }, 5000);
});

socket.on("whitewin", (victory, gameControll) => {
  victorymsg(victory);
  appendMsg(victory);
  appendMsg(resetmessage);
  watchingGame = true;
  setTimeout(() => {
    cleanBoard();
    boardDraw();
    appendMsg(restartmsg);
    watchingGame = gameControll;
  }, 5000);
});

// Get position
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

window.onload = boardDraw();
//Game Board
function boardDraw() {
  var board = document.getElementById("board");
  var ctx = board.getContext("2d"); //Canvas Context Object

  ctx.beginPath();
  for (let i = 1; i <= blank_length; i++) {
    ctx.moveTo(blank_size * i, board_size_start);
    ctx.lineTo(blank_size * i, board_size_finish);

    ctx.moveTo(board_size_start, blank_size * i);
    ctx.lineTo(board_size_finish, blank_size * i);
  }

  ctx.stroke();
}
// click and draw piece
function drawPiece(cx, cy, piece) {
  var board = document.getElementById("board");
  var ctx = board.getContext("2d");
  if (piece == 1) {
    ctx.fillStyle = "black";
  } else if (piece == 2) {
    ctx.fillStyle = "white";
  }
  ctx.beginPath();
  ctx.arc(blank_size * cx, blank_size * cy, piece_size, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function victorymsg(msg) {
  var c = document.getElementById("board");
  var ctx = c.getContext("2d");

  ctx.font = "100px Verdana";

  var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
  gradient.addColorStop("0", "gray");
  gradient.addColorStop("0.5", "darkblue");
  gradient.addColorStop("1.0", "red");

  ctx.fillStyle = gradient;
  ctx.fillText(msg, 50, 300);
}

function cleanBoard() {
  //盤重畫
  var board = document.getElementById("board");
  var ctx = board.getContext("2d");
  board.height = board.height;
  //盤重設
  for (let i = 0; i < 17; i++) {
    for (let j = 0; j < 17; j++) {
      gameBoard[i][j] = 0;
    }
  }

  socket.emit("reset", gameBoard);
}
