# Gemini CLI에 Supercloud 설치 가이드

발견일: 2025/08/07
원문 URL: https://www.youtube.com/watch?v=whLEc7lO_xY&list=PLoSIoPWNjwhLctI2K8DcKKxHQwUaEWfBi&ab_channel=%EC%86%8C%EC%8A%A4%EB%86%80%EC%9D%B4%ED%84%B0
분류: TIP
원문 Source: 🔗youtube
즐겨찾기: No

![](https://i.ytimg.com/vi/whLEc7lO_xY/maxresdefault.jpg)

출처 : [유튜브 링크](https://www.youtube.com/watch?v=whLEc7lO_xY&list=PLoSIoPWNjwhLctI2K8DcKKxHQwUaEWfBi&ab_channel=%EC%86%8C%EC%8A%A4%EB%86%80%EC%9D%B4%ED%84%B0)

Supercloud는 토큰 소모가 단점이지만 뛰어난 성능을 제공하며, Gemini CLI는 방대한 컨텍스트 크기가 장점입니다. 이 둘을 조합하면 단점을 상호 보완하여 최적의 환경을 구축할 수 있습니다. 아래는 Gemini CLI에 Supercloud를 설치하는  가이드입니다.

---

## 1. Gemini CLI 설치

1. **명령 프롬프트 실행**
    - 명령 프롬프트를 엽니다.
2. **Gemini CLI 설치**
    - 소스에 명시된 설치 명령어를 입력하여 Gemini CLI를 설치합니다.
    - *참고*: 소스에 구체적인 명령어가 없으므로, 공식 문서나 제공된 명령어를 확인하세요.
3. **설치 확인**
    - 설치 완료 후, 명령 프롬프트에서 `gemini`를 입력하여 실행 여부를 확인합니다.
    - 최초 실행 시 Google 로그인 과정이 나타날 수 있습니다.

---

## 2. Supercloud 파일을 Gemini CLI 형식으로 이전

Supercloud의 핵심 파일은 사용자 디렉토리의 `.cloud` 폴더에 마크다운 형태로 저장되어 있습니다. 이를 Gemini CLI가 인식할 수 있도록 `.gemini` 폴더로 이전합니다.

1. **사용자 디렉토리 이동**
    - 사용자 디렉토리로 이동하여 `.cloud`와 `.gemini` 폴더를 확인합니다.
2. **파일 복사**
    - `.cloud` 폴더 내 모든 파일(총 9개)을 `.gemini` 폴더로 복사합니다.
    - `cloud.md` 파일을 열어 내용을 복사한 뒤, `gemini.md` 파일에 붙여넣습니다.
    - 작업 완료 후 `cloud.md` 파일을 삭제합니다.
3. **커스텀 명령어 설정**
    - `.cloud` 폴더 내 `commands` 폴더로 이동합니다.
    - `SC` 폴더를 통째로 복사합니다.
    - `.gemini` 폴더에 새 `commands` 폴더를 생성한 뒤, 복사한 `SC` 폴더를 붙여넣습니다.

---

## 3. Monorepo 에러 해결

파일 이전 후 `gemini` 실행 시 `monorepo` 관련 에러가 발생할 수 있습니다.

1. [**orchestra.md](http://orchestra.md/) 파일 편집**
    - `.gemini` 폴더로 이동하여 `orchestra.md` 파일을 편집기로 엽니다.
    - 파일 내에서 `monorepo`를 검색하면 `@` 기호와 함께 나타납니다.
    - Gemini는 `@` 뒤의 내용을 파일로 인식하므로, `@` 기호를 삭제하고 저장합니다.
2. **실행 확인**
    - 다시 `gemini`를 실행하여 에러가 해결되었는지 확인합니다.
    - `/memory show` 명령어를 입력하여 지침 내용이 정상적으로 표시되는지 확인합니다.
    - *참고*: `/SC` 명령어는 아직 표시되지 않을 수 있습니다. 이는 파일 형식이 Gemini CLI에 맞지 않기 때문입니다.

---

## 4. 마크다운 파일을 TOL 파일로 변환

Supercloud의 마크다운 명령어 파일을 Gemini CLI 형식인 TOL 파일로 변환해야 합니다.

1. **자동화 스크립트 사용**
    - 소스(보통 영상 댓글 등)에서 제공된 자동화 스크립트 내용을 복사합니다.
    - `gemini`를 실행한 뒤, 복사한 내용을 붙여넣고 엔터를 누릅니다.
2. **변환 진행**
    - 스크립트가 마크다운 파일을 TOL 파일로 변환하며, Gemini CLI에 맞게 내용을 조정합니다.
    - 변환은 약 5분 정도 소요됩니다.
3. **변환 확인**
    - 변환 완료 후, `commands` 폴더에서 TOL 파일이 정상적으로 생성되었는지 확인합니다.

---

## 5. 설치 완료 확인

1. **Gemini CLI 실행**
    - `gemini`를 입력하여 실행합니다.
2. **Supercloud 명령어 확인**
    - `/SC`를 입력하여 Supercloud의 모든 명령어가 정상적으로 표시되는지 확인합니다.
    - 이상 없이 표시되면 Gemini CLI에 Supercloud 설치가 완료된 것입니다.

---

## 6. 추가 꿀팁: Claude 코드를 활용한 MCP 자동 설치

Gemini는 외부 도구 사용이 서툴러 자동화가 어렵지만, Claude 코드를 활용하여 MCP(Multiple Code Producer)를 자동 설치할 수 있습니다.

1. **파일 생성**
    - VS Code에서 새 파일을 엽니다.
    - 소스(영상 댓글 등)에서 제공된 내용을 복사하여 붙여넣습니다.
    - 파일을 작업 폴더에 `cloud.md`로 저장합니다.
2. **Claude 코드 실행**
    - 명령 프롬프트에서 작업 폴더로 이동한 뒤, `cloud`를 입력하여 Claude 코드를 실행합니다.
    - 설치하고 싶은 MCP(예: 시퀀셜 MCP, 컨텍스트 7 MCP)를 지정합니다.
    - 설치가 완료될 때까지 기다립니다.
3. **MCP 설치 확인**
    - `gemini`를 실행하고 `/MCP`를 입력하여 설치된 MCP가 정상적으로 표시되는지 확인합니다.

---

이 가이드를 따라 하면 Gemini CLI에 Supercloud를 성공적으로 설치하고, MCP까지 자동으로 설정할 수 있습니다. 추가 질문이 있다면 언제든지 문의하세요!