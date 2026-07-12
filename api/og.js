// api/og.js — 공유 카드 OG 이미지 (1200×630 PNG)
// /api/og?id=<reportId>
//
// 리포트는 기존 /api/get-rating-report 재사용 (Supabase 키 불필요)
// 일주/배우자궁은 lib/day-pillar.js 로 직접 계산 (GPT 미사용)
//
// 필요 패키지: @vercel/og, react
// 필요 파일:  public/fonts/Pretendard-Bold.ttf   (satori는 woff2 미지원 → ttf/otf/woff)

import { ImageResponse } from '@vercel/og';
import React from 'react';
import { dayPillar, branchRelation, isPositiveRelation } from '../lib/day-pillar.js';

export const config = { runtime: 'edge' };

const SITE = 'https://sajublueprint.com';
const W = 1200, H = 630;

// 색상 (라이트 핑크 테마)
const C = {
  bgFrom: '#fce7ee', bgMid: '#fdf1f5', bgTo: '#fbe6ee',
  ink: '#2e2126', pink: '#d9538a', pinkDeep: '#c05480',
  muted: '#8d7a82', card1Bg: '#f9dbe7', card1Bd: '#f2c2d6',
  white: '#ffffff', tile: '#fdeef2', tileHi: '#f7d9e5',
  lav: '#e6e2f8', lavTx: '#6b5f9e', pinkChip: '#fadbe6',
  track: '#eee2e7', badgeBg: '#f7e2ea', badgeTx: '#b0808f',
};

const h = React.createElement;

// satori는 textOverflow 지원이 불안정 → JS로 직접 자름
function clip(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function chip(text, bg, color, size = 26) {
  return h('div', {
    style: {
      display: 'flex', background: bg, color, fontSize: size, fontWeight: 700,
      padding: '9px 18px', borderRadius: 999, whiteSpace: 'nowrap',
    },
  }, text);
}

function header(title, accent, meStem, meBranch) {
  return h('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  }, [
    h('div', { key: 't', style: { display: 'flex', fontSize: 46, fontWeight: 700, color: C.ink, letterSpacing: '-0.04em' } }, [
      h('span', { key: 'a', style: { color: C.ink } }, title + ' '),
      h('span', { key: 'b', style: { color: C.pink } }, accent),
    ]),
    h('div', { key: 'p', style: { display: 'flex', gap: 9 } }, [
      h('div', { key: '1', style: { display: 'flex' } }, chip(`나·${meStem}${meBranch}`, C.lav, C.lavTx, 24)),
      h('div', { key: '2', style: { display: 'flex' } }, chip(`배우자궁 ${meBranch}`, C.pinkChip, C.pinkDeep, 24)),
    ]),
  ]);
}

// ── 레이아웃 A: 2명 이상 (랭킹) ─────────────────────────
function rankingCard(g, i) {
  const first = i === 0;
  const pos = isPositiveRelation(g.rel);
  return h('div', {
    key: i,
    style: {
      display: 'flex', alignItems: 'center', width: '100%',
      background: first ? C.card1Bg : C.white,
      border: first ? `2px solid ${C.card1Bd}` : '2px solid transparent',
      borderRadius: 22, padding: '22px 26px', gap: 20,
    },
  }, [
    h('div', {
      key: 'b',
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 54, height: 54, borderRadius: 999, flexShrink: 0,
        background: first ? C.pink : C.badgeBg,
        color: first ? '#fff' : C.badgeTx, fontSize: 27, fontWeight: 700,
      },
    }, String(i + 1)),
    h('div', { key: 'n', style: { display: 'flex', flex: 1, fontSize: 37, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em', whiteSpace: 'nowrap' } }, clip(g.name, 9)),
    h('div', { key: 'p1', style: { display: 'flex', flexShrink: 0 } },
      chip(`일주: ${g.pillar}`, first ? C.lav : '#f1ecf8', first ? C.lavTx : '#8f79ad', 23)),
    h('div', { key: 'p2', style: { display: 'flex', flexShrink: 0 } },
      chip(`배우자궁: ${g.rel}`, first ? C.white : '#faf2f5', pos ? C.pink : '#a68292', 23)),
    h('div', {
      key: 's',
      style: { display: 'flex', marginLeft: 8, fontSize: 66, fontWeight: 700, color: first ? C.pink : '#4a3038', flexShrink: 0 },
    }, String(g.score)),
  ]);
}

function layoutRanking(me, guys) {
  const top = guys.slice(0, 3);
  return h('div', {
    style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '42px 44px',
      backgroundImage: `linear-gradient(135deg, ${C.bgFrom} 0%, ${C.bgMid} 60%, ${C.bgTo} 100%)`,
      fontFamily: 'Pretendard',
    },
  }, [
    h('div', { key: 'h', style: { display: 'flex' } }, header('사주로 매긴', '내 남자 랭킹', me.stem, me.branch)),
    h('div', {
      key: 'l',
      style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 15, marginTop: 26 },
    }, top.map(rankingCard)),
  ]);
}

