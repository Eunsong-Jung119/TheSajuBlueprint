// ═══════════════════════════════════════════════════════════
// renderDeepReport(report, mountEl)
// 결제 후 심층 리포트 5섹션 렌더 (크림+다크브라운 톤)
// report = { target_name, sections:[
//   {id:1..4, title, subsections:[{subtitle, body, checkpoint}], evidence},
//   {id:5, title, subtitle, approach, timeline:[6], best_time, caution_time, tip}
// ]}
// rate-index.html <script> 안에 그대로 붙여넣어 사용.
// ═══════════════════════════════════════════════════════════

(function () {
  var RC = {
    pageBg:  '#1a1410',
    cardBg:  '#faf6ef',
    head:    '#241c14',
    gold:    '#c9a96a',
    goldTx:  '#8a5a2b',
    txt:     '#3a322a',
    sub:     '#9a8f7d',
    label:   '#b09a78',
    subBg:   '#fffdf8',   // subsection 카드 배경
    subLine: '#efe6d5',   // subsection 구분선
    cpBg:    '#f6ede0',   // checkpoint 배경
    cpTx:    '#8a5a2b',   // checkpoint 텍스트
    line:    '#ece3d3',
    mono:    '#a99c87',
    monoBg:  '#f3ece0',
    actBg:   '#f6ede0',
    me:      '#c9844a',
    him:     '#5a6b7a',
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── 섹션 1~4 (subsections 형) ──
  function renderTextSection(sec, idx) {
    var num = ('0' + (idx + 1)).slice(-2);

    var subs = (sec.subsections || []).map(function (ss, i) {
      var last = i === (sec.subsections.length - 1);
      // checkpoint: '→' 로 시작하면 그대로, 아니면 붙여줌
      var cpRaw = ss.checkpoint || '';
      var cp = cpRaw
        ? '<div style="margin-top:10px;background:' + RC.cpBg + ';border-radius:9px;padding:9px 12px;font-size:12.5px;line-height:1.7;color:' + RC.cpTx + ';font-weight:500;">'
            + esc(cpRaw) + '</div>'
        : '';
      return '<div style="padding:15px 0;' + (last ? '' : 'border-bottom:1px solid ' + RC.subLine + ';') + '">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">'
        +   '<span style="flex:0 0 auto;width:5px;height:16px;border-radius:3px;background:' + RC.gold + ';"></span>'
        +   '<span style="font-size:14.5px;font-weight:600;color:#2a2118;line-height:1.35;">' + esc(ss.subtitle) + '</span>'
        + '</div>'
        + '<div style="font-size:13.5px;line-height:1.9;color:' + RC.txt + ';">' + esc(ss.body) + '</div>'
        + cp
        + '</div>';
    }).join('');

    return ''
      + '<div style="background:' + RC.cardBg + ';border-radius:14px;overflow:hidden;">'
      +   '<div style="background:' + RC.head + ';padding:16px 18px;border-bottom:2px solid ' + RC.gold + ';">'
      +     '<div style="font-size:10px;letter-spacing:2px;color:' + RC.gold + ';margin-bottom:6px;">' + num + '</div>'
      +     '<div style="font-size:17px;font-weight:500;color:#f7f1e6;line-height:1.4;">' + esc(sec.title) + '</div>'
      +   '</div>'
      +   '<div style="padding:4px 18px 16px;">'
      +     subs
      +   '</div>'
      + '</div>';
  }

  // ── 섹션 5 (타임라인형) ──
  function renderTimelineSection(sec) {
    var months = (sec.timeline || []).map(function (t) {
      var fire = t.emoji === '🔥';
      var warn = t.emoji === '⚠️';
      var cardStyle, headTx, labelPill, meTx, himTx, actStyle, extra = '';
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
        +   (t.label ? '<span style="font-size:10px;' + labelPill + 'padding:2px 8px;border-radius:10px;">' + esc(t.label) + '</span>' : '')
        + '</div>'
        + '<div style="font-size:12px;line-height:1.65;color:' + meTx + ';margin-bottom:3px;"><b style="color:' + RC.me + ';">나</b> · ' + esc(t.femaleFlow) + '</div>'
        + '<div style="font-size:12px;line-height:1.65;color:' + himTx + ';margin-bottom:7px;"><b style="color:' + RC.him + ';">그</b> · ' + esc(t.maleFlow) + '</div>'
        + '<div style="font-size:12.5px;font-weight:500;border-radius:8px;padding:7px 10px;' + actStyle + '">→ ' + esc(t.verdict) + '</div>'
        + '</div>';
    }).join('');

    // best/caution/tip 을 섹션1~4 subsection 과 동일한 언어로 통일:
    // [골드 세로바 + 소제목] → 본문 → (있으면) 크림 checkpoint 박스
    function conclusionBlock(icon, heading, meta, body, boxed, last) {
      var titleTx = esc(icon + ' ' + heading) + (meta ? '<span style="font-weight:400;color:' + RC.sub + ';"> · ' + esc(meta) + '</span>' : '');
      var bodyHtml = boxed
        ? '<div style="margin-top:0;background:' + RC.cpBg + ';border-radius:9px;padding:9px 12px;font-size:12.5px;line-height:1.7;color:' + RC.cpTx + ';font-weight:500;">' + esc(body) + '</div>'
        : '<div style="font-size:13.5px;line-height:1.9;color:' + RC.txt + ';">' + esc(body) + '</div>';
      return '<div style="padding:15px 0;' + (last ? '' : 'border-bottom:1px solid ' + RC.subLine + ';') + '">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">'
        +   '<span style="flex:0 0 auto;width:5px;height:16px;border-radius:3px;background:' + RC.gold + ';"></span>'
        +   '<span style="font-size:14.5px;font-weight:600;color:#2a2118;line-height:1.35;">' + titleTx + '</span>'
        + '</div>'
        + bodyHtml
        + '</div>';
    }

    var conclHtml = '';
    if (sec.best_time)    conclHtml += conclusionBlock('🔥', '가장 좋은 시기', sec.best_time.month, sec.best_time.reason, false, false);
    if (sec.caution_time) conclHtml += conclusionBlock('⚠️', '주의 시기', sec.caution_time.month, sec.caution_time.reason, false, false);
    if (sec.tip)          conclHtml += conclusionBlock('💡', '지금 할 것', '', String(sec.tip).replace(/^💡\s*/, ''), true, true);

    return ''
      + '<div style="background:' + RC.cardBg + ';border-radius:14px;overflow:hidden;">'
      +   '<div style="background:' + RC.head + ';padding:16px 18px;border-bottom:2px solid ' + RC.gold + ';">'
      +     '<div style="font-size:10px;letter-spacing:2px;color:' + RC.gold + ';margin-bottom:6px;">05</div>'
      +     '<div style="font-size:17px;font-weight:500;color:#f7f1e6;line-height:1.4;">' + esc(sec.title) + '</div>'
      +     '<div style="font-size:12px;color:' + RC.sub + ';margin-top:5px;">' + esc(sec.subtitle || '') + '</div>'
      +   '</div>'
      +   '<div style="padding:16px 18px 4px;">'
      +     (sec.approach ? '<div style="font-size:13px;line-height:1.85;color:' + RC.txt + ';margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid ' + RC.line + ';">' + esc(sec.approach) + '</div>' : '')
      +     '<div style="display:flex;flex-direction:column;gap:8px;">' + months + '</div>'
      +   '</div>'
      +   '<div style="padding:0 18px 12px;">' + conclHtml + '</div>'
      + '</div>';
  }

  // ── 메인 ──
  function renderDeepReport(report, mountEl) {
    if (!report || !Array.isArray(report.sections)) return '';
    var sections = report.sections;
    var inner = '';

    inner += '<div style="text-align:center;padding:8px 0 4px;">'
      + '<div style="font-size:10px;letter-spacing:3px;color:' + RC.gold + ';">THE SAJU BLUEPRINT · DEEP ANALYSIS</div>'
      + '<div style="font-size:20px;font-weight:500;color:#f7f1e6;margin-top:8px;font-family:serif;">"' + esc(report.target_name || '그') + '" 심층 분석 리포트</div>'
      + '<div style="font-size:11px;color:' + RC.sub + ';margin-top:4px;">사주명리로 본 그 사람, 그리고 너</div>'
      + '</div>';

    var textIdx = 0;
    sections.forEach(function (sec) {
      if (sec.timeline || sec.id === 5) {
        inner += renderTimelineSection(sec);
      } else {
        inner += renderTextSection(sec, textIdx);
        textIdx++;
      }
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
  if (typeof module !== 'undefined' && module.exports) module.exports = { renderDeepReport: renderDeepReport };
})();