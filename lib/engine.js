/* 리릭비디오 메이커 — 공통 엔진 (파일 넣기 · 음원 분석 · 가사 정리 · 효과 · 구독 안내 · MP4 저장)
   템플릿 파일(templates/*.js)이 화면 그리기를 맡고, 이 엔진이 나머지를 모두 처리합니다. */
'use strict';
(function injectShell() {
  const st = document.createElement('style'); st.textContent = `:root{
  --bg:#f6f3ee; --panel:#ffffff; --ink:#24201c; --sub:#6f675e; --line:#e4ddd3;
  --accent:#c2457e; --accent-soft:#fbe9f1; --ok:#2f7d4f; --warn:#b4541a; --err:#b42318;
  --radius:14px; --font:"Pretendard","Malgun Gothic","Apple SD Gothic Neo",sans-serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);font-size:16px;line-height:1.55}
header{padding:22px 28px 10px;display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
header h1{margin:0;font-size:26px;letter-spacing:-.02em}
header p{margin:0;color:var(--sub)}
main{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:22px;padding:12px 28px 40px;align-items:start}
@media (max-width:1100px){main{grid-template-columns:1fr;padding:12px 16px 40px}}
section{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px;margin-bottom:18px}
h2{margin:0 0 12px;font-size:19px;display:flex;align-items:center;gap:10px}
h2 .n{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--accent);color:#fff;font-size:15px}
.hint{color:var(--sub);font-size:14.5px;margin:6px 0 0}
#drop{border:2px dashed #cfc5b8;border-radius:12px;padding:26px 16px;text-align:center;cursor:pointer;transition:.15s;background:#fcfaf7}
#drop.over{border-color:var(--accent);background:var(--accent-soft)}
#drop strong{font-size:17px}
button,.btn{font:inherit;border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:10px;padding:9px 14px;cursor:pointer}
button:hover{border-color:#bfb4a6}
button.primary{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:700;font-size:18px;padding:14px 22px;width:100%}
button.primary:disabled{opacity:.45;cursor:not-allowed}
button.small{padding:5px 9px;font-size:14px;border-radius:8px}
.tracks{display:flex;flex-direction:column;gap:10px;margin-top:14px}
.track{display:grid;grid-template-columns:30px 64px minmax(0,1fr) auto;gap:12px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff}
.track.sel{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent-soft)}
.track .num{font-weight:800;color:var(--sub);text-align:center}
.track .thumb{width:64px;height:64px;border-radius:8px;object-fit:cover;background:#eee;cursor:pointer;display:block}
.track input.title{width:100%;font:inherit;font-weight:700;border:1px solid transparent;border-radius:6px;padding:3px 6px;background:transparent}
.track input.title:hover,.track input.title:focus{border-color:var(--line);background:#fff}
.meta{font-size:13.5px;color:var(--sub);padding:0 6px;display:flex;gap:10px;flex-wrap:wrap}
.meta .ok{color:var(--ok)} .meta .warn{color:var(--warn)} .meta .err{color:var(--err)}
.acts{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;max-width:170px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px 16px}
@media (max-width:560px){.grid2{grid-template-columns:1fr}.track{grid-template-columns:24px 52px minmax(0,1fr)}.acts{grid-column:1/-1;max-width:none}}
label.f{display:flex;flex-direction:column;gap:5px;font-size:14.5px;color:var(--sub)}
label.f input[type=text],label.f select{font:inherit;color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:8px 10px}
label.f input[type=color]{width:100%;height:40px;border:1px solid var(--line);border-radius:8px;padding:2px;background:#fff}
label.f input[type=range]{width:100%;accent-color:var(--accent)}
.row-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap}
b.sub{display:block;margin-bottom:6px;font-size:15px}
.opts.layouts{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}
.opt{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;padding:10px;border-radius:12px;color:var(--sub)}
.opt svg{width:64px;height:36px;color:#6b5f66}
.opt b{color:var(--ink);font-size:15px}
.opt small{font-size:12.5px;line-height:1.35}
.opt.on{border-color:var(--accent);background:var(--accent-soft);box-shadow:0 0 0 1px var(--accent)}
.opt.on svg{color:var(--accent)}
.seg{display:flex;gap:6px;flex-wrap:wrap}
.seg button{padding:8px 12px}
.seg button.on{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:700}
.seg button:disabled{opacity:.4;cursor:not-allowed}
.chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.chip{width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px var(--line);padding:0;cursor:pointer}
.chip.on{box-shadow:0 0 0 3px var(--ink)}
.chips label{display:flex;align-items:center;gap:6px;font-size:14px;color:var(--sub)}
.chips input[type=color]{width:44px;height:36px;border:1px solid var(--line);border-radius:8px;padding:2px;background:#fff}
hr.sep{border:0;border-top:1px solid var(--line);margin:18px 0}
.preview-wrap{position:sticky;top:12px}
canvas#view{width:100%;aspect-ratio:16/9;border-radius:10px;background:#111;display:block}
.player{display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap}
.player input[type=range]{flex:1;min-width:160px;accent-color:var(--accent)}
.player select{font:inherit;border:1px solid var(--line);border-radius:8px;padding:7px 8px;max-width:240px}
.mono{font-variant-numeric:tabular-nums;color:var(--sub);font-size:14px}
.bar{height:12px;background:#eee6dc;border-radius:99px;overflow:hidden;margin-top:12px}
.bar>div{height:100%;width:0;background:var(--accent);transition:width .2s}
#status{margin-top:10px;font-size:15px;min-height:24px}
#status.err{color:var(--err)} #status.ok{color:var(--ok)}
textarea{width:100%;min-height:120px;font:14px/1.6 ui-monospace,Consolas,monospace;border:1px solid var(--line);border-radius:8px;padding:10px;resize:vertical}
details summary{cursor:pointer;font-weight:700}
details ol{padding-left:20px;margin:10px 0 0} details li{margin-bottom:4px}
.empty{color:var(--sub);text-align:center;padding:14px 0 4px;font-size:15px}
header .back{font-size:14px;color:var(--sub);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:5px 12px;background:#fff;align-self:center}
header .back:hover{border-color:var(--accent);color:var(--accent)}
`; document.head.appendChild(st);
  document.body.insertAdjacentHTML('afterbegin', `<header>
  <a class="back" href="index.html">← 템플릿 고르기</a>
  <h1>리릭비디오 메이커 · <span id="tplName"></span></h1>
  <p id="tplDesc"></p>
</header>
<main>
<div>
  <section>
    <h2><span class="n">1</span>파일 넣기</h2>
    <div id="drop" tabindex="0" role="button">
      <strong>음원 · 커버 이미지 · 가사 파일을 한꺼번에 끌어다 놓으세요</strong>
      <div class="hint">또는 여기를 눌러 파일 선택 (여러 개 선택 가능)</div>
    </div>
    <input type="file" id="pick" multiple accept=".mp3,.wav,.m4a,.flac,.ogg,.aac,.jpg,.jpeg,.png,.webp,.srt,.lrc" hidden>
    <p class="hint">같은 이름끼리 자동으로 짝지어집니다. 예: <b>01 가을 하늘.mp3</b> · <b>01 가을 하늘.jpg</b> · <b>01 가을 하늘.srt</b><br>이미지를 1장만 넣으면 모든 곡에 같은 커버가 쓰입니다.</p>
    <div class="tracks" id="tracks"><div class="empty">아직 넣은 곡이 없습니다.</div></div>
    <input type="file" id="pickOne" hidden>
  </section>

  <section>
    <h2><span class="n">2</span>꾸미기</h2>
    <div class="row-head"><b>디자인</b><span style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="hint" id="shuffleInfo" style="margin:0"></span><button id="shuffleBtn" class="small">🎲 다른 느낌으로 섞기</button></span></div>
    <div id="tplControls" style="margin-bottom:14px"></div>
    <div class="grid2">
      <div id="ctlLyric"><b class="sub">가사 스타일</b><div class="seg" id="optLyric"></div></div>
      <div id="ctlBar"><b class="sub">파형 스타일</b><div class="seg" id="optBar"></div><div class="hint" id="barNote" hidden style="margin-top:4px"></div></div>
    </div>
    <div class="grid2" style="margin-top:14px">
      <div><b class="sub">날씨 효과</b><div class="seg" id="optFx"></div></div>
      <label class="f">효과 양: <span id="vFx">보통</span>
        <input type="range" id="sFx" min="10" max="100" step="10" value="50"></label>
    </div>
    <div style="margin-top:14px" id="ctlColor"><b class="sub">강조색</b>
      <div class="chips" id="optColor"></div>
    </div>
    <hr class="sep">
    <div class="grid2">
      <label class="f" id="ctlLabel">위쪽 작은 글씨 (채널·플레이리스트 이름)
        <input type="text" id="sLabel" placeholder="예: dalcommood playlist"></label>
      <label class="f" id="ctlArtist">제목 아래 글씨 (아티스트·부제)
        <input type="text" id="sArtist" placeholder="예: 가을 감성 샹송"></label>
      <label class="f" id="ctlTitle">제목 크기: <span id="vTitle">65%</span>
        <input type="range" id="sTitle" min="50" max="120" step="5" value="65"></label>
      <label class="f" id="ctlTrackNo" style="flex-direction:row;align-items:center;gap:8px;margin-top:22px"><input type="checkbox" id="sTrackNo" checked style="width:20px;height:20px;accent-color:var(--accent)"> 제목 앞에 곡 번호 넣기 (01, 02 …)</label>
      <label class="f">전체 반복 횟수: <span id="vRepeat">1회</span>
        <input type="range" id="sRepeat" min="1" max="10" step="1" value="1"></label>
      <label class="f">곡 사이 간격: <span id="vGap">1.0초</span>
        <input type="range" id="sGap" min="0" max="5" step="0.5" value="1"></label>
      <label class="f" id="ctlBlur">배경 흐림: <span id="vBlur">40</span>
        <input type="range" id="sBlur" min="0" max="80" step="5" value="40"></label>
      <label class="f" id="ctlDim">배경 어둡기: <span id="vDim">55%</span>
        <input type="range" id="sDim" min="0" max="85" step="5" value="55"></label>
    </div>
    <hr class="sep">
    <div class="row-head"><b>구독·좋아요 안내 (영어)</b>
      <label style="display:flex;align-items:center;gap:8px;font-size:15px"><input type="checkbox" id="sSub" checked style="width:20px;height:20px;accent-color:var(--accent)"> 영상에 넣기</label></div>
    <div class="grid2">
      <label class="f">나오는 시점: 영상 시작 후 <span id="vSubStart">3초</span>
        <input type="range" id="sSubStart" min="0" max="60" step="1" value="3"></label>
      <label class="f">보이는 시간: <span id="vSubDur">12초</span>
        <input type="range" id="sSubDur" min="5" max="30" step="1" value="12"></label>
    </div>
    <div id="ctlBg">
    <hr class="sep">
    <div class="player" style="margin-top:14px">
      <button id="bgBtn">공통 배경 이미지 넣기</button>
      <button id="bgClear" class="small" hidden>배경 이미지 빼기</button>
      <span class="hint" id="bgInfo" style="margin:0">없으면 각 곡의 커버를 흐리게 깔아 배경으로 씁니다. 권장 크기 1920×1080 (16:9)</span>
    </div>
    </div>
    <input type="file" id="bgPick" accept=".jpg,.jpeg,.png,.webp" hidden>
  </section>

  <section>
    <details>
      <summary>사용 안내 · 자주 묻는 질문</summary>
      <ol>
        <li><b>크롬(Chrome) 또는 엣지(Edge)</b> 최신 버전에서 사용하세요. 프로그램 설치는 필요 없습니다.</li>
        <li>가사는 <b>SRT</b> 또는 <b>LRC</b>(시간이 들어 있는 가사 파일)만 됩니다. 가사가 없으면 연주곡으로 만들어집니다.</li>
        <li>가사 시간이 서로 겹치면 자동으로 정리합니다. 음원보다 긴 가사는 잘라냅니다.</li>
        <li>영상 만들기를 누르면 <b>저장 위치</b>를 먼저 묻습니다. 만드는 동안에는 이 창을 닫거나 최소화하지 마세요.</li>
        <li>40분 플레이리스트는 컴퓨터에 따라 10~40분 정도 걸립니다.</li>
        <li>음원·이미지·가사의 저작권은 사용자에게 있어야 합니다.</li>
      </ol>
    </details>
  </section>
</div>

<div class="preview-wrap">
  <section>
    <h2><span class="n">3</span>미리보기</h2>
    <canvas id="view" width="1920" height="1080"></canvas>
    <div class="player">
      <select id="pvTrack"></select>
      <button id="pvPlay">▶ 재생</button>
      <input type="range" id="pvSeek" min="0" max="1000" value="0">
      <span class="mono" id="pvTime">00:00 / 00:00</span>
    </div>
  </section>
  <section>
    <h2><span class="n">4</span>영상 만들기</h2>
    <button class="primary" id="makeBtn" disabled>MP4 영상 만들기</button>
    <div class="bar"><div id="prog"></div></div>
    <div id="status">곡을 넣으면 시작할 수 있습니다.</div>
    <button id="cancelBtn" class="small" hidden style="margin-top:8px">중지</button>
    <h2 style="margin-top:20px;font-size:16px">유튜브 설명란용 타임라인</h2>
    <textarea id="timeline" readonly placeholder="곡을 넣으면 자동으로 만들어집니다."></textarea>
    <button id="copyTl" class="small" style="margin-top:6px">타임라인 복사</button>
  </section>
</div>
</main>`);
})();
/* ====== 기본 설정 ====== */
const W = 1920, H = 1080, FPS = 30, SR = 48000, SPF = SR / FPS; // samples per frame = 1600
const BARS = 60;
const FONT = '"Pretendard","Malgun Gothic","Apple SD Gothic Neo",sans-serif';
const AUDIO_EXT = ['mp3','wav','m4a','flac','ogg','aac'], IMG_EXT = ['jpg','jpeg','png','webp'], LYR_EXT = ['srt','lrc'];
const state = { tracks: [], bg: null, settingsVer: 0, sel: 0 };
const S = Object.assign({ label:'', artist:'', accent:'#ff8fc8', gap:1, blur:40, dim:55, lyric:'glow', bar:'bars', titleScale:65, trackNo:true, repeat:1, sub:true, subStart:3, subDur:12, fx:'none', fxAmount:50 }, TPL.defaults || {});
loadSettings();
let uid = 1;
const $ = id => document.getElementById(id);