// ── 레이아웃 B: 1명 (세부 지표) ─────────────────────────
const DIMS = [
  ['heart', '감정의 깊이'], ['growth', '성장의 힘'], ['stability', '관계 안정성'],
  ['perspective', '세상을 보는 방식'], ['timing', '삶의 속도'],
];

function tile(label, val) {
  return h('div', {
    key: label,
    style: {
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      flex: 1, background: C.tile, borderRadius: 16, padding: '16px 18px',
    },
  }, [
    h('div', { key: 'l', style: { display: 'flex', fontSize: 21, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' } }, label),
    h('div', { key: 'v', style: { display: 'flex', fontSize: 42, fontWeight: 700, color: C.ink, marginTop: 6, marginBottom: 10 } }, String(val)),
    h('div', { key: 't', style: { display: 'flex', height: 7, background: C.track, borderRadius: 999, width: '100%' } },
      h('div', { style: { display: 'flex', width: `${Math.max(0, Math.min(100, val))}%`, height: '100%', background: C.pink, borderRadius: 999 } })),
  ]);
}

function totalTile(total) {
  return h('div', {
    key: 'total',
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      flex: 1, background: C.tileHi, borderRadius: 16, padding: '16px 18px',
    },
  }, [
    h('div', { key: 'l', style: { display: 'flex', fontSize: 21, fontWeight: 700, color: C.pinkDeep } }, '종합 스코어'),
    h('div', { key: 'v', style: { display: 'flex', alignItems: 'baseline', marginTop: 6 } }, [
      h('span', { key: 'a', style: { fontSize: 56, fontWeight: 700, color: C.pink } }, String(total)),
      h('span', { key: 'b', style: { fontSize: 22, fontWeight: 700, color: '#c58aa2', marginLeft: 4 } }, '/100'),
    ]),
  ]);
}

function layoutSolo(me, g) {
  const s = g.scores || {};
  return h('div', {
    style: {
      display: 'flex', flexDirection: 'column', width: W, height: H, padding: '34px 36px',
      backgroundImage: `linear-gradient(135deg, ${C.bgFrom} 0%, ${C.bgMid} 60%, ${C.bgTo} 100%)`,
      fontFamily: 'Pretendard',
    },
  }, [
    h('div', { key: 'h', style: { display: 'flex', marginBottom: 22 } }, header('사주로 본', '그 사람', me.stem, me.branch)),

    h('div', {
      key: 'panel',
      style: { display: 'flex', flexDirection: 'column', flex: 1, background: C.white, borderRadius: 24, padding: '28px 32px' },
    }, [
      h('div', { key: 'top', style: { display: 'flex', alignItems: 'center', width: '100%' } }, [
        h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', flex: 1 } }, [
          h('div', { key: 'n', style: { display: 'flex', fontSize: 46, fontWeight: 700, color: C.ink, letterSpacing: '-0.03em', whiteSpace: 'nowrap' } }, clip(g.name, 12)),
          h('div', { key: 'c', style: { display: 'flex', gap: 10, marginTop: 14 } }, [
            h('div', { key: '1', style: { display: 'flex' } }, chip(`일주: ${g.pillar}`, C.lav, C.lavTx, 25)),
            h('div', { key: '2', style: { display: 'flex' } }, chip(`배우자궁: ${g.rel}`, C.pinkChip, C.pinkDeep, 25)),
          ]),
        ]),
        h('div', { key: 'r', style: { display: 'flex', alignItems: 'baseline', flexShrink: 0 } }, [
          h('span', { key: 'a', style: { fontSize: 88, fontWeight: 700, color: C.pink } }, String(g.score)),
          h('span', { key: 'b', style: { fontSize: 24, fontWeight: 700, color: C.muted, marginLeft: 4 } }, '/100'),
        ]),
      ]),

      h('div', { key: 'div', style: { display: 'flex', height: 2, background: '#f0e6ea', margin: '20px 0 18px', width: '100%' } }),

      h('div', { key: 'g', style: { display: 'flex', flexDirection: 'column', flex: 1, gap: 13 } }, [
        h('div', { key: 'r1', style: { display: 'flex', flex: 1, gap: 13 } },
          DIMS.slice(0, 3).map(([k, label]) => tile(label, Math.round(s[k] || 0)))),
        h('div', { key: 'r2', style: { display: 'flex', flex: 1, gap: 13 } }, [
          ...DIMS.slice(3).map(([k, label]) => tile(label, Math.round(s[k] || 0))),
          totalTile(Math.round(g.score)),
        ]),
      ]),
    ]),
  ]);
}

