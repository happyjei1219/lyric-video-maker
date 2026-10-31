/* 템플릿 01 · 클래식 — 바이닐·센터 무대·시네마·폴라로이드·턴테이블 5가지 배치 */
const TPL = {
  id: 'classic', name: '클래식', continuous: true, desc: '바이닐 · 센터 무대 · 시네마 · 폴라로이드 · 턴테이블, 5가지 배치 중에서 고르는 기본 템플릿',
  defaults: { layout: 'vinyl', clean: false },
  validate(S) { if (!LAYOUTS[S.layout]) S.layout = 'vinyl'; },
  buildUI(box) {
    box.innerHTML = '<b class="sub">배치</b><div class="opts layouts" id="optLayout"></div>' +
      '<label class="f" style="flex-direction:row;align-items:center;gap:8px;margin-top:12px"><input type="checkbox" id="sClean" style="width:20px;height:20px;accent-color:var(--accent)"> 깨끗한 배경 — 흐림·어둡기 0, 가장자리 어둡게·흐르는 움직임 없음 (시네마 + 공통 배경 이미지에 추천)</label>';
    $('sClean').onchange = e => { S.clean = e.target.checked; if (S.clean) { S.blur = 0; S.dim = 0; } changed(); };
    $('optLayout').innerHTML = Object.entries(LAYOUTS).map(([k, L]) =>
      `<button class="opt" data-k="${k}"><svg viewBox="0 0 64 36" aria-hidden="true">${L.icon}</svg><b>${L.name}</b><small>${L.desc}</small></button>`).join('');
    document.querySelectorAll('#optLayout .opt').forEach(b => b.onclick = () => applyLayout(b.dataset.k));
  },
  syncUI() { document.querySelectorAll('#optLayout .opt').forEach(b => b.classList.toggle('on', b.dataset.k === S.layout)); $('sClean').checked = !!S.clean; },
  barNote(S) { return S.layout === 'turntable' ? '턴테이블은 원형 파형으로 고정됩니다.' : null; },
  shuffle(pick) { setLayout(pick(Object.keys(LAYOUTS).filter(k => k !== S.layout))); return LAYOUTS[S.layout].name; },

  prepare(t, index, total) {
    const Ly = LAYOUTS[S.layout] || LAYOUTS.vinyl, coverImg = coverOf(t);
    const bg = makeBlurBg(coverImg, { vignette: !S.clean });
    if (Ly.overlay === 'bottom') { // 아래쪽 글자를 읽기 쉽게 — 깨끗한 배경이면 글자 뒤에만 약하게
      const b = bg.getContext('2d'), g = b.createLinearGradient(0, S.clean ? 760 : 430, 0, H);
      if (S.clean) { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.62)'); }
      else { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.55, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,.85)'); }
      b.fillStyle = g; b.fillRect(0, 0, W, H);
    }
    if (S.clean && Ly.lyr.align === 'center') { // 깨끗한 배경: 가사 뒤에만 옅은 그림자 (밝은 사진에서도 가사가 읽히도록)
      const b = bg.getContext('2d'), L = Ly.lyr; b.save(); b.translate(L.x + L.w / 2, L.anchor); b.scale(1, .2);
      const g = b.createRadialGradient(0, 0, 0, 0, 0, L.w * .62); g.addColorStop(0, 'rgba(0,0,0,.42)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      b.fillStyle = g; b.fillRect(-W, -H * 3, W * 2, H * 6); b.restore();
    }
    const res = { Ly, bg };
    if (Ly.cover) res.cv = makeCoverCard(coverImg, Ly.cover.s, Ly.cover.r, Ly.cover.s < 200 ? 22 : 50);
    if (Ly.vinyl) { res.R = Math.round(Ly.cover.s * 0.47); res.vin = makeLP(coverImg, res.R); }
    if (Ly.disc) { res.disc = makeDisc(coverImg, Ly.disc.R); res.discShadow = makeShadow(Ly.disc.R); }
    if (Ly.card) res.card = makePolaroid(coverImg, Ly.card, t.title);
    res.title = fitTitle(t, index, Ly.title);
    res.lyr = wrapCues(t.cues, Ly.lyr);
    return res;
  },

  draw(ctx, res, t, fc) { // 곡이 바뀔 때: 검은 화면 없이 앞 곡 화면 → 새 곡 화면으로 겹쳐 넘어감
    const prev = fc && fc.k > 0 ? fc.getRes(fc.k - 1) : null, x = clamp(t / .9);
    if (prev && x < 1) { this.scene(ctx, prev, prev.duration); ctx.globalAlpha = ease(x); this.scene(ctx, res, t); ctx.globalAlpha = 1; }
    else this.scene(ctx, res, Math.min(t, res.duration));
  },
  scene(ctx, res, t) {
    const Ly = res.Ly, A = S.accent, p = res.duration ? clamp(t / res.duration) : 0;
    const zk = 1.07, ox = -W * (zk - 1) / 2 * (1 + Math.sin(t * 0.07)), oy = -H * (zk - 1) / 2 * (1 + Math.cos(t * 0.05));
    if (S.clean) ctx.drawImage(res.bg, 0, 0); // 깨끗한 배경: 확대·움직임 없이 원본 그대로
    else ctx.drawImage(res.bg, ox, oy, W * zk, H * zk); // 배경이 아주 천천히 흐르듯 움직임
    const bass = bassOf(res, t);
    if (Ly.vinyl) {
      const L = Ly.cover, R = res.R, cx = L.x + L.s + R * .38, cy = L.y + L.s / 2;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * Math.PI * 2 * 0.28); ctx.drawImage(res.vin, -R, -R); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      const sh = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.07)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sh; ctx.fillRect(cx - R, cy - R, R * 2, R * 2); ctx.restore();
    }
    if (res.cv) {
      if (Ly.pulse) { // 커버가 저음에 맞춰 살짝 숨쉬듯 움직임
        const k = 1 + 0.035 * bass, cx = Ly.cover.x + Ly.cover.s / 2, cy = Ly.cover.y + Ly.cover.s / 2;
        ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.drawImage(res.cv, -Ly.cover.s / 2 - 60, -Ly.cover.s / 2 - 60); ctx.restore();
      } else ctx.drawImage(res.cv, Ly.cover.x - 60, Ly.cover.y - 60);
    }
    if (res.card) {
      const C = Ly.card;
      ctx.save(); ctx.translate(C.cx, C.cy); ctx.rotate((C.rot + 0.6 * Math.sin(t * 0.5)) * Math.PI / 180);
      ctx.drawImage(res.card, -res.card.width / 2, -res.card.height / 2); ctx.restore();
    }
    if (res.disc) drawTurntable(ctx, res, t, p, A);
    if (Ly.bars) drawBars(ctx, res, t, Ly.bars, A, p);
    if (Ly.prog) drawProgress(ctx, res, t, Ly.prog, A, p);
    if (Ly.ctrl) drawControls(ctx, Ly.ctrl.x, Ly.ctrl.y, A);
    drawTitle(ctx, res, Ly.title, A);
    drawLyrics(ctx, res, t, A, Ly.lyr);
  }
};

