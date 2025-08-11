# Development Guidelines — AI Agent 전용 운영 규칙

본 문서는 AI 에이전트가 이 레포지토리에서 안전하고 일관되게 작업하기 위한 **행동 지침**이다. 일반 지식 서술을 금지하고, 이 프로젝트 고유의 결정 규칙과 파일 상호작용만 명시한다.

## 1. 프로젝트 개요(간략)
- 목적: 노션 데이터를 `pages/md_page/`로 동기화하여 카드형 UI/검색/필터가 있는 정적 사이트로 GitHub Pages에 배포한다.
- 기술 기준: 정적 사이트(권장: Astro+TS), 클라이언트 검색(Fuse.js), GitHub Actions 배포.

## 2. 디렉터리·아티팩트 규칙(필수 경로)
- `pages/md_page/`: 원본 Markdown 보관소. 노션 동기화 스크립트가 **추가/갱신**한다.
- `pages/public/index.json`: 검색 인덱스. 빌드시 **자동 생성**한다. 수동 편집 금지.
- `pages/public/assets/`: 이미지/OG 캐시 저장소. 빌드 또는 동기화 시 생성 가능. 수동 편집 금지.
- `pages/public/sitemap.xml`, `pages/public/robots.txt`: 빌드시 **자동 생성**한다. 수동 편집 금지.
- `scripts/notion-sync.mjs`: 노션 → Markdown 동기화 스크립트 파일 경로. 없으면 생성한다.
- `.github/workflows/sync-and-deploy.yml`: 스케줄 동기화 및 배포 워크플로. 없으면 생성한다.
- `pages/PRD.md`, `pages/README.md`, `pages/shrimp-rules.md`: 문서 3종. **상호 참조**를 유지하며 내용 변경 시 3개 문서를 동시 갱신한다.

## 3. 코드 표준(이 프로젝트 한정)
- 상수는 대문자 스네이크(`MAX_RETRY_COUNT`).
- 불린은 `is/has/can` 접두어(`isVisible`, `hasError`).
- 모든 함수/주요 로직 상단에 한국어 목적 설명, 복잡한 구간에 필요한 주석만 추가.
- 모든 함수는 예외 처리 포함. 실패 시 로깅, 사용자 메시지는 일반화된 문구로 제공.
- 외부 의존(노션 API, OG fetch 등)은 `scripts/` 또는 `lib/` 하위 별도 파일로 분리.

## 4. 기능 구현 표준
### 4.1 파서(메타 추출)
- 입력: `pages/md_page/*.md`
- 프론트매터(YAML)가 있으면 우선 사용. 없으면 다음 한국어 라벨을 파싱해 메타를 만든다:
  - `# 제목` → title
  - `발견일: YYYY/MM/DD` → date(ISO 변환)
  - `분류: XXX` → category
  - `원문 URL: ...` → source_url
  - `원문 Source: ...` → source_name
  - `즐겨찾기: Yes|No` → favorite(boolean)
- 썸네일 선택 우선순위: (1) 본문 첫 이미지 → (2) OG 캐시 → (3) 카테고리 기본 이미지.

### 4.2 인덱서(검색 인덱스 생성)
- 출력 파일: `pages/public/index.json`
- 스키마 필드: `slug,title,date,category,source_url,source_name,favorite,tags[],thumbnail,excerpt`.
- 크기 제한: 1.5MB 이하. 초과 시 오래된 항목 요약 축약/제거로 줄인다.

### 4.3 SEO/접근성
- 빌드시 메타/OG/Twitter 카드 포함. 이미지에는 대체텍스트. 시맨틱 마크업/키보드 내비.

## 5. 외부 의존 사용 규칙
- 검색: Fuse.js 고정. 대체 라이브러리 사용 시 본 문서와 `README.md` 즉시 갱신.
- 정적 프레임워크: 기본 Astro. 다른 SSG 채택 시 빌드/출력 경로와 워크플로를 본 문서에 반영.

## 6. 워크플로 규칙
- 트리거: `schedule`(크론), `workflow_dispatch`, `push`(main).
- 순서: (1) checkout → (2) Node 세팅 → (3) `scripts/notion-sync.mjs` 실행 → (4) 빌드 → (5) Pages 배포.
- 실패: 실패 시 워크플로 종료 코드 유지, **자동으로 이슈를 생성**하라.
  - 권장 액션: `actions/github-script` 또는 `actions-ecosystem/action-create-issue`.
  - 이슈 제목: `🚨 Deploy Failed: <run_id>`
  - 이슈 본문: 실패 단계, 오류 로그 요약, 재시도 안내.
- Secrets: `NOTION_API_KEY`, `NOTION_DATABASE_ID` 필수. 미설정 시 동기화 단계 스킵 후 실패 코드 반환.

## 7. 핵심 파일 상호작용 규칙(동시 수정)
- 파서/인덱서 스키마를 변경할 때: `pages/README.md`의 데이터 파싱 규칙/인덱스 스키마, `pages/PRD.md`의 데이터 모델, 본 문서 4.1/4.2를 **같은 PR**에서 갱신한다.
- 워크플로 경로/이름을 변경할 때: `README.md` 배포 섹션과 본 문서 6장 동시 갱신.

## 8. 의사결정 규칙(결정 트리)
1) 메타값 누락
   - 프론트매터 존재 → 우선
   - 라벨 파싱 가능 → 사용
   - 둘 다 없음 → 파일 스킵하고 경고 로그, 인덱스에 포함 금지
2) 중복 문서(동일 slug)
   - `date` 최신 항목을 우선, 나머지는 무시
3) 이미지 실패
   - 첫 이미지 실패 → OG 캐시 → 카테고리 기본 이미지 순으로 폴백
4) 인덱스 크기 초과
   - 오래된 항목부터 excerpt 축약 → 태그 제거 → 항목 수 축소 순으로 감소

## 9. 금지 항목
- `pages/public/index.json`/`pages/public/assets/`를 수동 편집하지 마라.
- 동기화 스크립트가 생성한 `md_page/*.md`의 메타 라인을 대량 치환하지 마라(파서 호환성 붕괴).
- 워크플로에서 빌드 실패를 무시하는 `continue-on-error`를 사용하지 마라.

## 11. 리포지토리 점검 규칙(재귀 검사)
- 변경 작업 전, **루트(현재 작업 루트)부터 모든 하위 폴더를 재귀적으로 검사**하고 관련 파일(README/PRD/Rules/워크플로/스크립트)의 영향도를 산정하라.
- 파일 생성/경로 변경 시, 본 문서 2장과 `README.md`/`PRD.md`를 함께 갱신하라.

## 10. 해야 할 것 / 하지 말아야 할 것 (예시)
- 해야 할 것: 파서 스키마 변경 시 README/PRD/Rules를 같은 PR에서 동시 갱신하라.
- 해야 할 것: 이미지가 없으면 카테고리 기본 썸네일을 지정하라.
- 하지 말아야 할 것: 검색 인덱스를 수동으로 수정하거나 커밋하지 마라.
- 하지 말아야 할 것: Secrets 없이 동기화를 강행하지 마라(즉시 실패시켜라).


