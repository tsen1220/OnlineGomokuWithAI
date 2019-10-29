# 目錄

[啟動](#啟動)

[房間清單列表](#房間清單列表)

[棋局房間](#棋局房間)

[AI](#AI)

# 啟動

---

使用 Node/Express 開發。

請先安裝 Node 與 Npm。

並輸入下面的指令安裝 modules。

```
npm install
```

啟動伺服器

```
$ npm run dev
```

預設 Port 為 3000，位於 localhost。

# 房間清單列表

在這裡使用 ejs 作為模板 views，ejs 經由 Server 渲染頁面，Server 的相關資訊會影響渲染的相關資料。

---

<img src='https://raw.githubusercontent.com/tsen1220/OnlineGomokuWithAI/master/public/roomintroduction.jpg' alt=''>

## 注意:

```
1.開啟新房間後，玩家即會進入新房間，如房間名已存在，則玩家會被引導回房間清單列表。

2.加入房間時，如果玩家進入的房間已有兩人，Server會偵測到房間人數已達上限，則玩家會被引導回房間清單的頁面。
```

# 棋局房間

首先我會先定義一個二維陣列來設立基本棋譜，並由 1 代表黑棋，2 代表白棋。

使用 Canvas 來繪製棋子以及棋盤。

```

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

```

在這裡使用 socket.io 來進行即時的資料傳遞，將棋譜在 Server 以及 client 進行資料的雙向流，即時更新棋盤資訊，並且判斷是否勝利。

以下為 socket.io 使用的範例

```
client:

  socket.on("waiting", waitmessage => {
    appendMsg(waitmessage);
  });

server:

 socket.emit("waiting", waitmessage);


```

每個房間都是獨立的，是使用 socket.io 的 room。

如果棋局有玩家勝利或玩家離開房間，將會重置棋盤。

離開了的玩家會重新等待新玩家的到來。

---

<img src='https://raw.githubusercontent.com/tsen1220/OnlineGomokuWithAI/master/public/gameintroduction.jpg' alt=''>

# AI

---

在房間清單點擊 AI 對戰即可與其他玩家遊玩。

AI 是藉由評估函數評估棋盤，使用卷積判斷 AI 適合下的位置，在藉極大-極小搜尋最佳值，Alpha-Beta 剪枝來減去不必要的節點，使用這些演算法，找出適合的位置下棋。

```

Score:
  # 5 10000
  # 4 80
  # 3 30
  # 2 5
  # 1(顆) 0分

```

極大-極小 與 Alpha-Beta 剪枝 概念:

```
Minimax Alpha-Beta conception :

# When alpha>=beta,cut-off the node.

function alphabeta(node, depth, α, β, maximizingPlayer)
     if depth = 0 or the terminal node
         return the score calculated from the board

     if maximizingPlayer
         for child of the all child node
             α := max(α, alphabeta(child, depth - 1, α, β, FALSE))
             if β ≤ α
                 break (* β cut-off *)
         return α

     else
         for  child of the all child node
             β := min(β, alphabeta(child, depth - 1, α, β, TRUE))
             if β ≤ α
                 break (* α cut-off *)
         return β

```

AI 目前仍在優化階段，敬請包含。
