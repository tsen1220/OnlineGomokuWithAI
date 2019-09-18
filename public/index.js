const socket = io("http://localhost:55555");

//game
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
//click to trigger event
board.addEventListener("click", evt => {
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
socket.on("blackwin", victory => {
  victorymsg(victory);
});

socket.on("whitewin", victory => {
  victorymsg(victory);
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