/* ====== 폰트 ====== */
const fontReady = (async () => {
  try {
    let src = 'url(https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2) format("woff2-variations")';
    if (window.PRETENDARD_B64) { const bin = atob(window.PRETENDARD_B64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); src = u.buffer; window.PRETENDARD_B64 = null; }
    const ff = new FontFace('Pretendard', src, { weight: '45 920' });
    document.fonts.add(await ff.load());
  } catch (e) { console.warn('Pretendard 폰트를 불러오지 못해 기본 글꼴을 사용합니다.', e); }
})();

/* ====== 유틸 ====== */
const ext = n => (n.split('.').pop() || '').toLowerCase();
const base = n => n.replace(/\.[^.]+$/, '').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
const baseNoNum = n => base(n).replace(/^\d{1,3}/, '');
const cleanTitle = n => n.replace(/\.[^.]+$/, '').normalize('NFC').replace(/_+/g, ' ').replace(/^\s*\d{1,3}\s*[-.)\]]*\s+/, '').replace(/\s+/g, ' ').trim() || n;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
const natural = (a, b) => a.localeCompare(b, 'ko', { numeric: true, sensitivity: 'base' });
function clock(s, forceH) {
  s = Math.max(0, Math.floor(s + 1e-6));
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60;
  const mm = String(m).padStart(2,'0'), ss = String(x).padStart(2,'0');
  return (h || forceH) ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
const yieldNow = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });

/* ====== 가사 파싱 (SRT / LRC) ====== */
async function readText(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  if (buf[0] === 0xFF && buf[1] === 0xFE) return new TextDecoder('utf-16le').decode(buf);
  if (buf[0] === 0xFE && buf[1] === 0xFF) return new TextDecoder('utf-16be').decode(buf);
  try { return new TextDecoder('utf-8', { fatal: true }).decode(buf); }
  catch { return new TextDecoder('euc-kr').decode(buf); } // 옛 한글 메모장 저장 파일
}
const stripTags = s => s.replace(/<[^>]+>/g, '').replace(/\{\\[^}]*\}/g, '').trim();
function parseSRT(src) {
  const cues = [];
  const t = (h, m, s, ms) => (+h) * 3600 + (+m) * 60 + (+s) + (+(ms + '00').slice(0, 3)) / 1000;
  const re = /(\d{1,2}):(\d{1,2}):(\d{1,2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{1,2}):(\d{1,2})[,.](\d{1,3})/;
  for (const block of src.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split(/\n\s*\n/)) {
    const lines = block.split('\n');
    const i = lines.findIndex(l => re.test(l));
    if (i < 0) continue;
    const m = lines[i].match(re);
    const text = lines.slice(i + 1).map(stripTags).filter(Boolean).join('\n');
    if (text) cues.push({ start: t(m[1], m[2], m[3], m[4]), end: t(m[5], m[6], m[7], m[8]), text });
  }
  return cues;
}
function parseLRC(src) {
  const out = [];
  for (const raw of src.replace(/\r\n?/g, '\n').split('\n')) {
    const tags = [...raw.matchAll(/\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/g)];
    if (!tags.length) continue;
    const text = stripTags(raw.replace(/\[[^\]]*\]/g, '').replace(/<\d+:\d+(?:[.:]\d+)?>/g, ''));
    for (const g of tags) out.push({ start: (+g[1]) * 60 + parseFloat(g[2].replace(':', '.')), text });
  }
  out.sort((a, b) => a.start - b.start);
  const cues = [];
  out.forEach((c, i) => { if (c.text) cues.push({ start: c.start, end: out[i + 1] ? out[i + 1].start : c.start + 6, text: c.text }); });
  return cues;
}
/* 확장프로그램이 약 40자에서 잘라 놓은 영어 가사 조각을 한 줄로 다시 잇기 */
const COMMON_WORDS = new Set(('a i an as at be by do go he if in is it me my no of oh on or so to up us we all and are but can day for get got her him his how its let may new not now off old one our out own say see set she the too two way was who why yet you ooh mm la na da hey ah yeah oh-oh' + ' le les de des du un une et en au aux ce ces se sa son ses ma mon mes ta ton tes ne pas que qui il je tu on nos vos est sur par toi moi lui mai ou y el los las del con por sin mi tu su si ya di il lo gli che per non una').split(' ')); // 프랑스어·스페인어·이탈리아어 짧은 단어도 띄어쓰기 유지
const SUFFIX_RE = /^(ing|ings|tion|tions|ful|ly|ness|ment|ments|ed|er|ers|est|es|ity|ous|ive|able|ible)$/;
function mergeFragments(cues) {
  const out = []; let merged = 0;
  for (const c of cues) {
    const prev = out[out.length - 1], t = c.text.trim();
    const p = prev ? prev.text.trim() : '';
    const isCont = prev && !p.includes('\n') && c.start - prev.end < 0.6 && /^[a-z\-)\],.!?;:]/.test(t) && (p.length >= 30 || t.length <= 6);
    if (!isCont) { out.push({ ...c }); continue; }
    let sep = ' ';
    if (/^[-)\],.!?;:]/.test(t)) sep = '';
    else if (/[A-Za-z]$/.test(p) && /^[a-z]/.test(t)) {
      const raw = p.match(/([A-Za-z]+)$/)[1], a = raw.toLowerCase(), b = t.match(/^([a-z]+)/)[1], capMid = raw !== 'I' && /^[A-Z]/.test(raw) && raw.length <= 3 && p.length > raw.length; // 문장 중간 대문자 조각(De|cember)은 잘린 단어
      if (!/[aeiouy]/.test(b) || capMid || (a.length <= 3 && !COMMON_WORDS.has(a)) || (SUFFIX_RE.test(b) && !COMMON_WORDS.has(b))) sep = '';
    }
    prev.text = p + sep + t; prev.end = Math.max(prev.end, c.end); merged++;
  }
  return { cues: out, merged };
}
function tidyCues(cues, duration) {
  const notes = [];
  cues = cues.filter(c => isFinite(c.start) && isFinite(c.end)).sort((a, b) => a.start - b.start);
  let overlaps = 0, cut = 0;
  for (let i = 0; i < cues.length; i++) {
    const n = cues[i + 1];
    if (n && cues[i].end > n.start) { cues[i].end = n.start; overlaps++; }
    if (cues[i].end <= cues[i].start) cues[i].end = cues[i].start + 0.5;
  }
  if (duration) {
    const before = cues.length;
    cues = cues.filter(c => c.start < duration - 0.2);
    cut = before - cues.length;
    cues.forEach(c => { if (c.end > duration) c.end = duration; });
  }
  if (overlaps) notes.push(`겹치는 시간 ${overlaps}곳 자동 정리`);
  if (cut) notes.push(`음원보다 늦은 가사 ${cut}줄 제외`);
  return { cues, notes };
}

