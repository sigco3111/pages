## 노션 Markdown → GitHub Pages

노션에서 Markdown을 내려받아 `md_page/` 폴더에 넣고 정적 사이트를 빌드해 GitHub Pages에 배포하는 프로젝트입니다. 카드형 UI, 전역 검색, 카테고리/태그 필터를 제공합니다.

### 특징
- 카드 그리드 UI(썸네일/카테고리/발견일 뱃지)
- 전역 검색(Fuse.js) + 카테고리/기간/즐겨찾기 필터
- 사용자가 주기적으로 노션에서 Markdown을 내려받아 `md_page/`에 추가/커밋하면, GitHub Actions가 인덱스 생성/빌드/배포를 자동 수행
- 접근성/SEO 최적화(시맨틱 마크업, 메타 태그)

### 기술 스택
- Astro 4 + TypeScript(정적 사이트 생성, 동적 라우트 프리렌더)
- Fuse.js(클라이언트 전역 검색)
- Sharp, png-to-ico(파비콘 PNG/ICO 자동 생성)
- GitHub Actions(빌드·배포 자동화, 실패 시 이슈 생성)
- Node.js 20(개발/CI 런타임)
- CSS(경량 글로벌 스타일)

### 디렉터리 구조(초기)
```
pages/
  md_page/           # 노션에서 가져온 Markdown 원본
  public/
    index.json       # 빌드시 생성되는 검색 인덱스
    assets/          # 썸네일/OG 캐시(선택)
  PRD.md             # 제품 요구사항
  README.md          # 본 문서
```

### 요구 사항
- Node.js ≥ 18, pnpm 또는 npm

### 빠른 시작(로컬 미리보기)
1) 의존성 설치
```bash
npm install
```
2) Markdown 추가/갱신 후, 인덱스 생성 → 빌드 → 개발 서버 실행
```bash
npm run index   # md_page/*.md → public/index.json 재생성
npm run build   # 새 슬러그 프리렌더(정적 출력)
npm run dev     # 로컬 미리보기
```
3) 브라우저에서 `http://localhost:4321/pages/` 접속

### 빌드만 수행
```bash
npm run index && npm run build
```
빌드 시 `public/index.json`이 생성/갱신되고, 상세 페이지가 프리렌더됩니다.

### 배포(GitHub Pages)
1) 리포지토리 Settings → Pages 활성화(브랜치 또는 GitHub Actions)
2) `main`에 커밋/푸시하면 Actions가 자동으로 `index → build → deploy`를 실행합니다.

### GitHub Actions 자동 배포(수동 동기화 가정)
사용자는 노션에서 Markdown을 내려받아 `md_page/`에 추가하고 커밋/푸시합니다. 워크플로는 인덱스 생성 → 빌드 → Pages 배포를 수행합니다.

워크플로 예시(`.github/workflows/deploy.yml`):
```yaml
name: Build and Deploy
on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci --no-fund --no-audit
      - name: Build index
        run: npm run index
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### GitHub Pages 설정 가이드
- Repo → Settings → Pages
  - Source: Deploy from a branch
  - Branch: `gh-pages` / `(root)` 선택 → Save
  - Enforce HTTPS: 체크
- Repo → Settings → Actions → General
  - Workflow permissions: Read and write permissions 선택(gh-pages 푸시 권한)
- 첫 배포 전: main 브랜치에 커밋/푸시 → Actions가 `gh-pages` 생성 → 위 Pages 화면에서 `gh-pages`를 지정

프로젝트 사이트(서브패스) 주의사항
- 레포가 사용자/조직 사이트가 아니라면 최종 URL은 `https://{username}.github.io/{repo}/` 형태입니다.
- 이 경우 Astro에 base를 지정하고, 정적 경로는 `import.meta.env.BASE_URL`을 사용하세요.

`astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', base: '/<repo>/' });
```

코드에서의 경로 예시
```js
// 데이터 로드
fetch(`${import.meta.env.BASE_URL}index.json`)
// 상세 링크
const href = `${import.meta.env.BASE_URL}post/${slug}`
```

### 데이터 파싱 규칙
- 프론트매터가 없을 경우, 본문 상단 라벨을 파싱하여 메타로 변환합니다.
  - `# 제목`, `발견일: YYYY/MM/DD`, `원문 URL: ...`, `분류: ...`, `원문 Source: ...`, `즐겨찾기: Yes|No`

### 개발 로드맵(요약)
- v0.1: UI 스켈레톤/그리드/검색 바
- v0.2: Fuse.js 검색/카테고리 필터/하이라이트
- v0.3: 상세 뷰/SEO/사이트맵/OG
- v1.0: 수동 동기화 + Pages 자동 배포
- v1.1: 이미지 캐싱/LQIP, 인덱스 최적화

### 라이선스
사내/개인 용도에 맞게 지정하세요. 기본은 MIT 제안.


