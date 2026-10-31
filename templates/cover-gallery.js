/* 템플릿 04 · 커버 갤러리 — 플레이리스트 커버들이 원근감 있게 늘어서고, 곡이 바뀌면 한 칸씩 미끄러져 다음 곡이 가운데로 */
const TPL = {
  id: 'cover-gallery', name: '커버 갤러리', continuous: true,
  desc: '플레이리스트의 커버들이 원근감 있게 늘어서고, 곡이 바뀔 때마다 한 칸씩 미끄러져 다음 곡이 가운데로 옵니다. 바닥에 반사가 비칩니다.',
  defaults: { cgRefl: true, lyric: 'color', bar: 'mirror', blur: 60, dim: 55, gap: 0.5 },
  hide: ['ctlBg'],
  buildUI(box) {
    box.innerHTML = `<label class="f" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="cgRefl" style="width:20px;height:20px;accent-color:var(--accent)"> 바닥 반사 넣기</label>`;
    $('cgRefl').onchange = e => { S.cgRefl = e.target.checked; changed(); };
  },
  syncUI() { $('cgRefl').checked = !!S.cgRefl; },

  prepare(t, index, total) {
    const img = coverOf(t), pal = extractPalette(img), Z = CG.Z;
    const bg = makeBlurBg(img, { useCommon: false }), b = bg.getContext('2d');
    let g = b.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(${pal.deep.join(',')},.55)`); g.addColorStop(.55, `rgba(${pal.mid.join(',')},.25)`); g.addColorStop(1, 'rgba(0,0,0,.6)');
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    g = b.createRadialGradient(W / 2, Z.cy + Z.size / 2 + 20, 10, W / 2, Z.cy + Z.size / 2 + 20, 700); // 무대 바닥 빛
    g.addColorStop(0, `rgba(${pal.light.join(',')},.16)`); g.addColorStop(1, 'rgba(0,0,0,0)');
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    const s = Z.size, cv = mk(s, s); drawCoverFit(cv.getContext('2d'), img, 0, 0, s, s);
    const rh = Math.round(s * .42), refl = mk(s, rh), r = refl.getContext('2d'); // 바닥 반사 (뒤집고 아래로 갈수록 투명)
    r.save(); r.translate(0, s); r.scale(1, -1); r.drawImage(cv, 0, 0); r.restore();
    r.globalCompositeOperation = 'destination-in'; const fg = r.createLinearGradient(0, 0, 0, rh); fg.addColorStop(0, 'rgba(0,0,0,.32)'); fg.addColorStop(1, 'rgba(0,0,0,0)'); r.fillStyle = fg; r.fillRect(0, 0, s, rh);
    return { pal, bg, cv, refl, hi: `rgb(${pal.light.join(',')})`, title: fitTitle(t, index, CG.L.title), lyr: wrapCues(t.cues, CG.L.lyr) };
  },

  draw(ctx, res, t, fc) {
    const L = CG.L, Z = CG.Z, dur = res.duration, gt = fc.gt, A = S.accent, p = clamp(t / dur);
    const prev = fc.k > 0 ? fc.getRes(fc.k - 1) : null, mv = clamp(t / 1.1);
    // 배경 전환
    if (prev && mv < 1) { ctx.drawImage(prev.bg, 0, 0); ctx.globalAlpha = ease(mv); }
    ctx.drawImage(res.bg, 0, 0); ctx.globalAlpha = 1;
    // 커버 줄: 지금 보는 위치(pos)를 기준으로 앞뒤 곡 배치
    const pos = fc.plan ? (prev ? fc.k - 1 + ease(mv) : fc.k) : 0;
    const items = [];
    for (let j = Math.floor(pos) - 4; j <= Math.ceil(pos) + 4; j++) {
      const r = fc.plan ? (j === fc.k ? res : (j >= 0 && j < fc.plan.length ? fc.getRes(j) : null)) : (j === 0 ? res : null);
      if (r) items.push({ r, d: j - pos });
    }
    items.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
    const bass = bassOf(res, t);
    for (const it of items) CG.drawCover(ctx, it.r, it.d, gt, Math.abs(it.d) < .5 ? bass : 0);
    // 위쪽 라벨
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = `700 24px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.9)';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
    ctx.fillText(((S.label || 'NOW PLAYING') + (res.total > 1 ? `  ·  ${String(res.index + 1).padStart(2, '0')} / ${String(res.total).padStart(2, '0')}` : '')).toUpperCase(), W / 2, 44);
    ctx.restore();
    // 제목 (곡이 바뀔 때 살짝 떠오르며 나타남)
    const ta = prev ? ease(clamp((t - .5) / .6)) : ease(clamp(t / .6));
    ctx.save(); ctx.globalAlpha = ta * (1 - ease(clamp((t - (dur - .5)) / .5))); ctx.translate(0, 16 * (1 - ta));
    let y = drawTitle(ctx, res, L.title, res.hi);
    ctx.restore();
    drawLyrics(ctx, res, t, res.hi, L.lyr);
    drawBars(ctx, res, t, L.bars, res.hi, p);
    drawProgress(ctx, res, t, L.prog, res.hi, p);
  }
};

