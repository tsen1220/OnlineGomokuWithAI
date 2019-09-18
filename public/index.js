const socket = io("http://localhost:55555");

//game
var board = document.getElementById("board");
var position = document.getElementById("position");
var blank_size = 40;
var blank_length = 15;
var piece_size = 20;
var board_size_start = 40;
var board_size_finish = 560;
var turn = true;

var gameBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

board.addEventListener("click", evt => {
  cv = board;
  var pos = getMousePos(cv, evt);
  position.innerHTML = `X position: ${Math.floor(
    pos.x
  )} <br/>  Y position: ${Math.floor(pos.y)}`;

  var xpos = Math.round(Math.floor(pos.x) / blank_size);
  var ypos = Math.round(Math.floor(pos.y) / blank_size);
  if (xpos != 0 && ypos != 0 && xpos != 15 && ypos != 15) {
    if (gameBoard[ypos][xpos] == 0) {
      if (turn) {
        socket.emit("turn", turn);
        drawPiece(xpos, ypos, 1);
        gameBoard[ypos][xpos] = 1;
        turn = false;
      } else {
        socket.emit("turn", turn);
        drawPiece(xpos, ypos, 2);
        gameBoard[ypos][xpos] = 2;
        turn = true;
      }
    }
  }

  socket.emit("gameBoardposition", {
    gameBoard: gameBoard,
    xpos: xpos,
    ypos: ypos
  });
});

//receive game data from server
socket.on("gameBoardpieces", (data, playerturn) => {
  gameBoard = data.gameBoard;
  if (data.xpos != 0 && data.ypos != 0 && data.xpos != 15 && data.ypos != 15) {
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

// Get position
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

window.onload = boardDraw();
//Game match
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
