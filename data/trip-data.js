/* =====================================================================
   汕頭・南澳・潮州・揭陽 行程數據（同 Hokkaido 版一樣：資料同畫面分開）
   ---------------------------------------------------------------------
   核實狀態 v:  'ok'  = 已核實（有來源）
               'est' = 估算（冇公開實價／按經驗推算）
               'na'  = 未公佈／未能核實
   座標：WGS-84（OpenStreetMap / Nominatim / Overpass 查證），同 OSM 底圖一致。
   車程：OSRM（router.project-osrm.org）實際道路計算；
         osrm = 自由車流分鐘數；est = 實際預估（×約1.35 + 泊車／市區緩衝）。
   資料搜集日期：2026-11-24
   ===================================================================== */

window.TRIP = {
  meta: {
    title: '汕頭 · 南澳島 · 潮州 · 揭陽',
    subtitle: '潮汕四日高鐵之旅',
    dates: '2026年12月24日（四）– 27日（日）',
    startDate: '2026-12-23',
    endDate: '2026-12-27',
    defaultTravellers: 4,
    dataVersion: 5,        // 改咗預設值就加 1，會重設瀏覽器內舊嘅人數／預算
    fxHKDperCNY: 1.09,      // ≈ 匯率，可喺「預算」頁修改
    researchedOn: '2026-11-24',
    storagePrefix: 'stc:'   // localStorage 前綴，避免同 Hokkaido 版互相覆蓋
  },

  /* -------------------------------------------------------------------
     地點（全部座標已查證；approx:true = 約略位置，誤差約 100–300 m）
     ------------------------------------------------------------------- */
  places: {
    /* 車站 */
    xjk: { type:'station', zh:'香港西九龙站', en:'Hong Kong West Kowloon Station', lat:22.3040, lng:114.1658, area:'香港',
      desc:'廣深港高鐵香港段總站。內地口岸區設於站內（一地兩檢），出入境手續喺西九龍站一次過完成。',
      tips:'建議開車前最少 45 分鐘到站（過關 + 安檢）。網上購票截止為開車前 30 分鐘。', v:'ok',
      src:[['港鐵高速鐵路','https://www.highspeed.mtr.com.hk/']] },
    stStation: { type:'station', zh:'汕头站', en:'Shantou Railway Station', lat:23.37469, lng:116.75243, area:'汕頭 龍湖區',
      desc:'汕頭主要高鐵站（廣汕高鐵、汕汕高鐵），有直達香港西九龍嘅列車。', photo:'stStation',
      tips:'出站有的士及網約車上落客區；到龍眼南路全季酒店約 7 km。', v:'ok' },
    chaoshan: { type:'station', zh:'潮汕站', en:'Chaoshan Railway Station', lat:23.54240, lng:116.58283, area:'潮州 潮安區',
      desc:'粵東最大高鐵樞紐，位於潮州、汕頭、揭陽三市中間。每日 6 班直達香港西九龍（12306 查證）。', photo:'chaoshan',
      tips:'回程建議喺呢度上車：揭陽市區（揭陽樓一帶）過嚟約 26 km、車程約 30–40 分鐘。', v:'ok' },
    jieyangnan: { type:'station', zh:'揭阳南站', en:'Jieyang South Railway Station', lat:23.57307, lng:116.36522, area:'揭陽 榕城區',
      desc:'離揭陽市區最近嘅高鐵站，但 12306 查詢顯示<b>冇直達香港西九龍嘅列車</b>（揭陽市只有惠來站 G6391 一班，惠來距市區約 60 km）。', photo:'jieyangnan',
      tips:'唔建議用作回港車站，除非轉車。', v:'ok' },

    /* Day 1 */
    hotelQJ: { type:'hotel', zh:'全季酒店(汕头龙眼南路万象城店)', en:'JI Hotel Shantou Longyan South Road MixC', lat:23.37094, lng:116.70587, area:'汕頭 金平區 龍眼路 102 號 1 座',
      desc:'2025 年開業，攜程 4.8 分（412 條點評），設免費停車場、自助早餐、洗衣房、健身室、免費行李寄存。', photo:null,
      tips:'步行約 850 m（約 10 分鐘）就到龍眼南路美食街。Day 2 朝早租車公司送車到呢度。', v:'ok',
      src:[['攜程','https://m.ctrip.com/html5/hotel/hoteldetail/131825137.html']] },
    hotelNA: { type:'hotel', zh:'雅斯特国际酒店(汕头南澳岛店)', en:"Yaste International Hotel Nan'ao Island", lat:23.41023, lng:117.03227, area:'南澳縣 後宅鎮 隆雲路 印象悅景花園 A3 棟',
      desc:'2026 年開業，攜程 4.5 分（58 條點評），有海景房、觀景露台、自助早餐、親子房。', photo:null,
      tips:'喺南澳縣城後宅鎮，附近有食肆。攜程設施列表冇寫泊車，入住前請向酒店確認停車位。', v:'ok',
      src:[['攜程','https://m.ctrip.com/html5/hotel/hoteldetail/135797548.html']] },
    longyan: { type:'food', zh:'龙眼南路美食街', en:'Longyan South Road Food Street', lat:23.3633, lng:116.7062, area:'汕頭 金平區 龍眼南路', photo:'longyan',
      desc:'汕頭本地人夜宵熱點，一條街集中咗粿條、牛肉丸、生醃、砂鍋粥、甜湯等潮汕小食。',
      tips:'晚上先最熱鬧；人氣店要排隊，可分散試多間。具體每間營業時間以店舖／大眾點評為準。', hours:'晚市至夜宵（各店不同，未逐一核實）', v:'est' },

    /* Day 2 南澳 */
    nanaoBridge: { type:'sight', zh:'南澳大桥', en:"Nan'ao Bridge", lat:23.43745, lng:116.90030, area:'汕頭 澄海 ↔ 南澳 長山尾', photo:'nanaoBridge',
      desc:'連接汕頭澄海萊蕪同南澳島長山尾嘅跨海大橋（國道 G539），全長約 11 km，係南澳島唯一陸路通道。',
      tips:'過橋要收費（2015 年公佈小客車 ¥48／次，現行收費未能核實）。橋上唔准停車，影橋景要去長山尾燈塔。', ticket:'過橋費約 ¥48／車次（2015 年資料）', v:'est',
      src:[['汕頭市政府（2015）','https://english.shantou.gov.cn/english/news/content/post_799776.html']] },
    zongbing: { type:'sight', zh:'总兵府', en:"Nan'ao General's Mansion", lat:23.45449, lng:117.09706, area:'南澳 深澳鎮', photo:'zongbing',
      desc:'明清兩代南澳鎮總兵駐地，號稱全國唯一海島總兵府，見證閩粵海防歷史，府前有鄭成功像。',
      tips:'規模唔大，約 30–45 分鐘睇完。', hours:'08:00–17:30（旅遊平台資料）', ticket:'團購約 ¥7 起（以現場為準）', time:'45 分鐘', v:'est',
      src:[['攜程攻略','https://gs.ctrip.com/html5/you/sight/215/1714961.html']] },
    tropicSquare: { type:'sight', zh:'北回归线广场', en:'Tropic of Cancer Square', lat:23.44426, lng:117.13175, area:'南澳 青澳灣', photo:'gate',
      desc:'青澳灣旁嘅北回歸線廣場，同「自然之門」標誌塔喺同一個園區。',
      tips:'<b>同下一站「自然之門」係同一地點</b>，一齊行即可，唔使再開車。', time:'45 分鐘（連自然之門）', v:'ok' },
    gate: { type:'sight', zh:'南澳北回归线标志·自然之门', en:"Nan'ao Tropic of Cancer Landmark – Gate of Nature", lat:23.44395, lng:117.13218, area:'南澳 青澳灣', photo:'gate',
      desc:'南澳北回歸線標誌塔，造型係一道「門」，夏至正午太陽直射時塔下無影。',
      tips:'廣場向海，影相最好係上午順光。', time:'45 分鐘', ticket:'未能核實（部分攻略稱免費）', v:'ok' },
    qingao: { type:'sight', zh:'青澳湾', en:"Qing'ao Bay", lat:23.43809, lng:117.13569, area:'南澳 青澳', photo:'qingao',
      desc:'南澳島最出名嘅沙灘，弧形海灣、沙質幼細、水清，被稱為「廣東最美海灣」之一。',
      tips:'12 月海風大、水凍，以散步影相為主。沙灘有海鮮大排檔可解決早午餐。', time:'1 小時', ticket:'免費（攜程）', v:'ok',
      src:[['攜程','https://gs.ctrip.com/html5/you/sight/chaoshandistrict2025172/17810.html']] },
    songjing: { type:'sight', zh:'南澳岛宋井', en:"Nan'ao Song Well", lat:23.39888, lng:117.10223, area:'南澳 雲澳鎮',
      desc:'相傳南宋末年宋帝南逃時士兵所掘嘅古井，位於海灘邊，潮漲時會被海水淹沒，潮退先見到，井水依然清甜。',
      tips:'睇唔睇到井口視乎潮汐，出發前可查當日潮汐表。', time:'30 分鐘', ticket:'未能核實', v:'est' },
    yunao: { type:'sight', zh:'云澳渔乡风情小镇', en:"Yun'ao Fishing Village", lat:23.40871, lng:117.09966, area:'南澳 雲澳鎮',
      desc:'南澳島南岸漁港小鎮，漁船、漁村街景、海鮮檔集中，適合食午餐。',
      tips:'海鮮按斤計，落單前問清價錢及做法。', time:'1 小時 10 分（連午餐）', v:'est' },
    qianao: { type:'sight', zh:'钱澳湾灯塔', en:"Qian'ao Bay Lighthouse", lat:23.41928, lng:116.99545, area:'南澳 後宅鎮 環島公路旁', photo:'qianao',
      desc:'南澳環島公路南段嘅白色燈塔，背山面海，環島公路景觀段之一。',
      tips:'路邊停車要小心來往車輛。', time:'30 分鐘', ticket:'免費（戶外）', v:'ok' },
    hhsLine: { type:'sight', zh:'黄花山北回归线网红打卡线', en:'Huanghuashan Tropic of Cancer Photo Line', lat:23.43737, lng:116.96512, area:'南澳 黃花山公路', approx:true,
      desc:'黃花山公路上北回歸線經過嘅位置，路面畫有標誌線，係社交平台熱門打卡點。',
      tips:'位置按 OSM 黃花山公路同北回歸線（約北緯 23.436°）交點推算，誤差約 200 m。馬路中間影相注意安全。', time:'30 分鐘', v:'est' },
    csw: { type:'sight', zh:'长山尾灯塔', en:'Changshanwei Lighthouse', lat:23.43433, lng:116.94151, area:'南澳 長山尾', photo:'csw',
      desc:'最近南澳大橋嘅燈塔，紅白塔身同大橋同框，係影南澳大橋最佳位置。',
      tips:'12 月日落約 17:45，黃昏前到最靚。', hours:'全日開放', ticket:'免費', time:'1 小時', v:'ok',
      src:[['南航旅遊攻略','https://www.csair.com/h5/cn/tourism_strategy/guonei_lvyougonglve/Shantou/1bf6mplqbovm8.shtml']] },
    oldtown: { type:'sight', zh:'汕头老城', en:'Shantou Old Town', lat:23.35528, lng:116.66989, area:'汕頭 金平區（開埠區）', photo:'oldtown',
      desc:'1860 年開埠後形成嘅騎樓老城，有汕頭開埠文化陳列館、郵政總局大樓、老媽宮等，近年活化，有不少咖啡店及文創小店。',
      tips:'以步行為主，騎樓街巷窄，叫車喺小公園或外馬路上落。', time:'1.5–2 小時', ticket:'街區免費；個別展館另計', v:'ok' },
    smallpark: { type:'sight', zh:'汕头小公园', en:'Shantou Small Park', lat:23.35785, lng:116.66945, area:'汕頭 金平區', photo:'smallpark',
      desc:'老城核心，中山紀念亭為中心向外放射嘅騎樓街區，晚上有燈光，係汕頭最具代表性嘅街景。',
      tips:'附近老媽宮粽球、福合埕牛肉丸等老字號可順路試。', time:'1 小時', ticket:'免費', v:'ok' },
    laomagong: { type:'food', zh:'老妈宫粽球', en:'Laomagong Zongqiu (rice dumplings)', lat:23.35752, lng:116.67074, area:'汕頭 小公園 老媽宮旁',
      desc:'汕頭老字號粽球店，鹹甜雙拼粽球。', tips:'遊記稱約 ¥12 一隻（未核實現價）。', cost:'約 ¥12／隻（遊記資料）', v:'est' },

    /* Day 3 */
    longquan: { type:'sight', zh:'龙泉岩寺庙群', en:'Longquan Yan Temple Complex', lat:23.40964, lng:116.64151, area:'汕頭 金平區 慈園路（汕頭大學附近）',
      desc:'由天然石洞同人工寺院組成嘅寺廟群。<b>注意：龍泉岩喺汕頭（金平區），唔係潮州</b>，剛好喺汕頭往潮州嘅路上，放喺 Day 3 第一站最順路。',
      tips:'09:00 開門，早啲出發可避開人流。', hours:'09:00–17:00（攜程）', ticket:'未能核實', time:'45 分鐘', v:'est',
      src:[['攜程','https://gs.ctrip.com/html5/you/sight/215/1646811.html']] },
    qinglong: { type:'sight', zh:'青龙古庙', en:'Qinglong Ancient Temple', lat:23.65404, lng:116.64088, area:'潮州 湘橋區 西新街道（古城南面）',
      desc:'潮州香火最旺嘅古廟之一，供奉安濟聖王，潮州人「營老爺」民俗嘅重要廟宇。',
      tips:'位於古城南面，由汕頭入潮州時先到，<b>建議調到潮州第一站</b>，避免之後走回頭路。', time:'30 分鐘', ticket:'未能核實', v:'est' },
    hanwengong: { type:'sight', zh:'韩文公祠', en:'Han Wen Gong Temple', lat:23.66652, lng:116.65570, area:'潮州 湘橋區 韓江東岸', photo:'hanwengong',
      desc:'紀念唐代韓愈（韓文公）嘅祠堂，依山而建，係現存最早紀念韓愈嘅祠廟。',
      tips:'<b>免費但要提前預約</b>（旅遊平台資料）。同廣濟橋東岸橋頭只隔約 300 m，參觀後步行過去。', hours:'08:30 開門（旅遊平台資料）', ticket:'免費，需預約', time:'45 分鐘', v:'est',
      src:[['攜程','https://gs.ctrip.com/html5/you/sight/467.html']] },
    guangji: { type:'sight', zh:'广济桥', en:'Guangji Bridge', lat:23.66502, lng:116.65201, area:'潮州 韓江', photo:'guangji',
      desc:'中國四大古橋之一，「十八梭船廿四洲」，梁橋與浮橋結合，中段浮橋可開合。',
      tips:'由東岸（韓文公祠一邊）行過橋，直接入廣濟門 → 牌坊街，唔使再坐車。去哪兒顯示北閣佛燈維修中。', hours:'約 10:00–17:30（17:00 停止入場，旅遊平台資料）', ticket:'¥20 起（攜程／去哪兒）', time:'1 小時', v:'est',
      src:[['去哪兒','https://touch.piao.qunar.com/touch/detail.htm?id=9591'],['攜程','https://gs.ctrip.com/html5/you/sight/467.html']] },
    paifang: { type:'sight', zh:'牌坊街', en:'Paifang Street (Memorial Archway Street)', lat:23.66445, lng:116.64526, area:'潮州 太平路', photo:'paifang',
      desc:'太平路上重建嘅 23 座石牌坊，兩旁騎樓，集中潮州小食、手信、工夫茶店。',
      tips:'午餐就喺呢度解決：鴨母捻、春餅、牛肉粿條等。', ticket:'免費', time:'1 小時 10 分（連午餐）', v:'ok' },
    kaiyuan: { type:'sight', zh:'开元寺', en:'Kaiyuan Temple, Chaozhou', lat:23.66600, lng:116.64469, area:'潮州 太平路', photo:'kaiyuan',
      desc:'始建於唐開元年間，粵東第一古剎，保存唐宋元明清各代文物。',
      tips:'寺內請保持安靜，部分殿堂唔准影相。', hours:'07:00 開門（旅遊平台資料）', ticket:'免費（旅遊平台資料）', time:'50 分鐘', v:'est' },
    gucheng: { type:'sight', zh:'潮州古城', en:'Chaozhou Ancient City', lat:23.66650, lng:116.64250, area:'潮州 湘橋區', photo:'gucheng', approx:true,
      desc:'保存完整嘅明清古城格局，甲第巷、義興甲巷等「百巷千街」有大量潮式民居、祠堂。',
      tips:'標記為古城中心大約位置；建議由開元寺向西北行入甲第巷，再行到西湖。', ticket:'免費', time:'1 小時 20 分', v:'ok' },
    westlake: { type:'sight', zh:'潮州西湖', en:'Chaozhou West Lake', lat:23.67352, lng:116.63768, area:'潮州 湘橋區', photo:'westlake',
      desc:'古城西北面嘅湖光山色公園，葫蘆山摩崖石刻、涵碧樓。',
      tips:'黃昏散步，之後由呢度出發去揭陽（約 31 km）。', ticket:'免費（公園）', time:'50 分鐘', v:'ok' },
    hotelJY: { type:'hotel', zh:'揭阳榕城揭阳楼亚朵酒店', en:'Atour Hotel Jieyang Tower Rongcheng', lat:23.5586, lng:116.3860, area:'揭陽 榕城區 臨江北路與才華路交叉口西 40 m',
      desc:'攜程評分 4.8（2,961 條點評），揭陽高檔酒店榜第 1。住客高頻提及前台服務、早餐豐富、房間大。',
      tips:'距揭陽南站約 3.7 km、潮汕站約 26 km、進賢門約 5.8 km。', v:'ok',
      src:[['攜程','https://m.ctrip.com/html5/hotel/hoteldetail/118949121.html']] },

    /* Day 4 */
    jygucheng: { type:'sight', zh:'揭阳古城', en:'Jieyang Ancient City', lat:23.5390, lng:116.3500, area:'揭陽 榕城區 進賢門一帶', approx:true, photo:'xuegong',
      desc:'以學宮、進賢門、城隍廟為核心嘅舊城區，騎樓街同古巷。',
      tips:'三個景點相距唔夠 300 m，全程步行。', ticket:'免費', time:'45 分鐘', v:'est' },
    xuegong: { type:'sight', zh:'揭阳学宫', en:'Jieyang Confucian Academy (Xuegong)', lat:23.53846, lng:116.35137, area:'揭陽 榕城區 韓祠路', photo:'xuegong',
      desc:'廣東現存規模最大、保存最完整嘅孔廟（學宮）建築群之一，始建於南宋。',
      tips:'<b>中午有午休</b>：據遊記約 09:00–11:30／14:30–17:30，週一閉館 → 一定要上午 11:30 前入場。', hours:'週二至日 09:00–11:30、14:30–17:30（遊記資料，未經官方核實）', ticket:'免費', time:'1 小時', v:'est',
      src:[['去哪兒','https://touch.travel.qunar.com/poi/705605']] },
    jinxian: { type:'sight', zh:'进贤门城楼', en:'Jinxian Gate Tower', lat:23.53739, lng:116.35304, area:'揭陽 榕城區 進賢門', photo:'jinxian',
      desc:'揭陽古城門樓，明代始建，係揭陽嘅城市標誌之一。',
      tips:'同學宮步行 3 分鐘。', ticket:'免費', time:'30 分鐘', v:'ok' }
  },

  /* -------------------------------------------------------------------
     出發安排（2026-11-24 更新）：一定要 12/24 出發，可以早 1 小時
     → 改搭 G6578 18:07 西九龍 → 汕頭 21:03；Day 2 刪減景點
     ------------------------------------------------------------------- */
  departure: {
    chosen: { no:'G6578', dep:'18:07', arr:'21:03', price:223 },
    why: '你要 12/24 先出發、可以早 1 小時：<b>G6578 18:07 → 汕頭 21:03</b> 比原本 19:20 班車早 1 小時到，仲平 ¥103（二等 ¥223 vs ¥326）。21:30 入住後仍有時間去龍眼南路食夜宵。',
    options: [
      { no:'G6578', time:'18:07 → 21:03（汕頭）', price:'¥223', verdict:'✅ 採用', note:'早 1 小時，最平，直達汕頭站（中途停潮汕站 20:36）。' },
      { no:'G6398', time:'19:20 → 22:03（汕頭）', price:'¥326', verdict:'後備', note:'如果 18:07 趕唔切／賣晒，改搭呢班；夜宵會推到 23:00 後。' },
      { no:'G926', time:'18:37 → 20:58（潮汕）', price:'¥266', verdict:'唔建議', note:'到潮汕站，再搭車約 45 km 入汕頭市區，實際比 G6578 更遲到酒店。' }
    ],
    cuts: {
      title: 'Day 2 刪減咗咩？',
      body: '原本 Day 2 要一日行 12 個點、約 166 km，而 12 月日落約 17:45、南澳景點 17:30 左右收，做唔切。已刪減：',
      removed: [
        { place:'songjing', why:'睇唔睇到井口要靠潮退，冬天時間又緊，性價比最低。' },
        { place:'qianao', why:'同長山尾燈塔性質重複（都係燈塔 + 海景），長山尾仲可以同南澳大橋同框。' }
      ],
      merged: '北回歸線廣場同自然之門係同一個園區，合併為一站。',
      result: '保留 10 個點（汕頭老城、小公園、長山尾燈塔、南澳大橋、黃花山打卡線、雲澳、青澳灣、北回歸線廣場／自然之門、總兵府），08:00 取車出發，17:30 入住南澳雅斯特，行車約 102 km。',
      optional: '如果當日行得快：錢澳灣燈塔喺黃花山去雲澳途中（只多約 4 km），可以停 15 分鐘影相；宋井離雲澳 1.5 km。'
    }
  },

  days: {
    B1: { n:1, date:'2026-12-24', label:'12/24（四）', color:'#d68c45', area:'香港 → 汕頭',
      title:'Day 1 · 香港 → 汕頭，龍眼南路夜宵', summary:'18:07 由西九龍出發，21:03 到汕頭。入住龍眼南路全季酒店，行 10 分鐘去龍眼南路食夜宵。',
      items:[
        { time:'17:15–18:07', dur:'約 50 分鐘', type:'free', place:'xjk', title:'香港西九龍站 — 過關、候車', note:'開車前最少 45 分鐘到站（17:20 前）。' },
        { time:'18:07–21:03', dur:'2 小時 56 分', type:'rail', title:'G6578　香港西九龍 → 汕頭', note:'二等座 ¥223 ／一等座 ¥357（12306，2026-11-24 查證）。中途停潮汕站 20:36，<b>唔好喺潮汕落車</b>。車票 12/10 開售。後備：G6398 19:20 → 22:03。', cost:{amt:223, per:'person', cat:'rail'}, link:'#trains' },
        { time:'21:03–21:30', type:'drive', from:'stStation', to:'hotelQJ', km:7.0, osrm:8, est:15, note:'滴滴「6 座」或分兩架的士（未取車）' },
        { time:'21:30–21:50', type:'hotel', place:'hotelQJ', title:'入住 全季酒店（汕頭龍眼南路萬象城店）', cost:{amt:350, per:'room', cat:'hotel', est:true} },
        { time:'21:50–22:00', type:'walk', title:'步行約 850 m 去龍眼南路美食街' },
        { time:'22:00–23:30', dur:'約 1.5 小時', type:'sight', place:'longyan', title:'龍眼南路美食街 — 夜宵', note:'點評必吃榜就喺附近：拜蟹咖（生醃膏蟹 4.6）、豪弟官塘（砂鍋粥 4.4）、雄記牛肉（濕炒粿條 4.4）、海記豬血湯（連續 6 年上榜）。詳見「美食」頁。', cost:{amt:80, per:'person', cat:'food', est:true} },
        { time:'23:30–23:40', type:'walk', title:'步行返酒店' }
      ],
      route:['stStation','hotelQJ','longyan','hotelQJ'] },

    B2: { n:2, date:'2026-12-25', label:'12/25（五）', color:'#3e6e8e', area:'汕頭老城 → 南澳島',
      title:'Day 2 · 取車 → 汕頭老城 → 南澳島環島，住南澳', summary:'08:00 SUV 送到全季酒店，連行李出發：上午行汕頭老城同小公園，中午過南澳大橋，由西向東環島（長山尾 → 黃花山 → 雲澳 → 青澳 → 北回歸線 → 總兵府），17:30 入住南澳雅斯特。行車約 102 km。',
      note:'<b>✎ 因為改住南澳：</b>汕頭老城由夜晚改到朝早行（騎樓街朝早人少、好影相），之後一程過島，唔使行回頭路。南澳景點由西向東行，最後一站總兵府喺深澳鎮，離後宅酒店約 15 km。<br><b>✂ 已刪減：</b>宋井（要潮退先見到井口）同錢澳灣燈塔（同長山尾燈塔重複）。<b>如果行得快：</b>錢澳灣燈塔喺黃花山去雲澳途中，可停 15 分鐘影相。',
      items:[
        { time:'07:45–08:00', type:'car', place:'hotelQJ', title:'🚙 取車：租車公司 08:00 送 SUV 到全季酒店，退房、行李上車', note:'租期開始。驗車時影低車身四周、油量同里數；確認保險、押金同潮汕站異地還車已寫入訂單。' },
        { time:'08:00–08:15', type:'drive', from:'hotelQJ', to:'oldtown', km:5.2, osrm:7, est:15, note:'自駕，泊小公園附近停車場（位置以高德為準）' },
        { time:'08:15–10:30', dur:'約 2 小時 15 分', type:'sight', place:'oldtown', title:'汕頭老城 ＋ 小公園 — 騎樓街、郵政總局大樓、開埠文化陳列館（外觀）＋ 🍽 早餐', also:'smallpark', note:'早餐：侗平腸粉（點評必吃榜 4.3）、老媽宮粽球；松英汫洲蠔仔粥（必吃榜 4.4）如已開門可試蠔仔烙。陳列館開放時間未核實，入唔到就睇外觀。', cost:{amt:50, per:'person', cat:'food', est:true} },
        { time:'10:30–11:15', type:'drive', from:'smallpark', to:'csw', km:38.8, osrm:31, est:45, note:'經南澳大橋過島（橋上唔可以停車，過橋收費）' },
        { time:'11:15–12:00', dur:'約 45 分鐘', type:'sight', place:'csw', title:'長山尾燈塔 ＋ 南澳大橋景觀', also:'nanaoBridge', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'12:00–12:10', type:'drive', from:'csw', to:'hhsLine', km:3.9, osrm:4, est:10 },
        { time:'12:10–12:30', dur:'約 20 分鐘', type:'sight', place:'hhsLine', title:'黃花山北回歸線打卡線', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'12:30–12:55', type:'drive', from:'hhsLine', to:'yunao', km:19.4, osrm:19, est:25, note:'途經錢澳灣燈塔（已刪減，時間夠可停 15 分鐘）' },
        { time:'12:55–14:05', dur:'約 1 小時 10 分', type:'meal', place:'yunao', title:'雲澳漁鄉風情小鎮 ＋ 🍽 海鮮午餐', cost:{amt:130, per:'person', cat:'food', est:true} },
        { time:'14:05–14:20', type:'drive', from:'yunao', to:'qingao', km:9.1, osrm:9, est:15 },
        { time:'14:20–15:20', dur:'約 1 小時', type:'sight', place:'qingao', title:'青澳灣', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'15:20–15:25', type:'drive', from:'qingao', to:'gate', km:2.3, osrm:4, est:5 },
        { time:'15:25–16:10', dur:'約 45 分鐘', type:'sight', place:'tropicSquare', title:'北回歸線廣場 ＋ 自然之門（同一園區）', also:'gate', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'16:10–16:25', type:'drive', from:'tropicSquare', to:'zongbing', km:8.6, osrm:10, est:15 },
        { time:'16:25–17:10', dur:'約 45 分鐘', type:'sight', place:'zongbing', title:'總兵府（17:30 關門前）', cost:{amt:10, per:'person', cat:'ticket', est:true} },
        { time:'17:10–17:30', type:'drive', from:'zongbing', to:'hotelNA', km:14.8, osrm:12, est:20 },
        { time:'17:30', type:'hotel', place:'hotelNA', title:'入住 雅斯特國際酒店（汕頭南澳島店）', note:'泊車安排請向酒店確認。', cost:{amt:450, per:'room', cat:'hotel', est:true} },
        { time:'18:30–20:00', type:'meal', title:'🍽 晚餐：後宅鎮海鮮（酒店附近）', note:'海鮮按斤計，落單前問清價錢同做法。', cost:{amt:120, per:'person', cat:'food', est:true} }
      ],
      route:['hotelQJ','oldtown','smallpark','nanaoBridge','csw','hhsLine','yunao','qingao','gate','tropicSquare','zongbing','hotelNA'] },

    D3: { n:3, date:'2026-12-26', label:'12/26（六）', color:'#b5473a', area:'汕頭 → 潮州 → 揭陽',
      title:'Day 3 · 龍泉岩 → 潮州古城 → 入住揭陽（自駕，行李放車尾）', summary:'自駕：07:45 由南澳出發過橋，經龍泉岩入潮州；睇完韓文公祠就將車泊喺西湖一帶，下晝全程步行古城，最後喺同一個停車場開車去揭陽。行李一直放車尾。',
      note:'<b>✎ 路線優化：</b>①龍泉岩其實喺<b>汕頭</b>（金平區汕大附近），正好喺去潮州路上，保留第一站。②青龍古廟喺古城南面，由汕頭入潮州最先經過 → 調到潮州第一站。③韓文公祠同廣濟橋東岸只隔 300 m：自駕唔可以「東岸落車、西岸上車」，所以睇完韓文公祠就揸車過江，<b>泊喺西湖一帶</b>，再步行去廣濟橋（由西岸行出去再行返）、牌坊街、開元寺、古城，最後喺西湖取車。原順序要喺韓江兩岸來回兜（廣濟橋 → 韓文公祠 → 南面青龍古廟 → 返古城）。<br><b>潮州 → 揭陽交通：</b>自駕直達（約 32 km、40 分鐘）；鐵路要先去潮汕站再轉，唔划算。',
      items:[
        { time:'07:30–07:45', type:'car', place:'hotelNA', title:'🚙 退房，行李上車（自駕：南澳 → 汕頭 → 潮州 → 揭陽）', note:'早餐開餐時間請向酒店確認，可能要食快啲或外帶。行李放車尾、用遮物簾遮住。' },
        { time:'07:45–08:50', type:'drive', from:'hotelNA', to:'longquan', km:51.4, osrm:43, est:65, note:'經南澳大橋返汕頭（過橋收費）' },
        { time:'09:00–09:45', dur:'約 45 分鐘', type:'sight', place:'longquan', title:'① 龍泉岩寺廟群（汕頭）', note:'09:00 開門，08:50 到可稍等。', cost:{amt:0, per:'person', cat:'ticket', est:true} },
        { time:'09:45–10:35', type:'drive', from:'longquan', to:'qinglong', km:35.3, osrm:36, est:50 },
        { time:'10:35–11:05', dur:'約 30 分鐘', type:'sight', place:'qinglong', title:'④ 青龍古廟（調前）', cost:{amt:0, per:'person', cat:'ticket', est:true} },
        { time:'11:05–11:15', type:'drive', from:'qinglong', to:'hanwengong', km:5.2, osrm:7, est:10 },
        { time:'11:15–12:00', dur:'約 45 分鐘', type:'sight', place:'hanwengong', title:'③ 韓文公祠（需預約）', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'12:00–12:15', type:'drive', from:'hanwengong', to:'westlake', km:5.1, osrm:7, est:15, note:'過韓江去西岸，泊西湖公園一帶停車場（下晝全程步行，停車場位置以高德為準）' },
        { time:'12:15–12:35', type:'walk', title:'步行約 1.5 km 經古城去廣濟門（廣濟橋西岸橋頭）' },
        { time:'12:35–13:30', dur:'約 55 分鐘', type:'sight', place:'guangji', title:'② 廣濟橋（由西岸行出去再行返）', cost:{amt:20, per:'person', cat:'ticket'} },
        { time:'13:30–14:30', dur:'約 1 小時', type:'meal', place:'paifang', title:'⑥ 牌坊街 ＋ 🍽 午餐（潮州小食）', note:'午餐推介：有味道魚生・砂鍋粥（牌坊街店，點評必吃榜 4.8，可訂位）；飯後行牌坊街試鴨母捻、春餅。', cost:{amt:80, per:'person', cat:'food', est:true} },
        { time:'14:30–15:15', dur:'約 45 分鐘', type:'sight', place:'kaiyuan', title:'⑤ 開元寺', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'15:15–16:30', dur:'約 1 小時 15 分', type:'sight', place:'gucheng', title:'⑦ 潮州古城（甲第巷、義興甲巷）— 步行', note:'可喺古城工夫茶館坐低歇腳。', cost:{amt:40, per:'person', cat:'food', est:true} },
        { time:'16:30–16:40', type:'walk', title:'步行返西湖（約 1 km）' },
        { time:'16:40–17:25', dur:'約 45 分鐘', type:'sight', place:'westlake', title:'⑧ 潮州西湖（黃昏），之後返停車場取車', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'17:25–18:05', type:'drive', from:'westlake', to:'hotelJY', km:31.9, osrm:27, est:40, note:'自駕去揭陽酒店' },
        { time:'18:05', type:'car', place:'hotelJY', title:'🅿 泊車：揭陽亞朵免費泊車過夜' },
        { time:'18:05', type:'hotel', place:'hotelJY', title:'⑨ 入住 揭陽榕城揭陽樓亞朵酒店', cost:{amt:400, per:'room', cat:'hotel', est:true} },
        { time:'19:00–20:30', type:'meal', title:'🍽 晚餐：鴻興家・非遺潮汕菜（臨江北路店，點評必吃榜 4.4）', note:'後備：東興生魚粥（必吃榜 4.7）。', cost:{amt:80, per:'person', cat:'food', est:true} }
      ],
      route:['hotelNA','nanaoBridge','longquan','qinglong','hanwengong','westlake','guangji','paifang','kaiyuan','gucheng','westlake','hotelJY'] },

    D4: { n:4, date:'2026-12-27', label:'12/27（日）', color:'#7a5aa6', area:'揭陽 → 香港',
      title:'Day 4 · 揭陽古城 → 潮汕站 → 香港', summary:'09:15 連行李自駕出發，行揭陽古城、學宮（11:30 午休前）、進賢門，食完午餐入油，直接揸去潮汕站還車（唔使返酒店攞行李），搭 G925 15:55 返西九龍（18:17 到）。',
      note:'<b>✎ 回程車站：</b>12306 查詢（2026-11-24）顯示<b>揭陽南站冇直達西九龍列車</b>；潮汕站每日 6 班直達。進賢門 → 潮汕站約 32 km、約 40 分鐘；14:10 到站還車，比開車早 1 小時 45 分（週日下午可能塞車 + 4 人實名安檢）。',
      items:[
        { time:'08:00–09:00', type:'meal', title:'🍽 酒店早餐', note:'住客評價早餐豐富（攜程）。' },
        { time:'09:00–09:15', type:'car', place:'hotelJY', title:'🚙 退房，行李上車' },
        { time:'09:15–09:30', type:'drive', from:'hotelJY', to:'jinxian', km:5.8, osrm:6, est:15, note:'自駕（泊進賢門／學宮一帶，停車場位置以高德為準）' },
        { time:'09:30–10:15', dur:'約 45 分鐘', type:'sight', place:'jygucheng', title:'① 揭陽古城 — 騎樓、城隍廟一帶', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'10:15–11:15', dur:'約 1 小時', type:'sight', place:'xuegong', title:'② 揭陽學宮（11:30 午休前完成）', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'11:15–11:45', dur:'約 30 分鐘', type:'sight', place:'jinxian', title:'③ 進賢門城樓', cost:{amt:0, per:'person', cat:'ticket'} },
        { time:'11:45–13:30', dur:'約 1 小時 45 分', type:'meal', title:'🍽 午餐：新合興牛肉火鍋（榕城古城店，點評必吃榜 4.5）', note:'飯後可買乒乓粿做小食。後備：盧記牛肉店（必吃榜 4.6）。', cost:{amt:60, per:'person', cat:'food', est:true} },
        { time:'13:30–14:10', type:'drive', from:'jinxian', to:'chaoshan', km:31.8, osrm:28, est:40, note:'自駕去潮汕站；出發前喺附近油站入返取車時嘅油量' },
        { time:'14:10–14:30', type:'car', place:'chaoshan', title:'🚙 還車：潮汕站（租車公司指定還車點，異地還車）', note:'租期結束。同職員一齊驗車、影相；拎行李落車。還車點準確位置以訂單為準。' },
        { time:'14:30–15:55', type:'free', place:'chaoshan', title:'潮汕站 — 實名安檢、候車（4 人預留充足緩衝）' },
        { time:'15:55–18:17', dur:'2 小時 22 分', type:'rail', title:'④ G925　潮汕 → 香港西九龍', note:'二等座 ¥276 ／一等座 ¥442（12306，2026-11-24 查證）。車票 12/13 開售。後備：G923 17:25→19:48、G6577 15:34→17:47（¥210）。', cost:{amt:276, per:'person', cat:'rail'}, link:'#trains' }
      ],
      route:['hotelJY','jygucheng','xuegong','jinxian','chaoshan'] }
  },
  planDays: { B:['B1','B2','D3','D4'] },

  /* -------------------------------------------------------------------
     高鐵（全部來自 12306 queryG / queryTicketPrice，查詢日期 2026-11-24，
     以 12/2–12/8 嘅運行圖為準；12 月下旬時刻表要開售先可以 100% 確認）
     價格單位：人民幣；O=二等座、M=一等座、A9=商務座
     ------------------------------------------------------------------- */
  trains: {
    window: { days:15, rule:'車票預售期 15 天（含乘車當日）', source:['港鐵高鐵：於12306購票','https://www.highspeed.mtr.com.hk/tc/latest-news/ticketing-via-12306-purchase-ticket.html'],
      observed:'2026-11-24 實測：西九龍出發可訂至 12/8；12/9 未開放 → 符合 15 天規則。潮汕站 12/8 車票顯示「14點起售」。',
      releases:[ {date:'2026-12-10', for:'12/24 去程 G6578'}, {date:'2026-12-13', for:'12/27 回程 G925'} ] },
    outbound: [
      { no:'G6578', from:'香港西九龙', to:'汕头', dep:'18:07', arr:'21:03', dur:'2:56', O:223, M:357, A9:745, days:'每日', rec:true, note:'採用：比 19:20 早 1 小時，最平（¥223），直達汕頭站（中途停潮汕 20:36）。' },
      { no:'G6398', from:'香港西九龙', to:'汕头', dep:'19:20', arr:'22:03', dur:'2:43', O:326, M:523, A9:1107, days:'每日（12/2–12/8 均有）', note:'後備：如 18:07 趕唔切；22:03 到。' },
      { no:'G926', from:'香港西九龙', to:'潮汕', dep:'18:37', arr:'20:58', dur:'2:21', O:266, M:442, A9:930, days:'每日', note:'到潮汕站，再搭車約 45 km 入汕頭市區（多約 50 分鐘 + 車費）。' },
      { no:'G900', from:'香港西九龙', to:'潮汕', dep:'20:00', arr:'22:11', dur:'2:11', O:179, M:null, A9:null, days:'只見於週五至週一（12/4–12/7）；12/2、12/3（週三、四）冇開 → 12/23、12/24 大機會唔開', note:'座位等級同一般 G 車唔同（12306 顯示二等 ¥179，另有 ¥203／¥250 兩種座位）。' },
      { no:'G6392', from:'香港西九龙', to:'汕头', dep:'12:55', arr:'15:10', dur:'2:15', O:305, M:489, A9:1033, days:'每日', note:'如想 Day 1 下午已到汕頭，可考慮呢班。' },
      { no:'G6574', from:'香港西九龙', to:'汕头', dep:'11:58', arr:'14:48', dur:'2:50', O:223, M:357, A9:745, days:'每日', note:'' },
      { no:'G6390', from:'香港西九龙', to:'汕头', dep:'07:26', arr:'09:47', dur:'2:21', O:294, M:489, A9:1033, days:'每日', note:'09:35 先到汕頭南。' }
    ],
    ret: [
      { no:'G925', from:'潮汕', to:'香港西九龙', dep:'15:55', arr:'18:17', dur:'2:22', O:276, M:442, A9:930, days:'每日', rec:true, note:'上午有足夠時間行揭陽古城，返到香港仲早。' },
      { no:'G923', from:'潮汕', to:'香港西九龙', dep:'17:25', arr:'19:48', dur:'2:23', O:276, M:442, A9:930, days:'每日', note:'後備／想喺揭陽多留：最後一班直達。' },
      { no:'G6577', from:'潮汕', to:'香港西九龙', dep:'15:34', arr:'17:47', dur:'2:13', O:210, M:337, A9:700, days:'每日', note:'最平；同 G925 時間相近。' },
      { no:'G919', from:'潮汕', to:'香港西九龙', dep:'11:26', arr:'13:52', dur:'2:26', O:276, M:442, A9:930, days:'每日', note:'太早，揭陽景點未行完。' },
      { no:'G921', from:'潮汕', to:'香港西九龙', dep:'11:53', arr:'14:20', dur:'2:27', O:276, M:442, A9:930, days:'每日', note:'' },
      { no:'G6573', from:'潮汕', to:'香港西九龙', dep:'08:47', arr:'11:34', dur:'2:47', O:210, M:337, A9:700, days:'每日', note:'' },
      { no:'G6391', from:'惠来（揭陽市轄）', to:'香港西九龙', dep:'16:17', arr:'18:22', dur:'2:05', O:261, M:417, A9:877, days:'每日', note:'12306 列為「揭陽」出發，但惠來站距揭陽市區約 60 km，唔方便。' },
      { no:'G6391', from:'汕头', to:'香港西九龙', dep:'15:41', arr:'18:22', dur:'2:41', O:305, M:489, A9:1033, days:'每日', note:'汕頭站出發嘅後備（揭陽市區過去約 50 km）。' }
    ],
    backup: '如直達車賣晒：① 潮汕／汕頭 → 深圳北（班次極多），再轉深圳北 → 西九龍（約 15–20 分鐘，班次密）；② 搭潮汕站 G925／G923 後備；③ 改坐汕頭站 G6391 15:41。',
    links: [ ['12306 官網','https://www.12306.cn/'], ['12306 時刻表查詢','https://kyfw.12306.cn/otn/leftTicket/init'], ['港鐵高鐵（香港段購票）','https://www.highspeed.mtr.com.hk/'], ['Trip.com 火車票','https://hk.trip.com/trains/china/'] ]
  },

  /* -------------------------------------------------------------------
     酒店比較（價錢 = 估算，12 月下旬實價需於攜程／官網入日期查詢）
     ------------------------------------------------------------------- */
  hotels: [
    { city:'汕頭市區', nights:'12/24–25（1 晚）', nightsB:1, rec:'hotelQJ', chosen:true,
      reason:'<b>你已揀：全季酒店（龍眼南路萬象城店）</b>。2025 年新開、攜程 4.8 分；步行 10 分鐘到龍眼南路美食街，第一晚食夜宵最方便；有免費停車場，Day 2 朝早租車公司可以直接送車到酒店。',
      options:[
        { id:'hotelQJ', zh:'全季酒店(汕头龙眼南路万象城店)', en:'JI Hotel Shantou Longyan South Road MixC', lat:23.37094, lng:116.70587,
          rating:'攜程 4.8／5（412 條點評）· 金砂公園舒適型酒店熱賣 No.8', ratingV:'ok', opened:'2025 年開業', price:[280,420], room:'全季標準（面積未核實）；有家庭房',
          facilities:'免費停車場、自助早餐、洗衣房、乾衣機、健身室、機器人服務、免費行李寄存',
          dist:{'汕頭站':'7.0 km（約 15 分鐘）','龍眼南路美食街':'步行約 850 m','小公園老城':'5.2 km（約 15 分鐘）','南澳大橋（長山尾）':'約 40 km（經老城）'},
          pros:['步行去龍眼南路食夜宵','新酒店、評分高','免費泊車，送車上門方便'],
          cons:['經濟型品牌，房間設施比高檔酒店簡單'],
          cancel:'按房價方案而定（訂房時睇「免費取消」條件）', links:[['攜程','https://m.ctrip.com/html5/hotel/hoteldetail/131825137.html'],['華住會官網','https://www.huazhu.com/']] },
      ] },
    { city:'南澳島', nights:'12/25–26（1 晚）', nightsB:1, rec:'hotelNA', chosen:true,
      reason:'<b>你已揀：雅斯特國際酒店（南澳島店）</b>。2026 年新開、攜程 4.5 分（點評數仲少，只有 58 條）；喺南澳縣城後宅鎮，食飯方便。住島上嘅好處：Day 2 唔使趕 17:30 前離島，可以慢慢行；Day 3 朝早要預多約 1 小時車程返汕頭／潮州。',
      options:[
        { id:'hotelNA', zh:'雅斯特国际酒店(汕头南澳岛店)', en:"Yaste International Hotel Nan'ao Island", lat:23.41023, lng:117.03227,
          rating:'攜程 4.5／5（58 條點評）· 南澳島高檔酒店榜 No.9', ratingV:'ok', opened:'2026 年開業', price:[350,600], room:'有海景房、套房、連通房、親子房（面積未核實）',
          facilities:'自助早餐、智能客控、兒童樂園、棋牌室、機器人服務、觀景露台；<b>泊車未列明</b>',
          dist:{'總兵府':'14.8 km（約 20 分鐘）','長山尾燈塔（南澳大橋）':'約 10 km','龍泉岩（Day 3 第一站）':'51.4 km（約 65 分鐘）','潮州青龍古廟':'66.5 km（約 1 小時 15 分）'},
          pros:['新酒店，有海景房','住縣城，晚餐選擇多','Day 2 唔使趕住離島'],
          cons:['點評數少，評分未穩定','Day 3 去潮州要多約 1 小時車程','12/25 聖誕夜（週五）房價可能偏高'],
          cancel:'按房價方案而定', links:[['攜程','https://m.ctrip.com/html5/hotel/hoteldetail/135797548.html']] }
      ] },
    { city:'揭陽', nights:'12/26–27（1 晚）', nightsB:1, rec:'hotelJY', chosen:true,
      reason:'<b>你已揀：揭陽樓亞朵酒店</b>。攜程 4.8 分、近 3,000 條點評、揭陽高檔酒店榜第 1，點評一致讚早餐同房間大；有免費泊車，Day 4 去揭陽古城約 15 分鐘、去潮汕站約 40 分鐘。',
      options:[
        { id:'hotelJY', zh:'揭阳榕城揭阳楼亚朵酒店', en:'Atour Hotel Jieyang Tower Rongcheng', lat:23.5586, lng:116.3860,
          rating:'攜程 4.8／5（2,961 條點評）· 揭陽高檔酒店榜 No.1', ratingV:'ok', opened:'—', price:[350,450], room:'住客評價「房間大」（面積未核實）',
          facilities:'自助早餐（好評）、免費泊車',
          dist:{'潮汕站':'26.3 km（約 30–40 分鐘）','揭陽南站':'3.7 km','進賢門／學宮':'5.8 km（約 15 分鐘）','潮州西湖':'31 km'},
          pros:['點評數量多、評分穩定','揭陽樓江景區，晚上有夜景','去潮汕站同去古城都唔遠'],
          cons:['唔係步行可到古城（自駕約 15 分鐘）'],
          cancel:'按房價方案而定', links:[['攜程','https://m.ctrip.com/html5/hotel/hoteldetail/118949121.html'],['永安旅遊','https://www.wingontravel.com/hotel/detail-jieyang-118949121/jieyang-rongcheng-jieyang-tower-atour-hotel/'],['亞朵官網','https://www.yaduo.com/']] },
      ] }
  ],

  /* -------------------------------------------------------------------
     本地交通
     ------------------------------------------------------------------- */
  localTransport: [
    { title:'🪪 駕照（出發前一定要搞掂）', body:'香港駕照<b>唔可以</b>直接喺內地揸車。租車公司一般要求<b>內地駕照</b>；持香港駕照嘅話，要先換領內地駕照，或者向當地車管所申請臨時駕駛許可。租車前向租車公司確認佢哋接受邊種證件。開車嗰位（同後備司機）要帶埋回鄉證。' },
    { title:'🚙 SUV 揀幾大？', body:'4 人 + 4 件行李：普通 5 座 SUV 尾箱大約放到 2 個 28 吋喼 + 2 個登機喼。如果 4 個都係大喼，揀<b>7 座 SUV</b>（第三排摺埋當尾箱）或者大型 SUV。訂車時睇清楚車型嘅尾箱容量。' },
    { title:'📝 點樣租', body:'攜程租車、一嗨（eHi）、神州租車等。訂單要寫清楚：12/25 08:00 送車上門到全季酒店（汕頭龍眼路 102 號）、12/27 約 14:10 潮汕站<b>異地還車</b>。確認：基本保險 + 不計免賠、租車押金同違章押金（通常信用卡預授權）、異地還車費、送車費、油量政策（一般滿油取、滿油還）。' },
    { title:'🅿 泊車', body:'全季同揭陽亞朵有免費泊車；南澳雅斯特未列明，入住前請確認。南澳島景點大多有停車位；汕頭老城、潮州古城、揭陽古城街巷窄，泊外圍停車場再步行（行程已經咁安排）。內地停車場多數用掃車牌 + 微信／支付寶付款。' },
    { title:'⚠ 內地駕駛要留意', body:'靠右行車；電子眼多，超速、壓線、亂泊都會影相罰款（違章押金會扣）。開高德導航會提示測速同車道。路口右轉要讓行人。' },
    { title:'滴滴／的士', body:'只剩 Day 1 夜晚（未取車）：汕頭站 → 酒店、往返龍眼南路。4 人可叫滴滴「6 座」車型，或者分兩架的士。滴滴 App 支援香港手機號碼註冊，可綁定 AlipayHK／WeChat Pay。', cost:'約 ¥80–150（估算）' },
    { title:'南澳大橋過橋費', body:'2015 年 4 月起收費，當時公佈一類車（小客車）¥48／車次。現行收費未能核實；一般可用 ETC 或現場掃碼付款。', cost:'≈ ¥48 × 2（2015 年資料）' },
    { title:'付款', body:'內地大部分店舖、的士、景點、停車場只收電子支付：建議開通 AlipayHK 或 WeChat Pay（綁香港信用卡），另帶少量人民幣現金。' }
  ],

  /* -------------------------------------------------------------------
     自駕 SUV 取車／還車時間表（價錢全部估算）
     ------------------------------------------------------------------- */
  carRental: {
    vehicle:'SUV（5 座或 7 座，見下面「SUV 揀幾大？」）',
    steps: [
      { when:'12/24（四）21:03', what:'未取車', where:'汕頭站 → 全季酒店', note:'夜晚門店未必營業，第一晚用滴滴／的士。' },
      { when:'12/25（五）07:45–08:00', what:'🚙 送車上門（租期開始）', where:'全季酒店（汕頭龍眼南路萬象城店）', note:'驗車影相；確認保險、押金、異地還車。退房，行李上車。' },
      { when:'12/25（五）', what:'自駕：汕頭老城 → 南澳島', where:'約 102 km', note:'晚上住南澳雅斯特（泊車請向酒店確認）。' },
      { when:'12/26（六）', what:'自駕：南澳 → 汕頭 → 潮州 → 揭陽', where:'約 130 km', note:'潮州泊西湖一帶；晚上泊揭陽亞朵（免費）。' },
      { when:'12/27（日）09:15', what:'連行李出發', where:'揭陽古城 → 潮汕站', note:'約 40 km；還車前入油。' },
      { when:'12/27（日）14:10–14:30', what:'🚙 還車（租期結束）', where:'潮汕站（異地還車）', note:'約 54.5 小時，多數按 3 日計。' }
    ],
    costs: [
      ['SUV 租金 × 3 日', 750, 1350],
      ['基本保險 + 不計免賠 × 3 日', 150, 300],
      ['異地還車費（汕頭 → 潮汕站）', 100, 300],
      ['送車上門費（全季酒店）', 0, 100],
      ['油費（約 270 km）', 150, 250],
      ['過橋費 + 高速費', 120, 200],
      ['停車費', 60, 150]
    ],
    deposit:'押金另計：租車押金 + 違章押金，通常用信用卡預授權（金額視乎車行，還車後約 30 日內解凍）。'
  },

  /* -------------------------------------------------------------------
     美食
     ------------------------------------------------------------------- */
  foodDishes: [
    { zh:'潮汕牛肉火鍋', en:'Chaoshan beef hotpot', desc:'即劏黃牛按部位分切（吊龍、匙仁、五花趾、嫩肉），清湯涮幾秒即食，配沙茶醬。', photo:'hotpot', cost:'人均約 ¥80–120（估算）' },
    { zh:'手打牛肉丸', en:'Hand-beaten beef balls', desc:'汕頭招牌，彈牙爽口，牛筋丸更有咬口。可買真空包裝做手信（注意入境香港規定）。', cost:'一碗約 ¥15–25（估算）' },
    { zh:'粿條湯', en:'Kway teow soup', desc:'潮汕早餐之王，米粉皮配牛肉／豬雜／魚丸清湯。', photo:'kwayteow', cost:'約 ¥15–25（估算）' },
    { zh:'潮州滷鵝', en:'Chaozhou braised goose', desc:'獅頭鵝滷水，鵝肝、鵝片、鵝掌，配蒜泥醋。', photo:'luoe', cost:'一碟約 ¥50–120（估算）' },
    { zh:'蠔烙', en:'Oyster omelette', desc:'番薯粉 + 鮮蠔 + 雞蛋煎到外脆內軟，配魚露。', cost:'約 ¥25–40（估算）' },
    { zh:'砂鍋粥', en:'Claypot congee', desc:'夜宵首選，蝦蟹砂鍋粥米粒開花、海鮮鮮甜。', photo:'congee', cost:'一鍋約 ¥60–150（估算）' },
    { zh:'生醃', en:'Raw marinated seafood', desc:'醬油、蒜、辣椒醃生蝦蟹蜆，潮汕人至愛；腸胃敏感者慎食。', cost:'約 ¥40–100（估算）' },
    { zh:'鴨母捻（湯圓）', en:'Chaozhou glutinous rice balls', desc:'潮州甜湯圓，大粒軟糯，配綠豆、芋泥等餡。', cost:'約 ¥10–20（估算）' },
    { zh:'粽球', en:'Zongqiu', desc:'汕頭特色粽，鹹甜雙拼。', cost:'約 ¥12／隻（遊記）' },
    { zh:'揭陽乒乓粿', en:'Jieyang pingpong kueh', desc:'揭陽傳統米粿甜點，外軟內有花生芝麻餡。', cost:'約 ¥5–15（估算）' },
    { zh:'工夫茶', en:'Gongfu tea', desc:'潮州單叢茶，古城茶館坐低飲一圈最地道。', cost:'茶位約 ¥30–80（估算）' }
  ],
  foodPlaces: [
    /* dp = 大眾點評「必吃榜 2026」頁面資料（2026-11-24 查詢）：評分、人均、推薦菜、上榜年數。營業時間未逐間核實。 */
    { day:'Day 1 夜', name:'拜蟹咖chill·潮汕家庭生腌·潮汕砂锅粥', area:'汕頭 龍眼南路（酒店步行範圍）', dish:'招牌冰鎮膏蟹、生醃、砂鍋粥（227 人推薦）', dp:'4.6 · 2026 新上榜', cost:'¥91／人', v:'ok', city:207 },
    { day:'Day 1 夜', name:'豪弟官塘·鱼生虾生·潮汕砂锅粥（长平店）', area:'汕頭 龍眼南路', dish:'干貝蝦砂鍋粥、魚生蝦生（122 人推薦）', dp:'4.4 · 連續 2 年上榜', cost:'¥89／人', v:'ok', city:207 },
    { day:'Day 1 夜', name:'雄记牛肉（梅园店）', area:'汕頭 龍眼南路', dish:'濕炒牛肉粿條（87 人推薦）', dp:'4.4 · 2026 新上榜', cost:'¥25／人', v:'ok', city:207 },
    { day:'Day 1 夜', name:'创弟牛肉丸', area:'汕頭 龍眼南路', dish:'牛肉丸（34 人推薦）', dp:'4.4 · 連續 2 年上榜', cost:'¥79／人', v:'ok', city:207 },
    { day:'Day 1 夜', name:'海记猪血汤（龙眼园店）', area:'汕頭 龍眼南路', dish:'豬雜豬血湯（76 人推薦）', dp:'4.3 · 連續 6 年上榜', cost:'¥25／人', v:'ok', city:207 },
    { day:'Day 1 夜／Day 2 早', name:'小吴肠粉', area:'汕頭 龍眼南路', dish:'豬肉海鮮蛋腸粉（2,244 人推薦）', dp:'4.2 · 連續 9 年上榜', cost:'¥15／人', v:'ok', city:207, note:'夜宵定早餐都啱，出發前喺點評睇營業時間。' },
    { day:'Day 2 早', name:'侗平肠粉（同平路店）', area:'汕頭 小公園商圈', dish:'全家福腸粉（137 人推薦）', dp:'4.3 · 連續 2 年上榜', cost:'¥15／人', v:'ok', city:207 },
    { day:'Day 2 早（如已開門）', name:'松英汫洲蚝仔粥（小公园店）', area:'汕頭 小公園商圈', dish:'招牌蠔仔烙、蠔仔粥（54 人推薦）', dp:'4.4 · 2026 新上榜', cost:'¥65／人', v:'ok', city:207 },
    { day:'Day 2 早', place:'laomagong', name:'老媽宮粽球', area:'汕頭 小公園', dish:'鹹甜粽球（老字號，唔喺必吃榜）', dp:'—', cost:'約 ¥12／隻（遊記）', v:'est' },
    { day:'Day 2 午', place:'yunao', name:'雲澳漁港海鮮檔', area:'南澳 雲澳鎮', dish:'南澳海鮮（按斤計）', dp:'南澳冇店上必吃榜', cost:'人均約 ¥100–150（估算）', v:'est', note:'落單前問清價錢、斤兩同做法。' },
    { day:'Day 2 晚', name:'後宅鎮海鮮小炒', area:'南澳 後宅鎮（酒店附近）', dish:'清蒸／薑蔥海鮮、紫菜、海膽炒飯', dp:'南澳冇店上必吃榜', cost:'人均約 ¥90–150（估算）', v:'est', note:'可請酒店前台推介；喺點評搜「南澳 後宅 海鮮」睇最新評價。', search:'后宅 海鲜' },
    { day:'Day 3 午', name:'有味道鱼生•砂锅粥•潮州菜•生腌（牌坊街店）', area:'潮州 牌坊街城區', dish:'魚生（103 人推薦）、砂鍋粥、生醃', dp:'4.8 · 連續 2 年上榜', cost:'¥97／人', v:'ok', city:221, note:'就喺行程牌坊街，可以訂位（點評顯示「訂」）。' },
    { day:'Day 3 午（小食）', place:'paifang', name:'牌坊街小食（如胡榮泉等老字號）', area:'潮州 太平路', dish:'鴨母捻、春餅、牛肉粿條（唔喺必吃榜）', dp:'—', cost:'人均約 ¥50–80（估算）', v:'est', search:'胡荣泉 潮州' },
    { day:'Day 3 下晝（可選）', name:'西门鳝鱼粿条（新泰里店）', area:'潮州 新橋路／三利街（古城西面）', dish:'鱔魚炒粿條（65 人推薦）', dp:'4.1 · 連續 2 年上榜', cost:'¥36／人', v:'ok', city:221, note:'距西湖嘅實際距離未核實，出發前用高德睇。' },
    { day:'Day 3 晚', name:'鸿兴家·非遗潮汕菜（临江北路店）', area:'揭陽 臨江北路（同酒店同一條路）', dish:'招牌鮑魚煲仔飯、非遺砂鍋粥（122 人推薦）', dp:'4.4 · 2026 新上榜', cost:'¥113／人', v:'ok', city:222 },
    { day:'Day 3 晚（後備）', name:'东兴生鱼粥', area:'揭陽 望江北路', dish:'螃蟹粥、生魚粥（48 人推薦）', dp:'4.7 · 連續 2 年上榜', cost:'¥73／人', v:'ok', city:222 },
    { day:'Day 4 午', name:'新合兴牛肉火锅（榕城古城店）', area:'揭陽 榕城古城', dish:'吊龍牛肉火鍋（87 人推薦）', dp:'4.5 · 2026 新上榜', cost:'¥84／人', v:'ok', city:222, note:'就喺揭陽古城，啱行完學宮、進賢門食。' },
    { day:'Day 4 午（後備）', name:'卢记牛肉店（新翠苑店）', area:'揭陽 榕城區', dish:'吊龍牛肉拼匙仁（77 人推薦）', dp:'4.6 · 連續 2 年上榜', cost:'¥111／人', v:'ok', city:222 }
  ],

  /* -------------------------------------------------------------------
     預算預設值（可喺網頁直接修改，會存喺本機）
     per: 'person' 按人數乘；'room' 按房間數（每 2 人 1 間）乘；'group' 全團一次
     ------------------------------------------------------------------- */
  budget: [
    { key:'rail-out', cat:'rail', label:'高鐵去程 G6578 二等座', amt:223, per:'person', v:'ok' },
    { key:'rail-ret', cat:'rail', label:'高鐵回程 G925 二等座', amt:276, per:'person', v:'ok' },
    { key:'hotel-st', cat:'hotel', label:'汕頭 全季 1 晚（估算）', amt:350, per:'room', v:'est' },
    { key:'hotel-na', cat:'hotel', label:'南澳 雅斯特 1 晚（估算）', amt:450, per:'room', v:'est' },
    { key:'hotel-jy', cat:'hotel', label:'揭陽 亞朵 1 晚（估算）', amt:400, per:'room', v:'est' },
    { key:'suv-rent', cat:'local', label:'SUV 租金 3 日（每日估算 ¥350）', amt:1050, per:'group', v:'est' },
    { key:'suv-ins', cat:'local', label:'保險 + 不計免賠 3 日', amt:210, per:'group', v:'est' },
    { key:'suv-oneway', cat:'local', label:'異地還車費（潮汕站）', amt:200, per:'group', v:'est' },
    { key:'fuel', cat:'local', label:'油費（約 280 km）', amt:200, per:'group', v:'est' },
    { key:'toll', cat:'local', label:'南澳大橋過橋費 ×2（2015 年資料）', amt:96, per:'group', v:'est' },
    { key:'highway', cat:'local', label:'高速公路費', amt:50, per:'group', v:'est' },
    { key:'parking', cat:'local', label:'停車費', amt:100, per:'group', v:'est' },
    { key:'taxi', cat:'local', label:'滴滴／的士（Day 1：汕頭站 → 酒店）', amt:60, per:'group', v:'est' },
    { key:'food', cat:'food', label:'餐飲（每人每日約 ¥300 × 4 日）', amt:1200, per:'person', v:'est' },
    { key:'tickets', cat:'ticket', label:'景點門票（廣濟橋 ¥20、總兵府、宋井等）', amt:50, per:'person', v:'est' },
    { key:'misc', cat:'misc', label:'手信、茶葉、雜費', amt:300, per:'person', v:'est' }
  ],
  budgetCats: { rail:'🚄 高鐵', hotel:'🏨 住宿', local:'🚗 本地交通', food:'🍽 餐飲', ticket:'🎫 門票', misc:'🛍 雜項' },

  weather: [
    { day:'Day 1', date:'2026-12-24', loc:'汕頭', lat:23.36, lon:116.71 },
    { day:'Day 2', date:'2026-12-25', loc:'南澳島', lat:23.43, lon:117.03 },
    { day:'Day 3', date:'2026-12-26', loc:'潮州', lat:23.66, lon:116.64 },
    { day:'Day 4', date:'2026-12-27', loc:'揭陽', lat:23.55, lon:116.37 }
  ],

  tips: [
    '<b>證件：</b>回鄉證（港澳居民來往內地通行證）有效期要覆蓋行程；12306 用回鄉證實名購票，兩位旅客都要喺 12306 App 加為乘車人。',
    '<b>買票提醒：</b>預售期 15 天（含乘車日）。去程（12/24）<b>12/10</b> 開售、回程（12/27）<b>12/13</b> 開售。可預先喺 12306 App 填好車次同乘客，開售即提交。',
    '<b>開售時間：</b>每個車站唔同。實測潮汕站係 14:00 起售；西九龍出發嘅車票喺當日上午已經可以買。以 12306 App 顯示為準。',
    '<b>天氣：</b>12 月下旬潮汕一般約 12–20°C（氣候估算），海邊風大，帶防風外套。即時預報約出發前 16 日先有。',
    '<b>日照：</b>12 月日落約 17:45，南澳戶外景點盡量 17:30 前完成。',
    '<b>預約：</b>韓文公祠要提前預約（旅遊平台資料）；揭陽學宮中午有午休、週一閉館。',
    '<b>支付：</b>AlipayHK／WeChat Pay 為主，帶少量人民幣現金。',
    '<b>網絡：</b>內地上 Google／WhatsApp 要用香港 SIM 漫遊或 eSIM；地圖建議用高德（本頁導航掣已用 WGS-84 座標轉換）。',
    '<b>手信入境：</b>肉類製品（包括牛肉丸）帶返香港有限制，出發前查清海關／漁護署規定。'
  ],

  sources: [
    ['大眾點評 必吃榜 2026（汕頭／潮州／揭陽，2026-11-24 查詢）','https://m.dianping.com/an/ranklist/musteat2023/page/index?notitlebar=1&ranktype=3&cityid=207'],
    ['12306 時刻／票價（queryG、queryTicketPrice，2026-11-24 查詢）','https://kyfw.12306.cn/otn/leftTicket/init'],
    ['港鐵高鐵：於12306購票（預售期 15 天）','https://www.highspeed.mtr.com.hk/tc/latest-news/ticketing-via-12306-purchase-ticket.html'],
    ['12306《廣深港高速鐵路跨境旅客運輸組織規則》','https://mobile.12306.cn/otsmobile/h5/otsbussiness/info/crossBorderPassenger.html'],
    ['攜程：全季酒店(汕頭龍眼南路萬象城店)','https://m.ctrip.com/html5/hotel/hoteldetail/131825137.html'],
    ['攜程：雅斯特國際酒店(汕頭南澳島店)','https://m.ctrip.com/html5/hotel/hoteldetail/135797548.html'],
    ['攜程：揭陽榕城揭陽樓亞朵酒店','https://m.ctrip.com/html5/hotel/hoteldetail/118949121.html'],
    ['攜程：龍泉岩（汕頭）','https://gs.ctrip.com/html5/you/sight/215/1646811.html'],
    ['攜程／去哪兒：廣濟橋、韓文公祠、開元寺','https://gs.ctrip.com/html5/you/sight/467.html'],
    ['攜程：南澳總兵府','https://gs.ctrip.com/html5/you/sight/215/1714961.html'],
    ['南航旅遊攻略：長山尾燈塔','https://www.csair.com/h5/cn/tourism_strategy/guonei_lvyougonglve/Shantou/1bf6mplqbovm8.shtml'],
    ['汕頭市政府：南澳大橋收費（2015）','https://english.shantou.gov.cn/english/news/content/post_799776.html'],
    ['去哪兒：揭陽學宮','https://touch.travel.qunar.com/poi/705605'],
    ['星島：汕頭美食推介','https://www.stheadline.com/zh-hans/travel/3367555/'],
    ['座標：OpenStreetMap Nominatim／Overpass','https://www.openstreetmap.org/'],
    ['車程：OSRM 路線計算','https://project-osrm.org/'],
    ['天氣：Open-Meteo','https://open-meteo.com/'],
    ['相片：Wikimedia Commons（各相附原頁連結）','https://commons.wikimedia.org/']
  ]
};
