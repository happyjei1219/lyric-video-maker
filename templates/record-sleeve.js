/* 템플릿 03 · 레코드 슬리브 — 앨범(슬리브)에서 LP가 빠져나오고 톤암이 내려앉음. 곡이 끝나면 다시 들어가고 다음 앨범으로 넘어감 */
const TPL = {
  id: 'record-sleeve', name: '레코드 슬리브', continuous: true,
  desc: '곡마다 앨범에서 LP가 미끄러져 나오고 바늘이 내려앉습니다. 곡이 끝나면 LP가 들어가고 다음 앨범으로 넘어갑니다.',
  defaults: { rsLabel: 'color', lyric: 'glow', bar: 'bars', blur: 55, dim: 62, gap: 0.5 },
  validate(S) { if (!['color', 'cover'].includes(S.rsLabel)) S.rsLabel = 'color'; },
  buildUI(box) {
    box.innerHTML = `<b class="sub">LP 가운데 라벨</b><div class="seg" id="rsLabel"><button data-k="color">커버 색 + 곡 제목</button><button data-k="cover">커버 그림</button></div>`;
    document.querySelectorAll('#rsLabel button').forEach(b => b.onclick = () => { S.rsLabel = b.dataset.k; changed(); });
  },
  syncUI() { document.querySelectorAll('#rsLabel button').forEach(b => b.classList.toggle('on', b.dataset.k === S.rsLabel)); },
  shuffle(pick) { S.rsLabel = pick(['color', 'cover']); return S.rsLabel === 'color' ? '색 라벨' : '그림 라벨'; },

  prepare(t, index, total) {
    const img = coverOf(t), pal = extractPalette(img), L = RS.L;
    const bg = makeBlurBg(img), b = bg.getContext('2d');
    const g = b.createLinearGradient(0, 0, W * .6, 0); g.addColorStop(0, `rgba(${pal.mid.join(',')},.55)`); g.addColorStop(1, `rgba(${pal.mid.join(',')},0)`);
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    return {
      pal, bg, sleeve: makeCoverCard(img, L.sleeve.s, 6, 60), lp: RS.makeLP(img, pal, t.title, L.R),
      title: fitTitle(t, index, L.title), lyr: wrapCues(t.cues, L.lyr)
    };
  },

  draw(ctx, res, t, fc) {
    const L = RS.L, dur = res.duration, A = S.accent, p = clamp(t / dur), gt = fc.gt;
    const prev = fc.k > 0 ? fc.getRes(fc.k - 1) : null;
    // 배경 (이전 곡에서 부드럽게 넘어옴)
    const bIn = clamp(t / .8);
    if (prev && bIn < 1) { ctx.drawImage(prev.bg, 0, 0); ctx.globalAlpha = ease(bIn); }
    ctx.drawImage(res.bg, 0, 0); ctx.globalAlpha = 1;
    // LP 위치: 0.6~1.5초 미끄러져 나옴 / 끝나기 0.9초 전부터 들어감
    const scx = L.sleeve.x + L.sleeve.s / 2, scy = L.sleeve.y + L.sleeve.s / 2;
    const out = ease(clamp((t - .6) / .9)) * (1 - ease(clamp((t - (dur - .9)) / .8)));
    const lpx = scx + L.slide * out;
    // 회전: 나온 뒤 서서히 빨라졌다가, 바늘이 들리면 서서히 멈춤 (각도 = 속도의 누적)
    const spin = (x => x < 1.2 ? 0 : x < 2 ? (x - 1.2) ** 2 / 1.6 : .4 + (x - 2))(t) - (x => x < 0 ? 0 : x < 1 ? x * x / 2 : .5 + (x - 1))(t - (dur - 1.2));
    if (!RS._sh) RS._sh = makeShadow(L.R); // 그림자는 한 번만 그려두고 재사용 (속도)
    ctx.globalAlpha = .75; ctx.drawImage(RS._sh, lpx + 10 - L.R - 80, scy + 4 - L.R - 80); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(lpx, scy); ctx.rotate(spin * Math.PI * 2 * .55); ctx.drawImage(res.lp, -L.R, -L.R); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(lpx, scy, L.R, 0, Math.PI * 2); ctx.clip();
    const sh = ctx.createLinearGradient(lpx - L.R, scy - L.R, lpx + L.R, scy + L.R);
    sh.addColorStop(0, 'rgba(255,255,255,.0)'); sh.addColorStop(.48, 'rgba(255,255,255,.09)'); sh.addColorStop(.52, 'rgba(255,255,255,.02)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sh; ctx.fillRect(lpx - L.R, scy - L.R, L.R * 2, L.R * 2); ctx.restore();
    // 슬리브(앨범): 곡이 바뀌면 옆으로 뒤집히며 새 앨범으로
    const flip = clamp(t / .7);
    const drawSleeve = (r, sx) => { if (sx <= 0.01) return; ctx.save(); ctx.translate(scx, scy); ctx.scale(sx, 1); ctx.drawImage(r.sleeve, -L.sleeve.s / 2 - 60, -L.sleeve.s / 2 - 60); ctx.restore(); };
    if (prev && flip < .5) drawSleeve(prev, 1 - ease(flip * 2));
    else if (prev) drawSleeve(res, ease((flip - .5) * 2));
    else { ctx.globalAlpha = ease(flip); drawSleeve(res, 1); ctx.globalAlpha = 1; }
    // 톤암: 1.4~2.3초 내려앉고, 끝나기 1.6초 전 들림
    const arm = ease(clamp((t - 1.4) / .9)) * (1 - ease(clamp((t - (dur - 1.6)) / .6)));
    RS.tonearm(ctx, arm, lpx);
    // 오른쪽: 제목 · 가사 · 파형
    const tin = ease(clamp((t - .3) / .7)), tout = ease(clamp((t - (dur - .6)) / .6));
    ctx.save(); ctx.globalAlpha = tin * (1 - tout); ctx.translate(30 * (1 - tin), 0);
    drawTitle(ctx, res, L.title, A);
    ctx.restore();
    drawLyrics(ctx, res, t, A, L.lyr);
    drawBars(ctx, res, t, L.bars, A, p);
    drawProgress(ctx, res, t, L.prog, A, p);
  }
};

const RS = {
  L: {
    sleeve: { x: 140, y: 250, s: 580 }, R: 272, slide: 360,
    pivot: { x: 1135, y: 150 },
    title: { x: 1210, y: 206, w: 620, align: 'left', max: 74, min: 40, lines: 2, label: { x: 1210, y: 152 }, divider: true },
    lyr: { x: 1210, w: 620, top: 470, bottom: 905, anchor: 600, align: 'left', big: 44, small: 31 },
    bars: { x: 1210, w: 620, base: 958, h: 52 }, prog: { x: 1210, w: 620, y: 996, knob: true, times: 'below' }
  },
  makeLP(img, pal, title, R) {
    const c = mk(R * 2, R * 2), v = c.getContext('2d'); v.translate(R, R);
    const g = v.createRadialGradient(0, 0, R * .2, 0, 0, R); g.addColorStop(0, '#1d1d1f'); g.addColorStop(1, '#070708');
    v.beginPath(); v.arc(0, 0, R, 0, Math.PI * 2); v.fillStyle = g; v.fill();
    for (let r = R * .42; r < R - 5; r += 2.6) { v.beginPath(); v.arc(0, 0, r, 0, Math.PI * 2); v.strokeStyle = `rgba(255,255,255,${(r | 0) % 9 === 0 ? .06 : .028})`; v.lineWidth = 1; v.stroke(); }
    v.beginPath(); v.arc(0, 0, R - 2, 0, Math.PI * 2); v.strokeStyle = 'rgba(255,255,255,.08)'; v.lineWidth = 2; v.stroke();
    const lr = R * .36;
    if (S.rsLabel === 'cover') {
      v.save(); v.beginPath(); v.arc(0, 0, lr, 0, Math.PI * 2); v.clip(); drawCoverFit(v, img, -lr, -lr, lr * 2, lr * 2); v.restore();
    } else {
      const lg = v.createRadialGradient(-lr * .3, -lr * .3, 0, 0, 0, lr); lg.addColorStop(0, `rgb(${pal.light.join(',')})`); lg.addColorStop(1, `rgb(${pal.vivid.join(',')})`);
      v.beginPath(); v.arc(0, 0, lr, 0, Math.PI * 2); v.fillStyle = lg; v.fill();
      const ink = `rgb(${pal.deep.join(',')})`;
      curvedText(v, (S.label || 'NOW PLAYING').toUpperCase().slice(0, 22), 0, 0, lr * .8, -Math.PI * .5 - .9, 12, ink, 700, 1.25);
      v.font = `800 20px ${FONT}`; v.fillStyle = ink; v.textAlign = 'center'; v.textBaseline = 'middle';
      const lines = wrap(v, title || '', lr * 1.25).slice(0, 2);
      lines.forEach((ln, i) => v.fillText(ellipsize(v, ln, lr * 1.3), 0, (i - (lines.length - 1) / 2) * 24 + 26));
      v.font = `600 11px ${FONT}`; v.fillStyle = `rgba(${pal.deep.join(',')},.75)`; v.fillText('SIDE A  ·  33⅓ RPM', 0, lr * .62);
    }
    v.beginPath(); v.arc(0, 0, lr, 0, Math.PI * 2); v.strokeStyle = 'rgba(0,0,0,.35)'; v.lineWidth = 2; v.stroke();
    v.beginPath(); v.arc(0, 0, 8, 0, Math.PI * 2); v.fillStyle = '#d6d2cb'; v.fill();
    return c;
  },
  tonearm(ctx, a, lpx) { // a: 0 = 쉬는 자리, 1 = 레코드 위
    const P = this.L.pivot, R = this.L.R, cy = this.L.sleeve.y + this.L.sleeve.s / 2;
    const fx = this.L.sleeve.x + this.L.sleeve.s / 2 + this.L.slide; // LP가 다 나왔을 때 위치 기준 (쉬는 자리 고정)
    const tx = fx + R * .8 * Math.cos(-.62), ty = cy + R * .8 * Math.sin(-.62); // 바늘이 닿을 자리
    const playAng = Math.atan2(ty - P.y, tx - P.x), restAng = playAng - .55, ang = restAng + (playAng - restAng) * a;
    const len = Math.hypot(tx - P.x, ty - P.y);
    ctx.save(); ctx.translate(P.x, P.y);
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8;
    // 받침
    let g = ctx.createRadialGradient(-8, -8, 2, 0, 0, 40); g.addColorStop(0, '#f2f2f2'); g.addColorStop(1, '#7c7c80');
    ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fillStyle = '#1b1b1e'; ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.rotate(ang);
    // 뒤쪽 무게추
    ctx.fillStyle = '#2a2a2e'; rr(ctx, -70, -14, 40, 28, 6); ctx.fill();
    ctx.fillStyle = '#c9c9cd'; ctx.fillRect(-32, -4, 32, 8);
    // 팔
    g = ctx.createLinearGradient(0, -6, 0, 6); g.addColorStop(0, '#f4f4f6'); g.addColorStop(.5, '#a9a9ae'); g.addColorStop(1, '#6d6d72');
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 10 + 4 * (1 - a);
    ctx.fillStyle = g; rr(ctx, 0, -5, len - 34, 10, 5); ctx.fill();
    // 헤드
    ctx.save(); ctx.translate(len - 30, 0); ctx.rotate(.35);
    ctx.fillStyle = '#26262a'; rr(ctx, -6, -13, 46, 26, 5); ctx.fill();
    ctx.fillStyle = '#d8d8dc'; ctx.fillRect(30, -3, 14, 6);
    ctx.restore();
    ctx.restore();
    ctx.beginPath(); ctx.arc(P.x, P.y, 7, 0, Math.PI * 2); ctx.fillStyle = '#1b1b1e'; ctx.fill();
  }
};
