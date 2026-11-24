# 潮汕四日高鐵之旅 Dashboard（汕頭 · 南澳島 · 潮州 · 揭陽）

2026-12-24（四）至 27（日）。以 `~/Desktop/Hokkaido/hokkaido_itinerary.html` 嘅架構同設計做底，獨立一個項目，**冇改動 Hokkaido 任何檔案**。

## 點樣開

1. **最簡單：** 雙擊 `index.html`（用 Chrome／Safari 開）。地圖、路線、天氣要連網。
2. **本機伺服器：** 雙擊 `start.command`，或者喺 Terminal：
   ```bash
   cd ~/Desktop/Shantou_Chaozhou_Trip && python3 -m http.server 8765
   ```
   然後開 http://localhost:8765

## 檔案結構

| 檔案 | 用途 |
|---|---|
| `index.html` | 頁面骨架（同 Hokkaido 一樣嘅 hero、主分頁、section 結構） |
| `css/base.css` | 由 Hokkaido 原樣複製嘅樣式（配色、表格、卡片、預算條） |
| `css/trip.css` | 新功能樣式（地圖工具列、酒店卡、高鐵表、可編輯預算、手機版） |
| `data/trip-data.js` | **所有行程資料**：地點座標、每日行程（方案 A／B）、高鐵、酒店、美食、預算、來源 |
| `data/photos.js` | Wikimedia Commons 相片（每張附原頁同授權） |
| `js/app.js` | 程式：由資料生成全部畫面、Leaflet 地圖、OSRM 路線、Open-Meteo 天氣、localStorage |

想改行程／價錢，只需要改 `data/trip-data.js`。

## 沿用 Hokkaido 嘅部分
- Leaflet 1.9.4 + OpenStreetMap 底圖、OSRM 實際道路路線（失敗自動改虛線）
- Open-Meteo 每日天氣卡、主分頁 + 日分頁、`table.itin` 行程表（時間／行程／交通／預算／已付）
- 「已付」剔選、自訂備註、上次開開嘅分頁都存喺 localStorage（今次加咗 `stc:` 前綴，唔會同 Hokkaido 互相覆蓋）

## 新增
- 12/24 出發（G6578 18:07 → 汕頭 21:03）；Day 2 已刪減南澳宋井、錢澳灣燈塔，令全日行程做得切
- 逐日彩色路線、編號標記（同行程表編號一致）、相片／簡介／貼士彈窗、高德／Apple／Google 導航（高德用 WGS-84 座標參數，避免內地坐標偏移）
- 酒店比較、12306 實時查證嘅高鐵班次及票價、開售日倒數、可編輯預算、旅客人數

## 資料準確度
- **已核實：** 高鐵班次、時間、票價（12306，2026-11-24 查詢，以 12 月上旬運行圖為準）；15 日預售期；座標（OSM）；車程（OSRM）；酒店評分及地址（攜程）
- **估算：** 酒店 12 月下旬房價、包車、餐飲、部分門票
- **未公佈：** 12/24、12/27 嘅車票（12/10、12/13 開售）、即時天氣（約出發前 16 日先有）
