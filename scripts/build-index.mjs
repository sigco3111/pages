#!/usr/bin/env node
/**
 * 목적: `pages/md_page/*.md`를 파싱해 `pages/public/index.json` 검색 인덱스를 생성한다.
 * - 프론트매터(YAML) 우선, 라벨 라인 백업 파싱 지원.
 * - 썸네일 폴백: 본문 첫 이미지 → OG 캐시(미구현 자리) → 카테고리 기본.
 * - 크기 제한: 1.5MB(기본). 초과 시 오래된 항목부터 축약/제거.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MD_DIR = path.resolve(__dirname, '../md_page');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const OUTPUT = path.join(PUBLIC_DIR, 'index.json');
const SIZE_LIMIT_BYTES = Number(process.env.INDEX_SIZE_LIMIT_BYTES || 1_500_000);

/**
 * 단순 YAML 프론트매터 파서(제한적)
 */
function parseFrontmatter(md) {
  if (!md.startsWith('---\n')) return { fm: {}, body: md };
  const end = md.indexOf('\n---', 4);
  if (end === -1) return { fm: {}, body: md };
  const raw = md.slice(4, end).trim();
  const body = md.slice(end + 4).replace(/^\n+/, '');
  const fm = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_\-]*):\s*(.*)$/);
    if (m) {
      const key = m[1].trim();
      let val = m[2].trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      fm[key] = val;
    }
  }
  return { fm, body };
}

/**
 * 라벨 라인(한국어) 백업 파싱
 */
