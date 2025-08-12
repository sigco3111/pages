# Cactus - 스마트폰을 위한 Ollama

발견일: 2025/08/05
원문 URL: https://github.com/cactus-compute/cactus
분류: 오픈소스
원문 Source: 🔗github
즐겨찾기: No

[](https://opengraph.githubassets.com/399bf855f9ea49a73c033ac1d04655bd09c6db0788ba06a2c561e24db95fd496/cactus-compute/cactus)

![](https://github.com/cactus-compute/cactus/raw/main/assets/banner.jpg)

  

[](https://camo.githubusercontent.com/8217e3a5f9b1407b0f16e86ed3ae74e43e5d3471043140a3701fe7a161df5f9c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f436f6d62696e61746f722d4630363532463f7374796c653d666f722d7468652d6261646765266c6f676f3d79636f6d62696e61746f72266c6f676f436f6c6f723d7768697465)

[](https://camo.githubusercontent.com/121a73ca130285368b9dd4bf399512e4d13e4a136906f47786e9c34f5a715c39/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4f78666f72645f536565645f46756e642d3030323134373f7374796c653d666f722d7468652d6261646765266c6f676f3d6f78666f7264266c6f676f436f6c6f723d7768697465)

[](https://camo.githubusercontent.com/34e80c407d6c961dc4822e1d5cabb83fdd9d1b392ecaf399b8a4792fd3b72f8d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f476f6f676c655f466f725f53746172747570732d3432383546343f7374796c653d666f722d7468652d6261646765266c6f676f3d676f6f676c65266c6f676f436f6c6f723d7768697465)

출처 : [**https://news.hada.io/topic?id=22342**](https://news.hada.io/topic?id=22342)

- 다양한 디바이스(스마트폰, 노트북, TV, 카메라 등)에서 **GGUF 모델**을 직접 실행할 수 있게 해주는 **크로스플랫폼 프레임워크**
    - Huggingface; Qwen, Gemma, Llama, DeepSeek 등에서 제공되는 아무 GGUF 모델이든 가능
    - 앱 내에서 LLM/VLM/TTS 모델을 직접 배포·구동
- **Flutter, React-Native, Kotlin Multiplatform**을 지원하며, **텍스트, 비전, 임베딩, TTS 모델** 등 다양한 타입의 모델을 온디바이스로 실행 가능
- FP32부터 2비트 양자화 모델까지 지원해 **모바일 환경에서 높은 효율성과 저전력 구동**가능
- 챗 템플릿(Jinja2), 토큰 스트리밍, 클라우드-로컬 자동 폴백, Speech-To-Text 등 지원
- Cactus 백엔드는 C/C++로 작성되어 있어, **모바일, PC, 임베디드, IoT 등 거의 모든 환경에서 직접 동작**
- 최신 스마트폰 기준 Gemma3 1B Q4 는 **20~50 토큰/초**, Qwen3 4B Q4은 **7~18 토큰/초** 속도로 동작
- [HuggingFace Cactus-Compute](https://huggingface.co/Cactus-Compute?sort_models=alphabetical#models)에서 추천 모델 다운로드 가능

## 활용 포인트 및 장점

- 기존 온디바이스 LLM 프레임워크와 달리 **여러 플랫폼을 통합 지원**, 로컬-클라우드 하이브리드 아키텍처 구현 용이
- **모바일 기기에서 고성능·저전력으로 최신 LLM/VLM/TTS 활용** 가능
- 앱/서비스 내 프라이빗 데이터 처리, 오프라인 AI 활용, 비용 절감 등 다양한 B2C/B2B 시나리오에 적합