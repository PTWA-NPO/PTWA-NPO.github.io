# Game View

- 這是一個統一遊戲視窗的框架，依照此框架所開發的遊戲，可以讓開發者在符合遊戲風格下專注開發遊戲內容

---

## 框架檔案說明

- script.js: 啟動遊戲的入口 [README.md comming soon]()
- GameTemplate.js: 遊戲框架，以及繼承遊戲框架下的不同類型遊戲模版 [README.md comming soon]()
- Handler.js: 處理與遊戲交互的按鍵事件，會呼叫遊戲的對應函式，並更新視窗畫面 [README.md comming soon]()
- constant.js: 統一遊戲框架的所有常數 [README.md comming soon]()
- module.js: 遊戲開發的函式庫 [README.md comming soon]()
- game_config.json: 遊戲設置檔案 [README.md comming soon]()
- index.html: 遊戲視窗的畫面 [README.md comming soon]()

## 使用方式

1. 在 [games](../games/) 新建遊戲資料夾 games/exsample_game
2. 在 [game_config.json](game_config.json) 設定遊戲資料（遊戲名稱須與資料夾名稱相同）
   ```json
   {
        "game_name": "exsample_game"
        , "game_kind": "math"
        , "game_grade": 3
        , "semester": "last"
        , "unit": 1
        , "game_level": 5
        , "game_rule": ["根據題目選擇對應的答案", "正確即可過關", "點擊💾可下載遊戲紀錄", "錯誤兩次可點擊提示"]
        , "game_option": ["lastBtn", "startBtn", "nextBtn", "hintBtn", "recordBtn", "submitBtn"]
   }
   ```
3. 在 [exsample_game](../games/example_game/)，建立遊戲必要 html、css、js、json 檔案
   ```
   |--game_view
   |--games
        |--exsample_game
            |--src
            |    |--Game.js
            |--game_config.json
            |--index.html
            |--style.css
   ```
4. 在 [html](../games/.examples/index.html) 必須定義 class="gameArea" 的 div，並在裡面建立遊戲內容
5. 在 [game_config.json](../games/example_game/game_config.json) 設定遊戲題庫，若需設定錯誤次數顯示提示的設定，則須命名 `"lives"` 並在冒號 `:` 之後，定義次數
6. 在 [css](../games/example_game/style.css) 中，必須在第一行打上 `@import url(../../game_view/css/game_style.css);` ，以繼承框架的遊戲樣式 [game_style](./css/game_style.css)
7. 在 [js](../games/example_game/src/Game.js) 中，實現遊戲邏輯，並傳出遊戲給 game_veiw

## 框架相關專案
1. 繼承使用框架的 connection 模版遊戲 [clock_connection](../games/clock_connection/)
2. 繼承使用框架的 connection 模版遊戲 [fractional_connection](../games/fractional_connection/)
3. 繼承使用框架的 connection 模版遊戲 [less_than_10k_connection](../games/less_than_10k_connection/)

## Future Work
- [ ] test case
- [ ] 遊戲開發文件
- [ ] 自動建立遊戲，無須開發者撰寫