function parseLabelsFallback(md) {
  const lines = md.split(/\r?\n/).slice(0, 40); // 상단 40줄 제한
  const pick = (label) => {
    const row = lines.find(l => l.startsWith(`${label}:`));
    if (!row) return undefined;
    return row.slice(row.indexOf(':') + 1).trim();
  };
  return {
    title: (lines.find(l => l.startsWith('# ')) || '').replace(/^#\s+/, '') || undefined,
    date: pick('발견일')?.replaceAll('/', '-') || undefined,
    category: pick('분류'),
    source_url: pick('원문 URL'),
    source_name: pick('원문 Source'),
    favorite: /yes/i.test(pick('즐겨찾기') || '')
  };
}

function toISODate(s) {
  if (!s) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

// 본문에서 첫 번째 이미지 URL을 탐지한다.
// 1) 표준 마크다운 이미지: ![alt](url)
// 2) 이미지 링크 형태: [](url) 이지만 url이 이미지로 추정되는 경우(확장자/도메인 휴리스틱)
function extractFirstImage(md) {
  // 1) 표준 마크다운 이미지: 전역 탐색 후 첫 항목 반환
  const imgMd = md.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+\"[^\"]*\"|\s+\'[^\']*\')?\)/g);
  for (const m of imgMd) {
    if (m && m[1]) return m[1];
  }

  // 2) HTML <img src="...">
  const imgHtml = md.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  for (const m of imgHtml) {
    if (m && m[1]) return m[1];
  }

  // 3) 링크 [](...) 중 이미지로 추정되는 URL을 첫 항목으로 채택
  const links = md.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);
  for (const m of links) {
    const url = m && m[1];
    if (url && isLikelyImageUrl(url)) return url;
  }

  // 4) 벌크 URL 텍스트 중 이미지로 추정되는 URL 사용
  const naked = md.matchAll(/https?:\/\/[^\s)>'"\]]+/g);
  for (const m of naked) {
    const url = m && m[0];
    if (url && isLikelyImageUrl(url)) return url;
  }

  return undefined;
}

// "즐겨찾기:" 이후에 처음 등장하는 링크/이미지/URL을 썸네일로 사용한다.
// 규칙: ![]() > []() > <url> > 벌크 URL 순서에서 가장 먼저(가장 앞에) 나타나는 것을 선택
function extractThumbnailAfterBookmark(md) {
  // 규칙 강화: '즐겨찾기:' 라인이 나온 뒤, 바로 다음 줄 또는 그 다음 줄(두 줄 이내)에 한해
  // ![]() 또는 []() 또는 <url>/벌크 URL 이 존재할 때만 썸네일로 인정한다.
  const lines = md.split(/\r?\n/);
  const idx = lines.findIndex((l) => l.includes('즐겨찾기:'));
  if (idx === -1) return undefined;
  const windowLines = lines.slice(idx + 1, idx + 3); // 아래 2줄만 검사
  if (windowLines.length === 0) return undefined;
  const text = windowLines.join('\n');

  // 우선순위: 이미지 > 링크 > 꺾쇠 > 벌크 URL
  const imgMd = text.match(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/);
  if (imgMd && imgMd[1]) return imgMd[1];

  const linkMd = text.match(/\[[^\]]*\]\(([^)]+)\)/);
  if (linkMd && linkMd[1]) return linkMd[1];

  const angle = text.match(/<https?:\/\/[^>\s]+>/);
  if (angle) return angle[0].slice(1, -1);

  const naked = text.match(/https?:\/\/[^\s)>'"\]]+/);
  if (naked) return naked[0];

  // 두 줄 이내에 없으면 썸네일 없음으로 간주
  return undefined;
}

// URL이 이미지로 추정되는지 판별한다(확장자 또는 유명 CDN/호스트 휴리스틱)
function isLikelyImageUrl(url) {
  try {
    const u = new URL(url);
    const full = url.toLowerCase();
    const pathname = u.pathname.toLowerCase();
    if (/(\.png|\.jpg|\.jpeg|\.webp|\.gif|\.bmp|\.svg)(\?|#|$)/.test(pathname)) return true;
    // 쿼리스트링에 포맷 명시
    if (/(^|[?&])(format|ext|type)=(png|jpg|jpeg|webp|gif|bmp|svg)(&|$)/.test(full)) return true;
    const host = u.hostname;
    // 확장자가 없어도 이미지일 확률이 높은 호스트들
    if (/googleusercontent\.com$/.test(host)) return true;
    if (/ytimg\.com$/.test(host)) return true;
    if (/cloudfront\.net$/.test(host)) return true;
    if (/miro\.medium\.com$/.test(host)) return true;
    if (/githubusercontent\.com$/.test(host)) return true;
    if (/githubassets\.com$/.test(host)) return true;
    if (/imgur\.com$/.test(host)) return true;
    if (/twimg\.com$/.test(host)) return true;
    return false;
  } catch {
    return false;
  }
}

// YouTube URL에서 썸네일 URL 생성(폴백)
function youtubeThumbFromUrl(url) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    let id = '';
    if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v') || '';
    else if (u.hostname === 'youtu.be') id = u.pathname.replace(/^\//, '');
    if (!id) return undefined;
    return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  } catch {
    return undefined;
  }
}

function excerpt(md, max = 160) {
  const plain = md.replace(/```[\s\S]*?```/g, '').replace(/[#>*_`\-]/g, '').replace(/\s+/g, ' ').trim();
  return plain.slice(0, max);
}

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  const files = await fs.readdir(MD_DIR).catch(() => []);
  const items = [];

  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const p = path.join(MD_DIR, f);
    const md = await fs.readFile(p, 'utf8');
    const { fm, body } = parseFrontmatter(md);
    const backup = parseLabelsFallback(md);

    const title = fm.title || backup.title || f.replace(/\.md$/, '');
    const date = toISODate(fm.date || backup.date);
    const category = fm.category || backup.category;
    const source_url = fm.source_url || backup.source_url;
    const source_name = fm.source_name || backup.source_name;
    const favorite = typeof fm.favorite === 'boolean' ? fm.favorite : backup.favorite;
    const thumbnail =
      extractThumbnailAfterBookmark(body || md) ||
      extractFirstImage(body || md) ||
      youtubeThumbFromUrl(source_url) ||
      undefined; // OG/기본은 UI에서 폴백 처리
    const slug = f.replace(/\.md$/, '');

    items.push({ slug, title, date, category, source_url, source_name, favorite, thumbnail, excerpt: excerpt(body || md) });
  }

  // 최신순 정렬(날짜 없으면 뒤)
  items.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  let payload = { generatedAt: new Date().toISOString(), items };
  let json = JSON.stringify(payload);

  // 크기 제한 처리: 오래된 항목부터 제거
  while (Buffer.byteLength(json, 'utf8') > SIZE_LIMIT_BYTES && payload.items.length > 0) {
    payload.items.pop();
    json = JSON.stringify(payload);
  }

  await fs.writeFile(OUTPUT, json, 'utf8');
  console.log(`index.json generated: ${payload.items.length} items, ${Buffer.byteLength(json, 'utf8')} bytes`);
}

main().catch(err => {
  console.error('인덱스 생성 실패:', err?.message || err);
  process.exit(1);
});


