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

function extractFirstImage(md) {
  const m = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return m ? m[1] : undefined;
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
    const thumbnail = extractFirstImage(body || md) || undefined; // OG/기본은 UI에서 폴백 처리
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