/* ====== 음원 분석 (주파수 막대) ====== */
const FFT_N = 2048, FFT_LOG = 11;
const rev = new Uint16Array(FFT_N), cosT = new Float32Array(FFT_N / 2), sinT = new Float32Array(FFT_N / 2), hann = new Float32Array(FFT_N);
let winSum = 0;
for (let i = 0; i < FFT_N; i++) {
  let r = 0; for (let b = 0; b < FFT_LOG; b++) r |= ((i >> b) & 1) << (FFT_LOG - 1 - b); rev[i] = r;
  hann[i] = .5 - .5 * Math.cos(2 * Math.PI * i / (FFT_N - 1)); winSum += hann[i];
}
for (let i = 0; i < FFT_N / 2; i++) { cosT[i] = Math.cos(-2 * Math.PI * i / FFT_N); sinT[i] = Math.sin(-2 * Math.PI * i / FFT_N); }
const bandDefs = (() => {
  const lo = 40, hi = 16000, defs = [];
  for (let i = 0; i < BARS; i++) {
    const a = lo * Math.pow(hi / lo, i / BARS), b = lo * Math.pow(hi / lo, (i + 1) / BARS), fc = Math.sqrt(a * b);
    const k0 = Math.ceil(a * FFT_N / SR), k1 = Math.floor(b * FFT_N / SR);
    const tilt = 3 * Math.log2(fc / 1000); // 고음역 보정 (+3dB/옥타브)
    if (k1 >= k0) defs.push({ bins: Array.from({ length: k1 - k0 + 1 }, (_, j) => [k0 + j, 1]), tilt });
    else { const x = fc * FFT_N / SR, f = Math.floor(x); defs.push({ bins: [[f, 1 - (x - f)], [f + 1, x - f]], tilt }); }
  }
  return defs;
})();
async function analyzeSpectrum(buffer, onTick) {
  const chs = [buffer.getChannelData(0), buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null].filter(Boolean);
  const frames = Math.ceil(buffer.length / SPF);
  const out = new Uint8Array(frames * BARS);
  const re = new Float32Array(FFT_N), im = new Float32Array(FFT_N), pw = new Float32Array(FFT_N / 2 + 1);
  const prev = new Float32Array(BARS);
  const up = 1 - Math.exp(-1 / (FPS * 0.05)), down = 1 - Math.exp(-1 / (FPS * 0.24));
  const norm = (2 / winSum) ** 2;
  for (let f = 0; f < frames; f++) {
    const c = Math.round(f * SPF);
    pw.fill(0);
    for (const d of chs) {
      for (let i = 0; i < FFT_N; i++) { const idx = c + i - FFT_N / 2; re[rev[i]] = idx >= 0 && idx < d.length ? d[idx] * hann[i] : 0; im[i] = 0; }
      for (let size = 2; size <= FFT_N; size <<= 1) {
        const half = size >> 1, step = FFT_N / size;
        for (let s = 0; s < FFT_N; s += size) for (let j = 0; j < half; j++) {
          const k = j * step, wr = cosT[k], wi = sinT[k], a = s + j, b = a + half;
          const tr = wr * re[b] - wi * im[b], ti = wr * im[b] + wi * re[b];
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        }
      }
      for (let k = 0; k <= FFT_N / 2; k++) pw[k] += (re[k] * re[k] + im[k] * im[k]) * norm / chs.length;
    }
    for (let b = 0; b < BARS; b++) {
      const d = bandDefs[b]; let p = 0, w = 0;
      for (const [k, wt] of d.bins) { p += pw[k] * wt; w += wt; }
      const db = 10 * Math.log10(Math.max(1e-12, p / w)) + d.tilt;
      const target = Math.pow(clamp((db + 62) / 50), 1.5);
      prev[b] += (target > prev[b] ? up : down) * (target - prev[b]);
      out[f * BARS + b] = Math.round(prev[b] * 255);
    }
    if (f % 600 === 0) { onTick && onTick(f / frames); await yieldNow(); }
  }
  return { frames, data: out };
}
async function embeddedCover(file) { // MP3(ID3) 안에 들어 있는 앨범 커버
  try {
    const head = new Uint8Array(await file.slice(0, 10).arrayBuffer());
    if (head[0] !== 0x49 || head[1] !== 0x44 || head[2] !== 0x33) return null;
    const ver = head[3], ss = (a, b, c, d) => ((a & 127) << 21) | ((b & 127) << 14) | ((c & 127) << 7) | (d & 127);
    const size = ss(head[6], head[7], head[8], head[9]);
    const buf = new Uint8Array(await file.slice(10, 10 + size).arrayBuffer());
    let i = 0;
    if (head[5] & 0x40) i = ver === 4 ? ss(buf[0], buf[1], buf[2], buf[3]) : 4 + ((buf[0] << 24) >>> 0) + (buf[1] << 16) + (buf[2] << 8) + buf[3];
    const idLen = ver === 2 ? 3 : 4, hdr = ver === 2 ? 6 : 10;
    while (i + hdr < buf.length) {
      const id = String.fromCharCode(...buf.subarray(i, i + idLen));
      if (!/^[A-Z0-9]+$/.test(id)) break;
      const fsz = ver === 2 ? (buf[i + 3] << 16) | (buf[i + 4] << 8) | buf[i + 5]
        : ver === 4 ? ss(buf[i + 4], buf[i + 5], buf[i + 6], buf[i + 7])
        : ((buf[i + 4] << 24) >>> 0) + (buf[i + 5] << 16) + (buf[i + 6] << 8) + buf[i + 7];
      const body = buf.subarray(i + hdr, i + hdr + fsz);
      if (id === 'APIC' || id === 'PIC') {
        const enc = body[0]; let p = 1, mime = 'image/jpeg';
        if (id === 'PIC') p = 4;
        else { const e = body.indexOf(0, p); mime = String.fromCharCode(...body.subarray(p, e)) || mime; p = e + 1; }
        p++; // 그림 종류
        if (enc === 1 || enc === 2) { while (p + 1 < body.length && !(body[p] === 0 && body[p + 1] === 0)) p += 2; p += 2; }
        else { while (p < body.length && body[p] !== 0) p++; p++; }
        return await createImageBitmap(new Blob([body.slice(p)], { type: mime.includes('/') ? mime : 'image/jpeg' }));
      }
      i += hdr + fsz;
    }
  } catch (e) { console.warn('내장 커버 없음', e); }
  return null;
}
async function decodeAudio(file) {
  const ctx = new OfflineAudioContext(2, SR, SR);
  return await ctx.decodeAudioData(await file.arrayBuffer());
}

/* ====== 파일 추가 / 짝짓기 ====== */
async function addFiles(list) {
  const files = [...list];
  const audios = files.filter(f => AUDIO_EXT.includes(ext(f.name))).sort((a, b) => natural(a.name, b.name));
  const imgs = files.filter(f => IMG_EXT.includes(ext(f.name))).sort((a, b) => natural(a.name, b.name));
  const lyrs = files.filter(f => LYR_EXT.includes(ext(f.name))).sort((a, b) => natural(a.name, b.name));
  const ignored = files.length - audios.length - imgs.length - lyrs.length;
  const fresh = audios.map(f => ({ id: uid++, title: cleanTitle(f.name), audio: f, cover: null, coverBmp: null, coverURL: null, lyr: null, cues: [], notes: [], duration: 0, spec: null, status: 'wait', err: '' }));
  state.tracks.push(...fresh);
  const targets = fresh.length ? fresh : state.tracks;
  // 1) 이름이 같은 파일끼리
  const useI = new Set(), useL = new Set();
  for (const t of targets) {
    const b = base(t.audio.name);
    const bn = baseNoNum(t.audio.name);
    const find = (arr, used) => { let k = arr.findIndex((f, j) => !used.has(j) && base(f.name) === b); if (k < 0 && bn) k = arr.findIndex((f, j) => !used.has(j) && baseNoNum(f.name) === bn); return k; };
    const i = find(imgs, useI); if (i >= 0) { useI.add(i); await setCover(t, imgs[i]); }
    const l = find(lyrs, useL); if (l >= 0) { useL.add(l); t.lyr = lyrs[l]; }
  }
  // 2) 남은 파일: 이미지 1장이면 공통 커버, 아니면 순서대로
  const leftI = imgs.filter((_, k) => !useI.has(k)), leftL = lyrs.filter((_, k) => !useL.has(k));
  const noCover = targets.filter(t => !t.cover), noLyr = targets.filter(t => !t.lyr);
  if (leftI.length === 1 && noCover.length) { for (const t of noCover) await setCover(t, leftI[0]); }
  else for (let k = 0; k < Math.min(leftI.length, noCover.length); k++) await setCover(noCover[k], leftI[k]);
  for (let k = 0; k < Math.min(leftL.length, noLyr.length); k++) noLyr[k].lyr = leftL[k];
  if (ignored) setStatus(`지원하지 않는 파일 ${ignored}개는 제외했습니다.`);
  renderList();
  for (const t of targets) if (t.lyr && t.status === 'ready') await loadLyrics(t);
  for (const t of fresh) await analyzeTrack(t);
}
async function setCover(t, file) {
  try {
    t.coverBmp = await createImageBitmap(file); t.cover = file; t.embedded = false;
    if (t.coverURL) URL.revokeObjectURL(t.coverURL); t.coverURL = URL.createObjectURL(file);
  } catch { t.err = `커버 “${file.name}”을 열 수 없습니다.`; }
  invalidate();
}
async function loadLyrics(t) {
  t.cues = []; t.notes = [];
  if (!t.lyr) return;
  try {
    const txt = await readText(t.lyr);
    const raw = ext(t.lyr.name) === 'lrc' ? parseLRC(txt) : parseSRT(txt);
    if (!raw.length) { t.notes = ['가사 시간 정보를 찾지 못했습니다']; return; }
    const mf = mergeFragments(raw.sort((a, b) => a.start - b.start));
    const r = tidyCues(mf.cues, t.duration); t.cues = r.cues; t.notes = r.notes;
    if (mf.merged) t.notes.unshift(`끊긴 가사 ${mf.merged}곳 이어붙임`);
  } catch (e) { t.notes = ['가사 파일을 읽지 못했습니다']; }
}
async function analyzeTrack(t) {
  t.status = 'busy'; renderList();
  try {
    const buf = await decodeAudio(t.audio);
    t.duration = buf.length / SR;
    if (!t.coverBmp) {
      const bmp = await embeddedCover(t.audio);
      if (bmp) {
        t.coverBmp = bmp; t.embedded = true;
        const c = mk(128, 128); drawCoverFit(c.getContext('2d'), bmp, 0, 0, 128, 128); t.coverURL = c.toDataURL('image/jpeg', .85);
        invalidate();
      }
    }
    t.spec = await analyzeSpectrum(buf, p => { t.pct = Math.round(p * 100); updateMeta(t); });
    t.status = 'ready';
    await loadLyrics(t);
  } catch (e) { console.error(e); t.status = 'error'; t.err = '음원을 읽을 수 없습니다. MP3 또는 WAV로 다시 저장해 주세요.'; }
  renderList(); refreshAll();
}

/* ====== 목록 UI ====== */
function metaHTML(t) {
  const m = [];
  if (t.status === 'busy') m.push(`<span>음원 분석 중… ${t.pct || 0}%</span>`);
  else if (t.status === 'error') m.push(`<span class="err">${t.err}</span>`);
  else if (t.status === 'ready') m.push(`<span>${clock(t.duration)}</span>`);
  m.push(t.lyr ? (t.cues.length ? `<span class="ok">가사 ${t.cues.length}줄</span>` : `<span class="warn">가사 없음</span>`) : `<span>가사 없음 (연주곡)</span>`);
  if (!t.cover) m.push(t.embedded ? `<span class="warn">음원 속 커버 사용 (${t.coverBmp.width}px)</span>` : '<span class="warn">커버 없음 (기본 커버)</span>');
  for (const n of t.notes) m.push(`<span class="warn">${n}</span>`);
  return m.join('');
}
function updateMeta(t) { const el = document.querySelector(`.track[data-id="${t.id}"] .meta`); if (el) el.innerHTML = metaHTML(t); }
function renderList() {
  const box = $('tracks');
  if (!state.tracks.length) { box.innerHTML = '<div class="empty">아직 넣은 곡이 없습니다.</div>'; refreshAll(); return; }
  box.innerHTML = '';
  state.tracks.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = 'track' + (i === state.sel ? ' sel' : ''); d.dataset.id = t.id;
    d.innerHTML = `<div class="num">${String(i + 1).padStart(2, '0')}</div>
      <img class="thumb" alt="커버" title="커버 바꾸기" src="${t.coverURL || DEFAULT_THUMB}">
      <div><input class="title" value="" aria-label="곡 제목"><div class="meta">${metaHTML(t)}</div></div>
      <div class="acts">
        <button class="small" data-a="lyr">${t.lyr ? '가사 바꾸기' : '가사 넣기'}</button>
        <button class="small" data-a="up" title="위로">▲</button><button class="small" data-a="down" title="아래로">▼</button><button class="small" data-a="del" title="삭제">✕</button>
      </div>`;
    const inp = d.querySelector('input.title'); inp.value = t.title;
    inp.addEventListener('input', () => { t.title = inp.value; invalidate(); refreshAll(); });
    d.querySelector('.thumb').onclick = () => pickOne('image/*,.jpg,.jpeg,.png,.webp', async f => { await setCover(t, f); renderList(); refreshAll(); });
    d.addEventListener('click', e => { if (e.target.closest('button,input,.thumb')) return; selectTrack(i); });
    d.querySelectorAll('button').forEach(b => b.onclick = async () => {
      const a = b.dataset.a, k = state.tracks.indexOf(t);
      if (a === 'lyr') return pickOne('.srt,.lrc', async f => { t.lyr = f; await loadLyrics(t); invalidate(); renderList(); refreshAll(); });
      if (a === 'del') { state.tracks.splice(k, 1); stopPreview(); state.sel = Math.min(state.sel, state.tracks.length - 1); if (state.sel < 0) state.sel = 0; }
      if (a === 'up' && k > 0) [state.tracks[k - 1], state.tracks[k]] = [state.tracks[k], state.tracks[k - 1]];
      if (a === 'down' && k < state.tracks.length - 1) [state.tracks[k + 1], state.tracks[k]] = [state.tracks[k], state.tracks[k + 1]];
      invalidate(); renderList(); refreshAll();
    });
    box.appendChild(d);
  });
}
function pickOne(accept, cb) {
  const p = $('pickOne'); p.accept = accept; p.value = '';
  p.onchange = () => { if (p.files[0]) cb(p.files[0]); }; p.click();
}
const DEFAULT_THUMB = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#3a2f3a"/><text x="32" y="42" font-size="30" text-anchor="middle" fill="#fff">♪</text></svg>');

