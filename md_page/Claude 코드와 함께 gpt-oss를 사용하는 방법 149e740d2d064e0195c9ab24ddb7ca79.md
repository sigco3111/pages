# Claude 코드와 함께 gpt-oss를 사용하는 방법

발견일: 2025/08/11
원문 URL: https://garysvenson09.medium.com/how-to-use-gpt-oss-with-claude-code-da3cea5c8af8
분류: TIP
원문 Source: 🔗garysvenson09.medium
즐겨찾기: No

![](https://miro.medium.com/v2/resize:fit:1200/0*ha6xWapdDCyD_m5q.png)

![](https://miro.medium.com/v2/resize:fill:64:64/1*lZW-IQU2EQXpcFQ3elV9AQ.png)

[Gary Svenson](https://apidog.com/?source=post_page---byline--da3cea5c8af8---------------------------------------)

Follow

5 min read

2 days ago

7

1

[Listen](https://medium.com/plans?dimension=post_audio_button&postId=da3cea5c8af8&source=upgrade_membership---post_audio_button-----------------------------------------)

Share

More

Want to run OpenAI‑compatible, open‑weight models in the familiar **Claude Code** CLI? **GPT-OSS** (20B and 120B) delivers strong coding and reasoning performance, and you can route Claude Code to it through OpenAI‑style endpoints. This guide shows three reliable ways to connect Claude Code to GPT-OSS using Hugging Face Inference Endpoints, OpenRouter, or a LiteLLM proxy. Pick the path that fits your workflow and budget.
친숙한 **Claude Code** CLI에서 OpenAI 호환 오픈 웨이트 모델을 실행하고 싶으신가요? **GPT-OSS**(20B 및 120B)는 강력한 코딩 및 추론 성능을 제공하며 OpenAI 스타일 엔드포인트를 통해 Claude 코드를 라우팅할 수 있습니다. 이 가이드에서는 Hugging Face Inference Endpoints, OpenRouter 또는 LiteLLM 프록시를 사용하여 Claude Code를 GPT-OSS에 연결하는 세 가지 신뢰할 수 있는 방법을 보여줍니다. 작업 흐름과 예산에 맞는 경로를 선택하십시오.

> *Pro tip: Building and testing APIs while you experiment with GPT-OSS? Use* [*Apidog*](https://bit.ly/3Teeyxv) *— the all-in-one API development platform — to* [*design](https://bit.ly/4hKOxQZ),* [*mock](https://bit.ly/3AHtaPS),* [*test](https://bit.ly/4fMLpCJ), and* [*publish docs*](https://bit.ly/3Cs56kA) *in one place. It pairs nicely with Claude Code so you can iterate on prompts and verify endpoints without switching tools.*
*전문가 팁: GPT-OSS를 실험하는 동안 API를 구축하고 테스트하시나요?* *올인원 API 개발 플랫폼인* [*Apidog*](https://bit.ly/3Teeyxv)을 사용하여 한 곳에서 문서를 [*디자인](https://bit.ly/4hKOxQZ),* [*모의](https://bit.ly/3AHtaPS),* [*테스트*](https://bit.ly/4fMLpCJ) *및* [*게시*](https://bit.ly/3Cs56kA)할 *수 있습니다. Claude Code와 잘 어울리므로 도구를 전환하지 않고도 프롬프트를 반복하고 엔드포인트를 확인할 수 있습니다.*
> 

# Why pair GPT-OSS with Claude Code?
GPT-OSS를 Claude Code와 페어링하는 이유는 무엇인가요?

**GPT-OSS** is Open AI’s open‑weight model family with a 128K context window and an Apache 2.0 license — ideal for private deployments and customization. **Claude Code** (v0.5.3+) provides a fast, conversational CLI for coding. By pointing Claude Code at an OpenAI‑compatible endpoint for GPT-OSS, you keep the UX you like while controlling costs and deployment.
**GPT-OSS**는 128K 컨텍스트 창과 Apache 2.0 라이선스를 갖춘 Open AI의 오픈 웨이트 모델 제품군으로, 프라이빗 배포 및 사용자 지정에 이상적입니다. **Claude Code** (v0.5.3+)는 코딩을 위한 빠른 대화형 CLI를 제공합니다. GPT-OSS용 OpenAI 호환 엔드포인트에서 Claude Code를 가리키면 비용과 배포를 제어하면서 원하는 UX를 유지할 수 있습니다.

# Prerequisites 필수 구성 요소

Make sure you have: 다음이 있는지 확인합니다.

- **Claude Code ≥ 0.5.3**: Check `claude --version`. Install with `pip install claude-code` or update with `pip install --upgrade claude-code`.
**Claude 코드 ≥ 0.5.3**: `claude --version`을 확인하십시오. `pip install claude-code`로 설치하거나 `pip install --upgrade claude-code` .
- **Hugging Face account**: Create a read/write token at [huggingface.co](https://huggingface.co/).
**Hugging Face 계정**: [huggingface.co](https://huggingface.co/) 에서 읽기/쓰기 토큰을 만듭니다.
- **OpenRouter API key** (for the OpenRouter path): Get one at [openrouter.ai](https://openrouter.ai/).
**OpenRouter API 키**(OpenRouter 경로용): [openrouter.ai](https://openrouter.ai/) 에서 가져옵니다.
- **Python 3.10+ and Docker**: Needed for local runs or LiteLLM.
**Python 3.10+ 및 Docker**: 로컬 실행 또는 LiteLLM에 필요합니다.
- **Command‑line familiarity**: You’ll set environment variables and run basic commands.
**명령줄 친숙도**: 환경 변수를 설정하고 기본 명령을 실행합니다.

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/0*ha6xWapdDCyD_m5q.png)

# Option A — Self‑host GPT‑OSS on Hugging Face
옵션 A — Hugging Face에서 GPT-OSS 자체 호스팅

Use Hugging Face Inference Endpoints to deploy a private, scalable TGI server with OpenAI compatibility.
Hugging Face Inference Endpoints를 사용하여 OpenAI와 호환되는 확장 가능한 프라이빗 TGI 서버를 배포하세요.

1. Choose a model 1) 모델 선택

---

1. Open the GPT‑OSS repo on Hugging Face: [openai/gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b) or [openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b).
Hugging Face에서 GPT-OSS 리포지토리([openai/gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b) 또는 [openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b))를 엽니다.
2. Accept the Apache 2.0 license.
Apache 2.0 라이선스에 동의합니다.
3. Optional alternative: **Qwen3-Coder-480B-A35B-Instruct** ([Qwen/Qwen3-Coder-480B-A35B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct)); choose a GGUF build for lighter hardware.
선택적 대안: **Qwen3-Coder-480B-A35B-Instruct**([Qwen/Qwen3-Coder-480B-A35B-Instruct](https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct)); 더 가벼운 하드웨어를 위해 GGUF 빌드를 선택하십시오.

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/0*hxRmLY-NEeS3L24l.png)

1. Deploy a Text Generation Inference endpoint
2. 텍스트 생성 추론 엔드포인트 배포

---

1. On the model page, select **Deploy** > **Inference Endpoint**.
모델 페이지에서 > **유추 엔드포인트** **배포를** 선택합니다.
2. Pick the **Text Generation Inference (TGI)** template (≥ v1.4.0).
**TGI(텍스트 생성 유추)** 템플릿(≥ v1.4.0)을 선택합니다.
3. Enable OpenAI compatibility (check **Enable OpenAI compatibility** or add `--enable-openai`).
OpenAI 호환성을 활성화합니다(**OpenAI 호환성 활성화** 또는 `--enable-openai` 추가).
4. Choose hardware: A10G/CPU for 20B; A100 for 120B. Create the endpoint.
하드웨어 선택: 10B용 A20G/CPU; 100B의 경우 A120. 엔드포인트를 만듭니다.
5. Gather credentials 3) 자격 증명 수집

---

1. When the endpoint is **Running**, note:
엔드포인트가 **실행 중**인 경우 다음을 참고하십시오.

- **ENDPOINT_URL** like `https://<your-endpoint>.us-east-1.aws.endpoints.huggingface.cloud`.
- **ENDPOINT_URL** 좋아요 `https://<your-endpoint>.us-east-1.aws.endpoints.huggingface.cloud` .

- **HF_API_TOKEN** from your Hugging Face account.
- Hugging Face 계정에서 **HF_API_TOKEN**합니다.

2. Capture the model ID (e.g., `gpt-oss-20b` or `gpt-oss-120b`).
2. 모델 ID(예: `gpt-oss-20b` 또는 `gpt-oss-120b`)를 캡처합니다.

1. Point Claude Code at your endpoint
2. 엔드포인트에서 Claude 코드를 가리킵니다.

---

1. Export environment variables:
1. 환경 변수 내보내기:

export ANTHROPIC_BASE_URL="https://.us-east-1.aws.endpoints.huggingface.cloud"

export ANTHROPIC_AUTH_TOKEN="hf_xxxxxxxxxxxxxxxxx"
export ANTHROPIC_MODEL="gpt-oss-20b"  # or gpt-oss-120b

2. Verify the connection:
2. 연결을 확인합니다.

claude --model gpt-oss-20b

Claude Code will route to your TGI endpoint via `/v1/chat/completions` using the OpenAI‑compatible schema.
Claude Code는 OpenAI 호환 스키마를 사용하여 `/v1/chat/completions`를 통해 TGI 엔드포인트로 라우팅합니다.

1. Cost and scaling 5) 비용 및 확장

---

- Hugging Face Inference Endpoints auto‑scale; monitor usage. A10G is about ~0.60/hour; A100 is about ~3/hour.
Hugging Face 추론 엔드포인트 자동 크기 조정; 사용량을 모니터링합니다. A10G는 약 ~0.60/시간입니다. A100은 약 ~3/시간입니다.
- Prefer local? Run TGI via Docker and point Claude Code at it:
현지를 선호하시나요? Docker를 통해 TGI를 실행하고 Claude Code를 가리킵니다.

docker run --name tgi -p 8080:80 -e HF_TOKEN=hf_xxxxxxxxxxxxxxxxx ghcr.io/huggingface/text-generation-inference:latest --model-id openai/gpt-oss-20b --enable-openai

Then set `ANTHROPIC_BASE_URL="http://localhost:8080"`. 그런 다음 `ANTHROPIC_BASE_URL="http://localhost:8080"` .

# Option B — Use OpenRouter as a managed proxy
옵션 B — OpenRouter를 관리형 프록시로 사용

Skip infrastructure and access GPT‑OSS through OpenRouter’s unified API.
인프라를 건너뛰고 OpenRouter의 통합 API를 통해 GPT-OSS에 액세스하세요.

1. Create an account and pick a model
2. 계정 생성 및 모델 선택

---

1. Sign up at [openrouter.ai](https://openrouter.ai/) and copy your API key from **Keys**.
[openrouter.ai](https://openrouter.ai/) 에서 가입하고 Keys에서 API 키를 복사**합니다.**
2. Choose a model slug: 모델 슬러그 선택:

- `openai/gpt-oss-20b`
- `오픈AI/GPT-OSS-20B`

- `openai/gpt-oss-120b`
- `오픈AI/GPT-OSS-120B`

- `qwen/qwen3-coder-480b` (Qwen’s coder model)
- `qwen/qwen3-coder-480b` (Qwen의 코더 모델)

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/0*0N_Qv1JcXiIVudCS.png)

1. Configure Claude Code 2) Claude 코드 구성

---

1. Export variables: 1. 변수 내보내기:

export ANTHROPIC_BASE_URL="[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)"

export ANTHROPIC_AUTH_TOKEN="or_xxxxxxxxx"
export ANTHROPIC_MODEL="openai/gpt-oss-20b"

2. Test the connection: 2. 연결을 테스트합니다.

claude --model openai/gpt-oss-20b

Claude Code will stream responses via OpenRouter, with built‑in fallback support.
Claude Code는 내장된 대체 지원을 통해 OpenRouter를 통해 응답을 스트리밍합니다.

1. Pricing notes 3) 가격 참고 사항

---

- Approx. costs: ~0.50/M input tokens and ~2.00/M output tokens for GPT‑OSS‑120B; far below many proprietary options.
대략적인 비용: GPT-OSS-120B의 경우 ~0.50/M 입력 토큰 및 ~2.00/M 출력 토큰; 많은 독점 옵션보다 훨씬 낮습니다.
- OpenRouter bills per usage; no infrastructure to manage.
OpenRouter는 사용량당 청구됩니다. 관리할 인프라가 없습니다.

# Option C — Route via LiteLLM for multi‑model workflows
옵션 C — 다중 모델 워크플로를 위해 LiteLLM을 통해 라우팅

Use LiteLLM as a local proxy if you want to hot‑swap between GPT‑OSS, Qwen, or Anthropic models.
GPT-OSS, Qwen 또는 Anthropic 모델 간에 핫스왑하려는 경우 LiteLLM을 로컬 프록시로 사용합니다.

1. Install and configure LiteLLM
2. LiteLLM 설치 및 구성

---

1. Install [LiteLLM](https://docs.litellm.ai/):
[LiteLLM](https://docs.litellm.ai/)을 설치합니다.

pip install litellm

2. Create `litellm.yaml`:
2. `litellm.yaml`을 만듭니다.

model_list:

- model_name: gpt-oss-20b
litellm_params:
model: openai/gpt-oss-20b
api_key: or_xxxxxxxxx  # OpenRouter key
api_base: [https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)

- model_name: qwen3-coder
litellm_params:
model: openrouter/qwen/qwen3-coder
api_key: or_xxxxxxxxx
api_base: [https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)

3. Start the proxy: 3. 프록시를 시작합니다.

litellm --config litellm.yaml

1. Point Claude Code to LiteLLM
2. Claude 코드를 LiteLLM에 가리키기

---

1. Export variables: 1. 변수 내보내기:

export ANTHROPIC_BASE_URL="[http://localhost:4000](http://localhost:4000)"

export ANTHROPIC_AUTH_TOKEN="litellm_master"
export ANTHROPIC_MODEL="gpt-oss-20b"

2. Confirm it works: 2. 작동하는지 확인합니다.

claude --model gpt-oss-20b

LiteLLM forwards to GPT‑OSS via OpenRouter and supports cost logging. Prefer simple‑shuffle routing to avoid incompatibilities with Anthropic providers.
LiteLLM은 OpenRouter를 통해 GPT-OSS로 전달하고 비용 로깅을 지원합니다. Anthropic 공급자와의 비호환성을 방지하기 위해 단순 셔플 라우팅을 선호합니다.

1. Notes 3) 메모

---

- Use simple‑shuffle over latency‑based routing for stability with Anthropic models.
Anthropic 모델의 안정성을 위해 지연 시간 기반 라우팅에 대한 단순 섞기를 사용합니다.
- Review LiteLLM logs to track usage and costs.
LiteLLM 로그를 검토하여 사용량 및 비용을 추적합니다.

# Validate your setup 설정 검증

Open Claude Code and try these checks:
Claude Code를 열고 다음 확인을 시도해 보세요:

- **Code generation 코드 생성**

claude --model gpt-oss-20b "Write a Python REST API with Flask"

Expected response (example):
예상 응답(예):

from flask import Flask, jsonify

app = Flask(__name__)
@app.route('/api', methods=['GET'])
def get_data():
return jsonify({"message": "Hello from GPT-OSS!"})
if __name__ == '__main__':
app.run(debug=True)

- **Codebase analysis 코드베이스 분석**

claude --model gpt-oss-20b "Summarize src/server.js"

- **Debugging 디버깅**

claude --model gpt-oss-20b "Debug this buggy Python code: [paste code]"

# Troubleshooting 문제 해결

- **404 on** `**/v1/chat/completions**`: Ensure `--enable-openai` is enabled in TGI (Option A) or verify model availability on OpenRouter (Option B).
`**/v1/chat/completions**`**의 404**: TGI(옵션 A)에서 `--enable-openai`가 활성화되어 있는지 확인하거나 OpenRouter(옵션 B)에서 모델 가용성을 확인합니다.
- **Empty responses**: Confirm `ANTHROPIC_MODEL` exactly matches the model slug (e.g., `gpt-oss-20b`).
**빈 응답**: 모델 슬러그(예: `gpt-oss-20b`)와 정확히 일치`ANTHROPIC_MODEL` 확인합니다.
- **400 after swapping models**: Set LiteLLM to simple‑shuffle routing (Option C).
**모델 교체 후 400**: LiteLLM을 단순 셔플 라우팅(옵션 C)으로 설정합니다.
- **Slow first token**: Warm up Hugging Face endpoints with a small prompt after scale‑to‑zero.
**느린 첫 번째 토큰**: 0으로 확장한 후 작은 프롬프트를 사용하여 Hugging Face 엔드포인트를 워밍업합니다.
- **Claude Code crashes**: Upgrade to ≥ 0.5.3 and recheck environment variables.
**Claude Code 충돌**: ≥ 0.5.3으로 업그레이드하고 환경 변수를 다시 확인하세요.

# Benefits of this setup 이 설정의 이점

- **Lower cost**: OpenRouter’s pricing is competitive; local TGI can be very cost‑effective once hardware is in place.
**저렴한 비용**: OpenRouter의 가격은 경쟁력이 있습니다. 로컬 TGI는 하드웨어가 설치되면 매우 비용 효율적일 수 있습니다.
- **Open and flexible**: GPT‑OSS’s Apache 2.0 license supports private customization and deployment.
**개방성과 유연성:** GPT-OSS의 Apache 2.0 라이선스는 개인 사용자 지정 및 배포를 지원합니다.
- **Great ergonomics**: Keep Claude Code’s productive CLI while tapping GPT‑OSS’s capability.
**뛰어난 인체공학:** GPT-OSS의 기능을 활용하면서 Claude Code의 생산적인 CLI를 유지하세요.
- **Model agility**: Switch between GPT‑OSS, Qwen, and Anthropic providers with LiteLLM or OpenRouter.
**모델 민첩성**: LiteLLM 또는 OpenRouter를 사용하여 GPT-OSS, Qwen 및 Anthropic 공급자 간에 전환합니다.

# Wrap‑up 마무리

You now have three proven ways to use GPT‑OSS with Claude Code — self‑host on Hugging Face, go fully managed with OpenRouter, or proxy locally with LiteLLM. Use the validation steps to confirm everything is wired correctly, then iterate on prompts, analyze codebases, and debug faster with an open‑weight model behind the scenes.
이제 Claude Code와 함께 GPT-OSS를 사용하는 세 가지 입증된 방법, 즉 Hugging Face에서 자체 호스팅, OpenRouter로 완전 관리, LiteLLM을 사용하여 로컬에서 프록시하는 방법이 있습니다. 유효성 검사 단계를 사용하여 모든 것이 올바르게 연결되었는지 확인한 다음, 프롬프트를 반복하고, 코드베이스를 분석하고, 백그라운드에서 오픈 가중치 모델을 사용하여 더 빠르게 디버깅합니다.