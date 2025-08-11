## 제품 요구사항 문서(PRD) — Notion → GitHub Pages 뉴스보드

문서버전: v1.0 • 작성일: 2025-08-11 • 오너: @hjshin • 상태: 승인대기

### 1) 배경과 목표
- **핵심 목표**: 노션에서 주기적으로 수집한 글(메모/기사/링크)을 `md_page/`에 Markdown으로 저장하고, GitHub Pages로 자동 배포하여 누구나 빠르게 탐색/검색/분류별 열람.
- **비전**: “수집 → 정리 → 탐색” 전 과정을 자동화. 이미지 썸네일이 있는 카드형 UI, 빠른 전역 검색, 카테고리/태그별 필터, 날짜 섹션(오늘/어제).

### 2) 성공지표(KPIs)
- Lighthouse 성능 ≥ 90, 접근성 ≥ 90, SEO ≥ 90(모바일/데스크톱)
- 초기 로드 TTI ≤ 2.5s, LCP ≤ 2.5s(광대역 기준)
- 클라이언트 검색 인덱스(JSON) 크기 ≤ 1.5MB, 최초 페치 ≤ 300ms(캐시 후 ≤ 50ms)
- 크론 기반 동기화 성공률 ≥ 99%(30일)

### 3) 범위(In-scope) / 비범위(Out-of-scope)
- In: 카드형 홈 UI, 전역 검색, 카테고리/태그/즐겨찾기 필터, 상세 뷰, 반응형, 이미지 썸네일, GitHub Actions 동기화+배포, 기존 `md_page/` 파일 호환 파서.
- Out: 사용자 로그인/권한, 서버 검색(초기엔 전부 클라이언트 검색), 댓글/좋아요, 다국어(초기 한국어 고정).

### 4) 주요 사용자와 요구
- **에디터(Owner)**: 노션에 링크/메모 등록 → 자동으로 사이트 반영되길 원함. 실패 시 재시도/로그 확인 필요.
- **방문자(User)**: 한눈에 최신/인기/카테고리별 글을 탐색하고, 제목/본문/태그로 빠르게 검색.

### 5) UX 개요
- 상단: 로고/검색창/정렬(최신/인기)/카테고리 탭(뉴스, 오픈소스, 인사이트, TIP 등).
- 본문: 섹션 `오늘`, `어제`, 이후 `최근`(무한 스크롤 또는 페이지네이션). 3~5열 카드 그리드.
- 카드: 썸네일(있으면), 제목, 배지(카테고리), 발견일 뱃지, 출처, 즐겨찾기 표식.
- 상세: Markdown 렌더, 원문 링크, 메타정보, 관련 태그.

### 6) 기능 요구사항(Functional)
1. 홈 피드/그리드
   - 날짜 기준 섹션 구분: 오늘, 어제, 최근(7/30/전체 필터)
   - 정렬: 기본=발견일 최신순. 보조=제목 가나다순
   - 반응형: 모바일 1열, 태블릿 2–3열, 데스크톱 4–5열
2. 검색
   - 클라이언트 검색(Fuse.js): 제목, 원문 URL, 본문 요약, 태그, 분류 필드 인덱싱
   - 디바운스(200ms), 결과 하이라이트, 무한 스크롤
3. 필터링/탭
   - 카테고리: `분류` 값(뉴스, 오픈소스, 인사이트, TIP 등)로 필터
   - 태그/즐겨찾기/기간(오늘/어제/7일/30일/전체) 토글
4. 상세 뷰
   - Markdown 렌더, 외부 링크는 새 탭, 코드/이미지/표 지원
   - 메타정보 패널: 발견일, 분류, 원문 Source/URL, 즐겨찾기 상태
5. 이미지 처리
   - 우선순위: (a) 문서 내 첫 이미지 → (b) Open Graph 프리뷰 URL → (c) 카테고리별 기본 썸네일
   - Lazy-load, LQIP/Blur Placeholder
6. 접근성/SEO
   - 시맨틱 마크업, 키보드 내비게이션, ARIA 라벨, 메타태그/OG/Twitter 카드

### 7) 비기능 요구사항(NFR)
- 정적 빌드(SSG)로 GitHub Pages 배포. 빌드 산출물은 캐시 헤더와 해시 파일명으로 장기 캐싱.
- 검색 인덱스는 빌드시 `index.json`로 생성(증분 빌드 지원). Markdown 원문은 필요 시 on-demand fetch.
- 브라우저 호환: 최근 2개 메이저 버전(Chromium/Firefox/Safari/iOS Safari)

