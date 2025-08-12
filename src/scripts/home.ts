/**
 * 목적: 홈 그리드 페이지 클라이언트 스크립트. index.json 로드, Fuse.js 검색, 필터/렌더 관리.
 */
import Fuse from 'fuse.js';

// BASE 경로: 메타 태그 → import.meta.env.BASE_URL → '/'
function getBaseUrl(): string {
  const meta = document.querySelector('meta[name="app-base"]') as HTMLMetaElement | null;
  let base = meta?.getAttribute('content') || (import.meta as any)?.env?.BASE_URL || '/';
  if (!base.endsWith('/')) base += '/';
  return base;
}
const BASE = getBaseUrl();

const state: {
  items: any[];
  filtered: any[];
  category: string;
  query: string;
} = { items: [], filtered: [], category: 'ALL', query: '' };

const grid = document.getElementById('grid') as HTMLDivElement;
const tabs = document.getElementById('tabs') as HTMLDivElement;
const q = document.getElementById('q') as HTMLInputElement;

function render() {
  if (!grid) return;
  grid.innerHTML = state.filtered
    .map(
      (item) => `
          <a class="card" href="${BASE}post/${item.slug}" aria-label="${item.title} 상세 보기">
            ${item.thumbnail ? `<img class="thumb" src="${item.thumbnail}" alt="" loading="lazy" />` : `<div class="thumb"></div>`}
            <div class="meta">${item.category ? `<span class=tab>${item.category}</span>` : ''}${
        item.date ? `<span>${item.date}</span>` : ''
      }</div>
            <div class="title">${item.title}</div>
          </a>`
    )
    .join('');
  console.log('[home] render', { filtered: state.filtered.length, children: grid.children.length });
}

function renderTabs(categories: string[]) {
  if (!tabs) return;
  tabs.innerHTML = ['ALL', ...categories]
    .map(
      (cat) => `
          <button class="tab ${state.category === cat ? 'active' : ''}" data-cat="${cat}" role="tab" aria-selected="${
            state.category === cat
          }">${cat}</button>`
    )
    .join('');
}

function applyFilters() {
  let list = state.items;
  if (state.category !== 'ALL') list = list.filter((i) => i.category === state.category);
  if (state.query) {
    // 검색 키 설명: URL(`source_url`)은 'https'에 포함된 'tts' 때문에 과도 매칭이 발생하므로 제외
    const SEARCH_KEYS = ['title', 'category', 'source_name', 'excerpt'];
    const fuse = new Fuse(list, {
      keys: SEARCH_KEYS,
      threshold: 0.3,          // 조금 더 엄격하게
      ignoreLocation: true,    // 위치 무시, 전체 텍스트 대상으로
      minMatchCharLength: 2,   // 최소 2자 이상일 때 매칭
      distance: 100
    } as any);
    list = fuse.search(state.query).map((r) => r.item);
  }
  state.filtered = list;
  render();
  console.log('[home] applyFilters', { category: state.category, query: state.query, filtered: state.filtered.length });
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// 초기화
fetch(`${BASE}index.json`)
  .then((r) => r.json())
  .then((data) => {
    state.items = data.items || [];
    const cats = Array.from(new Set(state.items.map((i: any) => i.category).filter(Boolean))).sort();
    renderTabs(cats);
    applyFilters();
    console.log('[home] index.json loaded', { items: state.items.length, base: BASE });
  })
  .catch((err) => {
    // index.json을 찾지 못하면 빈 상태로 유지
    state.items = [];
    renderTabs([]);
    applyFilters();
    console.error('[home] index.json load failed', err?.message || err);
  });

tabs?.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('button.tab') as HTMLButtonElement | null;
  if (!btn) return;
  state.category = btn.dataset.cat || 'ALL';
  const cats = Array.from(tabs.querySelectorAll('button.tab')).map((b) => (b as HTMLButtonElement).dataset.cat!).filter((c) => c !== 'ALL');
  renderTabs(cats);
  applyFilters();
});

q?.addEventListener('input', debounce(() => { state.query = (q.value || '').trim(); applyFilters(); }, 200));


