/* =====================================================================
   潮汕四日高鐵之旅 — 主程式
   沿用 Hokkaido 版架構：Leaflet + OSM 底圖 + OSRM 路線 + Open-Meteo 天氣
   + 主分頁／日分頁 + localStorage 剔選／備註。
   分別：內容全部由 data/trip-data.js 生成（方便日後改資料），並加入
   出發方案切換、逐日路線地圖、相片、酒店／高鐵／美食／可編輯預算。
   ===================================================================== */
(function(){
  'use strict';
  const T = window.TRIP, PH = window.PHOTOS || {};
  const P = T.places;
  const PFX = T.meta.storagePrefix;

  /* ---------------- helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const store = {
    get(k, d){ try { const v = localStorage.getItem(PFX + k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
    set(k, v){ try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch(e){} }
  };
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const hm = m => (m >= 60 ? Math.floor(m / 60) + ' 小時' + (m % 60 ? ' ' + (m % 60) + ' 分' : '') : m + ' 分鐘');
  const stripNums = s => String(s).replace(/[①-⑳]\s?/g, '');
  const VB = { ok:'<span class="vb ok">已核實</span>', est:'<span class="vb est">估算</span>', na:'<span class="vb na">未公佈</span>' };

  if (store.get('dataVersion', 0) !== (T.meta.dataVersion || 1)) {
    try { ['travellers', 'budget'].forEach(k => localStorage.removeItem(PFX + k)); } catch (e) {}
    store.set('dataVersion', T.meta.dataVersion || 1);
  }
  const state = {
    plan: store.get('plan', 'A'),
    trav: store.get('travellers', T.meta.defaultTravellers),
    fx: store.get('fx', T.meta.fxHKDperCNY)
  };
  if (!T.planDays[state.plan]) state.plan = Object.keys(T.planDays)[0];
  const multiPlan = Object.keys(T.planDays).length > 1;
  const listeners = [];
  const onChange = fn => listeners.push(fn);
  const fire = () => listeners.forEach(fn => { try { fn(); } catch(e){ console.error(e); } });

  const dayIds = () => T.planDays[state.plan];
  const dayOf = id => T.days[id];

  /* ---------------- links ---------------- */
  const amapMarker = p => 'https://uri.amap.com/marker?position=' + p.lng + ',' + p.lat + '&name=' + encodeURIComponent(p.zh) + '&coordinate=wgs84&callnative=1';
  const amapNav = (a, b) => 'https://uri.amap.com/navigation?from=' + a.lng + ',' + a.lat + ',' + encodeURIComponent(a.zh) + '&to=' + b.lng + ',' + b.lat + ',' + encodeURIComponent(b.zh) + '&mode=car&policy=1&coordinate=wgs84&callnative=1';
  const appleMap = p => 'https://maps.apple.com/?ll=' + p.lat + ',' + p.lng + '&q=' + encodeURIComponent(p.zh);
  const appleNav = (a, b) => 'https://maps.apple.com/?saddr=' + a.lat + ',' + a.lng + '&daddr=' + b.lat + ',' + b.lng + '&dirflg=d';
  const googleSearch = p => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.zh + ' ' + (p.area || ''));
  const amapSearch = (kw, city) => 'https://uri.amap.com/search?keyword=' + encodeURIComponent(kw) + (city ? '&city=' + encodeURIComponent(city) : '') + '&callnative=1';

  const photoOf = p => (p && p.photo && PH[p.photo] && PH[p.photo][0]) || null;
  const imgTag = (ph, cls, alt) => ph ? '<img class="' + cls + '" loading="lazy" src="' + esc(ph.src) + '" data-full="' + esc(ph.src) + '" data-page="' + esc(ph.page) + '" data-lic="' + esc(ph.license) + '" alt="' + esc(alt || '') + '" referrerpolicy="no-referrer" onerror="this.remove()">' : '';

  /* ---------------- numbering (itinerary ↔ map) ---------------- */
  function numbering(dayId){
    const d = dayOf(dayId), map = {};
    let n = 0;
    (d.items || []).forEach(it => {
      if (!it.place) return;
      const p = P[it.place];
      if (!p || p.type === 'hotel' || p.type === 'station') return;
      if (it.type !== 'sight' && it.type !== 'meal') return;
      if (map[it.place] == null) map[it.place] = ++n;
      if (it.also && map[it.also] == null) map[it.also] = map[it.place];
    });
    return map;
  }

  /* =====================================================================
     HERO
     ===================================================================== */
  function renderHero(){
    $('#heroEyebrow').textContent = 'Chaoshan Rail Trip · ' + state.trav + ' Travellers';
    $('#heroLead').innerHTML = T.meta.dates + '，4日3夜。12/24 晚 18:07 由香港西九龍搭高鐵到汕頭，自駕 SUV 環遊南澳島，行潮州古城、揭陽學宮，最後由潮汕站搭高鐵返港。';
    const shots = [['nanao','南澳島'],['guangji','潮州 廣濟橋'],['smallpark','汕頭 小公園'],['xuegong','揭陽 學宮']];
    $('#heroPhotos').innerHTML = shots.map(s => {
      const ph = PH[s[0]] && PH[s[0]][0];
      return ph ? '<figure>' + imgTag(ph, '', s[1]).replace('onerror="this.remove()"', 'onerror="this.parentNode.remove()"') + '<figcaption>' + s[1] + '</figcaption></figure>' : '';
    }).join('');
    const b = budgetCalc();
    $('#heroStats').innerHTML =
      '<div class="hstat"><div class="num">4天3夜</div><div class="lbl">12/24 晚出發</div></div>' +
      '<div class="hstat"><div class="num">G6578 / G925</div><div class="lbl">去程 / 回程高鐵（建議）</div></div>' +
      '<div class="hstat"><div class="num"><span class="trav-ctl"><button data-trav="-1" aria-label="減少">−</button><span id="travNum">' + state.trav + '</span>人<button data-trav="1" aria-label="增加">＋</button></span></div><div class="lbl">旅客人數（可改）</div></div>' +
      '<div class="hstat"><div class="num">¥' + fmt(b.total) + '</div><div class="lbl">預算總額（≈HK$' + fmt(b.total * state.fx) + '，大部分為估算）</div></div>';
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-trav]');
    if (!b) return;
    state.trav = Math.max(1, Math.min(12, state.trav + Number(b.dataset.trav)));
    store.set('travellers', state.trav);
    fire();
  });

  /* =====================================================================
     PLAN SWITCH（多個位置共用）
     ===================================================================== */
  function renderPlanSwitches(){
    $$('[data-role="plan-switch"]').forEach(box => {
      const bar = box.closest('.plan-bar'); if (bar) bar.style.display = multiPlan ? '' : 'none';
      if (!multiPlan) return;
      box.innerHTML = ['A','B'].map(k => '<button data-plan="' + k + '" class="' + (state.plan === k ? 'active' : '') + '">' + (k === 'A' ? '方案 A · 12/23 夜車（建議）' : '方案 B · 12/24 夜車') + '</button>').join('');
    });
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-plan]');
    if (!b) return;
    state.plan = b.dataset.plan; store.set('plan', state.plan); fire();
  });

  /* =====================================================================
     A. 總覽
     ===================================================================== */
  function renderOverview(){
    const D = T.departure, C = D.cuts;
    $('#planCompare').innerHTML =
      '<div class="cmp-card rec"><h4>🚄 去程：12/24（四）提早 1 小時<span class="rec-tag">已更新</span></h4><div style="font-size:13px;margin-bottom:10px">' + D.why + '</div>' +
      '<div class="table-scroll"><table class="data" style="min-width:0"><tr><th>車次</th><th>時間</th><th>二等</th><th></th></tr>' +
      D.options.map(o => '<tr class="' + (o.verdict.indexOf('採用') >= 0 ? 'rec' : '') + '"><td class="tno">' + o.no + '</td><td>' + esc(o.time) + '<div class="small">' + esc(o.note) + '</div></td><td>' + o.price + '</td><td class="small">' + o.verdict + '</td></tr>').join('') +
      '</table></div><div style="margin-top:8px;font-size:11.5px;color:var(--ink-soft)">票價：12306（2026-11-24 查證）· 12/24 車票 <b>12/10</b> 開售</div></div>' +
      '<div class="cmp-card"><h4>✂ ' + C.title + '</h4><div style="font-size:13px">' + C.body + '</div><ul>' +
      C.removed.map(r => '<li><b>' + esc(P[r.place].zh) + '</b> — ' + esc(r.why) + '</li>').join('') + '<li>' + esc(C.merged) + '</li></ul>' +
      '<div style="font-size:13px"><b>結果：</b>' + esc(C.result) + '</div><div style="margin-top:8px;font-size:12px;color:var(--ink-soft)">💡 ' + esc(C.optional) + '</div>' +
      '<div style="margin-top:12px"><button class="mbtn" data-goto-day="B2">睇 Day 2 新行程 →</button></div></div>';
    $('#ovDays').innerHTML = dayIds().map(id => {
      const d = dayOf(id);
      const firstPh = (d.route || []).map(pid => photoOf(P[pid])).filter(Boolean)[0];
      const drives = (d.items || []).filter(i => i.type === 'drive');
      const km = drives.reduce((s, i) => s + (i.km || 0), 0);
      const nn = Object.values(numbering(id)); const stops = nn.length ? Math.max.apply(null, nn) : 0;
      return '<div class="ov-day" style="--c:' + d.color + '" data-goto-day="' + id + '">' +
        (firstPh ? '<div class="ph" data-bg="' + esc(firstPh.src) + '"></div>' : '') +
        '<div class="bd"><div class="dn">DAY ' + d.n + ' · ' + d.label + '</div><h4>' + esc(d.title.replace(/^Day \d · /, '')) + '</h4>' +
        '<div class="st">📍 ' + stops + ' 站　🚗 約 ' + Math.round(km) + ' km</div></div></div>';
    }).join('');
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-goto-day]');
    if (!c) return;
    activateView('itin', true);
    selectDay(dayIds().indexOf(c.dataset.gotoDay));
  });

  /* ---------------- 天氣（沿用 Hokkaido Open-Meteo 寫法） ---------------- */
  const WX = {0:['☀️','晴'],1:['🌤','大致晴'],2:['⛅','局部多雲'],3:['☁️','陰'],45:['🌫','霧'],48:['🌫','霧凇'],51:['🌦','毛毛雨'],53:['🌦','毛毛雨'],55:['🌦','毛毛雨'],61:['🌧','小雨'],63:['🌧','雨'],65:['🌧','大雨'],80:['🌦','陣雨'],81:['🌦','陣雨'],82:['⛈','強陣雨'],95:['⛈','雷雨'],96:['⛈','雷雨冰雹'],99:['⛈','雷雨冰雹']};
  function renderWeather(){
    const cards = T.weather.filter(w => !w.planOnly || w.planOnly === state.plan);
    $('#wxGrid').innerHTML = cards.map(w => '<div class="wx-card" data-lat="' + w.lat + '" data-lon="' + w.lon + '" data-date="' + w.date + '"><div class="wx-day">' + w.day + ' · ' + w.date.slice(5).replace('-', '/') + '</div><div class="wx-loc">' + w.loc + '</div><div class="wx-body">載入中…</div></div>').join('');
    $('#wxNote').innerHTML = '資料來源：Open-Meteo，每次開啟即時更新。Open-Meteo 只提供約 16 日內預報；未到時間會顯示「預報未開放」同預計開放日期。12 月下旬潮汕一般約 12–20°C <span class="vb est">氣候估算</span>。溫度為 當日最低 / <b>最高</b>，☔ 為降雨機率，💨 為最大風速。';
    const today = new Date(); today.setHours(0,0,0,0);
    $$('.wx-card', $('#wxGrid')).forEach(card => {
      const date = card.dataset.date, body = $('.wx-body', card);
      const dt = new Date(date + 'T00:00:00');
      const daysAway = Math.round((dt - today) / 86400000);
      if (daysAway > 15) {
        const open = new Date(dt.getTime() - 15 * 86400000);
        body.innerHTML = '<div class="wx-icon">🗓</div><div class="wx-desc">預報未開放</div><div class="wx-meta">約 ' + (open.getMonth() + 1) + '/' + open.getDate() + ' 起有預報</div><div class="wx-meta">平均約 12–20°C <span class="vb est">估算</span></div>';
        return;
      }
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + card.dataset.lat + '&longitude=' + card.dataset.lon +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FShanghai&start_date=' + date + '&end_date=' + date;
      fetch(url).then(r => r.json()).then(d => {
        if (!d.daily || !d.daily.time || !d.daily.time.length) throw new Error('no data');
        const wc = WX[d.daily.weather_code[0]] || ['🌡',''];
        body.innerHTML = '<div class="wx-icon">' + wc[0] + '</div><div class="wx-desc">' + wc[1] + '</div>' +
          '<div class="wx-temp">' + Math.round(d.daily.temperature_2m_min[0]) + '° / <b>' + Math.round(d.daily.temperature_2m_max[0]) + '°</b></div>' +
          '<div class="wx-meta">☔ ' + (d.daily.precipitation_probability_max[0] ?? '—') + '%　💨 ' + Math.round(d.daily.wind_speed_10m_max[0]) + ' km/h</div>';
      }).catch(() => {
        body.innerHTML = '<div class="wx-desc">需連網載入</div><a class="info-btn" target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent(card.querySelector('.wx-loc').textContent + ' 天氣 ' + date) + '">🔎 查天氣</a>';
      });
    });
  }

  /* =====================================================================
     B. 逐日行程（table.itin 同 Hokkaido 一樣嘅欄位）
     ===================================================================== */
  let currentDayIdx = store.get('dayIdx', 0);
  function costCell(it){
    if (!it.cost) return '—';
    const c = it.cost;
    if (!c.amt) return '免費';
    const per = c.per === 'person' ? '/人' : c.per === 'room' ? '/房/晚' : '/車';
    return '¥' + fmt(c.amt) + per + (c.est ? '<span class="vb est">估算</span>' : '<span class="vb ok">已核實</span>') + '<br><span class="mini">≈HK$' + fmt(c.amt * state.fx) + '</span>';
  }
  function driveRow(it, key){
    const a = P[it.from], b = P[it.to];
    return '<tr class="drive"><td class="time">' + esc(it.time) + '<span class="dur">（車程約 ' + it.est + ' 分鐘）</span></td>' +
      '<td class="activity">🚗 ' + esc(a.zh) + ' → ' + esc(b.zh) + '<div class="sub-note">約 ' + it.km + ' km' + (it.note ? '。' + esc(it.note) : '') + '</div></td>' +
      '<td><div class="drive-meta"><a class="amap-btn" target="_blank" rel="noopener" href="' + amapNav(a, b) + '">高德導航</a><a class="apple-btn" target="_blank" rel="noopener" href="' + appleNav(a, b) + '">Apple</a></div>' +
      '<div class="drive-meta" style="margin-top:4px"><span class="t">' + it.km + ' km · 約 ' + it.est + ' 分</span></div><div class="osrm">OSRM ' + it.osrm + ' 分（自由車流）</div></td>' +
      '<td class="col-budget">—</td><td class="col-paid"><input type="checkbox" class="paid-check" data-key="' + key + '"></td></tr>';
  }
  function itemRow(it, key, nums, color){
    if (it.type === 'drive') return driveRow(it, key);
    const p = it.place ? P[it.place] : null;
    const num = p && nums[it.place];
    const cls = it.type === 'rail' ? 'rail' : it.type === 'walk' ? 'walk' : it.type === 'free' ? 'free' : it.type === 'car' ? 'car' : '';
    let act = '';
    const title = it.title ? stripNums(it.title) : (p ? p.zh : '');
    const pin = num ? '<span class="num-pin" style="background:' + color + '">' + num + '</span>' : '';
    const hotelIcon = it.type === 'hotel' ? '🏨 ' : it.type === 'rail' ? '🚄 ' : '';
    let links = '';
    if (p) {
      links += '<a class="gmap-btn maponly-btn" data-showplace="' + it.place + '">📍 地圖</a>';
      links += '<a class="amap-btn" target="_blank" rel="noopener" href="' + amapMarker(p) + '">高德</a>';
      links += '<a class="apple-btn" target="_blank" rel="noopener" href="' + appleMap(p) + '">Apple</a>';
      if (p.type === 'hotel') links += '<a class="doc-btn" href="#hotel-' + it.place + '">ℹ️ 酒店比較</a>';
      (p.src || []).forEach(s => { links += '<a class="info-btn" target="_blank" rel="noopener" href="' + esc(s[1]) + '">🔎 ' + esc(s[0]) + '</a>'; });
    }
    if (it.link) links += '<a class="ticket-btn" href="' + it.link + '">🎫 班次／買票</a>';
    (it.links || []).forEach(l => { links += '<a class="info-btn" target="_blank" rel="noopener" href="' + esc(l[1]) + '">🔎 ' + esc(l[0]) + '</a>'; });
    let sub = '';
    if (p && (it.type === 'sight' || it.type === 'meal')) {
      sub += '<div class="sub-note">' + p.desc + '</div>';
      if (p.tips) sub += '<div class="sub-note">💡 ' + p.tips + '</div>';
      const meta = [];
      if (p.hours) meta.push('🕘 ' + p.hours);
      if (p.ticket) meta.push('🎫 ' + p.ticket);
      if (meta.length) sub += '<div class="sub-note">' + meta.join('　') + ' ' + (VB[p.v] || '') + '</div>';
    }
    if (it.note) sub += '<div class="sub-note">' + it.note + '</div>';
    if (it.picks) sub += '<ul class="picks">' + it.picks.map(k => '<li><b>' + esc(k.n) + '</b> ' + (k.ok ? '<span class="vb ok">點評必吃榜</span>' : '<span class="vb est">未核實</span>') + '<div class="small">' + esc(k.d) + '</div><div class="links">' +
      '<a class="amap-btn" target="_blank" rel="noopener" href="' + amapSearch(k.kw, k.c) + '">高德搜尋</a>' +
      (k.dp ? '<a class="link-btn" target="_blank" rel="noopener" href="https://www.dianping.com/search/keyword/' + k.dp + '/0_' + encodeURIComponent(k.kw) + '">點評 ↗</a>' : '') + '</div></li>').join('') + '</ul>';
    const ph = p ? photoOf(p) : null;
    act = '<div class="act-wrap">' + (ph ? imgTag(ph, 'act-thumb', p.zh) : '') + '<div>' + pin + hotelIcon + esc(title) +
      (p && p.approx ? '<span class="vb est">位置約略</span>' : '') +
      (links ? '<div class="links">' + links + '</div>' : '') + sub + '</div></div>';
    const transport = it.type === 'rail' ? '🚄 高鐵' : it.type === 'car' ? '<a class="info-btn" href="#carSchedule">🚙 租車安排</a>' : it.type === 'walk' ? '🚶 步行' : (p && p.area ? esc(p.area) : '—');
    return '<tr class="' + cls + '"><td class="time">' + esc(it.time) + (it.dur ? '<span class="dur">（' + esc(it.dur) + '）</span>' : '') + '</td>' +
      '<td class="activity">' + act + '</td><td class="note">' + transport + '</td>' +
      '<td class="col-budget">' + costCell(it) + '</td><td class="col-paid"><input type="checkbox" class="paid-check" data-key="' + key + '"></td></tr>';
  }
  function renderItin(){
    const ids = dayIds();
    if (currentDayIdx >= ids.length) currentDayIdx = 0;
    $('#dayTabs').innerHTML = ids.map((id, i) => {
      const d = dayOf(id);
      return '<div class="day-tab ' + (i === currentDayIdx ? 'active' : '') + '" style="--c:' + d.color + '" data-day="' + i + '"><span class="d">Day ' + d.n + '</span>' + d.label + ' ' + esc(d.area) + '</div>';
    }).join('');
    $('#dayPanels').innerHTML = ids.map((id, i) => {
      const d = dayOf(id), nums = numbering(id);
      let rows = '';
      if (d.pre) {
        rows += '<tr class="pre-head"><td colspan="5">前一晚 · 12/23（三）</td></tr>';
        d.pre.forEach((it, j) => { rows += itemRow(it, id + '-pre' + j, nums, d.color); });
        rows += '<tr class="pre-head"><td colspan="5">' + d.label + '</td></tr>';
      }
      d.items.forEach((it, j) => { rows += itemRow(it, id + '-' + j, nums, d.color); });
      const drives = d.items.concat(d.pre || []).filter(x => x.type === 'drive');
      const km = drives.reduce((s, x) => s + x.km, 0), mins = drives.reduce((s, x) => s + x.est, 0);
      return '<div class="day-panel ' + (i === currentDayIdx ? 'active' : '') + '" id="day-' + id + '">' +
        '<div class="day-title"><h3>' + esc(d.title) + '</h3><span class="date">' + d.label + '</span></div>' +
        '<div class="day-summary">' + d.summary + '<br><b>當日車程合計：</b>約 ' + Math.round(km) + ' km、約 ' + hm(mins) + '（實際預估）　<a class="gmap-btn maponly-btn" data-showday="' + id + '">🗺 睇當日路線圖</a></div>' +
        (d.note ? '<div class="detour-note">' + d.note + '</div>' : '') +
        '<div class="scroll-hint">↔ 表格可左右滑動查看更多欄位</div><div class="table-scroll"><table class="itin">' +
        '<tr><th>時間</th><th>行程</th><th>交通 / 車程</th><th>預算</th><th>已付</th></tr>' + rows +
        '<tr class="remark-row"><td colspan="5"><div class="remark-label">✎ 自訂備註</div><div class="remark-cell" contenteditable="true" data-rkey="' + id + '" data-placeholder="喺呢度填低你自己嘅提醒、變更或想加嘅嘢…"></div></td></tr>' +
        '</table></div></div>';
    }).join('');
    initPersisted($('#dayPanels'));
  }
  function selectDay(i){
    if (i < 0) i = 0;
    currentDayIdx = i; store.set('dayIdx', i);
    $$('.day-tab').forEach(t => t.classList.toggle('active', Number(t.dataset.day) === i));
    $$('.day-panel').forEach((p, j) => p.classList.toggle('active', j === i));
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('.day-tab');
    if (t) selectDay(Number(t.dataset.day));
  });

  /* 剔選 + 備註（同 Hokkaido 一樣，但加前綴避免撞 key） */
  function initPersisted(root){
    $$('.paid-check, .persist-check', root).forEach(box => {
      const key = 'checked:' + box.dataset.key;
      box.checked = store.get(key, false) === true;
      box.addEventListener('change', () => store.set(key, box.checked));
    });
    $$('.remark-cell', root).forEach(cell => {
      const key = 'remark:' + cell.dataset.rkey;
      const saved = store.get(key, '');
      if (saved) cell.textContent = saved;
      cell.addEventListener('input', () => store.set(key, cell.textContent));
    });
  }

  /* =====================================================================
     C. 互動地圖
     ===================================================================== */
  let map, mapReady = false, mapSel = store.get('mapSel', 'all');
  const layerOn = store.get('mapLayers', { hotel:true, station:true, food:true, labels:true });
  const routeCache = {};
  let groups = {};

  function pinIcon(p, num, color){
    let cls = 'mpin', inner = num || '';
    if (!num) {
      if (p.type === 'hotel') { cls += ' hotel'; inner = '🏨'; }
      else if (p.type === 'station') { cls += ' station'; inner = '🚄'; }
      else if (p.type === 'food') { cls += ' food'; inner = '🍜'; }
      else inner = '•';
    }
    return L.divIcon({ className:'leaflet-div-icon', html:'<div class="' + cls + '" style="' + (num || (!['hotel','station','food'].includes(p.type)) ? 'background:' + color : '') + '"><span>' + inner + '</span></div>', iconSize:[30,30], iconAnchor:[15,28], popupAnchor:[0,-26] });
  }
  function placeDays(pid){
    return dayIds().filter(id => (dayOf(id).route || []).includes(pid)).map(id => dayOf(id));
  }
  function popupHtml(pid){
    const p = P[pid], ph = photoOf(p);
    const days = placeDays(pid);
    let h = '<div class="pop">' + (ph ? imgTag(ph, '', p.zh) + '<div class="credit">相片：<a target="_blank" rel="noopener" href="' + esc(ph.page) + '">Wikimedia Commons</a> · ' + esc(ph.license) + '</div>' : '') +
      days.map(d => '<span class="daytag" style="background:' + d.color + '">Day ' + d.n + '</span>').join('') +
      '<h5>' + esc(p.zh) + '</h5><div class="en">' + esc(p.en) + (p.approx ? ' · <span class="vb est">位置約略</span>' : '') + '</div>' +
      '<div class="meta">📍 ' + esc(p.area || '') + '</div>' +
      '<div class="ds">' + p.desc + '</div>' + (p.tips ? '<div class="tp">💡 ' + p.tips + '</div>' : '');
    const meta = [];
    if (p.hours) meta.push('🕘 ' + p.hours);
    if (p.ticket) meta.push('🎫 ' + p.ticket);
    if (p.time) meta.push('⏱ 建議停留 ' + p.time);
    if (meta.length) h += '<div class="meta">' + meta.join('<br>') + ' ' + (VB[p.v] || '') + '</div>';
    h += '<div class="links"><a class="amap-btn" target="_blank" rel="noopener" href="' + amapMarker(p) + '">高德地圖</a><a class="apple-btn" target="_blank" rel="noopener" href="' + appleMap(p) + '">Apple 地圖</a><a class="gmap-btn" target="_blank" rel="noopener" href="' + googleSearch(p) + '">Google</a></div></div>';
    return h;
  }

  function fetchRoute(dayId){
    const d = dayOf(dayId);
    const pts = d.route.map(id => P[id]);
    const sig = pts.map(p => p.lng.toFixed(4) + ',' + p.lat.toFixed(4)).join(';');
    if (routeCache[sig]) return Promise.resolve(routeCache[sig]);
    const cached = store.get('osrm:' + sig, null);
    if (cached) { routeCache[sig] = cached; return Promise.resolve(cached); }
    return fetch('https://router.project-osrm.org/route/v1/driving/' + sig + '?overview=simplified&geometries=geojson')
      .then(r => r.json()).then(data => {
        if (!data.routes || !data.routes[0]) throw new Error('no route');
        const coords = data.routes[0].geometry.coordinates.map(c => [+c[1].toFixed(5), +c[0].toFixed(5)]);
        const res = { coords, km: data.routes[0].distance / 1000, min: data.routes[0].duration / 60 };
        routeCache[sig] = res; store.set('osrm:' + sig, res);
        return res;
      });
  }

  function buildMap(){
    if (mapReady || typeof L === 'undefined') return;
    map = L.map('routeMap', { scrollWheelZoom:false, tap:true }).setView([23.5, 116.8], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap contributors', maxZoom:18 }).addTo(map);
    mapReady = true;
    drawMap();
  }

  function drawMap(){
    if (!mapReady) return;
    Object.values(groups).forEach(g => map.removeLayer(g));
    groups = {};
    const ids = dayIds();
    const shown = new Set();
    const bounds = [];
    ids.forEach(id => {
      const d = dayOf(id), g = L.layerGroup();
      groups[id] = g;
      const nums = numbering(id);
      // markers for numbered stops
      Object.keys(nums).forEach(pid => {
        const p = P[pid];
        // 同一點多個號（例：北回歸線廣場 + 自然之門）只畫一次
        const key = id + pid;
        if (shown.has(key)) return; shown.add(key);
        L.marker([p.lat, p.lng], { icon: pinIcon(p, nums[pid], d.color), zIndexOffset: 500 }).bindPopup(popupHtml(pid), { maxWidth: 280, autoPanPaddingTopLeft: [10, 70] }).addTo(g);
      });
      // route polyline（OSRM，失敗改直線）
      const straight = d.route.map(pid => [P[pid].lat, P[pid].lng]);
      const placeholder = L.polyline(straight, { color: d.color, weight: 3, dashArray: '3 8', opacity: .8 }).addTo(g);
      fetchRoute(id).then(res => {
        g.removeLayer(placeholder);
        L.polyline(res.coords, { color: '#fff', weight: 7, opacity: .8 }).addTo(g);
        L.polyline(res.coords, { color: d.color, weight: 4.5, opacity: .95 }).addTo(g);
      }).catch(() => {});
      // leg labels（距離 · 預估時間）
      const lg = L.layerGroup(); groups['lbl_' + id] = lg;
      {
        d.items.concat(d.pre || []).filter(it => it.type === 'drive' && it.km >= 2).forEach(it => {
          const a = P[it.from], b = P[it.to];
          const mid = [(a.lat + b.lat) / 2, (a.lng + b.lng) / 2];
          L.tooltip({ permanent: true, direction: 'center', className: 'leg-label', interactive: false })
            .setLatLng(mid).setContent(it.km + 'km · ' + it.est + '分').addTo(lg);
        });
      }
      d.route.forEach(pid => bounds.push([P[pid].lat, P[pid].lng]));
    });
    // hotels / stations / food layers
    const typeLayer = t => {
      const g = L.layerGroup();
      Object.keys(P).forEach(pid => {
        const p = P[pid];
        if (p.type !== t) return;
        L.marker([p.lat, p.lng], { icon: pinIcon(p, null, '#555'), zIndexOffset: t === 'hotel' ? 800 : 300 }).bindPopup(popupHtml(pid), { maxWidth: 280, autoPanPaddingTopLeft: [10, 70] }).addTo(g);
      });
      if (t === 'hotel') {
        T.hotels.forEach(hc => hc.options.forEach(o => {
          if (P[o.id]) return;
          const pp = { zh:o.zh, en:o.en, lat:o.lat, lng:o.lng, type:'hotel', area:hc.city + '（候選酒店）', desc:'候選酒店 · ' + o.rating + '<br>估算 ¥' + o.price[0] + '–' + o.price[1] + '／晚', tips:o.pros.join('；'), approx:o.approx, v:'est' };
          P['_' + o.id] = pp;
          L.marker([o.lat, o.lng], { icon: L.divIcon({ className:'leaflet-div-icon', html:'<div class="mpin hotel" style="background:#b8946f;opacity:.9"><span>🏨</span></div>', iconSize:[30,30], iconAnchor:[15,28], popupAnchor:[0,-26] }) }).bindPopup(popupHtml('_' + o.id), { maxWidth:280 }).addTo(g);
        }));
      }
      return g;
    };
    groups.hotel = typeLayer('hotel');
    groups.station = typeLayer('station');
    groups.food = typeLayer('food');
    // 高鐵示意線
    const rg = L.layerGroup();
    const xjk = P.xjk;
    const outTo = P.stStation, retFrom = P.chaoshan;
    L.polyline([[xjk.lat, xjk.lng], [outTo.lat, outTo.lng]], { color:'#d68c45', weight:2.5, dashArray:'10 8', opacity:.9 }).bindTooltip('去程 ' + T.departure.chosen.no + ' 西九龍 ' + T.departure.chosen.dep + ' → 汕頭 ' + T.departure.chosen.arr + '（示意）', { sticky:true }).addTo(rg);
    L.polyline([[retFrom.lat, retFrom.lng], [xjk.lat, xjk.lng]], { color:'#7a5aa6', weight:2.5, dashArray:'10 8', opacity:.9 }).bindTooltip('回程 G925 潮汕 15:55 → 西九龍 18:17（示意）', { sticky:true }).addTo(rg);
    groups.rail = rg;
    applyMapSel(false, bounds);
  }

  function applyMapSel(fly, allBounds){
    if (!mapReady) return;
    const ids = dayIds();
    const sel = mapSel === 'all' || ids.includes(mapSel) ? mapSel : 'all';
    ids.forEach(id => { const g = groups[id]; if (!g) return; (sel === 'all' || sel === id) ? g.addTo(map) : map.removeLayer(g); });
    ids.forEach(id => { const g = groups['lbl_' + id]; if (!g) return; (layerOn.labels && sel === id) ? g.addTo(map) : map.removeLayer(g); });
    ['hotel','station','food'].forEach(t => { if (groups[t]) (layerOn[t] ? groups[t].addTo(map) : map.removeLayer(groups[t])); });
    if (groups.rail) (sel === 'all' ? groups.rail.addTo(map) : map.removeLayer(groups.rail));
    // bounds
    let pts = [];
    if (sel === 'all') pts = ids.reduce((a, id) => a.concat(dayOf(id).route.map(pid => [P[pid].lat, P[pid].lng])), []);
    else pts = dayOf(sel).route.map(pid => [P[pid].lat, P[pid].lng]);
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding:[30,30] });
    renderMapButtons(); renderLegPanel(sel);
  }

  function renderMapButtons(){
    const ids = dayIds();
    $('#mapDayBtns').innerHTML = '<button class="mbtn ' + (mapSel === 'all' || !ids.includes(mapSel) ? 'active' : '') + '" data-mapsel="all">🗺 四日總覽</button>' +
      ids.map(id => { const d = dayOf(id); return '<button class="mbtn ' + (mapSel === id ? 'active' : '') + '" data-mapsel="' + id + '" style="--c:' + d.color + '"><span class="sw"></span>Day ' + d.n + ' ' + d.area + '</button>'; }).join('');
    $('#mapLayerBtns').innerHTML = [['hotel','🏨 酒店'],['station','🚄 車站'],['food','🍜 美食'],['labels','🏷 車程標籤']]
      .map(x => '<button class="mbtn toggle ' + (layerOn[x[0]] ? '' : 'off') + '" data-maplayer="' + x[0] + '">' + x[1] + '</button>').join('');
  }
  function renderLegPanel(sel){
    const ids = dayIds();
    if (sel === 'all') {
      let html = '<h4>四日總覽</h4><div class="tot">揀上面嘅 Day 掣睇逐段路線、距離同導航。</div>';
      ids.forEach(id => {
        const d = dayOf(id);
        const drives = d.items.concat(d.pre || []).filter(x => x.type === 'drive');
        const km = drives.reduce((s, x) => s + x.km, 0), mins = drives.reduce((s, x) => s + x.est, 0);
        html += '<div class="leg-item"><span class="num-pin" style="background:' + d.color + '">' + d.n + '</span><div><div class="nm" data-mapsel="' + id + '">' + esc(d.title) + '</div><div class="lg">' + d.label + '　🚗 約 ' + Math.round(km) + ' km · 約 ' + hm(mins) + '</div></div></div>';
      });
      html += '<div class="leg-item"><span class="num-pin" style="background:#d68c45">🚄</span><div><div class="nm">去程 ' + T.departure.chosen.no + '</div><div class="lg">西九龍 ' + T.departure.chosen.dep + ' → 汕頭 ' + T.departure.chosen.arr + '（12/24）</div></div></div>' +
        '<div class="leg-item"><span class="num-pin" style="background:#7a5aa6">🚄</span><div><div class="nm">回程 G925</div><div class="lg">潮汕 15:55 → 西九龍 18:17（12/27）</div></div></div>';
      $('#legPanel').innerHTML = html; return;
    }
    const d = dayOf(sel), nums = numbering(sel);
    const items = (d.pre || []).concat(d.items);
    const drives = items.filter(x => x.type === 'drive');
    const km = drives.reduce((s, x) => s + x.km, 0), mins = drives.reduce((s, x) => s + x.est, 0);
    let html = '<h4 style="color:' + d.color + '">' + esc(d.title) + '</h4><div class="tot">' + d.label + '　合計約 ' + Math.round(km) + ' km · 約 ' + hm(mins) + '車程</div>';
    items.forEach(it => {
      if (it.type === 'drive') {
        const a = P[it.from], b = P[it.to];
        html += '<div class="leg-item"><span class="pin">🚗</span><div class="lg">' + it.km + ' km · 約 ' + it.est + ' 分（OSRM ' + it.osrm + ' 分）<br><a target="_blank" rel="noopener" href="' + amapNav(a, b) + '">高德導航 ↗</a>　<a target="_blank" rel="noopener" href="' + appleNav(a, b) + '">Apple ↗</a></div></div>';
      } else if (it.place && (it.type === 'sight' || it.type === 'meal' || it.type === 'hotel')) {
        const p = P[it.place], n = nums[it.place];
        const pin = n ? '<span class="num-pin" style="background:' + d.color + '">' + n + '</span>' : '<span class="pin">' + (p.type === 'hotel' ? '🏨' : p.type === 'station' ? '🚄' : '📍') + '</span>';
        html += '<div class="leg-item">' + pin + '<div><div class="nm" data-focus="' + it.place + '">' + esc(stripNums(it.title || p.zh)) + '</div><div class="lg">' + esc(it.time) + (p.time ? ' · 建議 ' + esc(p.time) : '') + '</div></div></div>';
      } else if (it.type === 'car') {
        html += '<div class="leg-item"><span class="pin">' + (it.title.startsWith('🅿') ? '🅿' : '🚙') + '</span><div><div class="nm">' + esc(it.title.replace(/^(🚙|🅿)\s*/u, '')) + '</div><div class="lg">' + esc(it.time) + '</div></div></div>';
      } else if (it.type === 'rail') {
        html += '<div class="leg-item"><span class="pin">🚄</span><div><div class="nm">' + esc(stripNums(it.title)) + '</div><div class="lg">' + esc(it.time) + '</div></div></div>';
      }
    });
    $('#legPanel').innerHTML = html;
  }
  function focusPlace(pid){
    activateView('map', false);
    setTimeout(() => {
      const p = P[pid];
      // 揀含有呢個點嘅日子
      const d = dayIds().find(id => dayOf(id).route.includes(pid));
      if (d && mapSel !== 'all' && mapSel !== d) { mapSel = d; store.set('mapSel', mapSel); applyMapSel(); }
      map.setView([p.lat, p.lng], 14, { animate:false });
      map.panBy([0, -140], { animate:false });
      let found = false;
      map.eachLayer(l => { if (!found && l instanceof L.Marker && l.getLatLng().lat === p.lat && l.getLatLng().lng === p.lng) { l.openPopup(); found = true; } });
      if (!found) L.popup({ maxWidth:280 }).setLatLng([p.lat, p.lng]).setContent(popupHtml(pid)).openOn(map);
      const top = $('#routeMap').getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 120);
  }
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-mapsel]');
    if (s) { mapSel = s.dataset.mapsel; store.set('mapSel', mapSel); applyMapSel(); return; }
    const l = e.target.closest('[data-maplayer]');
    if (l) { const k = l.dataset.maplayer; layerOn[k] = !layerOn[k]; store.set('mapLayers', layerOn); applyMapSel(); return; }
    const f = e.target.closest('[data-focus]');
    if (f) { focusPlace(f.dataset.focus); return; }
    const sp = e.target.closest('[data-showplace]');
    if (sp) { e.preventDefault(); focusPlace(sp.dataset.showplace); return; }
    const sd = e.target.closest('[data-showday]');
    if (sd) { e.preventDefault(); mapSel = sd.dataset.showday; store.set('mapSel', mapSel); activateView('map', true); applyMapSel(); setTimeout(() => window.scrollTo({ top: $('#routeMap').getBoundingClientRect().top + window.pageYOffset - 70, behavior:'smooth' }), 150); }
  });

  /* =====================================================================
     D. 酒店
     ===================================================================== */
  function renderHotels(){
    $('#hotelList').innerHTML = T.hotels.map(hc => {
      const nights = hc.nightsB;
      const rooms = Math.ceil(state.trav / 2);
      return '<div class="hotel-city"><h3>' + hc.city + '</h3><div class="nights">' + hc.nights + '　· ' + nights + ' 晚 × ' + rooms + ' 間房（' + state.trav + ' 人）</div>' +
        '<div class="rec-box"><b>建議：</b>' + hc.reason + '</div><div class="hotel-grid">' +
        hc.options.map(o => {
          const isRec = o.id === hc.rec;
          const mid = (o.price[0] + o.price[1]) / 2;
          return '<div class="hotel-card ' + (isRec ? 'rec' : '') + '" id="hotel-' + o.id + '">' +
            '<h4>' + esc(o.zh) + (isRec ? '<span class="rec-tag">' + (hc.chosen ? '已揀' : '推薦') + '</span>' : '') + '</h4><div class="en">' + esc(o.en) + '</div>' +
            '<dl><dt>評分</dt><dd>' + esc(o.rating) + ' ' + VB[o.ratingV] + '</dd>' +
            '<dt>每晚</dt><dd><span class="price-big">¥' + o.price[0] + '–' + o.price[1] + '</span> ' + VB.est + '<br><span class="mini">≈HK$' + fmt(o.price[0] * state.fx) + '–' + fmt(o.price[1] * state.fx) + '</span></dd>' +
            '<dt>住宿總額</dt><dd>約 ¥' + fmt(mid * nights * rooms) + '（' + nights + ' 晚 × ' + rooms + ' 房，按中位數）</dd>' +
            '<dt>開業</dt><dd>' + esc(o.opened) + '</dd><dt>房間</dt><dd>' + esc(o.room) + '</dd><dt>設施</dt><dd>' + esc(o.facilities) + '</dd>' +
            '<dt>取消</dt><dd>' + esc(o.cancel) + ' ' + VB.na + '</dd></dl>' +
            '<table class="dist-table">' + Object.keys(o.dist).map(k => '<tr><td>' + k + '</td><td>' + o.dist[k] + '</td></tr>').join('') + '</table>' +
            '<div class="pc"><div class="p"><div class="h">優點</div><ul>' + o.pros.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="c"><div class="h">缺點</div><ul>' + o.cons.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>' +
            '<div class="btn-row links">' + o.links.map(l => '<a class="link-btn" target="_blank" rel="noopener" href="' + esc(l[1]) + '">' + esc(l[0]) + ' ↗</a>').join('') +
            '<a class="gmap-btn maponly-btn" data-showplace="' + (P[o.id] ? o.id : '_' + o.id) + '">📍 地圖</a>' +
            '<a class="amap-btn" target="_blank" rel="noopener" href="' + amapMarker({ lat:o.lat, lng:o.lng, zh:o.zh }) + '">高德</a></div>' +
            (o.approx ? '<div class="doc-warn">地圖位置約略（誤差約 300 m）。</div>' : '') + '</div>';
        }).join('') + '</div></div>';
    }).join('');
    // 確保候選酒店喺 P 入面有資料（地圖未開都可以 focus）
    T.hotels.forEach(hc => hc.options.forEach(o => {
      if (!P[o.id] && !P['_' + o.id]) P['_' + o.id] = { zh:o.zh, en:o.en, lat:o.lat, lng:o.lng, type:'hotel', area:hc.city + '（候選酒店）', desc:'候選酒店 · ' + o.rating, tips:o.pros.join('；'), approx:o.approx, v:'est' };
    }));
  }

  /* =====================================================================
     E. 交通
     ===================================================================== */
  function trainTable(list, title){
    return '<div class="tbl-card"><h4>' + title + '</h4><div class="table-scroll"><table class="data"><tr><th>車次</th><th>出發 → 到達</th><th>時間</th><th>歷時</th><th>二等／一等／商務（¥）</th><th>運行日</th><th>備註</th></tr>' +
      list.map(t => '<tr class="' + (t.rec ? 'rec' : '') + '"><td class="tno">' + t.no + (t.rec ? '<span class="rec-tag">推薦</span>' : '') + '</td><td>' + esc(t.from) + ' → ' + esc(t.to) + '</td><td><b>' + t.dep + ' → ' + t.arr + '</b></td><td>' + t.dur + '<div class="small">直達，0 次轉車</div></td>' +
        '<td>¥' + t.O + ' / ' + (t.M ? '¥' + t.M : '—') + ' / ' + (t.A9 ? '¥' + fmt(t.A9) : '—') + '<div class="small">≈HK$' + fmt(t.O * state.fx) + '（二等）</div></td><td class="small">' + esc(t.days) + '</td><td class="small">' + esc(t.note) + '</td></tr>').join('') +
      '</table></div></div>';
  }
  function renderTransport(){
    const w = T.trains.window;
    const today = new Date(); today.setHours(0,0,0,0);
    const rel = w.releases.map(r => {
      const d = new Date(r.date + 'T00:00:00'), diff = Math.round((d - today) / 86400000);
      const cal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('買高鐵飛：' + r.for) + '&dates=' + r.date.replace(/-/g, '') + '/' + r.date.replace(/-/g, '') + '&details=' + encodeURIComponent('12306 App 開售。去程 G6578 18:07／回程 G925 15:55。');
      return '<div class="release"><div class="f">開售日（' + esc(r.for) + '）</div><div class="d">' + Number(r.date.slice(5,7)) + '月' + Number(r.date.slice(8)) + '日</div><div class="cd">' + (diff > 0 ? '尚有 ' + diff + ' 日' : diff === 0 ? '今日開售！' : '已開售') + '</div><a target="_blank" rel="noopener" href="' + cal + '">＋ 加入 Google 日曆提醒</a></div>';
    }).join('');
    $('#trainInfo').innerHTML =
      '<div class="note-box"><b>⏳ 12 月下旬車票未開售。</b>' + esc(w.rule) + '，所以 12/24 去程同 12/27 回程要等以下日期先買到。' +
      '以下班次、時間、票價係 <span class="vb ok">已核實</span> 12306 實時資料（以 12 月上旬運行圖為準）；12 月下旬如有調圖，以開售時為準。<br>' + esc(w.observed) +
      ' <a target="_blank" rel="noopener" href="' + w.source[1] + '">來源：' + esc(w.source[0]) + ' ↗</a></div>' +
      '<div class="release-grid">' + rel + '</div>' +
      trainTable(T.trains.outbound, '去程：香港西九龍 → 汕頭／潮汕（12/24（四））') +
      trainTable(T.trains.ret, '回程：潮汕／揭陽／汕頭 → 香港西九龍（12/27（日））') +
      '<div class="doc-grid" style="margin-bottom:22px">' +
      '<div class="doc-card"><h4>🚉 車站點揀？</h4><ul><li><b>去程：汕頭站</b> — G6578 直達，到龍眼南路全季酒店約 7 km。潮汕站離汕頭市區約 45 km，唔建議夜晚到。</li><li><b>回程：潮汕站</b> — 揭陽南站（離揭陽酒店最近）<b>冇直達香港</b>；12306 列為「揭陽」嘅 G6391 其實喺惠來站開出（距市區約 60 km）。潮汕站每日 6 班直達。</li><li>Day 4 由揭陽古城自駕去潮汕站約 32 km、約 40 分鐘，14:10 到站還車。</li></ul></div>' +
      '<div class="doc-card"><h4>🔁 後備方案</h4><ul><li>' + esc(T.trains.backup) + '</li><li>G900 20:00 西九龍 → 潮汕 22:11 只見於週五至週一，12/24（四）大機會冇。</li></ul></div>' +
      '<div class="doc-card"><h4>🎫 買票連結</h4><div class="btn-row">' + T.trains.links.map(l => '<a class="link-btn" target="_blank" rel="noopener" href="' + esc(l[1]) + '">' + esc(l[0]) + ' ↗</a>').join('') + '</div><div class="doc-sub" style="margin-top:10px">12306 用回鄉證實名購票；香港段網上購票截止為開車前 30 分鐘。票價以人民幣計；經港鐵購票以港幣計，金額或有差異。</div></div>' +
      '</div>';
    const cr = T.carRental;
    const crTot = cr.costs.reduce((a, c) => [a[0] + c[1], a[1] + c[2]], [0, 0]);
    $('#carSchedule').innerHTML = '<div class="tbl-card"><h4>🚙 自駕租車：取車／還車時間表（' + state.trav + ' 人 · ' + esc(cr.vehicle) + '）</h4><div class="table-scroll"><table class="data"><tr><th>時間</th><th>事項</th><th>地點</th><th>備註</th><th>已辦</th></tr>' +
      cr.steps.map((c, i) => '<tr><td class="tno">' + esc(c.when) + '</td><td><b>' + esc(c.what) + '</b></td><td>' + esc(c.where) + '</td><td class="small">' + esc(c.note) + '</td><td class="col-paid"><input type="checkbox" class="persist-check" data-key="rent-' + i + '"></td></tr>').join('') +
      '</table></div>' +
      '<h4 style="margin-top:16px">💴 租車費用估算 ' + VB.est + '</h4><div class="table-scroll"><table class="data"><tr><th>項目</th><th>估算</th></tr>' +
      cr.costs.map(c => '<tr><td>' + esc(c[0]) + '</td><td>¥' + fmt(c[1]) + '–' + fmt(c[2]) + '</td></tr>').join('') +
      '<tr><td style="text-align:right;font-weight:700">合計（估算）</td><td><b>¥' + fmt(crTot[0]) + '–' + fmt(crTot[1]) + '</b><div class="small">≈HK$' + fmt(crTot[0] * state.fx) + '–' + fmt(crTot[1] * state.fx) + '</div></td></tr></table></div>' +
      '<div class="small" style="margin-top:8px;color:var(--ink-soft)">' + esc(cr.deposit) + '</div></div>';
    initPersisted($('#carSchedule'));
    $('#localTransport').innerHTML = T.localTransport.map(x => '<div class="doc-card"><h4>' + x.title + '</h4><div class="doc-sub" style="font-size:13px;color:var(--ink)">' + x.body + '</div>' + (x.cost ? '<div class="fee"><span class="tot">' + x.cost + '</span> ' + VB.est + '</div>' : '') + '</div>').join('');
  }

  /* =====================================================================
     F. 美食
     ===================================================================== */
  function renderFood(){
    $('#foodDishes').innerHTML = T.foodDishes.map(f => {
      const ph = f.photo && PH[f.photo] && PH[f.photo][0];
      return '<div class="food-card">' + (ph ? '<div class="ph" data-bg="' + esc(ph.src) + '" data-full="' + esc(ph.src) + '" data-page="' + esc(ph.page) + '" data-lic="' + esc(ph.license) + '"></div>' : '') +
        '<div class="bd"><h4>' + esc(f.zh) + '</h4><div class="en">' + esc(f.en) + '</div><p>' + esc(f.desc) + '</p><div class="cost">' + esc(f.cost) + '</div></div></div>';
    }).join('');
    $('#foodPlaces').innerHTML = '<tr><th>行程日</th><th>餐廳</th><th>點評推薦菜</th><th>點評評分</th><th>人均</th><th>連結</th></tr>' +
      T.foodPlaces.map(f => {
        const p = f.place ? P[f.place] : null;
        const city = /潮州/.test(f.area) ? '潮州' : /揭陽/.test(f.area) ? '揭阳' : '汕头';
        const mapLinks = p ? '<a class="gmap-btn maponly-btn" data-showplace="' + f.place + '">📍 地圖</a> <a class="amap-btn" target="_blank" rel="noopener" href="' + amapMarker(p) + '">高德</a>'
          : '<a class="amap-btn" target="_blank" rel="noopener" href="' + amapSearch(f.search || f.name, city) + '">高德搜尋</a>';
        const dpLink = f.city ? ' <a class="link-btn" target="_blank" rel="noopener" href="https://www.dianping.com/search/keyword/' + f.city + '/0_' + encodeURIComponent(f.name) + '">點評 ↗</a>' : '';
        return '<tr><td class="small"><b>' + esc(f.day) + '</b></td><td><b>' + esc(f.name) + '</b><div class="small">' + esc(f.area) + '</div>' + (f.note ? '<div class="small">' + esc(f.note) + '</div>' : '') + '</td><td>' + esc(f.dish) + '</td><td class="small">' + (f.city ? '⭐ ' : '') + esc(f.dp || '—') + '</td><td>' + esc(f.cost) + ' ' + VB[f.v] + '</td><td><div class="links">' + mapLinks + dpLink + '</div></td></tr>';
      }).join('');
  }

  /* =====================================================================
     G. 預算（可編輯）
     ===================================================================== */
  function budgetItems(){
    const saved = store.get('budget', null);
    return Array.isArray(saved) ? saved : JSON.parse(JSON.stringify(T.budget));
  }
  function stNights(){ return 2; }
  function lineTotal(it){
    const rooms = Math.ceil(state.trav / 2);
    let mult = it.per === 'person' ? state.trav : it.per === 'room' ? rooms : 1;
    if (it.nightsKey === 'st') mult *= stNights();
    return (Number(it.amt) || 0) * mult;
  }
  function budgetCalc(){
    const items = budgetItems(), byCat = {};
    let total = 0;
    items.forEach(it => { const v = lineTotal(it); total += v; byCat[it.cat] = (byCat[it.cat] || 0) + v; });
    return { items, byCat, total };
  }
  function renderBudget(){
    const b = budgetCalc();
    $('#budgetTitle').textContent = '預算總覽（' + state.trav + ' 人 · 4日3夜）';
    $('#budgetTotal').innerHTML = '<div><div class="sub">預算總額（' + state.trav + ' 人）</div><div class="big">¥' + fmt(b.total) + ' ≈ HK$' + fmt(b.total * state.fx) + '</div>' +
      '<div class="sub">匯率約 ¥1 = HK$' + state.fx + '（僅供參考，可喺下面修改）。高鐵票價已核實；住宿、租車、餐飲為估算。</div></div>' +
      '<div class="per-person"><span>人均預算</span><span>¥' + fmt(b.total / state.trav) + ' ≈ HK$' + fmt(b.total * state.fx / state.trav) + '</span></div>';
    const cats = Object.keys(T.budgetCats);
    $('#budgetBars').innerHTML = cats.map(c => {
      const v = b.byCat[c] || 0, pct = b.total ? Math.round(v / b.total * 100) : 0;
      return '<div class="bar-row"><div class="bar-top"><span>' + T.budgetCats[c] + '</span><span class="amt">¥' + fmt(v) + ' ≈ HK$' + fmt(v * state.fx) + ' · ' + pct + '%</span></div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div></div>';
    }).join('') + '<div class="budget-note">住宿：汕頭 1 晚 + 南澳 1 晚 + 揭陽 1 晚，每 2 人 1 間房。</div>';
    const catOpts = sel => cats.map(c => '<option value="' + c + '"' + (c === sel ? ' selected' : '') + '>' + T.budgetCats[c] + '</option>').join('');
    const perOpts = sel => [['person','每人'],['room','每房'],['group','全團']].map(p => '<option value="' + p[0] + '"' + (p[0] === sel ? ' selected' : '') + '>' + p[1] + '</option>').join('');
    $('#budgetTable').innerHTML = '<tr><th>類別</th><th>項目</th><th>單價（¥）</th><th>計算</th><th>狀態</th><th style="text-align:right">小計</th><th></th></tr>' +
      b.items.map((it, i) => '<tr data-bi="' + i + '"><td><select data-bf="cat">' + catOpts(it.cat) + '</select></td><td><input type="text" data-bf="label" value="' + esc(it.label) + '"></td>' +
        '<td><input type="number" min="0" step="1" data-bf="amt" value="' + (Number(it.amt) || 0) + '"></td><td><select data-bf="per">' + perOpts(it.per) + '</select>' + (it.nightsKey === 'st' ? '<div class="mini">× ' + stNights() + ' 晚</div>' : '') + '</td>' +
        '<td>' + (VB[it.v] || VB.est) + '</td><td class="sub">¥' + fmt(lineTotal(it)) + '</td><td><button class="del" data-bdel="' + i + '" title="刪除">✕</button></td></tr>').join('') +
      '<tr><td colspan="5" style="text-align:right;font-weight:700">合計</td><td class="sub">¥' + fmt(b.total) + '</td><td></td></tr>';
    $('#fxInput').value = state.fx;
  }
  function saveBudget(items){ store.set('budget', items); fire(); }
  document.addEventListener('change', e => {
    const f = e.target.closest('[data-bf]');
    if (f) {
      const i = Number(f.closest('tr').dataset.bi), items = budgetItems();
      const k = f.dataset.bf;
      items[i][k] = k === 'amt' ? Math.max(0, Number(f.value) || 0) : f.value;
      if (k === 'amt') items[i].v = 'est';
      saveBudget(items); return;
    }
    if (e.target.id === 'fxInput') { const v = Number(e.target.value); if (v > 0) { state.fx = v; store.set('fx', v); fire(); } }
  });
  document.addEventListener('click', e => {
    const d = e.target.closest('[data-bdel]');
    if (d) { const items = budgetItems(); items.splice(Number(d.dataset.bdel), 1); saveBudget(items); return; }
    if (e.target.id === 'budAdd') { const items = budgetItems(); items.push({ key:'custom' + Date.now(), cat:'misc', label:'新項目', amt:0, per:'group', v:'est' }); saveBudget(items); return; }
    if (e.target.id === 'budReset') { if (confirm('還原所有預算項目到預設值？')) { try { localStorage.removeItem(PFX + 'budget'); } catch(_){} fire(); } }
  });

  /* =====================================================================
     貼士 / 來源
     ===================================================================== */
  function renderTips(){
    $('#tipsList').innerHTML = T.tips.map(t => '<li>' + t + '</li>').join('');
    $('#srcList').innerHTML = T.sources.map(s => '<li><a target="_blank" rel="noopener" href="' + esc(s[1]) + '">' + esc(s[0]) + ' ↗</a></li>').join('');
  }

  /* =====================================================================
     主分頁（同 Hokkaido 一樣，加前綴）
     ===================================================================== */
  function activateView(name, scroll){
    if (!document.getElementById('view-' + name)) name = 'overview';
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    $$('.main-tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
    store.set('mainview', name);
    if (name === 'map') {
      buildMap();
      setTimeout(() => { if (map) { map.invalidateSize(); applyMapSel(); } }, 60);
    }
    if (scroll) window.scrollTo(0, document.getElementById('mainTabs').offsetTop);
  }
  $$('.main-tab').forEach(t => t.addEventListener('click', () => activateView(t.dataset.view, true)));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    const view = el.closest('.view');
    if (!view) return;
    e.preventDefault();
    activateView(view.id.replace('view-', ''), false);
    requestAnimationFrame(() => el.scrollIntoView({ behavior:'smooth', block:'start' }));
  });

  /* lightbox */
  document.addEventListener('click', e => {
    const im = e.target.closest('img[data-full], .ph[data-full]');
    const lb = $('#lightbox');
    if (im && !e.target.closest('#lightbox')) {
      $('img', lb).src = im.dataset.full;
      $('.cap', lb).innerHTML = '相片：<a target="_blank" rel="noopener" href="' + esc(im.dataset.page) + '">Wikimedia Commons</a> · ' + esc(im.dataset.lic || '') + '（撳任何位置關閉）';
      lb.classList.add('open');
      return;
    }
    if (e.target.closest('#lightbox') && !e.target.closest('a')) lb.classList.remove('open');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#lightbox').classList.remove('open'); });

  /* =====================================================================
     啟動
     ===================================================================== */
  /* 背景相：先試載入，成功先顯示；失敗就成格刪走 */
  function applyBgs(){
    $$('[data-bg]').forEach(el => {
      const url = el.dataset.bg; el.removeAttribute('data-bg');
      const im = new Image();
      im.onload = () => { el.style.backgroundImage = 'url("' + url + '")'; };
      im.onerror = () => el.remove();
      im.src = url;
    });
  }
  function renderAll(){
    renderPlanSwitches(); renderHero(); renderOverview(); renderWeather(); renderItin();
    renderHotels(); renderTransport(); renderFood(); renderBudget(); renderTips();
    if (mapReady) drawMap();
    applyBgs();
  }
  onChange(renderAll);
  renderAll();
  activateView(store.get('mainview', 'overview'), false);
})();