function setLayout(k) {
  const L = LAYOUTS[k]; S.layout = k; S.blur = L.blur; S.dim = L.dim; S.lyric = L.lyric;
  if (L.bar !== 'radial') S.bar = L.bar;
}
function applyLayout(k) { setLayout(k); changed(); }

const LAYOUTS = {
  vinyl: { name: '바이닐', desc: '커버+LP판 · 오른쪽 가사', blur: 40, dim: 55, lyric: 'glow', bar: 'bars',
    icon: '<rect x="6" y="8" width="18" height="18" rx="2" fill="currentColor" opacity=".9"/><circle cx="26" cy="17" r="8" fill="currentColor" opacity=".45"/><rect x="38" y="9" width="20" height="4" rx="2" fill="currentColor"/><rect x="38" y="20" width="18" height="2.5" rx="1.2" fill="currentColor" opacity=".6"/><rect x="38" y="25" width="14" height="2.5" rx="1.2" fill="currentColor" opacity=".6"/>',
    cover: { x: 130, y: 150, s: 500, r: 18 }, vinyl: true,
    bars: { x: 130, w: 500, base: 835, h: 92 }, prog: { x: 130, w: 500, y: 878, knob: true, times: 'below' }, ctrl: { x: 380, y: 985 },
    title: { x: 1000, y: 202, w: 800, align: 'left', max: 82, min: 46, lines: 2, label: { x: 1000, y: 150 }, divider: true },
    lyr: { x: 1000, w: 800, top: 545, bottom: 1030, anchor: 690, align: 'left', big: 48, small: 34 } },
  center: { name: '센터 무대', desc: '가운데 커버 · 아래 가사', blur: 50, dim: 60, lyric: 'color', bar: 'mirror',
    icon: '<rect x="25" y="4" width="14" height="14" rx="2" fill="currentColor" opacity=".9"/><rect x="18" y="21" width="28" height="3" rx="1.5" fill="currentColor"/><rect x="14" y="27" width="36" height="2.5" rx="1.2" fill="currentColor" opacity=".6"/><rect x="20" y="32" width="24" height="1.5" rx=".7" fill="currentColor" opacity=".4"/>',
    cover: { x: 790, y: 110, s: 340, r: 16 }, pulse: true,
    bars: { x: 560, w: 800, base: 968, h: 46 }, prog: { x: 560, w: 800, y: 1014, knob: true, times: 'side' },
    title: { x: 960, y: 478, w: 1500, align: 'center', max: 60, min: 38, lines: 1, label: { x: 960, y: 58 } },
    lyr: { x: 260, w: 1400, top: 598, bottom: 915, anchor: 705, align: 'center', big: 50, small: 32 } },
  cinema: { name: '시네마', desc: '선명한 배경 · 큰 자막', blur: 0, dim: 25, lyric: 'glow', bar: 'dots', overlay: 'bottom',
    icon: '<rect x="2" y="2" width="60" height="32" rx="2" fill="currentColor" opacity=".25"/><rect x="12" y="15" width="40" height="3.5" rx="1.7" fill="currentColor"/><rect x="6" y="25" width="7" height="7" rx="1" fill="currentColor" opacity=".9"/><rect x="15" y="26" width="16" height="2.5" rx="1.2" fill="currentColor" opacity=".7"/><rect x="2" y="34" width="60" height="1.5" fill="currentColor"/>',
    cover: { x: 90, y: 892, s: 130, r: 10 }, pulse: true,
    bars: { x: 1300, w: 520, base: 1012, h: 54 }, prog: { x: 0, w: 1920, y: 1075, knob: false, times: { x: 1820, y: 905, align: 'right' } },
    title: { x: 250, y: 926, w: 950, align: 'left', max: 42, min: 30, lines: 1, label: { x: 250, y: 893, size: 20 }, artistSize: 24 },
    lyr: { x: 260, w: 1400, top: 552, bottom: 846, anchor: 695, align: 'center', big: 44, small: 30 } },
  polaroid: { name: '폴라로이드', desc: '사진 카드 · 왼쪽 가사', blur: 45, dim: 50, lyric: 'box', bar: 'bars',
    icon: '<g transform="rotate(-6 46 18)"><rect x="35" y="4" width="22" height="27" rx="1.5" fill="currentColor" opacity=".9"/><rect x="38" y="7" width="16" height="16" fill="#fff" opacity=".55"/></g><rect x="5" y="8" width="22" height="4" rx="2" fill="currentColor"/><rect x="5" y="17" width="20" height="2.5" rx="1.2" fill="currentColor" opacity=".6"/><rect x="5" y="22" width="16" height="2.5" rx="1.2" fill="currentColor" opacity=".6"/>',
    card: { cx: 1370, cy: 520, w: 620, h: 730, photo: 560, rot: -3.5 },
    bars: { x: 150, w: 760, base: 962, h: 56 }, prog: { x: 150, w: 760, y: 1002, knob: true, times: 'below' },
    title: { x: 150, y: 200, w: 780, align: 'left', max: 70, min: 42, lines: 2, label: { x: 150, y: 150 }, divider: true },
    lyr: { x: 150, w: 780, top: 455, bottom: 905, anchor: 595, align: 'left', big: 46, small: 32 } },
  turntable: { name: '턴테이블', desc: '원형 커버 + 원형 파형', blur: 40, dim: 60, lyric: 'color', bar: 'radial',
    icon: '<circle cx="17" cy="18" r="13" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2" opacity=".7"/><circle cx="17" cy="18" r="9" fill="currentColor" opacity=".9"/><rect x="38" y="9" width="20" height="4" rx="2" fill="currentColor"/><rect x="38" y="20" width="18" height="2.5" rx="1.2" fill="currentColor" opacity=".6"/><rect x="38" y="25" width="14" height="2.5" rx="1.2" fill="currentColor" opacity=".6"/>',
    disc: { cx: 520, cy: 505, R: 300 },
    title: { x: 1040, y: 202, w: 760, align: 'left', max: 76, min: 44, lines: 2, label: { x: 1040, y: 150 }, divider: true },
    lyr: { x: 1040, w: 760, top: 470, bottom: 990, anchor: 620, align: 'left', big: 46, small: 33 } }
};

