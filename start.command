#!/bin/bash
# 雙擊啟動潮汕行程 Dashboard（本機伺服器，port 8765）
cd "$(dirname "$0")"
PORT=8765
echo "潮汕四日高鐵之旅 → http://localhost:$PORT"
( sleep 1; open "http://localhost:$PORT" ) &
python3 -m http.server $PORT
