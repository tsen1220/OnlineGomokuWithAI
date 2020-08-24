//3*3 convolution
function convolve(board, convolveBoard) 
{
  for (let i = 0; i < 3; i++) 
  {
    for (let j = 0; j < 3; j++) 
    {
      for (let g = 0; g < board.length; g++) 
      {
        for (let k = 0; k < board[g].length; k++) 
        {
          convolveBoard[g + i][k + j] += board[g][k];
        }
      }
    }
  }

  var valueSliceY = convolveBoard.slice(1, 1 + board.length);
  var val = valueSliceY.map(v => {
    a = [];
    for (let i = 1; i < 1 + board.length; i++) 
    {
      a.push(v[i]);
    }
    return a;
  });

  for (let i = 0; i < val.length; i++) 
  {
    for (let j = 0; j < val.length; j++) 
    {
      if (val[i][j] > 0) 
      {
        val[i][j] = 1;
      }
    }
  }

  for (let i = 0; i < val.length; i++) 
  {
    for (let j = 0; j < val.length; j++) 
    {
      if (val[i][j] > 0 && board[i][j] > 0) 
      {
        val[i][j] = 0;
      }
    }
  }

  return val;
}

module.exports = { convolve: convolve };