/* ====== 디자인 테마 ====== */
const PALETTE = [['핑크', '#ff8fc8'], ['코랄', '#ff9a76'], ['골드', '#f2c45a'], ['민트', '#5fdcbc'], ['스카이', '#74bfff'], ['라벤더', '#b49cff'], ['화이트', '#f4f1ea']];
const LYRIC_STYLES = { glow: '빛나는 글씨', color: '강조색 글씨', box: '형광펜' };
const BAR_STYLES = { bars: '막대', mirror: '대칭', dots: '점' };
const LYR_LH = 1.38, LYR_GAP = 22;
/* ====== 화면 그리기 ====== */
let resCache = new Map();
function invalidate() { state.settingsVer++; resCache.clear(); saveSettings(); }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function hexRgb(h) { const m = /rgba?\(([^)]+)\)/.exec(h); if (m) return m[1].split(',').slice(0, 3).map(v => Math.round(+v)); const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function defaultCover(accent) {
  const c = mk(800, 800), x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 800, 800); g.addColorStop(0, accent); g.addColorStop(1, '#1d1622');
  x.fillStyle = g; x.fillRect(0, 0, 800, 800);
  x.fillStyle = 'rgba(255,255,255,.85)'; x.font = `300px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('♪', 400, 420);
  return c;
}
function drawCoverFit(ctx, img, x, y, w, h) {
  const iw = img.width, ih = img.height, s = Math.max(w / iw, h / ih);
  const sw = w / s, sh = h / s;
  ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, x, y, w, h);
}
function wrap(ctx, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(/(\s+)/).filter(s => s.length);
    let line = '';
    for (const w of words) {
      const test = line + w;
      if (ctx.measureText(test.trimEnd()).width <= maxW || !line.trim()) {
        if (ctx.measureText(test.trimEnd()).width > maxW) { // 한 단어가 너무 긴 경우 글자 단위로 자르기
          let part = '';
          for (const ch of test) { if (ctx.measureText(part + ch).width > maxW && part) { out.push(part); part = ch; } else part += ch; }
          line = part;
        } else line = test;
      } else { out.push(line.trim()); line = w.trimStart(); }
    }
    if (line.trim()) out.push(line.trim());
  }
  return out.length ? out : [''];
}
function ellipsize(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text; while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1);
  return s.trimEnd() + '…';
}
function makeCoverCard(img, s, r, shadow) {
  const cv = mk(s + 120, s + 120), c = cv.getContext('2d');
  c.save(); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = shadow; c.shadowOffsetY = shadow * .36;
  rr(c, 60, 60, s, s, r); c.fillStyle = '#000'; c.fill(); c.restore();
  c.save(); rr(c, 60, 60, s, s, r); c.clip(); drawCoverFit(c, img, 60, 60, s, s); c.restore();
  rr(c, 60.5, 60.5, s - 1, s - 1, r); c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 1.5; c.stroke();
  return cv;
}
function makeLP(img, R) { // 커버 뒤 LP판
  const vin = mk(R * 2, R * 2), v = vin.getContext('2d');
  v.translate(R, R);
  const g = v.createRadialGradient(0, 0, R * .2, 0, 0, R); g.addColorStop(0, '#1b1b1d'); g.addColorStop(1, '#070708');
  v.beginPath(); v.arc(0, 0, R, 0, Math.PI * 2); v.fillStyle = g; v.fill();
  for (let r = R * .38; r < R - 4; r += 3.2) { v.beginPath(); v.arc(0, 0, r, 0, Math.PI * 2); v.strokeStyle = 'rgba(255,255,255,.03)'; v.lineWidth = 1; v.stroke(); }
  v.save(); v.beginPath(); v.arc(0, 0, R * .37, 0, Math.PI * 2); v.clip(); drawCoverFit(v, img, -R * .37, -R * .37, R * .74, R * .74); v.restore();
  v.beginPath(); v.arc(0, 0, R * .37, 0, Math.PI * 2); v.strokeStyle = 'rgba(0,0,0,.6)'; v.lineWidth = 3; v.stroke();
  v.beginPath(); v.arc(0, 0, 9, 0, Math.PI * 2); v.fillStyle = '#0b0b0c'; v.fill();
  return vin;
}
function makeDisc(img, R) { // 턴테이블: 커버가 원판 전체
  const d = mk(R * 2, R * 2), c = d.getContext('2d');
  c.translate(R, R);
  c.beginPath(); c.arc(0, 0, R, 0, Math.PI * 2); c.fillStyle = '#0c0c0d'; c.fill();
  c.save(); c.beginPath(); c.arc(0, 0, R - 14, 0, Math.PI * 2); c.clip(); drawCoverFit(c, img, -R, -R, R * 2, R * 2);
  for (let r = R * .22; r < R - 14; r += 6) { c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.strokeStyle = 'rgba(0,0,0,.10)'; c.lineWidth = 1.2; c.stroke(); }
  c.restore();
  c.beginPath(); c.arc(0, 0, R - 14, 0, Math.PI * 2); c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2; c.stroke();
  c.beginPath(); c.arc(0, 0, 34, 0, Math.PI * 2); c.fillStyle = 'rgba(10,10,12,.82)'; c.fill();
  c.beginPath(); c.arc(0, 0, 9, 0, Math.PI * 2); c.fillStyle = '#d9d6d0'; c.fill();
  return d;
}
function makeShadow(R) {
  const s = mk(R * 2 + 160, R * 2 + 160), c = s.getContext('2d');
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 60; c.shadowOffsetY = 20;
  c.beginPath(); c.arc(R + 80, R + 80, R, 0, Math.PI * 2); c.fillStyle = '#000'; c.fill();
  return s;
}
function makePolaroid(img, C, title) {
  const cv = mk(C.w + 120, C.h + 120), c = cv.getContext('2d'), o = 60;
  c.save(); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 46; c.shadowOffsetY = 18;
  rr(c, o, o, C.w, C.h, 6); c.fillStyle = '#f7f4ee'; c.fill(); c.restore();
  const m = (C.w - C.photo) / 2;
  drawCoverFit(c, img, o + m, o + m, C.photo, C.photo);
  c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 1; c.strokeRect(o + m + .5, o + m + .5, C.photo - 1, C.photo - 1);
  c.font = `600 34px ${FONT}`; c.fillStyle = '#2a2326'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(ellipsize(c, title || '', C.photo), o + C.w / 2, o + m + C.photo + (C.h - m - C.photo) / 2);
  return cv;
}

/* ====== 템플릿용 공통 도구 ====== */
function coverOf(t) { return t.coverBmp || defaultCover(S.accent); }
function makeBlurBg(img, opt = {}) { // 커버(또는 공통 배경)를 흐리고 어둡게 깐 배경
  const blur = opt.blur ?? S.blur, dim = opt.dim ?? S.dim;
  const bg = mk(W, H), b = bg.getContext('2d');
  b.fillStyle = '#0b0a0c'; b.fillRect(0, 0, W, H);
  const pad = blur * 2;
  b.filter = blur ? `blur(${blur}px)` : 'none';
  drawCoverFit(b, opt.useCommon === false ? img : (state.bg || img), -pad, -pad, W + pad * 2, H + pad * 2);
  b.filter = 'none';
  b.fillStyle = `rgba(0,0,0,${dim / 100})`; b.fillRect(0, 0, W, H);
  if (opt.vignette !== false) {
    const vg = b.createRadialGradient(W * .45, H * .5, H * .3, W * .5, H * .5, W * .75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)');
    b.fillStyle = vg; b.fillRect(0, 0, W, H);
  }
  return bg;
}
function fitTitle(t, index, T) { // 제목을 정해진 너비·줄 수에 맞게 글자 크기 조절
  const m = mk(10, 10).getContext('2d'), sc = S.titleScale / 100;
  const tMax = Math.round(T.max * sc), tMin = Math.round(T.min * sc);
  const prefix = S.trackNo && !T.noNumber ? String(index + 1).padStart(2, '0') + '  ' : '';
  const titleText = prefix + (t.title || '제목 없음');
  let size = tMax, lines;
  for (; size >= tMin; size -= 2) { m.font = `800 ${size}px ${FONT}`; lines = wrap(m, titleText, T.w); if (lines.length <= T.lines) break; }
  size = Math.max(size, tMin); m.font = `800 ${size}px ${FONT}`;
  if (lines.length > T.lines) { const keep = lines.slice(0, T.lines); keep[T.lines - 1] = ellipsize(m, lines.slice(T.lines - 1).join(' '), T.w); lines = keep; }
  return { size, lines, prefix: prefix.trimEnd() };
}
function wrapCues(cues, Lr) { // 가사를 큰 글씨/작은 글씨 기준으로 각각 줄바꿈
  const m = mk(10, 10).getContext('2d');
  return cues.map(q => {
    m.font = `700 ${Lr.big}px ${FONT}`; const big = wrap(m, q.text, Lr.w);
    m.font = `500 ${Lr.small}px ${FONT}`; const small = wrap(m, q.text, Lr.w);
    return { ...q, big, small };
  });
}
function hsv2rgb(h, s, v) {
  const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}
function extractPalette(img) { // 커버에서 대표 색을 뽑아 배경·라벨용 색 세트 만들기
  const c = mk(48, 48), x = c.getContext('2d', { willReadFrequently: true });
  drawCoverFit(x, img, 0, 0, 48, 48);
  const d = x.getImageData(0, 0, 48, 48).data, bins = Array.from({ length: 18 }, () => ({ w: 0, h: 0, s: 0 }));
  let total = 0, ar = 0, ag = 0, ab = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), v = mx, s = mx ? (mx - mn) / mx : 0;
    ar += r; ag += g; ab += b; total++;
    if (s < .12 || v < .12) continue;
    let h = 0; const dl = mx - mn;
    if (dl) h = mx === r ? 60 * (((g - b) / dl) % 6) : mx === g ? 60 * ((b - r) / dl + 2) : 60 * ((r - g) / dl + 4);
    if (h < 0) h += 360;
    const w = s * (v > .95 ? .4 : 1), bin = bins[Math.floor(h / 20) % 18];
    bin.w += w; bin.h += h * w; bin.s += s * w;
  }
  const best = bins.reduce((a, b) => b.w > a.w ? b : a);
  let h, s;
  if (best.w < total * .04) { // 거의 흑백인 이미지 → 평균색의 색조 사용
    const r = ar / total, g = ag / total, b = ab / total, mx = Math.max(r, g, b), mn = Math.min(r, g, b), dl = mx - mn;
    h = !dl ? 220 : mx === r ? 60 * (((g - b) / dl) % 6) : mx === g ? 60 * ((b - r) / dl + 2) : 60 * ((r - g) / dl + 4); if (h < 0) h += 360;
    s = Math.min(.25, mx ? dl / mx : 0);
  } else { h = best.h / best.w; s = best.s / best.w; }
  const S1 = Math.min(s, .62);
  const rgb = a => `rgb(${a.join(',')})`;
  const pal = { h, s, deep: hsv2rgb(h, S1 * .9, .17), mid: hsv2rgb(h, S1, .34), soft: hsv2rgb(h, S1 * .7, .62), light: hsv2rgb(h, Math.min(.5, S1 + .1), .93), vivid: hsv2rgb(h, Math.max(.45, S1), .88) };
  pal.css = k => rgb(pal[k]);
  return pal;
}
const mixRgb = (a, b, k) => `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
function curvedText(ctx, text, cx, cy, r, start, size, color, weight = 700, spacing = 1.15) { // 원 둘레를 따라 글자 쓰기 (LP 라벨용)
  ctx.save(); ctx.font = `${weight} ${size}px ${FONT}`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let a = start;
  for (const ch of text) {
    const w = ctx.measureText(ch).width * spacing, da = w / r;
    ctx.save(); ctx.translate(cx + Math.cos(a + da / 2) * r, cy + Math.sin(a + da / 2) * r); ctx.rotate(a + da / 2 + Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore();
    a += da;
  }
  ctx.restore();
}
function bassOf(res, t) { const f = specFn(res, t); let b = 0; for (let i = 0; i < 6; i++) b += f(i) / 6; return b; }
function drawPlayerIcons(ctx, x, cy, size, color) { // ⏮ ⏸ ⏭ 작은 아이콘 묶음 (x = 왼쪽 시작)
  ctx.save(); ctx.fillStyle = color; const s = size;
  ctx.beginPath(); ctx.moveTo(x + s * .9, cy - s * .5); ctx.lineTo(x + s * .25, cy); ctx.lineTo(x + s * .9, cy + s * .5); ctx.closePath(); ctx.fill(); ctx.fillRect(x, cy - s * .5, s * .16, s);
  const px = x + s * 1.8; ctx.fillRect(px, cy - s * .5, s * .26, s); ctx.fillRect(px + s * .48, cy - s * .5, s * .26, s);
  const nx = x + s * 3.3; ctx.beginPath(); ctx.moveTo(nx, cy - s * .5); ctx.lineTo(nx + s * .65, cy); ctx.lineTo(nx, cy + s * .5); ctx.closePath(); ctx.fill(); ctx.fillRect(nx + s * .74, cy - s * .5, s * .16, s);
  ctx.restore();
  return x + s * 4.3;
}

/* ====== 화면 그리기: 템플릿 연결부 ====== */
function prepare(t, index, total) {
  // 곡 분석 상태·가사·커버가 바뀌면 다른 열쇠가 되어 새로 만듦 (분석 중에 만든 자료가 남지 않도록)
  const key = [t.id, state.settingsVer, index, total, t.status, t.duration, t.cues.length, t.coverBmp ? t.coverBmp.width : 0, t.title].join(':');
  if (resCache.has(key)) { const r = resCache.get(key); resCache.delete(key); resCache.set(key, r); return r; }
  const res = TPL.prepare(t, index, total) || {};
  Object.assign(res, { track: t, duration: t.duration, spec: t.spec, index, total });
  resCache.set(key, res);
  while (resCache.size > 24) resCache.delete(resCache.keys().next().value); // 메모리 보호
  return res;
}

function specFn(res, t) {
  if (!res.spec) return () => 0;
  const pos = clamp(t * FPS, 0, res.spec.frames - 1), f0 = Math.floor(pos), f1 = Math.min(res.spec.frames - 1, f0 + 1), k = pos - f0, d = res.spec.data;
  return i => (d[f0 * BARS + i] * (1 - k) + d[f1 * BARS + i] * k) / 255;
}

const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const THUMB = new Path2D('M2 10h4v12H2z M8 22h9.5a2 2 0 0 0 2-1.6l1.8-8A2 2 0 0 0 19.3 10H14l.9-4.3A2.3 2.3 0 0 0 12.6 3L8 9.5z');
const BELL = new Path2D('M12 2a6 6 0 0 0-6 6v4.5L4 16v1h16v-1l-2-3.5V8a6 6 0 0 0-6-6z M9.5 19a2.5 2.5 0 0 0 5 0z');
const CURSOR = new Path2D('M0 0 L0 34 L9 26 L15 40 L21 37 L15 24 L27 24 Z');
function drawSubscribe(ctx, gt) {
  if (!S.sub || gt == null) return;
  const u = gt - S.subStart, D = S.subDur;
  if (u < 0 || u > D) return;
  const a = Math.min(ease(clamp(u / .6)), ease(clamp((D - u) / .6)));
  const C = 5.5, cycles = Math.max(1, Math.floor((D - .6) / C));
  const v = u < cycles * C ? u % C : C; // 5.5초마다 클릭 동작 반복, 남는 시간은 완료 상태 유지
  const liked = v > 1.75, subbed = v > 3.35, H = 64, top = 44, right = 1872, cy = top + H / 2;
  ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * 90, 0);
  ctx.font = `800 26px ${FONT}`; ctx.textBaseline = 'middle';
  const likeW = 26 + 34 + 12 + ctx.measureText('Liked').width + 28, subW = 60 + ctx.measureText('SUBSCRIBED').width, gap = 14;
  const lx = right - (likeW + gap + subW + gap + H), lcx = lx + likeW / 2, sx = lx + likeW + gap, scx = sx + subW / 2, bx = sx + subW + gap + H / 2;
  const press = t0 => (v > t0 - .12 && v < t0 + .12) ? .92 : 1;
  const pill = (x, w, fill, cx0, t0, inner) => {
    ctx.save(); const k = press(t0); ctx.translate(cx0, cy); ctx.scale(k, k); ctx.translate(-cx0, -cy);
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18; rr(ctx, x, top, w, H, H / 2); ctx.fillStyle = fill; ctx.fill(); ctx.shadowBlur = 0;
    inner(); ctx.restore();
  };
  pill(lx, likeW, 'rgba(255,255,255,.96)', lcx, 1.75, () => {
    ctx.save(); ctx.translate(lx + 26, cy - 17); ctx.scale(34 / 24, 34 / 24); ctx.fillStyle = liked ? S.accent : '#1b1b1f';
    if (liked) ctx.fill(THUMB); else { ctx.lineWidth = 2; ctx.strokeStyle = '#1b1b1f'; ctx.lineJoin = 'round'; ctx.stroke(THUMB); }
    ctx.restore();
    ctx.fillStyle = '#1b1b1f'; ctx.textAlign = 'left'; ctx.fillText(liked ? 'Liked' : 'Like', lx + 72, cy + 1);
  });
  pill(sx, subW, subbed ? 'rgba(58,58,62,.94)' : '#e5262b', scx, 3.35, () => {
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(subbed ? 'SUBSCRIBED' : 'SUBSCRIBE', scx, cy + 1);
  });
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(bx, cy, H / 2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.96)'; ctx.fill(); ctx.shadowBlur = 0;
  let ang = 0; if (v > 3.6 && v < 4.6) { const k = v - 3.6; ang = Math.sin(k * 28) * .45 * (1 - k); }
  ctx.save(); ctx.translate(bx, cy - 4); ctx.rotate(ang); ctx.scale(34 / 24, 34 / 24); ctx.translate(-12, -9); ctx.fillStyle = subbed ? S.accent : '#1b1b1f'; ctx.fill(BELL); ctx.restore();
  const P0 = [right + 30, top + 170], P1 = [lcx + 6, cy + 6], P2 = [scx + 10, cy + 6], P3 = [right + 40, top + 200];
  let cp = null, ca = 1;
  if (v >= .8 && v < 1.6) cp = lerp2(P0, P1, ease(clamp((v - .8) / .8)));
  else if (v >= 1.6 && v < 2.3) cp = P1;
  else if (v >= 2.3 && v < 3.2) cp = lerp2(P1, P2, ease(clamp((v - 2.3) / .9)));
  else if (v >= 3.2 && v < 3.9) cp = P2;
  else if (v >= 3.9 && v < 4.7) { cp = lerp2(P2, P3, ease(clamp((v - 3.9) / .8))); ca = 1 - clamp((v - 3.9) / .8); }
  if (cp) {
    ctx.globalAlpha = a * ca * clamp((v - .8) / .3);
    const k = ((v > 1.63 && v < 1.87) || (v > 3.23 && v < 3.47) ? .86 : 1) * 1.1;
    ctx.save(); ctx.translate(cp[0], cp[1]); ctx.scale(k, k);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 8; ctx.fill(CURSOR); ctx.shadowBlur = 0; ctx.stroke(CURSOR); ctx.restore();
  }
  ctx.restore();
}
/* ====== 날씨 효과 (눈 · 비 · 반짝임) ====== */
const FX = { none: '없음', snow: '❄ 눈', rain: '☔ 비', sparkle: '✨ 반짝임' };
const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }; // 매 프레임 같은 위치 계산(미리보기=영상)
let glowSprite = null;
function glow() {
  if (glowSprite) return glowSprite;
  const c = mk(64, 64), x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); return glowSprite = c;
}
function drawFx(ctx, gt) {
  if (!S.fx || S.fx === 'none') return;
  const amt = S.fxAmount / 100, sp = glow();
  ctx.save();
  if (S.fx === 'snow') {
    const n = Math.round(50 + 350 * amt);
    for (let i = 0; i < n; i++) {
      const z = rnd(i, 1), r = 2.5 + z * z * 11, speed = 28 + z * 85, sway = 18 + z * 40;
      const y = (rnd(i, 2) * (H + 40) + gt * speed) % (H + 40) - 20;
      const x = ((rnd(i, 3) * (W + 80) + Math.sin(gt * (.35 + rnd(i, 4) * .6) + rnd(i, 5) * 6.28) * sway + gt * 10) % (W + 80) + (W + 80)) % (W + 80) - 40;
      ctx.globalAlpha = .3 + .55 * z; ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    }
  } else if (S.fx === 'rain') {
    const n = Math.round(90 + 450 * amt), slant = .16; ctx.lineCap = 'round';
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath(); ctx.strokeStyle = `rgba(205,222,255,${.16 + layer * .12})`; ctx.lineWidth = 1 + layer * .8;
      for (let i = layer; i < n; i += 3) {
        const z = (layer + rnd(i, 1)) / 3, len = 20 + z * 36, speed = 950 + z * 700;
        const y = (rnd(i, 2) * (H + 200) + gt * speed) % (H + 200) - 100;
        const x = (rnd(i, 3) * (W + 300) + y * slant) % (W + 300) - 150;
        ctx.moveTo(x, y); ctx.lineTo(x - len * slant, y - len);
      }
      ctx.stroke();
    }
  } else if (S.fx === 'sparkle') {
    const n = Math.round(18 + 110 * amt); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const per = 2.5 + rnd(i, 1) * 4, pos = gt + rnd(i, 2) * per, cyc = Math.floor(pos / per), ph = (pos % per) / per;
      const x = rnd(i, 3 + cyc * 7) * W, y = rnd(i, 4 + cyc * 7) * H - ph * 30, a = Math.sin(ph * Math.PI), r = 2 + rnd(i, 5) * 4;
      ctx.globalAlpha = a * .55; ctx.drawImage(sp, x - r * 3, y - r * 3, r * 6, r * 6);
      ctx.globalAlpha = a * .9; ctx.lineWidth = 1.4; const L = r * 3.2 * a;
      ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawFrame(ctx, res, t, fade = 1, gt = null, fc = null) {
  ctx.save(); TPL.draw(ctx, res, t, fc || { gt: gt == null ? t : gt, plan: null, k: 0, getRes: () => null }); ctx.restore();
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.filter = 'none';
  drawFx(ctx, gt == null ? t : gt);
  if (fade < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - fade})`; ctx.fillRect(0, 0, W, H); }
  drawSubscribe(ctx, gt);
}
function renderAt(ctx, plan, k, t, fade = 1) { // 재생 목록의 k번째 곡, 곡 안의 t초 화면
  const seg = plan[k], res = prepare(seg.t, seg.i, seg.n);
  const fc = { plan, k, gt: seg.start / FPS + t, inGap: t > seg.t.duration, getRes: j => plan[j] ? prepare(plan[j].t, plan[j].i, plan[j].n) : null };
  drawFrame(ctx, res, TPL.continuous ? t : Math.min(t, seg.t.duration), fade, fc.gt, fc);
}

function drawBars(ctx, res, t, B, A, p) {
  const fr = specFn(res, t), bw = Math.max(3, Math.min(6, B.w / BARS * .55)), gap = (B.w - BARS * bw) / (BARS - 1);
  const style = S.bar;
  for (let i = 0; i < BARS; i++) {
    const e = fr(i), x = B.x + i * (bw + gap), lit = (i + .5) / BARS <= p;
    ctx.fillStyle = lit ? A : 'rgba(255,255,255,.88)';
    if (lit) { ctx.shadowColor = A; ctx.shadowBlur = 10; } else ctx.shadowBlur = 0;
    if (style === 'mirror') { const h = 4 + B.h * e; rr(ctx, x, B.base - B.h / 2 - h / 2, bw, h, bw / 2); ctx.fill(); }
    else if (style === 'dots') {
      const step = bw + 3, n = Math.max(1, Math.round(e * Math.floor(B.h / step)));
      ctx.beginPath(); for (let k = 0; k < n; k++) { const y = B.base - bw / 2 - k * step; ctx.moveTo(x + bw, y); ctx.arc(x + bw / 2, y, bw / 2, 0, Math.PI * 2); } ctx.fill();
    } else { const h = 6 + B.h * e; rr(ctx, x, B.base - h, bw, h, bw / 2); ctx.fill(); }
  }
  ctx.shadowBlur = 0;
}
function drawProgress(ctx, res, t, P, A, p) {
  const th = P.knob ? 6 : 5;
  rr(ctx, P.x, P.y - th / 2, P.w, th, th / 2); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fill();
  rr(ctx, P.x, P.y - th / 2, Math.max(th, P.w * p), th, th / 2); ctx.fillStyle = A; ctx.fill();
  if (P.knob) { ctx.beginPath(); ctx.arc(P.x + P.w * p, P.y, 10, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0; }
  ctx.font = `500 24px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.85)';
  if (P.times === 'below') {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left'; ctx.fillText(clock(t), P.x, P.y + 20);
    ctx.textAlign = 'right'; ctx.fillText(clock(res.duration), P.x + P.w, P.y + 20);
  } else if (P.times === 'side') {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right'; ctx.fillText(clock(t), P.x - 26, P.y);
    ctx.textAlign = 'left'; ctx.fillText(clock(res.duration), P.x + P.w + 26, P.y);
  } else if (P.times) {
    ctx.textBaseline = 'top'; ctx.textAlign = P.times.align; ctx.fillText(`${clock(t)} / ${clock(res.duration)}`, P.times.x, P.times.y);
  }
  ctx.textAlign = 'left';
}
function drawTitle(ctx, res, T, A) {
  ctx.textAlign = T.align; ctx.textBaseline = 'top';
  if (T.label) {
    const label = (S.label || 'NOW PLAYING') + (res.total > 1 ? `  ·  ${String(res.index + 1).padStart(2, '0')} / ${String(res.total).padStart(2, '0')}` : '');
    ctx.font = `700 ${T.label.size || 26}px ${FONT}`; ctx.fillStyle = T.labelColor || A;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
    ctx.fillText(label.toUpperCase(), T.label.x, T.label.y);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }
  let y = T.y;
  ctx.font = `800 ${res.title.size}px ${FONT}`; ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 16;
  res.title.lines.forEach((ln, li) => {
    const pre = res.title.prefix;
    if (li === 0 && pre && ln.startsWith(pre)) {
      const rest = ln.slice(pre.length).trimStart(), gap = res.title.size * .42;
      const wp = ctx.measureText(pre).width, wr = ctx.measureText(rest).width;
      const x0 = T.align === 'center' ? T.x - (wp + gap + wr) / 2 : T.x;
      ctx.textAlign = 'left';
      ctx.fillStyle = A; ctx.fillText(pre, x0, y);
      ctx.fillStyle = '#fff'; ctx.fillText(rest, x0 + wp + gap, y);
      ctx.textAlign = T.align;
    } else ctx.fillText(ln, T.x, y);
    y += res.title.size * 1.16;
  });
  ctx.shadowBlur = 0;
  if (S.artist) { const as = T.artistSize || 32; y += as * .25; ctx.font = `500 ${as}px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.fillText(S.artist, T.x, y); y += as * 1.35; }
  if (T.divider) { y += 18; rr(ctx, T.align === 'center' ? T.x - 36 : T.x, y, 72, 5, 2.5); ctx.fillStyle = A; ctx.fill(); y += 5; }
  ctx.textAlign = 'left';
  return y;
}
function drawControls(ctx, cx, cy, A) {
  ctx.save(); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(cx, cy, 38, 0, Math.PI * 2); ctx.strokeStyle = A; ctx.shadowColor = A; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillRect(cx - 11, cy - 14, 7, 28); ctx.fillRect(cx + 4, cy - 14, 7, 28);
  const tri = (x, dir) => { ctx.beginPath(); ctx.moveTo(x + 10 * dir, cy - 14); ctx.lineTo(x - 10 * dir, cy); ctx.lineTo(x + 10 * dir, cy + 14); ctx.closePath(); ctx.fill(); ctx.fillRect(dir > 0 ? x - 14 : x + 10, cy - 14, 4, 28); };
  tri(cx - 105, 1); tri(cx + 105, -1);
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 3;
  const sx = cx - 215;
  ctx.beginPath(); ctx.moveTo(sx - 16, cy - 10); ctx.bezierCurveTo(sx - 2, cy - 10, sx + 2, cy + 10, sx + 16, cy + 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx - 16, cy + 10); ctx.bezierCurveTo(sx - 2, cy + 10, sx + 2, cy - 10, sx + 16, cy - 10); ctx.stroke();
  for (const yy of [-10, 10]) { ctx.beginPath(); ctx.moveTo(sx + 10, cy + yy - 6); ctx.lineTo(sx + 17, cy + yy); ctx.lineTo(sx + 10, cy + yy + 6); ctx.stroke(); }
  const hx = cx + 215, hy = cy + 2;
  ctx.beginPath(); ctx.moveTo(hx, hy + 13);
  ctx.bezierCurveTo(hx - 24, hy - 2, hx - 13, hy - 22, hx, hy - 9);
  ctx.bezierCurveTo(hx + 13, hy - 22, hx + 24, hy - 2, hx, hy + 13); ctx.stroke();
  ctx.restore();
}

function drawLyrics(ctx, res, t, A, Lr) {
  const cues = res.lyr; if (!cues.length) return;
  const emph = cues.map((c, i) => {
    if (t < c.start) return 0;
    const end = Math.min(c.end, cues[i + 1] ? cues[i + 1].start : c.end);
    return Math.min(clamp((t - c.start) / 0.25), clamp(1 - (t - end) / 0.3));
  });
  const sizes = emph.map(e => Lr.small + (Lr.big - Lr.small) * e);
  const heights = cues.map((c, i) => (c.small.length * Lr.small + (c.big.length * Lr.big - c.small.length * Lr.small) * emph[i]) * LYR_LH);
  const centers = []; let acc = 0;
  for (let i = 0; i < cues.length; i++) { centers.push(acc + heights[i] / 2); acc += heights[i] + LYR_GAP; }
  const look = t + 0.15;
  let f = -1; for (let i = 0; i < cues.length; i++) if (cues[i].start <= look) f = i;
  let center;
  if (f <= 0) center = centers[0];
  else { const pr = ease(clamp((look - cues[f].start) / 0.45)); center = centers[f - 1] + (centers[f] - centers[f - 1]) * pr; }
  const [ar, ag, ab] = hexRgb(A), style = S.lyric;
  const tx = Lr.align === 'center' ? Lr.x + Lr.w / 2 : Lr.x;
  ctx.save();
  ctx.beginPath(); ctx.rect(Lr.x - 40, Lr.top, Lr.w + 80, Lr.bottom - Lr.top); ctx.clip();
  ctx.textBaseline = 'middle'; ctx.textAlign = Lr.align;
  for (let i = 0; i < cues.length; i++) {
    const cy = Lr.anchor + (centers[i] - center);
    if (cy < Lr.top - 200 || cy > Lr.bottom + 200) continue;
    const d = cy - Lr.anchor, top = cy - heights[i] / 2, bot = cy + heights[i] / 2, e = emph[i];
    const edge = (d < 0 ? clamp(1 + d / 220) : clamp(1 - (d - 30) / 360)) * clamp((top - Lr.top) / 70) * clamp((Lr.bottom - bot) / 70);
    const dist = edge + (1 - edge) * e, a = (0.42 + 0.58 * e) * dist;
    if (a <= 0.01) continue;
    const s = sizes[i], lines = e > .5 ? cues[i].big : cues[i].small;
    ctx.font = `${e > .5 ? 700 : 500} ${s}px ${FONT}`;
    let ly = cy - lines.length * s * LYR_LH / 2 + s * LYR_LH / 2;
    for (const ln of lines) {
      ctx.shadowBlur = 0;
      if (style === 'box') {
        if (e > 0.02) {
          const w = ctx.measureText(ln).width, bx = Lr.align === 'center' ? tx - w / 2 - 16 : tx - 16;
          ctx.globalAlpha = e * dist; rr(ctx, bx, ly - s * .64, w + 32, s * 1.28, 10); ctx.fillStyle = A; ctx.fill(); ctx.globalAlpha = 1;
        }
        ctx.fillStyle = e > .5 ? `rgba(24,18,22,${dist})` : `rgba(255,255,255,${a})`;
      } else if (style === 'color') {
        ctx.fillStyle = `rgba(${Math.round(255 + (ar - 255) * e)},${Math.round(255 + (ag - 255) * e)},${Math.round(255 + (ab - 255) * e)},${a})`;
        if (e > 0.05) { ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 12; }
      } else {
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        if (e > 0.05) { ctx.shadowColor = A; ctx.shadowBlur = 22 * e; }
      }
      ctx.fillText(ln, tx, ly); ly += s * LYR_LH;
    }
  }
  ctx.restore();
}

/* ====== 예시 곡 (파일을 넣기 전 템플릿 미리보기용) ====== */
function demoCover(h, k) {
  const c = mk(800, 800), x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 800); g.addColorStop(0, `hsl(${h},62%,70%)`); g.addColorStop(1, `hsl(${(h + 40) % 360},50%,30%)`);
  x.fillStyle = g; x.fillRect(0, 0, 800, 800);
  x.fillStyle = `hsla(${(h + 20) % 360},90%,92%,.95)`; x.beginPath(); x.arc(250 + k * 70, 300 - k * 20, 120 + k * 10, 0, Math.PI * 2); x.fill();
  for (let L = 0; L < 3; L++) {
    x.fillStyle = `hsla(${(h + 200) % 360},35%,${22 - L * 6}%,${.55 + L * .2})`; x.beginPath(); x.moveTo(0, 800);
    for (let i = 0; i <= 10; i++) x.lineTo(i * 80, 560 + L * 70 + Math.sin(i * 1.3 + k + L) * 50);
    x.lineTo(800, 800); x.closePath(); x.fill();
  }
  return c;
}
const DEMO_TRACKS = (() => {
  const dur = 30, frames = dur * FPS, data = new Uint8Array(frames * BARS);
  for (let f = 0; f < frames; f++) for (let b = 0; b < BARS; b++) {
    const beat = Math.exp(-((f % 15) / 5)), env = Math.pow(1 - b / BARS, 1.3);
    const v = clamp(env * (0.45 + 0.35 * beat) + 0.18 * Math.sin(f * 0.17 + b * 0.5) * (1 - b / BARS) + 0.08 * Math.sin(f * 0.41 + b * 1.7));
    data[f * BARS + b] = Math.round(v * 255);
  }
  const spec = { frames, data };
  const lines = ['예시 화면입니다 · Sample preview', '곡을 넣으면 실제 음원과 가사로 바뀝니다', 'Every little light along the way', '템플릿과 색을 바꿔 보세요', 'Hold me close tonight', '마음에 드는 조합을 찾으면 영상 만들기'];
  const cues = []; for (let i = 0; i < 6; i++) cues.push({ start: 1.5 + i * 4.6, end: 5.8 + i * 4.6, text: lines[i] });
  return [['Sample Song One', 20], ['Midnight Letter', 205], ['Golden Hour', 35], ['Blue Window', 175], ['Snow Avenue', 280]]
    .map(([title, h], k) => ({ id: -(k + 1), title, duration: dur, spec, cues, coverBmp: demoCover(h, k), status: 'ready', demo: true }));
})();

/* ====== 미리보기 ====== */
const view = $('view'), vctx = view.getContext('2d');
let pvAudio = null, pvURL = null, pvRAF = 0, pvTime = 0, demoRAF = 0;
function readyTracks() { return state.tracks.filter(t => t.status === 'ready'); }
function selectTrack(i) { stopPreview(); state.sel = i; pvTime = 0; renderList(); refreshAll(); }
function stopPreview() {
  if (demoRAF) { cancelAnimationFrame(demoRAF); demoRAF = 0; }
  cancelAnimationFrame(pvRAF); pvRAF = 0;
  if (pvAudio) { pvAudio.pause(); pvAudio = null; }
  if (pvURL) { URL.revokeObjectURL(pvURL); pvURL = null; }
  $('pvPlay').textContent = '▶ 재생';
}
function demoTotal() { const p = planFor(DEMO_TRACKS); return (p[p.length - 1].start + p[p.length - 1].frames) / FPS; }
function drawPreview() {
  if (!state.tracks.length) { // 곡이 없으면 예시 곡 5개로 템플릿 미리보기 (곡 전환 연출까지)
    const plan = planFor(DEMO_TRACKS), total = demoTotal(), g = ((pvTime % total) + total) % total;
    let k = plan.findIndex(p => g < (p.start + p.frames) / FPS); if (k < 0) k = plan.length - 1;
    renderAt(vctx, plan, k, g - plan[k].start / FPS, 1);
    $('pvTime').textContent = `${clock(g)} / ${clock(total)} (예시)`;
    $('pvSeek').value = Math.round(g / total * 1000);
    return;
  }
  const t = state.tracks[state.sel];
  if (!t || t.status !== 'ready') {
    vctx.fillStyle = '#141216'; vctx.fillRect(0, 0, W, H);
    vctx.fillStyle = 'rgba(255,255,255,.6)'; vctx.font = `500 44px ${FONT}`; vctx.textAlign = 'center'; vctx.textBaseline = 'middle';
    vctx.fillText('음원을 분석하고 있습니다…', W / 2, H / 2); vctx.textAlign = 'left';
    return;
  }
  const plan = segPlan(), k = plan.findIndex(p => p.t === t);
  renderAt(vctx, plan, Math.max(0, k), pvTime, 1);
  $('pvTime').textContent = `${clock(pvTime)} / ${clock(t.duration)}`;
  $('pvSeek').value = t.duration ? Math.round(pvTime / t.duration * 1000) : 0;
}
$('pvPlay').onclick = () => {
  if (!state.tracks.length) { // 예시: 소리 없이 움직임과 곡 전환만 재생
    if (demoRAF) { cancelAnimationFrame(demoRAF); demoRAF = 0; $('pvPlay').textContent = '▶ 재생'; return; }
    $('pvPlay').textContent = '❚❚ 멈춤'; let last = performance.now();
    const loop = now => { pvTime = (pvTime + (now - last) / 1000) % demoTotal(); last = now; drawPreview(); demoRAF = requestAnimationFrame(loop); };
    demoRAF = requestAnimationFrame(loop); return;
  }
  const t = state.tracks[state.sel];
  if (!t || t.status !== 'ready') return;
  if (pvAudio) { stopPreview(); return; }
  pvURL = URL.createObjectURL(t.audio); pvAudio = new Audio(pvURL); pvAudio.currentTime = pvTime;
  pvAudio.play(); $('pvPlay').textContent = '❚❚ 멈춤';
  pvAudio.onended = () => { stopPreview(); };
  const loop = () => { if (!pvAudio) return; pvTime = pvAudio.currentTime; drawPreview(); pvRAF = requestAnimationFrame(loop); };
  loop();
};
$('pvSeek').oninput = e => {
  if (!state.tracks.length) { pvTime = demoTotal() * e.target.value / 1000; drawPreview(); return; }
  const t = state.tracks[state.sel]; if (!t) return;
  pvTime = t.duration * e.target.value / 1000;
  if (pvAudio) pvAudio.currentTime = pvTime; else drawPreview();
};
$('pvTrack').onchange = e => selectTrack(+e.target.value);

/* ====== 타임라인 / 상태 ====== */
function timeline() {
  const ok = state.tracks.every(t => t.status === 'ready');
  if (!state.tracks.length || !ok) return '';
  const plan = segPlan(), total = plan.reduce((a, x) => a + x.frames, 0) / FPS, longF = total >= 3600;
  return plan.map(p => `${clock(p.start / FPS, longF)} ${S.trackNo ? String(p.i + 1).padStart(2, '0') + ' ' : ''}${p.t.title}`).join('\n');
}
function planFor(list) { // 반복 횟수만큼 곡 목록을 이어 붙인 실제 재생 순서
  const items = [], n = Math.max(1, Math.round(S.repeat) || 1);
  for (let r = 0; r < n; r++) list.forEach((t, i) => items.push({ t, i, n: list.length }));
  let start = 0;
  return items.map((it, k) => {
    const tf = Math.ceil(it.t.duration * FPS - 1e-6), gf = k < items.length - 1 ? Math.round(S.gap * FPS) : 0;
    const p = { ...it, trackFrames: tf, gapFrames: gf, frames: tf + gf, start }; start += tf + gf; return p;
  });
}
function segPlan() { return planFor(state.tracks); }

function refreshAll() {
  const sel = $('pvTrack');
  sel.innerHTML = state.tracks.map((t, i) => `<option value="${i}">${String(i + 1).padStart(2, '0')}. ${t.title.replace(/</g, '&lt;')}</option>`).join('');
  sel.value = state.sel; sel.hidden = !state.tracks.length;
  $('timeline').value = timeline();
  const ready = state.tracks.length && state.tracks.every(t => t.status === 'ready');
  $('makeBtn').disabled = !ready || exporting;
  if (!exporting) {
    if (!state.tracks.length) setStatus('곡을 넣으면 시작할 수 있습니다.');
    else if (!ready) setStatus(state.tracks.some(t => t.status === 'error') ? '읽을 수 없는 음원이 있습니다. 해당 곡을 빼고 다시 시도해 주세요.' : '음원을 분석하고 있습니다…', state.tracks.some(t => t.status === 'error') ? 'err' : '');
    else {
      const total = segPlan().reduce((a, x) => a + x.frames, 0) / FPS;
      setStatus(`준비 완료 · ${state.tracks.length}곡 · 총 ${clock(total)}`);
    }
  }
  if (!pvAudio && !demoRAF) drawPreview();
}
function setStatus(msg, cls = '') { const s = $('status'); s.textContent = msg; s.className = cls; }

/* ====== 설정 입력 ====== */
function loadSettings() {
  try { const v = JSON.parse(localStorage.getItem('lyricVideoMaker.' + TPL.id) || 'null'); if (v) for (const k of Object.keys(S)) if (k in v) S[k] = v[k]; } catch {}
  if (TPL.validate) TPL.validate(S);
}
function saveSettings() { try { localStorage.setItem('lyricVideoMaker.' + TPL.id, JSON.stringify(S)); } catch {} }
function changed() { syncUI(); invalidate(); refreshAll(); }
function syncUI() {
  $('sLabel').value = S.label; $('sArtist').value = S.artist;
  $('sGap').value = S.gap; $('vGap').textContent = (+S.gap).toFixed(1) + '초';
  $('sBlur').value = S.blur; $('vBlur').textContent = S.blur;
  $('sDim').value = S.dim; $('vDim').textContent = S.dim + '%';
  document.querySelectorAll('#optFx button').forEach(b => b.classList.toggle('on', b.dataset.k === (S.fx || 'none')));
  $('sFx').value = S.fxAmount; $('vFx').textContent = fxLabel(S.fxAmount); $('sFx').disabled = S.fx === 'none';
  $('sRepeat').value = S.repeat; $('vRepeat').textContent = S.repeat + '회';
  $('sSub').checked = !!S.sub; $('sSubStart').value = S.subStart; $('vSubStart').textContent = S.subStart + '초'; $('sSubDur').value = S.subDur; $('vSubDur').textContent = S.subDur + '초';
  $('sTitle').value = S.titleScale; $('vTitle').textContent = S.titleScale + '%'; $('sTrackNo').checked = !!S.trackNo;
  document.querySelectorAll('#optLyric button').forEach(b => b.classList.toggle('on', b.dataset.k === S.lyric));
  const note = TPL.barNote ? TPL.barNote(S) : null;
  document.querySelectorAll('#optBar button').forEach(b => { b.classList.toggle('on', !note && b.dataset.k === S.bar); b.disabled = !!note; });
  $('barNote').hidden = !note; $('barNote').textContent = note || '';
  document.querySelectorAll('#optColor .chip').forEach(b => b.classList.toggle('on', b.dataset.c.toLowerCase() === S.accent.toLowerCase()));
  $('sAccent').value = S.accent;
  if (TPL.syncUI) TPL.syncUI();
}
function fxLabel(v) { return v <= 30 ? '살짝' : v <= 70 ? '보통' : '많이'; }
(function buildOptions() {
  $('tplName').textContent = TPL.name; $('tplDesc').textContent = TPL.desc || ''; document.title = `리릭비디오 메이커 · ${TPL.name}`;
  $('optLyric').innerHTML = Object.entries(LYRIC_STYLES).map(([k, n]) => `<button data-k="${k}">${n}</button>`).join('');
  $('optFx').innerHTML = Object.entries(FX).map(([k, n]) => `<button data-k="${k}">${n}</button>`).join('');
  $('optBar').innerHTML = Object.entries(BAR_STYLES).map(([k, n]) => `<button data-k="${k}">${n}</button>`).join('');
  $('optColor').innerHTML = PALETTE.map(([n, c]) => `<button class="chip" data-c="${c}" title="${n}" aria-label="${n}" style="background:${c}"></button>`).join('') +
    '<label>직접 고르기 <input type="color" id="sAccent" value="#ff8fc8"></label>';
  document.querySelectorAll('#optFx button').forEach(b => b.onclick = () => { S.fx = b.dataset.k; changed(); });
  document.querySelectorAll('#optLyric button').forEach(b => b.onclick = () => { S.lyric = b.dataset.k; changed(); });
  document.querySelectorAll('#optBar button').forEach(b => b.onclick = () => { S.bar = b.dataset.k; changed(); });
  document.querySelectorAll('#optColor .chip').forEach(b => b.onclick = () => { S.accent = b.dataset.c; changed(); });
  if (TPL.buildUI) TPL.buildUI($('tplControls')); else $('tplControls').hidden = true;
  for (const id of TPL.hide || []) { const el = $(id); if (el) el.hidden = true; }
  $('shuffleBtn').onclick = () => {
    const pick = a => a[Math.floor(Math.random() * a.length)], info = [];
    if (TPL.shuffle) info.push(TPL.shuffle(pick));
    if (!(TPL.hide || []).includes('ctlLyric')) { S.lyric = pick(Object.keys(LYRIC_STYLES)); info.push(LYRIC_STYLES[S.lyric]); }
    if (!(TPL.hide || []).includes('ctlBar') && !(TPL.barNote && TPL.barNote(S))) { S.bar = pick(Object.keys(BAR_STYLES)); info.push(BAR_STYLES[S.bar] + ' 파형'); }
    const col = pick(PALETTE.filter(p => p[1] !== S.accent)); S.accent = col[1]; info.push(col[0]);
    changed();
    $('shuffleInfo').textContent = '→ ' + info.filter(Boolean).join(' · ');
  };
})();
const bind = (id, key, fmt, num) => $(id).addEventListener('input', e => {
  S[key] = num ? +e.target.value : e.target.value;
  if (fmt) $(fmt[0]).textContent = fmt[1](S[key]);
  if (key === 'accent') syncUI();
  invalidate(); refreshAll();
});
bind('sLabel', 'label'); bind('sArtist', 'artist'); bind('sAccent', 'accent');
bind('sGap', 'gap', ['vGap', v => v.toFixed(1) + '초'], true);
bind('sBlur', 'blur', ['vBlur', v => v], true);
bind('sDim', 'dim', ['vDim', v => v + '%'], true);
bind('sTitle', 'titleScale', ['vTitle', v => v + '%'], true);
bind('sFx', 'fxAmount', ['vFx', fxLabel], true);
bind('sRepeat', 'repeat', ['vRepeat', v => v + '회'], true);
bind('sSubStart', 'subStart', ['vSubStart', v => v + '초'], true);
bind('sSubDur', 'subDur', ['vSubDur', v => v + '초'], true);
$('sSub').addEventListener('change', e => { S.sub = e.target.checked; invalidate(); refreshAll(); });
$('sTrackNo').addEventListener('change', e => { S.trackNo = e.target.checked; invalidate(); refreshAll(); });
syncUI();

$('bgBtn').onclick = () => $('bgPick').click();
$('bgPick').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { state.bg = await createImageBitmap(f); $('bgInfo').textContent = `배경: ${f.name}`; $('bgClear').hidden = false; }
  catch { setStatus('배경 이미지를 열 수 없습니다.', 'err'); }
  invalidate(); refreshAll();
};
$('bgClear').onclick = () => { state.bg = null; $('bgPick').value = ''; $('bgInfo').textContent = '없으면 각 곡의 커버를 흐리게 깔아 배경으로 씁니다. 권장 크기 1920×1080 (16:9)'; $('bgClear').hidden = true; invalidate(); refreshAll(); };

/* ====== 파일 넣기 ====== */
const drop = $('drop');
drop.onclick = () => $('pick').click();
drop.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') $('pick').click(); };
$('pick').onchange = e => { addFiles(e.target.files); e.target.value = ''; };
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => addFiles(e.dataTransfer.files));
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => { e.preventDefault(); if (!drop.contains(e.target)) addFiles(e.dataTransfer.files); });
$('copyTl').onclick = async () => { try { await navigator.clipboard.writeText($('timeline').value); setStatus('타임라인을 복사했습니다.', 'ok'); } catch { $('timeline').select(); document.execCommand('copy'); } };

/* ====== MP4 만들기 ====== */
let exporting = false, cancelFlag = false;
$('cancelBtn').onclick = () => { cancelFlag = true; setStatus('중지하는 중…'); };
async function pickCodecs() {
  if (!('VideoEncoder' in window) || !('AudioEncoder' in window)) throw new Error('이 브라우저는 영상 만들기를 지원하지 않습니다. 최신 크롬(Chrome) 또는 엣지(Edge)를 사용해 주세요.');
  let video = null;
  for (const c of ['avc1.640028', 'avc1.4d0028', 'avc1.42e028']) {
    for (const hw of ['prefer-hardware', 'no-preference']) {
      const cfg = { codec: c, width: W, height: H, bitrate: 8_000_000, framerate: FPS, hardwareAcceleration: hw, avc: { format: 'avc' } };
      try { if ((await VideoEncoder.isConfigSupported(cfg)).supported) { video = cfg; break; } } catch {}
    }
    if (video) break;
  }
  if (!video) throw new Error('이 컴퓨터에서 H.264 영상 인코딩을 사용할 수 없습니다. 크롬을 최신 버전으로 업데이트해 주세요.');
  let audio = null;
  for (const [enc, mux] of [['mp4a.40.2', 'aac'], ['opus', 'opus']]) {
    const cfg = { codec: enc, sampleRate: SR, numberOfChannels: 2, bitrate: 192000 };
    try { if ((await AudioEncoder.isConfigSupported(cfg)).supported) { audio = { cfg, mux }; break; } } catch {}
  }
  if (!audio) throw new Error('이 브라우저에서 음성 인코딩을 사용할 수 없습니다.');
  return { video, audio };
}
$('makeBtn').onclick = async () => {
  if (exporting) return;
  stopPreview();
  let codecs;
  try { codecs = await pickCodecs(); } catch (e) { setStatus(e.message, 'err'); return; }
  const plan = segPlan(), totalFrames = plan.reduce((a, x) => a + x.frames, 0);
  const name = (state.tracks.length > 1 ? (S.label || 'playlist') : state.tracks[0].title).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim() || 'lyric-video';
  let target, writable = null, inMemory = false;
  if (window.showSaveFilePicker) {
    try {
      const h = await showSaveFilePicker({ suggestedName: `${name}_lyric-video.mp4`, types: [{ description: 'MP4 영상', accept: { 'video/mp4': ['.mp4'] } }] });
      writable = await h.createWritable();
      target = new Mp4Muxer.FileSystemWritableFileStreamTarget(writable);
    } catch (e) { if (e.name === 'AbortError') return; console.warn(e); }
  }
  if (!target) {
    if (totalFrames / FPS > 20 * 60 && !confirm('이 브라우저는 저장 위치 선택을 지원하지 않아 영상을 메모리에 만듭니다. 20분이 넘는 영상은 실패할 수 있습니다. 계속할까요?')) return;
    target = new Mp4Muxer.ArrayBufferTarget(); inMemory = true;
  }
  exporting = true; cancelFlag = false; $('makeBtn').disabled = true; $('cancelBtn').hidden = false;
  let wake = null; try { wake = await navigator.wakeLock?.request('screen'); } catch {}
  let failure = null, finalMsg = null;
  const fail = e => { failure = failure || e; };
  const muxer = new Mp4Muxer.Muxer({
    target, firstTimestampBehavior: 'offset',
    // 유튜브 권장: 목차(moov)를 파일 앞에 — 프레임 수를 미리 알기 때문에 앞자리를 예약해 둡니다
    fastStart: inMemory ? 'in-memory' : { expectedVideoChunks: totalFrames, expectedAudioChunks: Math.ceil(totalFrames * SPF / 480) + 64 },
    video: { codec: 'avc', width: W, height: H, frameRate: FPS },
    audio: { codec: codecs.audio.mux, numberOfChannels: 2, sampleRate: SR }
  });
  const venc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: fail });
  venc.configure(codecs.video);
  const aenc = new AudioEncoder({ output: (c, m) => muxer.addAudioChunk(c, m), error: fail });
  aenc.configure(codecs.audio.cfg);
  const canvas = mk(W, H), ctx = canvas.getContext('2d', { alpha: false });
  const started = performance.now();
  let frameNo = 0, sampleNo = 0;
  try {
    await fontReady;
    for (let k = 0; k < plan.length; k++) {
      const seg = plan[k], t = seg.t, i = seg.i;
      setStatus(`${k + 1}/${plan.length} “${t.title}” 음원 준비 중…`);
      const buf = await decodeAudio(t.audio);
      const chL = buf.getChannelData(0), chR = buf.numberOfChannels > 1 ? buf.getChannelData(1) : chL;
      const segStartSample = sampleNo, segStartFrame = frameNo;
      const pushAudio = upToFrame => {
        const endSample = upToFrame * SPF;
        while (sampleNo < endSample) {
          const n = Math.min(SR, endSample - sampleNo), data = new Float32Array(n * 2), off = sampleNo - segStartSample;
          for (let k = 0; k < n; k++) { const s = off + k; if (s < chL.length) { data[k] = chL[s]; data[n + k] = chR[s]; } }
          const ad = new AudioData({ format: 'f32-planar', sampleRate: SR, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round(sampleNo * 1e6 / SR), data });
          aenc.encode(ad); ad.close(); sampleNo += n;
        }
      };
      const fadeIn = 0.5, fadeOut = 0.5, isLast = k === plan.length - 1;
      for (let f = 0; f < seg.frames; f++) {
        if (cancelFlag) throw new Error('CANCEL');
        if (failure) throw failure;
        const tt = f / FPS;
        let fade;
        if (TPL.continuous) { const g = frameNo / FPS, end = totalFrames / FPS; fade = Math.min(clamp(g / fadeIn), clamp((end - g) / fadeOut)); }
        else {
          fade = clamp(tt / fadeIn);
          if (seg.gapFrames > 0 || isLast) fade = Math.min(fade, clamp((t.duration - tt) / fadeOut));
          if (f >= seg.trackFrames) fade = 0;
        }
        renderAt(ctx, plan, k, tt, fade);
        const vf = new VideoFrame(canvas, { timestamp: Math.round(frameNo * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
        venc.encode(vf, { keyFrame: frameNo % (FPS * 2) === 0 }); vf.close();
        frameNo++;
        if (frameNo % FPS === 0 || f === seg.frames - 1) pushAudio(frameNo);
        while (venc.encodeQueueSize > 8) await new Promise(r => venc.addEventListener('dequeue', r, { once: true }));
        if (frameNo % 15 === 0) {
          await yieldNow();
          const pct = frameNo / totalFrames, el = (performance.now() - started) / 1000, eta = el / pct - el;
          $('prog').style.width = (pct * 100).toFixed(1) + '%';
          setStatus(`${k + 1}/${plan.length} “${t.title}” 만드는 중 · ${Math.floor(pct * 100)}% · 남은 시간 약 ${clock(eta)}`);
        }
      }
    }
    setStatus('마무리 저장 중…');
    await venc.flush(); await aenc.flush();
    if (failure) throw failure;
    muxer.finalize();
    if (inMemory) {
      const blob = new Blob([target.buffer], { type: 'video/mp4' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${name}_lyric-video.mp4`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    } else await writable.close();
    $('prog').style.width = '100%';
    const took = (performance.now() - started) / 1000;
    finalMsg = [`완성되었습니다! 영상 길이 ${clock(totalFrames / FPS)} · 걸린 시간 ${clock(took)}${codecs.audio.mux === 'opus' ? ' (음성: Opus)' : ''}`, 'ok'];
    window.__lastExport = { ok: true, frames: frameNo, samples: sampleNo, audio: codecs.audio.mux, video: codecs.video.codec };
  } catch (e) {
    console.error(e);
    try { venc.close(); aenc.close(); } catch {}
    if (writable) { try { await writable.abort(); } catch {} }
    finalMsg = [e.message === 'CANCEL' ? '중지했습니다.' : `영상을 만들지 못했습니다: ${e.message || e}`, e.message === 'CANCEL' ? '' : 'err'];
    window.__lastExport = { ok: false, error: String(e && e.message || e) };
  } finally {
    exporting = false; $('cancelBtn').hidden = true; try { wake && wake.release(); } catch {}
    refreshAll();
    if (finalMsg) setStatus(...finalMsg);
  }
};

fontReady.then(() => { invalidate(); refreshAll(); });
refreshAll();