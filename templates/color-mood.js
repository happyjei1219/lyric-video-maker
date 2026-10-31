/* 템플릿 02 · 컬러 무드 — 커버의 대표색으로 배경·LP 라벨이 곡마다 바뀌고, 곡 전환 때 색이 부드럽게 넘어감 */
const TPL = {
  id: 'color-mood', name: '컬러 무드', continuous: true,
  desc: '커버에서 뽑은 색으로 배경과 LP 라벨이 곡마다 바뀝니다. 곡이 바뀔 때 색이 부드럽게 넘어가고 LP가 들어갔다 나옵니다.',
  defaults: { cmBig: 'title', cmAuto: true, lyric: 'glow', bar: 'mirror', gap: 0.5 },
  hide: ['ctlBlur', 'ctlDim', 'ctlBg'],
  validate(S) { if (!['title', 'label', 'none'].includes(S.cmBig)) S.cmBig = 'title'; },
  buildUI(box) {
    box.innerHTML = `<div class="grid2">
      <div><b class="sub">배경 큰 글자</b><div class="seg" id="cmBig"><button data-k="title">곡 제목</button><button data-k="label">채널 이름</button><button data-k="none">없음</button></div></div>
      <label class="f" style="flex-direction:row;align-items:center;gap:8px;margin-top:26px"><input type="checkbox" id="cmAuto" style="width:20px;height:20px;accent-color:var(--accent)"> 강조색도 커버 색에 맞추기</label>
    </div>`;
    document.querySelectorAll('#cmBig button').forEach(b => b.onclick = () => { S.cmBig = b.dataset.k; changed(); });
    $('cmAuto').onchange = e => { S.cmAuto = e.target.checked; changed(); };
  },
  syncUI() {
    document.querySelectorAll('#cmBig button').forEach(b => b.classList.toggle('on', b.dataset.k === S.cmBig));
    $('cmAuto').checked = !!S.cmAuto;
  },
  shuffle(pick) { S.cmBig = pick(['title', 'label', 'none']); return '배경 글자: ' + { title: '곡 제목', label: '채널 이름', none: '없음' }[S.cmBig]; },

  prepare(t, index, total) {
    const img = coverOf(t), pal = extractPalette(img);
    // 배경: 대표색 그라데이션 + 아주 흐린 커버 질감 + 고운 입자
    const bg = mk(W, H), b = bg.getContext('2d');
    b.fillStyle = pal.css('deep'); b.fillRect(0, 0, W, H);
    b.globalAlpha = .22; b.filter = 'blur(70px)'; drawCoverFit(b, img, -200, -200, W + 400, H + 400); b.filter = 'none'; b.globalAlpha = 1;
    let g = b.createRadialGradient(W * .48, H * .36, 40, W * .48, H * .4, W * .62);
    g.addColorStop(0, `rgba(${pal.mid.join(',')},.95)`); g.addColorStop(1, `rgba(${pal.deep.join(',')},0)`);
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    g = b.createRadialGradient(W * .1, H * 1.05, 20, W * .1, H * 1.05, W * .5);
    g.addColorStop(0, `rgba(${pal.soft.join(',')},.28)`); g.addColorStop(1, `rgba(${pal.soft.join(',')},0)`);
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    b.fillStyle = CM.grain(); b.globalAlpha = .07; b.fillRect(0, 0, W, H); b.globalAlpha = 1;
    const vg = b.createRadialGradient(W / 2, H / 2, H * .4, W / 2, H / 2, W * .72);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); b.fillStyle = vg; b.fillRect(0, 0, W, H);
    // 배경 큰 글자 (가로로 천천히 흐름)
    const word = S.cmBig === 'none' ? '' : (S.cmBig === 'label' ? (S.label || 'PLAYLIST') : t.title).toUpperCase();
    let big = null;
    if (word) {
      const m = mk(10, 10).getContext('2d'); m.font = `800 300px ${FONT}`;
      const unit = m.measureText(word + '   ·   ').width;
      big = mk(Math.ceil(unit * 2), 360); const x = big.getContext('2d');
      x.font = `800 300px ${FONT}`; x.textBaseline = 'middle'; x.fillStyle = `rgba(${pal.light.join(',')},.085)`;
      x.fillText(word + '   ·   ' + word + '   ·   ', 0, 190); big.unit = unit;
    }
    const L = CM.L;
    return {
      pal, bg, big, hi: S.cmAuto ? pal.css('light') : S.accent,
      cv: makeCoverCard(img, L.cover.s, 14, 54), lp: CM.makeLP(pal, t.title, L.R), mini: CM.mini(img),
      title: fitTitle(t, index, L.title), lyr: wrapCues(t.cues, L.lyr)
    };
  },

  draw(ctx, res, t, fc) {
    const L = CM.L, dur = res.duration, gt = fc.gt, p = clamp(t / dur);
    const prev = fc.k > 0 ? fc.getRes(fc.k - 1) : null;
    const pin = clamp(t / 1.1), pout = clamp((t - (dur - .8)) / .8); // 들어오기 / 나가기 진행도
    // 1) 배경: 이전 곡 색 → 새 곡 색으로 부드럽게
    if (prev && pin < 1) { ctx.drawImage(prev.bg, 0, 0); ctx.globalAlpha = ease(pin); }
    ctx.drawImage(res.bg, 0, 0); ctx.globalAlpha = 1;
    // 2) 큰 글자 흐름
    const drawBig = (r, a) => { if (!r.big || a <= 0) return; ctx.globalAlpha = a; const off = (gt * 45) % r.big.unit; ctx.drawImage(r.big, -off, 150); ctx.drawImage(r.big, -off + r.big.width, 150); ctx.globalAlpha = 1; };
    if (prev && pin < 1) drawBig(prev, 1 - ease(pin));
    drawBig(res, prev && pin < 1 ? ease(pin) : 1);
    // 3) LP (커버 뒤에서 나왔다 들어감) + 커버
    const inA = ease(pin), outA = ease(pout);
    const lpOut = ease(clamp((t - .45) / .8)) * (1 - ease(clamp((t - (dur - .8)) / .5)));
    const cx0 = L.cover.x + L.cover.s / 2, cy0 = L.cover.y + L.cover.s / 2;
    const lpx = cx0 + (L.cover.s / 2 + L.R * .1) * lpOut, rot = gt * Math.PI * 2 * .3;
    ctx.save(); ctx.translate(lpx, cy0); ctx.rotate(rot); ctx.drawImage(res.lp, -L.R, -L.R); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(lpx, cy0, L.R, 0, Math.PI * 2); ctx.clip();
    const sh = ctx.createLinearGradient(lpx - L.R, cy0 - L.R, lpx + L.R, cy0 + L.R);
    sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.08)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sh; ctx.fillRect(lpx - L.R, cy0 - L.R, L.R * 2, L.R * 2); ctx.restore();
    const bass = bassOf(res, t), sc = (0.93 + 0.07 * inA) * (1 + 0.025 * bass), cy = cy0 + 50 * (1 - inA) + 40 * outA;
    ctx.save(); ctx.globalAlpha = inA * (1 - outA * .85); ctx.translate(cx0, cy); ctx.scale(sc, sc);
    ctx.drawImage(res.cv, -L.cover.s / 2 - 60, -L.cover.s / 2 - 60); ctx.restore();
    // 4) 제목 · 아티스트
    ctx.save(); ctx.globalAlpha = inA * (1 - outA);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = `800 ${res.title.size}px ${FONT}`; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14;
    let y = L.title.y; const pre = res.title.prefix;
    for (const [li, ln] of res.title.lines.entries()) {
      if (li === 0 && pre && ln.startsWith(pre)) {
        const rest = ln.slice(pre.length).trimStart(), gap = res.title.size * .4, wp = ctx.measureText(pre).width, wr = ctx.measureText(rest).width, x0 = W / 2 - (wp + gap + wr) / 2;
        ctx.textAlign = 'left'; ctx.fillStyle = res.hi; ctx.fillText(pre, x0, y); ctx.fillStyle = '#fff'; ctx.fillText(rest, x0 + wp + gap, y); ctx.textAlign = 'center';
      } else { ctx.fillStyle = '#fff'; ctx.fillText(ln, W / 2, y); }
      y += res.title.size * 1.15;
    }
    ctx.shadowBlur = 0;
    if (S.artist) { ctx.font = `500 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(S.artist, W / 2, y + 6); }
    ctx.restore();
    // 5) 가사
    drawLyrics(ctx, res, t, res.hi, L.lyr);
    // 6) 아래 플레이어 바
    CM.player(ctx, res, t, p, gt);
  }
};

const CM = {
  L: {
    cover: { x: 640, y: 96, s: 440 }, R: 205,
    title: { x: 960, y: 572, w: 1300, align: 'center', max: 58, min: 36, lines: 1 },
    lyr: { x: 310, w: 1300, top: 668, bottom: 915, anchor: 760, align: 'center', big: 44, small: 30 },
    bar: { x: 360, y: 932, w: 1200, h: 92 }
  },
  _grain: null,
  grain() {
    if (this._grain) return this._grain;
    const c = mk(256, 256), x = c.getContext('2d'), d = x.createImageData(256, 256);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); return this._grain = x.createPattern(c, 'repeat');
  },
  makeLP(pal, title, R) { // 대표색 라벨 + 둘레 글자가 있는 LP
    const c = mk(R * 2, R * 2), v = c.getContext('2d'); v.translate(R, R);
    const g = v.createRadialGradient(0, 0, R * .2, 0, 0, R); g.addColorStop(0, '#1c1c1e'); g.addColorStop(1, '#060607');
    v.beginPath(); v.arc(0, 0, R, 0, Math.PI * 2); v.fillStyle = g; v.fill();
    for (let r = R * .5; r < R - 4; r += 3) { v.beginPath(); v.arc(0, 0, r, 0, Math.PI * 2); v.strokeStyle = 'rgba(255,255,255,.035)'; v.lineWidth = 1; v.stroke(); }
    const lr = R * .44, lg = v.createLinearGradient(-lr, -lr, lr, lr);
    lg.addColorStop(0, `rgb(${pal.vivid.join(',')})`); lg.addColorStop(1, `rgb(${pal.soft.join(',')})`);
    v.beginPath(); v.arc(0, 0, lr, 0, Math.PI * 2); v.fillStyle = lg; v.fill();
    v.beginPath(); v.arc(0, 0, lr * .78, 0, Math.PI * 2); v.strokeStyle = `rgba(${pal.deep.join(',')},.35)`; v.lineWidth = 1.5; v.stroke();
    const word = (title || '').toUpperCase().slice(0, 28) + '  •  ' + (S.label || 'NOW PLAYING').toUpperCase().slice(0, 20) + '  •';
    const fs = Math.max(11, Math.min(17, (2 * Math.PI * lr * .86) / (word.length * 0.78) * .9));
    curvedText(v, word, 0, 0, lr * .86, -Math.PI / 2, fs, `rgb(${pal.deep.join(',')})`, 700, 1.08);
    v.beginPath(); v.arc(0, 0, 7, 0, Math.PI * 2); v.fillStyle = '#0b0b0c'; v.fill();
    return c;
  },
  mini(img) { const c = mk(124, 124), x = c.getContext('2d'); x.save(); rr(x, 0, 0, 124, 124, 16); x.clip(); drawCoverFit(x, img, 0, 0, 124, 124); x.restore(); return c; },
  player(ctx, res, t, p, gt) {
    const B = this.L.bar, cy = B.y + B.h / 2, hi = res.hi;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    rr(ctx, B.x, B.y, B.w, B.h, B.h / 2); ctx.fillStyle = 'rgba(10,10,14,.38)'; ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.stroke();
    let x = drawPlayerIcons(ctx, B.x + 46, cy, 22, 'rgba(255,255,255,.92)');
    ctx.drawImage(res.mini, x + 26, cy - 31, 62, 62);
    x += 26 + 62 + 22;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = `700 24px ${FONT}`; ctx.fillStyle = '#fff'; ctx.fillText(ellipsize(ctx, res.track.title, 420), x, cy - 13);
    ctx.font = `500 17px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.62)';
    ctx.fillText(ellipsize(ctx, [S.label, S.artist].filter(Boolean).join('  ·  ') || 'NOW PLAYING', 420), x, cy + 16);
    ctx.font = `500 19px ${FONT}`; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.fillText(`${clock(t)} / ${clock(res.duration)}`, B.x + B.w - 400, cy);
    ctx.restore();
    drawBars(ctx, res, t, { x: B.x + B.w - 370, w: 320, base: S.bar === 'mirror' ? cy + 22 : cy + 20, h: 44 }, hi, p);
    // 바 아래쪽 안쪽 테두리를 따라 진행 표시
    ctx.save(); const px0 = B.x + B.h / 2, pw = B.w - B.h;
    rr(ctx, px0, B.y + B.h - 7, pw, 3, 1.5); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill();
    rr(ctx, px0, B.y + B.h - 7, Math.max(3, pw * p), 3, 1.5); ctx.fillStyle = hi; ctx.fill();
    ctx.restore();
  }
};
