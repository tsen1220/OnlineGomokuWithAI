function Range(i, j) 
{
  return i >= 0 && i < 17 && j >= 0 && j < 17;
}

function oneScore(board, ypos, xpos, player, player2) 
{
  // # 5 10000
  // # 4 80
  // # 3 30
  // # 2 5
  // # 1 0
  var award = [
    0,
    5,
    30,
    80,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000,
    10000
  ];
  var count_direction = [[1, 1], [1, 0], [1, -1], [0, 1]];
  var count_container = [];
  var award_container = new Array(4);
  var oneScore = 0;

  for (let direction of count_direction) 
  {
    var tempX = xpos;
    var tempY = ypos;
    var count = 0;

    while (Range(xpos, ypos)) 
    {
      if (board[ypos][xpos] == player) 
      {
        count += 1;
        xpos += direction[0];
        ypos += direction[1];
      } 
      else 
      {
        xpos = tempX;
        ypos = tempY;
        break;
      }
    }
    count_container.push(count);
    count = 0;

    while (Range(xpos, ypos)) 
    {
      if (board[ypos][xpos] == player) 
      {
        count += 1;
        xpos += -direction[0];
        ypos += -direction[1];
      } 
      else 
      {
        xpos = tempX;
        ypos = tempY;
        break;
      }
    }
    count_container.push(count);
    count = 0;
  }

  for (let [i, countcontainer] of count_container.entries()) 
  {
    count_container[i] = countcontainer - 1;
  }

  for (let i = 0; i < award_container.length; i++) 
  {
    award_container[i] = count_container[2 * i] + count_container[2 * i + 1];
  }

  for (let [i, awarding] of award_container.entries()) 
  {
    if (awarding < 0) 
    {
      award_container[i] = 0;
    } 
    else 
    {
      award_container[i] = award[awarding];
    }
  }

  oneScore = award_container.reduce((a, b) => {
    return a + b;
  });

  return oneScore;
}

function boardScore(board, player) 
{
  Sum = 0;
  for (let i = 0; i < 17; i++) 
  {
    for (let j = 0; j < 17; j++) 
    {
      Sum += oneScore(board, j, i, player);
    }
  }

  return Sum;
}

function totalScore(board) 
{
  return boardScore(board, 1) - boardScore(board, 2);
}

module.exports = {
  oneScore: oneScore,
  boardScore: boardScore,
  totalScore: totalScore,
  Range: Range
};