function drawTurntable(ctx, res, t, p, A) {
  const D = res.Ly.disc, R = D.R, fr = specFn(res, t), N = BARS * 2, r0 = R + 24;
  ctx.save(); ctx.translate(D.cx, D.cy);
  ctx.lineCap = 'round'; ctx.lineWidth = 6;
  for (let i = 0; i < N; i++) {
    const band = i < BARS ? i : N - 1 - i, e = fr(band), ang = -Math.PI / 2 + (i + .5) / N * Math.PI * 2, len = 5 + 78 * e;
    const lit = (i + .5) / N <= p, c = Math.cos(ang), s = Math.sin(ang);
    ctx.strokeStyle = lit ? A : 'rgba(255,255,255,.85)';
    ctx.beginPath(); ctx.moveTo(c * r0, s * r0); ctx.lineTo(c * (r0 + len), s * (r0 + len)); ctx.stroke();
  }
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, R + 10, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, R + 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); ctx.strokeStyle = A; ctx.stroke();
  ctx.drawImage(res.discShadow, -R - 80, -R - 80);
  ctx.save(); ctx.rotate(t * Math.PI * 2 * 0.12); ctx.drawImage(res.disc, -R, -R); ctx.restore();
  ctx.beginPath(); ctx.arc(0, 0, R - 14, 0, Math.PI * 2); ctx.clip();
  const sh = ctx.createLinearGradient(-R, -R, R, R);
  sh.addColorStop(0, 'rgba(255,255,255,.10)'); sh.addColorStop(.45, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,0,0,.18)');
  ctx.fillStyle = sh; ctx.fillRect(-R, -R, R * 2, R * 2);
  ctx.restore();
  ctx.font = `500 26px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(`${clock(t)} / ${clock(res.duration)}`, D.cx, D.cy + R + 118);
  ctx.textAlign = 'left';
}
