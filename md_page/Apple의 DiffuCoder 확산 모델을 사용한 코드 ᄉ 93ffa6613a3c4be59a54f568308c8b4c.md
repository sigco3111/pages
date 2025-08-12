# Apple의 DiffuCoder 확산 모델을 사용한 코드 생성

발견일: 2025/07/09
원문 URL: https://github.com/apple/ml-diffucoder
분류: 오픈소스
원문 Source: 🔗github
즐겨찾기: No

## Masked Diffusion Models for Code Generation
코드 생성을 위한 마스킹된 확산 모델

    

[](https://camo.githubusercontent.com/f191a33a959369475e8c3743c17bdd2d069fdaee1abd8bf3cf042ebd1844e5ea/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617065722d41727869762532304c696e6b2d677265656e)

[](https://camo.githubusercontent.com/14e900c44228cffa80904c2e05a53ca33d84a63d198c411a9f8e67b008594322/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4170706c652d626c7565)

[](https://camo.githubusercontent.com/92d7302321a11da62ca18a3261e59653a8bd21c98a0519205c134ba22eaa95c2/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f48756767696e67253230466163652d4469666675436f6465725f426173652d464645423342)

[](https://camo.githubusercontent.com/29eaa740d50677ab100f9430003418fc85f2ff2c9d98c1f756c72f7269d2c15b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f48756767696e67253230466163652d4469666675436f6465725f496e7374727563742d464645423342)

[](https://camo.githubusercontent.com/6bae1026ea3606363463b7109ae30993b6bcac1f610a9709a5ec05d0179892f0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f48756767696e67253230466163652d4469666675436f6465725f63704752504f2d464645423342)

This software project accompanies the research paper, [DiffuCoder: Understanding and Improving Masked Diffusion Models for Code Generation](https://arxiv.org/abs/2506.20639).
이 소프트웨어 프로젝트는 연구 논문인 [DiffuCoder: 코드 생성을 위한 마스킹 확산 모델 이해 및 개선](https://arxiv.org/abs/2506.20639)과 함께 제공됩니다.

### Updates 업데이트

**MLX support on Apple Silicon is in progress. We will make necessary updates to the repository once it is available.**
**Apple Silicon에서 MLX 지원이 진행 중입니다. 저장소가 사용 가능해지면 필요한 업데이트를 수행할 것입니다.**

- July 8, 2025. We are still training for 14B models, to be updated.
2025년 7월 8일. 우리는 여전히 업데이트될 14B 모델에 대한 훈련 중입니다.
- July 7, 2025. [MLX community implementation of DiffuCoder 8bit model](https://huggingface.co/mlx-community/DiffuCoder-7B-cpGRPO-8bit)
2025년 7월 7일. [DiffuCoder 8비트 모델의 MLX 커뮤니티 구현](https://huggingface.co/mlx-community/DiffuCoder-7B-cpGRPO-8bit)
- July 4, 2025. [MLX](https://github.com/ml-explore/mlx) support in progress. To preview or contribute, please check out this PR started by @Goekdeniz-Guelmez:
2025년 7월 4일. [MLX](https://github.com/ml-explore/mlx) 지원이 진행 중입니다. 미리 보거나 기여하려면 @Goekdeniz-Guelmez가 시작한 PR을 확인하세요.[this PR](https://github.com/ml-explore/mlx-lm/pull/270)
- July 4, 2025. Update inference usage/examples/demo.
2025년 7월 4일. 추론 사용/예제/데모를 업데이트합니다.
- July 2, 2025. Models are available on Huggingface.
2025년 7월 2일. 모델은 Huggingface에서 사용할 수 있습니다.
- July 1, 2025. Code is available.
2025년 7월 1일. 코드를 사용할 수 있습니다.

![](https://github.com/apple/ml-diffucoder/raw/main/figs/teaser.png)

### Motivation 동기

Scaling upon Masked Denoising Models (MDMs), diffusion LLMs (dLLMs) such as [LLaDA](https://ml-gsai.github.io/LLaDA-demo/) and [Dream](https://hkunlp.github.io/blog/2025/dream/) have achieved performance on par with similarly sized autoregressive (AR) LLMs across many benchmarks. Recent commercial-scale dLLMs like [Mercury](https://chat.inceptionlabs.ai/) and [Gemini](https://deepmind.google/models/gemini-diffusion/) further demonstrate that diffusion-based code generators can rival top AR code models on programming tasks while offering faster text generation.
마스킹 노이즈 제거 모델(MDM), [LLaDA](https://ml-gsai.github.io/LLaDA-demo/) 및 [Dream](https://hkunlp.github.io/blog/2025/dream/)과 같은 확산 LLM(dLLM)에 대한 확장은 많은 벤치마크에서 유사한 크기의 자가회귀(AR) LLM과 동등한 성능을 달성했습니다. [Mercury](https://chat.inceptionlabs.ai/) 및 [Gemini](https://deepmind.google/models/gemini-diffusion/)와 같은 최근의 상용 규모 dLLM은 확산 기반 코드 생성기가 프로그래밍 작업에서 최고의 AR 코드 모델과 경쟁하는 동시에 더 빠른 텍스트 생성을 제공할 수 있음을 더욱 보여줍니다.

However, the generation pattern and post-training strategies of dLLMs remain under-explored. In this work, we investigate the following questions:
그러나 dLLM의 생성 패턴과 훈련 후 전략은 아직 연구되지 않았습니다. 이 작업에서는 다음 질문을 조사합니다.

- **How does the generation pattern of dLLMs differ from AR models?**
**dLLM의 생성 패턴은 AR 모델과 어떻게 다른가요?**
- **What is the difference in modeling different data modalities, such as code vs. math?**
**코드와 수학과 같은 다양한 데이터 양식을 모델링할 때 어떤 차이점이 있나요?**
- **How diverse can dLLMs be, and how should post-training be designed?**
**dLLM은 얼마나 다양할 수 있으며, 사후 교육은 어떻게 설계해야 합니까?**

![](https://github.com/apple/ml-diffucoder/raw/main/figs/pipeline.png)

We train **DiffuCoder** using the adaptation approach in [DiffuLLaMA](https://github.com/HKUNLP/DiffuLLaMA) and introduce a new metric — **autoregressiveness score** — to quantify the causal pattern during dLLM generation. The key findings are listed below.
[DiffuLLaMA](https://github.com/HKUNLP/DiffuLLaMA)의 적응 접근 방식을 사용하여 **DiffuCoder**를 훈련하고 dLLM 생성 중 인과 패턴을 정량화하기 위해 새로운 지표인 **자기 회귀 점수**를 도입합니다. 주요 결과는 다음과 같습니다.

### Findings 결과

- dLLMs still exhibit a left-to-right bias due to the nature of text, but they can also break this strict order in AR models.
dLLM은 텍스트의 특성으로 인해 여전히 왼쪽에서 오른쪽으로 편향되지만 AR 모델에서 이러한 엄격한 순서를 깨뜨릴 수도 있습니다.
- After pre-training, we show that code tasks induce less global AR-ness than math.
사전 훈련 후 코드 작업이 수학보다 글로벌 AR성을 덜 유도한다는 것을 보여줍니다.
- In dLLMs, changing the sampling temperature not only affects sampled tokens (as in AR models), but also alters the generation order itself.
dLLM에서 샘플링 온도를 변경하면 샘플링된 토큰(AR 모델에서와 같이 )에 영향을 미칠 뿐만 아니라 생성 순서 자체도 변경됩니다.

For more interesting findings, please refer to our original paper!
더 흥미로운 결과를 원하시면 원본 논문을 참조하세요!

We propose **Coupled-GRPO**, a post-training method to improve DiffuCoder's performance.
DiffuCoder의 성능을 향상시키기 위한 사후 학습 방법인 **Coupled-GRPO**를 제안합니다.

---

### Coupled-GRPO 결합-GRPO

In diffusion LLMs, the per-timestep loss L t typically computes log-probabilities only at masked token positions, which leads to inefficiency and high variance when sampling is limited. To address this, **Coupled-GRPO** introduces a *coupled-sampling* scheme:
확산 LLM에서 시간단계 손실 L t 은 일반적으로 마스킹된 토큰 위치에서만 로그 확률을 계산하므로 샘플링이 제한될 때 비효율성과 높은 분산이 발생합니다. 이 문제를 해결하기 위해 **Coupled-GRPO**는 *결합 샘플링* 체계를 도입합니다.

- For each training example, we select λ pairs of timesteps ( t , t ^ ) such that t + t ^ = T .
각 훈련 예제에 대해 다음과 같은 시간 단계 ( t , t ) 쌍을 선택합니다 λ . t + t = T
- We apply two complementary token masks — each mask hides part of the tokens, and together they cover the entire set of target tokens.
두 개의 보완적인 토큰 마스크를 적용합니다 — 각 마스크는 토큰의 일부를 숨기고 함께 전체 대상 토큰 세트를 덮습니다.
- As a result, every token is unmasked in exactly one of the two forward passes.
결과적으로 모든 토큰은 두 개의 전달 패스 중 정확히 하나에서 마스킹되지 않습니다.

This ensures that: 이를 통해 다음을 보장합니다.

1. Every token's log-probability is computed at least once, providing a non-zero learning signal for all tokens.
모든 토큰의 로그 확률은 적어도 한 번 계산되어 모든 토큰에 대해 0이 아닌 학습 신호를 제공합니다.
2. The probability estimates are more accurate, since each token is evaluated in a realistic partially-masked context (rather than always being fully masked).
확률 추정치는 각 토큰이 항상 완전히 마스킹되는 것이 아니라 부분적으로 마스킹된 현실적인 컨텍스트에서 평가되기 때문에 더 정확합니다.
3. The scheme effectively uses 2 λ times more sampling passes than the baseline (we choose λ = 1 ), improving estimation with modest computational overhead.
이 체계는 기준선(우리가 선택) λ = 1 보다 몇 배 더 많은 샘플링 패스를 효과적으로 사용하여 2 λ 적당한 계산 오버헤드로 추정을 개선합니다.

In this repository, we release our implementation of **Coupled-GRPO**, built upon [open-r1](https://github.com/huggingface/open-r1/blob/6a0cd5c8ad031fc75118a4ce7f42a4860c3d8dea/).
이 저장소에서는 [open-r1](https://github.com/huggingface/open-r1/blob/6a0cd5c8ad031fc75118a4ce7f42a4860c3d8dea/)을 기반으로 구축된 **Coupled-GRPO**의 구현을 릴리스합니다.

### Getting Started 시작

```
├── run.sh # start training
├── setup.py # modified open-r1/setup.py
├── src/open_r1/ #  our code based on open-r1
│   ├── configs.py # with diffusion related params
│   ├── coupled_grpo.py # inherits trl GRPOTrainer 
│   ├── grpo.py # main training script
│   ├── rewards.py # rewrite code reward and code_format reward 
│   ├── utils/code_providers.py # rewrite pass rate extraction for E2B
├── recipes/process_data.py # prepare grpo training data
├── recipes/config_coupled_code.yaml # training config
├── tests/test_code_reward.py # test sandbox execution for code
```

### 1. Prepare code and environment

1. 코드 및 환경 준비

Clone the source code of Open-R1 from `git clone https://github.com/huggingface/open-r1`. Merge and replace files between ours and Open-R1's (including `setup.py`).
에서 Open-R1의 소스 코드를 복제합니다 `git clone https://github.com/huggingface/open-r1` . 당사와 Open-R1(`setup.py` 포함) 간의 파일을 병합하고 교체합니다.

Set up the environment and dependencies following Open-R1:
Open-R1 다음에 환경 및 종속성을 설정합니다.

```
env=openr1
conda create -n $env python=3.11 -y -c anaconda
conda activate $env
pip install vllm==0.8.4
pip install setuptools
pip install flash-attn==2.8.0.post1 --no-build-isolation
pip install -e ".[code]"
```

Prepare a code sandbox at [E2B](https://e2b.dev/). Export your E2B token to `E2B_API_KEY` environment variable. Log in to wandb and export your `WANDB_ENTITY`.
[E2B](https://e2b.dev/)에서 코드 샌드박스를 준비합니다. E2B 토큰을 `E2B_API_KEY` 환경 변수로 내보냅니다. wandb에 로그인하고 `WANDB_ENTITY` 내보냅니다.

### 2. Data preparation 2. 데이터 준비

We prepare a hard split of GRPO training data based on [AceCode-89k](https://huggingface.co/datasets/TIGER-Lab/AceCode-87K).
[AceCode-89k](https://huggingface.co/datasets/TIGER-Lab/AceCode-87K)를 기반으로 GRPO 훈련 데이터의 하드 분할을 준비합니다.

```
cd recipes
python process_data.py --dataset_path "TIGER-Lab/AceCode-89K" --output_path "./acecode_hard.jsonl" --difficulty "hard"
```

### 3. Start GRPO training 3. GRPO 교육 시작

```
cd ..
bash run.sh 
# in `run.sh`, we start e2b server locally, but you can also run it on CPU clusters.
```

### Inference 추론

The DiffuCoder models ([Base](https://huggingface.co/apple/DiffuCoder-7B-Base), [Instruct](https://huggingface.co/apple/DiffuCoder-7B-Instruct), and [cpGRPO](https://huggingface.co/apple/DiffuCoder-7B-cpGRPO)) are now available on HuggingFace. Change `TOKEN_PER_STEP` to trade off between performance and speed.
이제 DiffuCoder 모델([Base](https://huggingface.co/apple/DiffuCoder-7B-Base), [Instruct](https://huggingface.co/apple/DiffuCoder-7B-Instruct) 및 [cpGRPO)](https://huggingface.co/apple/DiffuCoder-7B-cpGRPO)을 HuggingFace에서 사용할 수 있습니다. 성능과 속도 사이에서 균형을 맞추기 위해 `TOKEN_PER_STEP`를 변경하십시오.

Usage for Base model (click to expand)
기본 모델에 대한 사용(확장하려면 클릭)

```
import torch
from transformers import AutoModel, AutoTokenizer
model_path = "apple/DiffuCoder-7B-Base"
model = AutoModel.from_pretrained(model_path, torch_dtype=torch.bfloat16, trust_remote_code=True)
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = model.to("cuda").eval()
prompt = """
from typing import List

def has_close_elements(numbers: List[float], threshold: float) -> bool:
    \"\"\"
    Check if in given list of numbers, are any two numbers closer to each other than given threshold.
    >>> has_close_elements([1.0, 2.0, 3.0], 0.5)
    False
    >>> has_close_elements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3)
    True
    \"\"\"
"""
TOKEN_PER_STEP = 1 # diffusion timesteps * TOKEN_PER_STEP = total new tokens
inputs = tokenizer(prompt, return_tensors="pt")
input_ids = inputs.input_ids.to(device="cuda")
attention_mask = inputs.attention_mask.to(device="cuda")
output = model.diffusion_generate(
    input_ids,
    attention_mask=attention_mask,
    max_new_tokens=256,
    output_history=True,
    return_dict_in_generate=True,
    steps=256//TOKEN_PER_STEP,
    temperature=0.2,
    top_p=0.95,
    alg="entropy",
    alg_temp=0.,
)
generations = [
    tokenizer.decode(g[len(p) :].tolist())
    for p, g in zip(input_ids, output.sequences)
]
print(generations[0].split(tokenizer.eos_token)[0])
```

Output (click to expand)
출력(확장하려면 클릭)

```
    # Sort the list to make it easier to find close elements
    numbers.sort()
    # Iterate through the list, checking each adjacent pair
    for i in range(len(numbers) - 1):
        # If the difference between the current and next element is less than the threshold, return True
        if numbers[i + 1] - numbers[i] < threshold:
            return True
    # If no such pair is found, return False
    return False 
```

> Given an example input from the HumanEval test, the output of DiffuCoder-Base is a direct completion of the code snippet.
HumanEval 테스트의 예제 입력이 주어지면 DiffuCoder-Base의 출력은 코드 조각의 직접 완성입니다.
> 

Usage for Instruct model (click to expand)
Instruct 모델 사용법(확장하려면 클릭)

```
import torch
from transformers import AutoModel, AutoTokenizer
model_path = "apple/DiffuCoder-7B-cpGRPO"
model = AutoModel.from_pretrained(model_path, torch_dtype=torch.bfloat16, trust_remote_code=True)
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = model.to("cuda").eval()
query = "Write a function to find the shared elements from the given two lists."
prompt = f"""<|im_start|>system
You are a helpful assistant.<|im_end|>
<|im_start|>user
{query.strip()}
<|im_end|>
<|im_start|>assistant
""" ## following the template of qwen; you can also use apply_chat_template function
TOKEN_PER_STEP = 1 # diffusion timesteps * TOKEN_PER_STEP = total new tokens
inputs = tokenizer(prompt, return_tensors="pt")
input_ids = inputs.input_ids.to(device="cuda")
attention_mask = inputs.attention_mask.to(device="cuda")
output = model.diffusion_generate(
    input_ids,
    attention_mask=attention_mask,
    max_new_tokens=256,
    output_history=True,
    return_dict_in_generate=True,
    steps=256//TOKEN_PER_STEP,
    temperature=0.4,
    top_p=0.95,
    alg="entropy",
    alg_temp=0.,
)
generations = [
    tokenizer.decode(g[len(p) :].tolist())
    for p, g in zip(input_ids, output.sequences)
]
print(generations[0].split('<|dlm_pad|>')[0])
```

Output (click to expand)
출력(확장하려면 클릭)

```
Here is the code to solve this problem: 
```python
def shared_elements(list1, list2): 
  return [value for value in list1 if value in  list2] 
```<|im_end|> 
```

> Given an example input from the MBPP test, the output of DiffuCoder-cpGRPO is a chat-based response.
MBPP 테스트의 예제 입력이 주어지면 DiffuCoder-cpGRPO의 출력은 채팅 기반 응답입니다.
> 

### Demo 데모

🚀 Start the demo and enter any prompt you want!
🚀 데모를 시작하고 원하는 프롬프트를 입력하세요!

```
python inference_demo.py
```

### Evaluation 평가

The diffusion inference algorithm is based on Dream-7B. The code evaluation is based on [Qwen2.5-Coder](https://github.com/QwenLM/Qwen2.5-Coder/tree/main/qwencoder-eval).
확산 추론 알고리즘은 Dream-7B를 기반으로 합니다. 코드 평가는 [Qwen2.5-Coder](https://github.com/QwenLM/Qwen2.5-Coder/tree/main/qwencoder-eval)를 기반으로 합니다.

## Acknowledgments 승인을

We sincerely appreciate the following works for DiffuCoder:
DiffuCoder에 대한 다음 작업에 진심으로 감사드립니다.

- Our data used in pre-training/mid-training/instruction tuning are from [OpenCoder](https://huggingface.co/OpenCoder-LLM).
사전 학습/중간 학습/명령어 튜닝에 사용된 데이터는 [OpenCoder](https://huggingface.co/OpenCoder-LLM)에서 가져온 것입니다.
- Our instruction tuning code is based on [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory).
우리의 명령어 튜닝 코드는 [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory)를 기반으로 합니다.
- Our coupled-GRPO is built upon [Open-R1](https://github.com/huggingface/open-r1) and [d1](https://github.com/dllm-reasoning/d1).
당사의 결합 GRPO는 [Open-R1](https://github.com/huggingface/open-r1) 및 [d1](https://github.com/dllm-reasoning/d1)을 기반으로 합니다.
- Our evaluation is built upon [Dream](https://github.com/HKUNLP/Dream) and [Qwen2.5-Coder](https://github.com/QwenLM/Qwen2.5-Coder/tree/main/qwencoder-eval).
우리의 평가는 [Dream](https://github.com/HKUNLP/Dream)과 [Qwen2.5-Coder](https://github.com/QwenLM/Qwen2.5-Coder/tree/main/qwencoder-eval)를 기반으로 합니다.

## Citation 인용

```
@article{gong2025diffucoder,
  title={DiffuCoder: Understanding and Improving Masked Diffusion Models for Code Generation},
  author={Shansan Gong, Ruixiang Zhang, Huangjie Zheng, Jiatao Gu, Navdeep Jaitly, Lingpeng Kong, Yizhe Zhang},
  year={2025},
  eprint={2506.20639},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2506.20639},
}
```