const CG = {
  Z: { cy: 345, size: 420 },
  L: {
    title: { x: 960, y: 618, w: 1300, align: 'center', max: 56, min: 34, lines: 1 },
    lyr: { x: 260, w: 1400, top: 690, bottom: 925, anchor: 772, align: 'center', big: 44, small: 30 },
    bars: { x: 660, w: 600, base: 985, h: 40 }, prog: { x: 560, w: 800, y: 1030, knob: true, times: 'side' }
  },
  // 가운데에서 떨어진 정도(d)에 따른 위치·크기·기울기·어둡기
  X: [0, 395, 640, 830, 975], SC: [1, .68, .52, .41, .33], ANG: [0, .95, 1.05, 1.12, 1.16], DIM: [0, .38, .58, .74, .86],
  at(arr, a) { const i = Math.min(arr.length - 2, Math.floor(a)), f = Math.min(1, a - i); return arr[i] + (arr[i + 1] - arr[i]) * f; },
  drawCover(ctx, r, d, gt, bass) {
    const a = Math.abs(d); if (a > 4) return;
    const side = Math.sign(d), Z = this.Z;
    const sc = this.at(this.SC, a) * (1 + .03 * bass), ang = this.at(this.ANG, a), dim = this.at(this.DIM, a);
    const cx = W / 2 + side * this.at(this.X, a), cy = Z.cy + (a < .5 ? Math.sin(gt * 1.3) * 5 * (1 - a * 2) : 0) + (1 - sc) * 60;
    const hIn = Z.size * sc, hOut = hIn * (1 - .24 * Math.sin(ang)), w = Z.size * sc * Math.cos(ang * .78);
    const fade = clamp(3.8 - a);
    if (fade <= 0) return;
    ctx.save(); ctx.globalAlpha = fade;
    // 그림자 (가운데 커버만 진하게)
    if (a < 1) { // 그림자: 미리 그려둔 흐린 타원을 늘려서 사용 (속도)
      if (!CG._sh) { const c = mk(240, 80), x = c.getContext('2d'); x.filter = 'blur(14px)'; x.fillStyle = '#000'; x.beginPath(); x.ellipse(120, 40, 90, 12, 0, 0, Math.PI * 2); x.fill(); CG._sh = c; }
      ctx.globalAlpha = fade * .55 * (1 - a); ctx.drawImage(CG._sh, cx - w * .62, cy + hIn / 2 - 22, w * 1.24, 60); ctx.globalAlpha = fade;
    }
    const N = a < .02 ? 1 : a < 1.5 ? 24 : 14, sw = r.cv.width / N, rw = r.refl.width / N;
    const hAt = u => { const inner = side < 0 ? u : side > 0 ? 1 - u : 1; return hOut + (hIn - hOut) * inner; };
    for (let i = 0; i < N; i++) {
      const u = (i + .5) / N, h = N === 1 ? hIn : hAt(u), x = cx - w / 2 + i * w / N;
      ctx.drawImage(r.cv, i * sw, 0, sw, r.cv.height, x, cy - h / 2, w / N + .7, h);
      if (S.cgRefl) ctx.drawImage(r.refl, i * rw, 0, rw, r.refl.height, x, cy + h / 2 + 6, w / N + .7, h * .42);
    }
    // 멀어질수록 어둡게 (사다리꼴 모양으로 덮기)
    const hl = N === 1 ? hIn : hAt(0), hr = N === 1 ? hIn : hAt(1);
    const quad = (k, extra) => { ctx.beginPath(); ctx.moveTo(cx - w / 2, cy - hl / 2); ctx.lineTo(cx + w / 2, cy - hr / 2); ctx.lineTo(cx + w / 2, cy + hr / 2 + extra * hr); ctx.lineTo(cx - w / 2, cy + hl / 2 + extra * hl); ctx.closePath(); };
    if (dim > .01) { quad(0, S.cgRefl ? .46 : 0); ctx.fillStyle = `rgba(0,0,0,${dim})`; ctx.fill(); }
    quad(0, 0); ctx.strokeStyle = `rgba(255,255,255,${.22 * (1 - Math.min(1, a))})`; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
  }
};
