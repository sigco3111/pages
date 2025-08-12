# Claude Code와 Gemini CLI를 함께 쓰는 조합

발견일: 2025/07/21
원문 URL: https://www.threads.com/@choi.openai/post/DLZf-DTJ-wD/claude-code%EC%99%80-gemini-cli%EB%A5%BC-%ED%95%A8%EA%BB%98-%EC%93%B0%EB%8A%94-%EC%A1%B0%ED%95%A9-%EC%A0%95%EB%A7%90-%EC%A2%8B%EC%8A%B5%EB%8B%88%EB%8B%A4%E2%91%A0-gemini-cli%EB%A5%BC-%EC%84%A4%EC%B9%98%ED%95%B4%EC%84%9C-%EB%B0%94%EB%A1%9C-%EC%93%B8-%EC%88%98-%EC%9E%88%EA%B2%8C-%EC%84%B8%ED%8C%85%E2%91%A1-claude
분류: TIP
원문 Source: 🔗threads
즐겨찾기: No

① Gemini CLI를 설치해서 바로 쓸 수 있게 세팅

② CLAUDE .md 파일에 아래 댓글 내용 작성

③ Claude Code 실행할 때 "Gemini와 상의하면서 진행해줘" 같은 문구 포함해서 실행

I need to modify a Python video processing application's file selection functionality. Currently, it only handles local
file paths through tkinter filedialog. I want to enhance it so that when a user inputs a URL (instead of selecting a
file), the application automatically detects it's a URL and processes it accordingly.

The main application is in [main.py](http://main.py/) and uses tkinter for GUI. It has video downloading capabilities with yt-dlp for
various platforms including YouTube and Twitter/X.

Key requirements:

1. Detect if input is URL vs file path
2. If URL, automatically trigger download process
3. Seamlessly integrate with existing workflow
4. Handle various video platforms (YouTube, Twitter, etc.)
5. Maintain existing file selection functionality

Please provide implementation approach and code modifications needed.