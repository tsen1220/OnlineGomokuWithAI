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
var watchingGame = false;
var resetmessage = "5秒後重設棋盤";
var waitingAI = "請等待AI下棋";
var startMsg = "AI對戰，遊戲開始";

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

appendMsg(`You joined`);
appendMsg(startMsg);

chatbox.addEventListener("submit", evt => {
  evt.preventDefault();
  appendMsg("You:" + msgInput.value);
});

function appendMsg(message) 
{
  var div = document.createElement("div");
  div.width = "300px";
  div.overflow = "hidden";
  var textnode = document.createTextNode(message);
  div.appendChild(textnode);
  msgContainer.appendChild(div);
  msgInput.value = " ";
}

//click to trigger event

//賽局控制
board.addEventListener("click", evt => {
    if (watchingGame) 
    {
      return;
    } 
    else 
    {
      cv = board;
      var pos = getMousePos(cv, evt);
      position.innerHTML = `X position: ${Math.floor(pos.x)} <br/>  Y position: ${Math.floor(pos.y)}`;

      var xpos = Math.round(Math.floor(pos.x) / blank_size);
      var ypos = Math.round(Math.floor(pos.y) / blank_size);
      if (xpos != border_start && ypos != border_start && xpos != boarder_finish && ypos != boarder_finish) 
      {
        if (gameBoard[ypos][xpos] == 0) 
        {
          if (turn) 
          {
            drawPiece(xpos, ypos, 1);
            gameBoard[ypos][xpos] = 1;
            turn = false;
            watchingGame = true;
          } 
          else 
          {
            drawPiece(ypos, xpos, 2);
            gameBoard[ypos][xpos] = 2;
            turn = true;
            watchingGame = true;
          }
        }
      }
    }

    appendMsg(waitingAI);

    socket.emit("aireq", {
      gameBoard: gameBoard,
      turn: turn
    });

    socket.on("aires", data => {
      drawPiece(data[1], data[0], 2);
      gameBoard[data[0]][data[1]] = 2;
      turn = true;
      watchingGame = false;
    });
  },
  false
);

socket.on("yourTurn", msg => {
  appendMsg(msg);
});

//gamewatch
socket.on("blackWin", victory => {
  victorymsg(victory);
  appendMsg(victory);
  appendMsg(resetmessage);
  watchingGame = true;
  setTimeout(() => {
    cleanBoard();
    boardDraw();
    appendMsg(restartmsg);
    watchingGame = false;
  }, 5000);
});

socket.on("whiteWin", victory => {
  victorymsg(victory);
  appendMsg(victory);
  appendMsg(resetmessage);
  watchingGame = true;
  setTimeout(() => {
    cleanBoard();
    boardDraw();
    appendMsg(restartmsg);
    gameBoard;
    watchingGame = false;
  }, 5000);
});

// Get position
function getMousePos(canvas, evt) 
{
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

window.onload = boardDraw();
//Game Board
function boardDraw() 
{
  var board = document.getElementById("board");
  var ctx = board.getContext("2d"); //Canvas Context Object

  ctx.beginPath();
  for (let i = 1; i <= blank_length; i++) 
  {
    ctx.moveTo(blank_size * i, board_size_start);
    ctx.lineTo(blank_size * i, board_size_finish);

    ctx.moveTo(board_size_start, blank_size * i);
    ctx.lineTo(board_size_finish, blank_size * i);
  }

  ctx.stroke();
}
// click and draw piece
function drawPiece(cx, cy, piece) 
{
  var board = document.getElementById("board");
  var ctx = board.getContext("2d");
  if (piece == 1) 
  {
    ctx.fillStyle = "black";
  } 
  else if (piece == 2) 
  {
    ctx.fillStyle = "white";
  }
  ctx.beginPath();
  ctx.arc(blank_size * cx, blank_size * cy, piece_size, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function victorymsg(msg) 
{
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

function cleanBoard() 
{
  //盤重畫
  var board = document.getElementById("board");
  var ctx = board.getContext("2d");
  board.height = board.height;
  //盤重設
  for (let i = 0; i < 17; i++) 
  {
    for (let j = 0; j < 17; j++) 
    {
      gameBoard[i][j] = 0;
    }
  }

  socket.emit("reset", gameBoard);
}
