// ═══════════════════════════════════════════════════════════
// renderDeepReport(report, mountEl)
// 결제 후 심층 리포트 5섹션 렌더 (크림+다크브라운 톤)
// report = { target_name, cards:[ {id,title,subtitle,visual,body,evidence} x4,
//                                 + card5 {id,title,subtitle,approach,timeline[6],best_time,caution_time,tip} ] }
// rate-index.html <script> 안에 그대로 붙여넣어 사용.
// ═══════════════════════════════════════════════════════════

(function () {
  // 색 토큰 (티저 RP 톤과 동일)
  var RC = {
    pageBg:  '#1a1410',
    cardBg:  '#faf6ef',
    head:    '#241c14',
    gold:    '#c9a96a',
    goldTx:  '#8a5a2b',
    txt:     '#3a322a',
    sub:     '#9a8f7d',
    label:   '#b09a78',
    pillBg:  '#f6ebdb',
    pillTx:  '#8a5a2b',
    line:    '#ece3d3',
    mono:    '#a99c87',
    monoBg:  '#f3ece0',
    actBg:   '#f6ede0',
    me:      '#c9844a',   // 나
    him:     '#5a6b7a',   // 그
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── visual 렌더러 ──
  function vTags(v) {
    var items = (v.items || []).map(function (it) {
      return '<span style="font-size:12px;font-weight:600;color:' + RC.pillTx + ';background:' + RC.pillBg + ';padding:5px 11px;border-radius:20px;">' + esc(it) + '</span>';
    }).join('');
    return '<div style="font-size:10px;color:' + RC.label + ';margin-bottom:8px;letter-spacing:.5px;">' + esc(v.label || '') + '</div>'
         + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">' + items + '</div>';
  }

  function vContrast(v) {
    var outer = (v.outer || []).map(function (it) {
      return '<span style="font-size:12px;font-weight:600;color:' + RC.pillTx + ';background:' + RC.pillBg + ';padding:5px 11px;border-radius:20px;">' + esc(it) + '</span>';
    }).join('');
    var inner = (v.inner || []).map(function (it) {
      return '<span style="font-size:12px;font-weight:600;color:#fff;background:' + RC.goldTx + ';padding:5px 11px;border-radius:20px;">' + esc(it) + '</span>';
    }).join('');
    return '<div style="margin-bottom:14px;">'
      + '<div style="font-size:10px;color:' + RC.label + ';margin-bottom:6px;letter-spacing:.5px;">남들이 보는 겉모습</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + outer + '</div>'
      + '<div style="text-align:center;color:' + RC.gold + ';font-size:14px;margin:9px 0;">↓ 사실은</div>'
      + '<div style="font-size:10px;color:' + RC.label + ';margin-bottom:6px;letter-spacing:.5px;">진짜 속마음</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + inner + '</div>'
      + '</div>';
  }

  function vRanking(v) {
    var rows = (v.items || []).map(function (pair, i) {
      var first = i === 0;
      var numBg = first ? RC.goldTx : RC.line;
      var numTx = first ? '#fff' : RC.label;
      var labTx = first ? '#1a1410' : RC.txt;
      var labW  = first ? '600' : '400';
      var border = i < (v.items.length - 1) ? 'border-bottom:1px solid ' + RC.line + ';' : '';
      return '<div style="display:flex;align-items:center;gap:11px;padding:9px 0;' + border + '">'
        + '<span style="flex:0 0 24px;height:24px;border-radius:50%;background:' + numBg + ';color:' + numTx + ';font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;">' + (i + 1) + '</span>'
        + '<span style="flex:1;font-size:14px;font-weight:' + labW + ';color:' + labTx + ';">' + esc(pair[0]) + '</span>'
        + '<span style="font-size:11px;color:' + (first ? RC.goldTx : RC.label) + ';">' + esc(pair[1]) + '</span>'
        + '</div>';
    }).join('');
    return '<div style="display:flex;flex-direction:column;gap:2px;margin-bottom:14px;">' + rows + '</div>';
  }

  function vTransform(v) {
    var nTags = (v.normalTags || []).map(function (it) {
      return '<span style="font-size:12px;font-weight:600;color:#6b6256;background:#fff;padding:5px;border-radius:8px;">' + esc(it) + '</span>';
    }).join('');
    var wTags = (v.withHimTags || []).map(function (it) {
      return '<span style="font-size:12px;font-weight:600;color:#f0e6d4;background:#3a2e22;padding:5px;border-radius:8px;">' + esc(it) + '</span>';
    }).join('');
    return '<div style="display:flex;align-items:stretch;gap:10px;margin-bottom:14px;">'
      + '<div style="flex:1;background:' + RC.monoBg + ';border-radius:10px;padding:12px;text-align:center;">'
      + '<div style="font-size:10px;color:' + RC.label + ';margin-bottom:8px;">' + esc(v.normalLabel || '평소의 너') + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:5px;">' + nTags + '</div></div>'
      + '<div style="display:flex;align-items:center;color:' + RC.gold + ';font-size:18px;">→</div>'
      + '<div style="flex:1;background:' + RC.head + ';border-radius:10px;padding:12px;text-align:center;">'
      + '<div style="font-size:10px;color:' + RC.gold + ';margin-bottom:8px;">' + esc(v.withHimLabel || '그 앞에서의 너') + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:5px;">' + wTags + '</div></div>'
      + '</div>';
  }

  function renderVisual(v) {
    if (!v || !v.type) return '';
    if (v.type === 'tags')      return vTags(v);
    if (v.type === 'contrast')  return vContrast(v);
    if (v.type === 'ranking')   return vRanking(v);
    if (v.type === 'transform') return vTransform(v);
    return '';
  }

  // ── 카드1~4 (본문형) ──
  function renderTextCard(c, idx) {
    var num = ('0' + (idx + 1)).slice(-2);
    return ''
      + '<div style="background:' + RC.cardBg + ';border-radius:14px;overflow:hidden;">'
      +   '<div style="background:' + RC.head + ';padding:16px 18px;border-bottom:2px solid ' + RC.gold + ';">'
      +     '<div style="font-size:10px;letter-spacing:2px;color:' + RC.gold + ';margin-bottom:6px;">' + num + '</div>'
      +     '<div style="font-size:17px;font-weight:500;color:#f7f1e6;line-height:1.4;">' + esc(c.title) + '</div>'
      +     '<div style="font-size:12px;color:' + RC.sub + ';margin-top:5px;">' + esc(c.subtitle || '') + '</div>'
      +   '</div>'
      +   '<div style="padding:16px 18px;">'
      +     renderVisual(c.visual)
      +     '<div style="font-size:13.5px;line-height:1.9;color:' + RC.txt + ';">' + esc(c.body) + '</div>'
      +     (c.evidence ? '<div style="margin-top:14px;padding:11px 13px;background:' + RC.monoBg + ';border-radius:10px;font-size:11px;color:' + RC.mono + ';font-family:monospace;">' + esc(c.evidence) + '</div>' : '')
      +   '</div>'
      + '</div>';
  }

  // ── 카드5 (타임라인형) ──
  function renderTimelineCard(c) {
    var months = (c.timeline || []).map(function (t) {
      var fire = t.emoji === '🔥';
      var warn = t.emoji === '⚠️';
      var cardStyle, headTx, labelPill, meTx, himTx, actStyle;
      if (fire) {
        cardStyle = 'border:2px solid ' + RC.gold + ';background:#fbf3e4;';
        headTx = RC.goldTx;
        labelPill = 'color:#fff;background:' + RC.gold + ';';
        meTx = '#7a5a3a'; himTx = '#7a5a3a';
        actStyle = 'color:#fff;background:' + RC.goldTx + ';';
      } else if (warn) {
        cardStyle = 'border:1px solid #e0cdb0;background:#faf2e6;';
        headTx = '#9a7a4a';
        labelPill = 'color:#9a7a4a;background:#f0e4d0;';
        meTx = '#6b6256'; himTx = '#6b6256';
        actStyle = 'color:#1a1410;background:#f3e6d2;';
      } else {
        cardStyle = 'border:1px solid ' + RC.line + ';';
        headTx = '#1a1410';
        labelPill = 'color:' + RC.label + ';background:' + RC.monoBg + ';';
        meTx = '#6b6256'; himTx = '#6b6256';
        actStyle = 'color:#1a1410;background:' + RC.actBg + ';';
      }
      return '<div style="border-radius:11px;padding:12px 13px;' + cardStyle + '">'
        + '<div style="display:flex;align-items:center;gap:7px;margin-bottom:8px;">'
        +   '<span style="font-size:14px;">' + esc(t.emoji || '') + '</span>'
        +   '<span style="font-size:13px;font-weight:500;color:' + headTx + ';">' + esc(t.month) + '</span>'
        +   (t.label ? '<span style="font-size:10px;' + labelPill + 'padding:2px 8px;border-radius:10px;">' + esc(t.label) + (fire ? ' · 최고의 기회' : '') + '</span>' : '')
        + '</div>'
        + '<div style="font-size:12px;line-height:1.65;color:' + meTx + ';margin-bottom:3px;"><b style="color:' + RC.me + ';">나</b> · ' + esc(t.femaleFlow) + '</div>'
        + '<div style="font-size:12px;line-height:1.65;color:' + himTx + ';margin-bottom:7px;"><b style="color:' + RC.him + ';">그</b> · ' + esc(t.maleFlow) + '</div>'
        + '<div style="font-size:12.5px;font-weight:500;border-radius:8px;padding:7px 10px;' + actStyle + '">→ ' + esc(t.verdict) + '</div>'
        + '</div>';
    }).join('');

    var bestHtml = c.best_time ? '<div style="background:' + RC.actBg + ';border-radius:10px;padding:11px 13px;"><span style="font-size:12px;font-weight:500;color:' + RC.goldTx + ';">🔥 가장 좋은 시기 · ' + esc(c.best_time.month) + '</span><div style="font-size:12.5px;color:' + RC.txt + ';line-height:1.7;margin-top:4px;">' + esc(c.best_time.reason) + '</div></div>' : '';
    var cautHtml = c.caution_time ? '<div style="background:' + RC.monoBg + ';border-radius:10px;padding:11px 13px;"><span style="font-size:12px;font-weight:500;color:#9a7a4a;">⚠️ 주의 시기 · ' + esc(c.caution_time.month) + '</span><div style="font-size:12.5px;color:' + RC.txt + ';line-height:1.7;margin-top:4px;">' + esc(c.caution_time.reason) + '</div></div>' : '';
    var tipHtml = c.tip ? '<div style="background:' + RC.head + ';border-radius:10px;padding:12px 14px;"><div style="font-size:12.5px;color:#f0e6d4;line-height:1.75;">' + esc(c.tip) + '</div></div>' : '';

    return ''
      + '<div style="background:' + RC.cardBg + ';border-radius:14px;overflow:hidden;">'
      +   '<div style="background:' + RC.head + ';padding:16px 18px;border-bottom:2px solid ' + RC.gold + ';">'
      +     '<div style="font-size:10px;letter-spacing:2px;color:' + RC.gold + ';margin-bottom:6px;">05</div>'
      +     '<div style="font-size:17px;font-weight:500;color:#f7f1e6;line-height:1.4;">' + esc(c.title) + '</div>'
      +     '<div style="font-size:12px;color:' + RC.sub + ';margin-top:5px;">' + esc(c.subtitle || '') + '</div>'
      +   '</div>'
      +   '<div style="padding:16px 18px;">'
      +     (c.approach ? '<div style="font-size:13px;line-height:1.85;color:' + RC.txt + ';margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid ' + RC.line + ';">' + esc(c.approach) + '</div>' : '')
      +     '<div style="display:flex;flex-direction:column;gap:8px;">' + months + '</div>'
      +     '<div style="display:flex;flex-direction:column;gap:8px;margin-top:14px;">' + bestHtml + cautHtml + tipHtml + '</div>'
      +   '</div>'
      + '</div>';
  }

  // ── 메인 ──
  function renderDeepReport(report, mountEl) {
    if (!report || !Array.isArray(report.cards)) return '';
    var cards = report.cards;
    var inner = '';

    // 표지
    inner += '<div style="text-align:center;padding:8px 0 4px;">'
      + '<div style="font-size:10px;letter-spacing:3px;color:' + RC.gold + ';">THE SAJU BLUEPRINT · DEEP ANALYSIS</div>'
      + '<div style="font-size:20px;font-weight:500;color:#f7f1e6;margin-top:8px;font-family:serif;">"' + esc(report.target_name || '그') + '" 심층 분석 리포트</div>'
      + '<div style="font-size:11px;color:' + RC.sub + ';margin-top:4px;">사주명리로 본 그 사람, 그리고 너</div>'
      + '</div>';

    // 카드들
    cards.forEach(function (c, i) {
      if (c.timeline || c.id === 5) inner += renderTimelineCard(c);
      else inner += renderTextCard(c, i);
    });

    inner += '<div style="text-align:center;font-size:10px;color:#6b6256;padding:6px 0;">재미로 보는 사주 분석이에요 · sajublueprint.com</div>';

    var html = '<div style="background:' + RC.pageBg + ';border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">' + inner + '</div>';

    if (mountEl) {
      if (typeof mountEl === 'string') mountEl = document.querySelector(mountEl);
      if (mountEl) mountEl.innerHTML = html;
    }
    return html;
  }

  if (typeof window !== 'undefined') window.renderDeepReport = renderDeepReport;
})();