### 8) 데이터 모델
소스는 노션 → Markdown(`md_page/*.md`). 메타 추출 규칙(프론트매터가 없을 경우 헤더 파싱):
```
title: # 첫 번째 H1
date:  '발견일: YYYY/MM/DD'
category: '분류: XXX'
source_url: '원문 URL:'
source_name: '원문 Source:'
favorite: '즐겨찾기: Yes|No'
tags:  본문 해시태그 or 분류 기반 유추(옵션)
thumbnail: 본문 첫 이미지 URL 또는 OG 캐싱 URL
slug: 파일명 slug (공백→-)
```
검색 인덱스(`public/index.json`) 예시:
```json
{
  "generatedAt": "2025-08-11T12:00:00Z",
  "items": [
    {
      "slug": "gpt-5-공개-geeknews-751564a9a160499bb91e27985352d65b",
      "title": "GPT-5 공개 GeekNews",
      "date": "2025-08-10",
      "category": "뉴스",
      "source_url": "https://...",
      "source_name": "🔗geeknews",
      "favorite": false,
      "tags": ["AI","모델"],
      "thumbnail": "/assets/og/gpt5.png",
      "excerpt": "요약 텍스트 160자 내외"
    }
  ]
}
```

### 9) 동기화/배포 플로우
1) 스케줄(크론) GitHub Actions → 노션 API 호출 → 새/변경 글을 Markdown으로 변환하여 `md_page/`에 저장(이미지/OG는 `assets/` 캐싱 선택적)
2) 빌드 작업(SSG)에서 메타 파싱 → `index.json` 생성 → 정적 산출물 빌드
3) GitHub Pages에 배포(브랜치 `gh-pages` 또는 Pages 전용 설정)
4) 실패 시 알림(워크플로우 로그 + 이슈 오픈)

Secrets/설정
- `NOTION_API_KEY`, `NOTION_DATABASE_ID`
- `PAGES_TOKEN`(필요 시), Pages 환경 설정

### 10) 기술 스택 제안
- 정적 사이트: Astro(빠른 MD 처리/섹션화 용이) 또는 11ty(의존도 최소). 초기 제안: **Astro + TypeScript**
- 검색: Fuse.js(클라이언트) + 빌드시 인덱스 전처리
- 스타일: Tailwind CSS(유지보수/반응형 용이), 다크모드 지원
- 품질: ESLint/Prettier, Lighthouse CI(선택)

### 11) 마이그레이션/호환
- 현 `md_page/` 파일은 프론트매터 없음 → 파서가 한국어 라벨(발견일/분류/원문 URL/원문 Source/즐겨찾기)을 인식해 메타 생성
- 신규 문서는 가능하면 YAML 프론트매터 지원으로 전환(점진적)

### 12) 리스크와 대응
- 노션 API 제한/스키마 변경: 파서 방어코드, 실패 시 부분 커밋 금지, 재시도 백오프
- 대용량 인덱스: 오래된 항목은 축약 요약만 저장, 본문 전문은 on-demand fetch
- 이미지 핫링크 차단: 빌드시 `assets/`로 캐싱(옵션), 실패 시 기본 썸네일로 폴백

### 13) 마일스톤/수용 기준(UAT)
- v0.1 UI 스켈레톤: 홈 그리드/상단 검색창/카테고리 탭, 더미 인덱스 표시
  - 카드 썸네일/배지/발견일 보임, 모바일/데스크톱 레이아웃 정상
- v0.2 검색/필터: Fuse.js 결과 50ms 내 필터 반영, 하이라이트 동작
- v0.3 상세 뷰/SEO: OG/메타, 사이트맵, 접근성 기본 준수
- v1.0 동기화/배포: 크론 동기화 → 빌드 → Pages 배포 자동화, 실패 시 알림
- v1.1 인덱스 최적화/이미지 캐싱: index.json 1.5MB 이하 유지, 이미지 LQIP

### 14) 부록 — 카드 데이터 예시
```json
{
  "title": "Claude Code를 사용한 Vibe 코딩",
  "category": "TIP",
  "date": "2025-08-11",
  "source_name": "🔗news.hada",
  "source_url": "https://news.hada.io/topic?id=...",
  "thumbnail": "/assets/og/claude.png",
  "favorite": false
}
```


