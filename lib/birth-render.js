// 저장된 payload → 브랜드 스크롤 리포트 HTML (웹 /r/:id 및 검수용).
const WXCOL = { 목:'#5bb3a3', 화:'#e08a72', 토:'#d6ab52', 금:'#9aa3ae', 수:'#5b7c93' };
const HZ = { 목:'木', 화:'火', 토:'土', 금:'金', 수:'水' };
const esc = s => String(s ?? '').replace(/[<>&]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;' }[c]));

function ohaengBars(pct, f) {
  const order = ['목','화','토','금','수'].sort((a, b) => pct[b] - pct[a]);
  const role = e => [e === f.dayEl && '일간', e === f.yongshin && '용신', e === f.heeshin && '희신', e === f.gishin && '기신'].filter(Boolean);
  return `<div class="bars">` + order.map(e => {
    const p = pct[e], col = WXCOL[e];
    const tags = role(e).map(r => `<span class="rt">${r}</span>`).join('');
    return `<div class="brow"><div class="bl"><b style="color:${col}">${HZ[e]}</b> ${e} ${tags}</div>
      <div class="bt"><div class="bf" style="width:${Math.max(p,3)}%;background:${col}"></div></div><div class="bp">${p}%</div></div>`;
  }).join('') + `</div>`;
}

function dateSection(f) {
  const c = f.content || {};
  const picks = (c.career_picks || []).map(([a, b]) => `<tr><td>${esc(a)}</td><td class="v">${esc(b)}</td></tr>`).join('');
  const sinsal = (f.wealthSinsal || []).map(s => `<div class="ssl"><b>${s.key}</b> — ${esc(s.desc)}</div>`).join('')
    || `<div class="ssl"><b>스스로 일구는 복</b> — 성실함과 꾸준함이 그대로 재물이 되는 결이에요.</div>`;
  const bonds = (c.bonds || []).map(b => `<div class="rel"><div class="rh">${b.who === '엄마' ? '👩' : '👨'} ${b.who}와 <em>${esc(b.tag)}</em></div><p>${esc(b.text)}</p></div>`).join('');
  return `<section class="dcard">
    <div class="dhead"><span class="dd">${f.date}</span><span class="dj">${f.saju3.join(' ')} · ${f.dayMaster}(${f.dayEl})</span></div>
    <div class="tt">${esc(c.emoji || '🌱')} ${esc(c.type || '')}</div>
    <p class="gist">${esc(c.gist || '')}</p>
    <div class="blk"><div class="bh">📊 오행 · 신강약 <span class="lv">${f.strengthLevel}</span></div>${ohaengBars(f.ohaeng, f)}
      <div class="stg"><b>유년</b> ${esc(c.child)} · <b>소년</b> ${esc(c.teen)} · <b>성인</b> ${esc(c.adult)}</div></div>
    <div class="blk"><div class="bh">🧭 사용설명서</div><p>${esc(c.manual_body)}</p>
      <div class="watch">🌱 ${esc(c.manual_watch)}</div><div class="tip">👉 ${esc(c.manual_tip)}</div></div>
    <div class="blk"><div class="bh">💼 ${esc(c.career_head)}</div><table class="pick">${picks}</table><p>${esc(c.career_desc)}</p></div>
    <div class="blk"><div class="bh">💰 ${esc(c.wealth_head)}</div><p>${esc(c.wealth_money)}</p><div class="ssls">${sinsal}</div><div class="tip">👉 ${esc(c.wealth_tip)}</div></div>
    <div class="blk"><div class="bh">💞 부모와의 관계</div>${bonds}<div class="gem">✨ ${esc(c.gem)}</div></div>
    <div class="blk"><div class="bh">🌈 크게 피어나는 때</div><p>🌟 ${esc(c.bloom_good)}</p><p>💗 ${esc(c.bloom_care)}</p></div>
  </section>`;
}

function renderReport(p) {
  const parents = (p.parents || []).map((x, i) => `<div class="prow"><b>${i === 0 ? '🌲 엄마' : '🌲 아빠'}</b> ${x.dayPillar} 일주 · ${x.dayEl}</div>`).join('');
  const body = (p.dates || []).map(dateSection).join('');
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>우리 아기 스케치북</title><style>
:root{--cream:#fff8f1;--ink:#5a4a44;--ink2:#8a7a72;--deep:#40323b;--peach:#e79a86;--gold:#c8992f;--line:#f0e4d5}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;background:#e9e2d8;color:var(--ink);line-height:1.75}
.wrap{max-width:520px;margin:0 auto;background:var(--cream);min-height:100vh;padding:0 22px 60px}
.cover{text-align:center;padding:48px 0 30px}.cover .k{color:var(--peach);font-weight:800;letter-spacing:3px;font-size:13px}
.cover h1{font-size:32px;font-weight:900;color:var(--deep);margin:12px 0;line-height:1.3}.cover .s{color:var(--ink2);font-size:15px}
.letter{background:#fff;border-radius:20px;padding:22px;margin:14px 0;box-shadow:0 8px 22px rgba(160,140,120,.1)}
.letter .q{font-size:19px;font-weight:800;color:var(--deep);line-height:1.5;margin-bottom:10px}
.pcard{background:#fff;border-radius:20px;padding:20px;margin:14px 0;box-shadow:0 8px 22px rgba(160,140,120,.1)}
.prow{font-size:14.5px;margin:6px 0}.prow b{color:var(--deep)}
.dcard{background:#fff;border-radius:22px;padding:22px;margin:16px 0;box-shadow:0 8px 24px rgba(160,140,120,.1)}
.dhead{display:flex;align-items:baseline;gap:10px;border-bottom:1px dashed var(--line);padding-bottom:10px;margin-bottom:12px}
.dhead .dd{font-size:22px;font-weight:900;color:var(--deep)}.dhead .dj{font-size:13px;color:var(--gold);font-weight:700}
.tt{font-size:19px;font-weight:800;color:var(--deep);margin:6px 0}.gist{font-size:14.5px;color:var(--ink);margin-bottom:6px}
.blk{background:#fdf8f2;border-radius:14px;padding:14px 15px;margin-top:12px}
.bh{font-weight:800;color:var(--deep);font-size:14.5px;margin-bottom:8px}.lv{background:#efe7f7;color:#6a5cc0;font-size:11px;font-weight:800;border-radius:999px;padding:2px 8px;margin-left:4px}
.bars{margin:6px 0}.brow{display:flex;align-items:center;gap:8px;margin:5px 0;font-size:12px}.bl{flex:0 0 118px;color:var(--ink2)}.bl b{font-size:15px}
.rt{background:#efe7dd;color:#8a7a52;font-size:10px;font-weight:800;border-radius:999px;padding:1px 6px;margin-left:3px}
.bt{flex:1;height:9px;background:#f0e7da;border-radius:999px;overflow:hidden}.bf{height:100%;border-radius:999px}.bp{flex:0 0 42px;text-align:right;font-weight:800;color:var(--deep)}
.stg{font-size:12.5px;color:var(--ink2);margin-top:8px}.stg b{color:var(--deep)}
.watch{background:#f4f7f4;border-radius:10px;padding:10px 12px;font-size:13px;margin-top:8px}.tip{background:#fff4ec;border-radius:10px;padding:10px 12px;font-size:13px;margin-top:6px}
.pick{width:100%;border-collapse:collapse;margin:4px 0}.pick td{padding:7px 3px;border-bottom:1px solid var(--line);font-size:13.5px}.pick td.v{text-align:right;font-weight:800;font-size:12px;white-space:nowrap}
.ssls{margin:8px 0}.ssl{background:linear-gradient(180deg,#fff8ef,#fdf3f6);border:1px solid #f1e4d6;border-radius:10px;padding:9px 12px;font-size:12.5px;margin-top:6px}.ssl b{color:var(--deep)}
.rel{background:#fff;border-radius:12px;padding:11px 13px;margin-top:8px}.rh{font-weight:800;color:var(--deep);font-size:14px}.rh em{background:#f0ece0;color:#8a7a52;font-size:11px;border-radius:999px;padding:2px 8px;font-style:normal;margin-left:4px}.rel p{font-size:12.5px;color:var(--ink2);margin-top:4px}
.gem{background:linear-gradient(180deg,#fff6ec,#fbf1fb);border:1px solid #f0e2d6;border-radius:12px;padding:11px 13px;margin-top:8px;font-size:12.5px}
.disc{font-size:11.5px;color:var(--ink2);text-align:center;padding:24px 10px;line-height:1.7}
</style></head><body><div class="wrap">
<div class="cover"><div class="k">${esc(p.baby?.due_from || '')} ~ ${esc(p.baby?.due_to || '')}</div><h1>우리 아기<br>스케치북</h1><div class="s">— 곧 만날 아기의 타고난 결 —</div></div>
<div class="letter"><div class="q">“아직 이름도 없는 제가,<br>어떤 결을 안고 태어날까요.”</div><p>보내주신 출산 가능일 중, 사주가 가장 조화롭게 짜이는 <b>세 날짜</b>를 골라 아기의 타고난 결을 하나하나 그려두었어요. 🤍</p></div>
<div class="pcard"><div class="bh">우리는 어떤 부모일까</div>${parents}</div>
${body}
<div class="disc">본 리포트는 사주명리 해석에 근거한 참고 자료이며, 정해진 미래나 의학적 판단을 제공하지 않아요.<br>출산 시기·방법은 반드시 주치의와 상의해 주세요.</div>
</div></body></html>`;
}
module.exports = { renderReport };
