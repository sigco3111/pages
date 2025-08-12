/**
 * 목적: 홈 그리드 페이지 클라이언트 스크립트. index.json 로드, Fuse.js 검색, 필터/렌더 관리.
 */
import Fuse from 'fuse.js';

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
          <a class="card" href="${import.meta.env.BASE_URL}post/${item.slug}" aria-label="${item.title} 상세 보기">
            ${item.thumbnail ? `<img class="thumb" src="${item.thumbnail}" alt="" loading="lazy" />` : `<div class="thumb"></div>`}
            <div class="meta">${item.category ? `<span class=tab>${item.category}</span>` : ''}${
        item.date ? `<span>${item.date}</span>` : ''
      }</div>
            <div class="title">${item.title}</div>
          </a>`
    )
    .join('');
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
    const fuse = new Fuse(list, { keys: ['title', 'category', 'source_name', 'source_url', 'excerpt'], threshold: 0.35 });
    list = fuse.search(state.query).map((r) => r.item);
  }
  state.filtered = list;
  render();
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// 초기화
fetch(`${import.meta.env.BASE_URL}index.json`)
  .then((r) => r.json())
  .then((data) => {
    state.items = data.items || [];
    const cats = Array.from(new Set(state.items.map((i: any) => i.category).filter(Boolean))).sort();
    renderTabs(cats);
    applyFilters();
  })
  .catch(() => {
    // index.json을 찾지 못하면 빈 상태로 유지
    state.items = [];
    renderTabs([]);
    applyFilters();
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