// ── 리포트 조회 (Supabase REST 직접 호출) ─────────────
// /api/get-rating-report 를 다시 부르면 홉이 하나 더 생겨 카톡 봇 타임아웃 위험이 커짐.
async function fetchReport(id) {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error('SUPABASE env missing');
  const q = `${base}/rest/v1/rate_analyses`
    + `?id=eq.${encodeURIComponent(id)}`
    + `&select=result,my_year,my_month,my_day,partners&limit=1`;
  const res = await fetch(q, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) return null;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

// ── 폰트 (모듈 스코프 캐시 → 웜스타트 재사용) ──────────
let _font = null;
async function loadFont(origin) {
  if (_font) return _font;
  const res = await fetch(`${origin}/fonts/Pretendard-Bold.ttf`);
  if (!res.ok) throw new Error('font fetch failed: ' + res.status);
  _font = await res.arrayBuffer();
  return _font;
}

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response('missing id', { status: 400 });

    const origin = url.origin;
    const [font, rep] = await Promise.all([
      loadFont(origin),
      fetchReport(id),
    ]);
    if (!rep || !rep.result) return new Response('not found', { status: 404 });

    // 내 일주
    const mp = dayPillar(rep.my_year, rep.my_month, rep.my_day);
    const me = { stem: mp.stem, branch: mp.branch };

    let partners = rep.partners;
    if (typeof partners === 'string') { try { partners = JSON.parse(partners); } catch { partners = []; } }
    partners = Array.isArray(partners) ? partners : [];

    const results = rep.result.results || [];
    const sameLen = partners.length === results.length;

    const guys = results
      .map((r, i) => {
        // GPT가 닉네임을 임의로 바꾸는 경우가 있음(예: "4년 만난 전남친" → "전남친 1").
        // ① 이름 매칭 → ② 개수가 같으면 인덱스 매칭 → ③ 실패 시 사주 생략.
        let p = partners.find(x => (x.nickname || x.name) === r.name) || null;
        if (!p && sameLen) p = partners[i] || null;

        const dp = (p && p.year && p.month && p.day) ? dayPillar(p.year, p.month, p.day) : null;
        return {
          // 유저가 직접 쓴 닉네임이 GPT 리네임보다 훨씬 좋음 → 원본 우선
          name: (p && (p.nickname || p.name)) || r.name,
          score: Math.round(r.scores?.total || 0),
          scores: r.scores || {},
          pillar: dp ? dp.pillar : '—',
          rel: dp ? branchRelation(mp.branch, dp.branch) : '—',
        };
      })
      .sort((a, b) => b.score - a.score);

    if (!guys.length) return new Response('no results', { status: 404 });

    const tree = guys.length === 1 ? layoutSolo(me, guys[0]) : layoutRanking(me, guys);

    return new ImageResponse(tree, {
      width: W, height: H,
      fonts: [{ name: 'Pretendard', data: font, weight: 700, style: 'normal' }],
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch (e) {
    console.error('[og] fail', e);
    return new Response('og error', { status: 500 });
  }
}
