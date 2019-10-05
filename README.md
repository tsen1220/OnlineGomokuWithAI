# 目錄

[啟動](#啟動)

[房間清單](#房間清單列表)

[棋局房間](#棋局房間)

[AI 對戰](#AI)

# 啟動

---

請先安裝 Node 與 Npm。

並輸入下面的指令安裝modules。

```
npm install
```

啟動伺服器

```
$ npm run dev
```

預設 Port 為 3000，位於 localhost。

# 房間清單列表

---

<img src='https://raw.githubusercontent.com/tsen1220/OnlineGomokuWithAI/master/public/roomintroduction.jpg' alt=''>

## 注意:

```
1.開啟新房間後，玩家即會進入新房間，如房間名已存在，則玩家會被引導回房間清單列表。

2.加入房間時，如果玩家進入的房間已有兩人，則玩家會被引導回房間清單的頁面。
```

# 棋局房間

---

<img src='https://raw.githubusercontent.com/tsen1220/OnlineGomokuWithAI/master/public/gameintroduction.jpg' alt=''>

# AI

---

在房間清單點擊 AI 對戰即可與其他玩家遊玩。

AI 是藉由評估函數評估棋盤，在藉極大-極小搜尋，Alpha-Beta 剪枝，找出適合的位置下棋。

AI 目前仍在優化階段，強度還有待加強。
