# 폰트 복제 AI - Calligrapher

발견일: 2025/07/07
원문 URL: https://github.com/Calligrapher2025/Calligrapher
분류: 오픈소스
원문 Source: 🔗github
즐겨찾기: No

[](https://opengraph.githubassets.com/8a972e2dd6ece6346cc793e0f945483e2740e8ea93fd2148f228280cdd9966cc/Calligrapher2025/Calligrapher)

# Calligrapher: Freestyle Text Image Customization
서예가: 자유형 텍스트 이미지 사용자 정의

> **Calligrapher: Freestyle Text Image Customization**
**서예가: 자유형 텍스트 이미지 사용자 정의**
> 

![](https://github.com/Calligrapher2025/Calligrapher/raw/main/docs/static/images/teaser.jpg)

**Figure:** Photorealistic text image customization results produced by our proposed Calligrapher, which allows users to perform customization with diverse stylized images and text prompts.
**숫자:** 우리가 제안한 Calligrapher가 생성한 사실적인 텍스트 이미지 사용자 정의 결과를 통해 사용자는 다양한 양식화된 이미지와 텍스트 프롬프트로 사용자 정의를 수행할 수 있습니다.

![](https://github.com/Calligrapher2025/Calligrapher/raw/main/docs/static/images/multilingual_samples.png)

**Figure:** Multilingual freestyle text customization results are shown in the below figure, where tested languages and text are: Chinese (你好朋友/夏天来了), Korean (서예가), and Japanese (ナルト).
**숫자:** 다국어 자유형 텍스트 사용자 지정 결과는 아래 그림에 표시되어 있으며, 테스트된 언어와 텍스트는 중국어(你好朋友/夏天来了), 한국어(서예가) 및 일본어(ナルト)입니다.

## 🔗 **Links & Resources**
🔗 **링크 및 리소스**

**[[📄 Project Page](https://calligrapher2025.github.io/Calligrapher/)]** **[[🎥 Video](https://youtu.be/FLSPphkylQE)]** **[[📦 Model & Data](https://huggingface.co/Calligrapher2025/Calligrapher)]** **[[🤗 Hugging Face Demo](https://huggingface.co/spaces/Calligrapher2025/Calligrapher)]** **[[Demo2](https://huggingface.co/spaces/SahilCarterr/Calligrapher)]**
**[** [**📄 프로젝트 페이지](https://calligrapher2025.github.io/Calligrapher/)]****[** [**🎥 비디오](https://youtu.be/FLSPphkylQE)]****[** [**📦 모델 및 데이터](https://huggingface.co/Calligrapher2025/Calligrapher)]****[** [**🤗 포옹 얼굴 데모](https://huggingface.co/spaces/Calligrapher2025/Calligrapher)]****[[데모2](https://huggingface.co/spaces/SahilCarterr/Calligrapher)]**

## Summary 요약

We introduce Calligrapher, a novel diffusion-based framework that innovatively integrates advanced text customization with artistic typography for digital calligraphy and design applications. Addressing the challenges of precise style control and data dependency in typographic customization, our framework supports text customization under various settings including self-reference, cross-reference, and non-text reference customization. By automating high-quality, visually consistent typography, Calligrapher empowers creative practitioners in digital art, branding, and contextual typographic design.
디지털 서예 및 디자인 애플리케이션을 위한 고급 텍스트 사용자 정의와 예술적 타이포그래피를 혁신적으로 통합하는 새로운 확산 기반 프레임워크인 Calligrapher를 소개합니다. 타이포그래피 사용자 정의에서 정확한 스타일 제어 및 데이터 종속성 문제를 해결하기 위해 당사 프레임워크는 자체 참조, 상호 참조 및 비텍스트 참조 사용자 정의를 포함한 다양한 설정에서 텍스트 사용자 정의를 지원합니다. 고품질의 시각적으로 일관된 타이포그래피를 자동화함으로써 Calligrapher는 디지털 아트, 브랜딩 및 상황에 맞는 타이포그래피 디자인 분야의 창의적인 실무자에게 힘을 실어줍니다.

![](https://github.com/Calligrapher2025/Calligrapher/raw/main/docs/static/images/framework.jpg)

**Figure:** Training framework of Calligrapher, demonstrating the integration of localized style injection and diffusion-based learning.
**숫자:** 현지화된 스타일 주입과 확산 기반 학습의 통합을 보여주는 Calligrapher의 교육 프레임워크입니다.

## Environment Setup 환경 설정

We provide two ways to set up the environment:
환경을 설정하는 두 가지 방법을 제공합니다.

### Using pip pip 사용

Requires Python 3.10 + PyTorch 2.5.0 + CUDA. Install the required dependencies using:
Python 3.10 + PyTorch 2.5.0 + CUDA가 필요합니다. 다음을 사용하여 필요한 종속성을 설치합니다.

```
pip install -r requirements.txt
```

### Using Conda Conda 사용

```
conda env create -f env.yml
conda activate calligrapher
```

## Pretrained Models & Data (Benchmark)
사전 훈련된 모델 및 데이터(벤치마크)

Before running the demos, please download the required pretrained models and test data.
데모를 실행하기 전에 필요한 사전 학습된 모델과 테스트 데이터를 다운로드하세요.

Download the models and testing bench using huggingface_hub:
다음을 사용하여 모델 및 테스트 벤치를 다운로드huggingface_hub.

```
from huggingface_hub import snapshot_download
# Download the base model FLUX.1-Fill-dev (granted access needed)
snapshot_download("black-forest-labs/FLUX.1-Fill-dev", token="your_token")
# Download SigLIP image encoder (this model can also be automatically downloaded when running the code)
snapshot_download("google/siglip-so400m-patch14-384")
# Download Calligrapher model and test data
snapshot_download("Calligrapher2025/Calligrapher")
```

Or manually download from: [FLUX.1-Fill-dev](https://huggingface.co/black-forest-labs/FLUX.1-Fill-dev), [SigLIP](https://huggingface.co/google/siglip-so400m-patch14-384), and [Calligrapher](https://huggingface.co/Calligrapher2025/Calligrapher).
또는 다음에서 수동으로 다운로드합니다. [FLUX.1-채우기 개발](https://huggingface.co/black-forest-labs/FLUX.1-Fill-dev), [SigLIP](https://huggingface.co/google/siglip-so400m-patch14-384) 및 [서예가](https://huggingface.co/Calligrapher2025/Calligrapher).

The Calligrapher repository hosted on Huggingface contains:
Huggingface에서 호스팅되는 Calligrapher 저장소에는 다음이 포함됩니다.

- `calligrapher.bin`: Model weights.
`calligrapher.bin`: 가중치를 모델링합니다.
- `Calligrapher_bench_testing.zip`: Test dataset with examples for both self-reference customization and cross-reference customization scenarios. Additional reference images could also be found in it.
`Calligrapher_bench_testing.zip` : 자체 참조 사용자 지정 및 상호 참조 사용자 지정 시나리오 모두에 대한 예제가 포함된 테스트 데이터 세트입니다. 추가 참조 이미지도 찾을 수 있습니다.

## Model Usage 모델 사용

### 1.Path Configuration 1. 경로 구성

Before running the models, you need to configure the paths in `path_dict.json`:
모델을 실행하기 전에 `path_dict.json`에서 경로를 구성해야 합니다.

- `data_dir`: Path to store the test dataset.
`data_dir`: 테스트 데이터 세트를 저장할 경로입니다.
- `cli_save_dir`: Path to save results from command-line interface experiments.
`cli_save_dir`: 명령줄 인터페이스 실험의 결과를 저장하는 경로입니다.
- `gradio_save_dir`: Path to save results from Gradio interface experiments.
`gradio_save_dir`: Gradio 인터페이스 실험의 결과를 저장하는 경로입니다.
- `gradio_temp_dir`: Path to save temporary files.
`gradio_temp_dir`: 임시 파일을 저장할 경로입니다.
- `base_model_path`: Path to the base model FLUX.1-Fill-dev.
`base_model_path`: 기본 모델 FLUX.1-Fill-dev의 경로입니다.
- `image_encoder_path`: Path to the SigLIP image encoder model.
`image_encoder_path`: SigLIP 이미지 인코더 모델의 경로입니다.
- `calligrapher_path`: Path to the Calligrapher model weights.
`calligrapher_path`: 서예가 모델 가중치의 경로입니다.

### 2. Gradio Demo Interface (Recommended)

2. Gradio 데모 인터페이스(권장)

We provide two Gradio demo interfaces:
우리는 두 가지 Gradio 데모 인터페이스를 제공합니다.

1. Basic version: 기본 버전:

```
python gradio_demo.py
```

When using this demo, in addition to uploading source and reference images, users also need to use the Draw button (brush control) in the Image Editing Panel to manually draw the mask.
이 데모를 사용할 때 사용자는 소스 및 참조 이미지를 업로드하는 것 외에도 이미지 편집 패널의 그리기 버튼(브러시 컨트롤)을 사용하여 마스크를 수동으로 그려야 합니다.

1. Version supporting uploading custom inpainting masks:
사용자 정의 인페인팅 마스크 업로드를 지원하는 버전:

```
python gradio_demo_upload_mask.py
```

This version includes pre-configured examples (e.g., at the bottom of the page) and is recommended for users to first understand how to use the model.
이 버전에는 사전 구성된 예제(예: 페이지 하단)가 포함되어 있으며 사용자가 먼저 모델 사용 방법을 이해하는 것이 좋습니다.

Below is a preview of the two aforementioned Gradio demo interfaces:
다음은 앞서 언급한 두 가지 Gradio 데모 인터페이스의 미리보기입니다.

![](https://github.com/Calligrapher2025/Calligrapher/raw/main/docs/static/images/gradio_preview.png)

1. Version supporting multilingual text customization such as Chinese, which is supported by [TextFLUX](https://github.com/yyyyyxie/textflux). To use this gradio demo, first download [TextFLUX weights](https://huggingface.co/yyyyyxie/textflux-lora/blob/main/pytorch_lora_weights.safetensors) and configure the "textflux_path" entry in "path_dict.json". Then download [the font resource](https://github.com/yyyyyxie/textflux/blob/main/resource/font/Arial-Unicode-Regular.ttf) to "./resources/" and run:
[TextFLUX](https://github.com/yyyyyxie/textflux)에서 지원하는 중국어와 같은 다국어 텍스트 사용자 정의를 지원하는 버전입니다. 이 gradio 데모를 사용하려면 먼저 [TextFLUX 가중치](https://huggingface.co/yyyyyxie/textflux-lora/blob/main/pytorch_lora_weights.safetensors)를 다운로드하고 "path_dict.json"에서 "textflux_path" 항목을 구성하십시오. 그런 다음 [글꼴 리소스를](https://github.com/yyyyyxie/textflux/blob/main/resource/font/Arial-Unicode-Regular.ttf) "./resources/"에 다운로드하고 다음을 실행합니다.

```
python gradio_demo_multilingual.py
```

**✨User Tips: ✨사용자 팁:**

1. **Quality of multilingual generation.** The implementation strategy combines Calligrapher with the fine-tuned base model (textflux) without additional fine-tuning, please temper expectations regarding output quality.
**다국어 생성의 품질.** 구현 전략은 추가 미세 조정 없이 Calligrapher와 미세 조정된 기본 모델(textflux)을 결합하므로 출력 품질에 대한 기대치를 완화하십시오.
2. **Speed vs Quality Trade-off.** Use fewer steps (e.g., 10-step which takes ~4s/image on a single A6000 GPU) for faster generation, but quality may be lower.
**속도와 품질 절충.** 더 빠른 생성을 위해 더 적은 단계(예: 단일 A6000 GPU에서 이미지당 ~4초가 소요되는 10단계)를 사용하지만 품질은 낮아질 수 있습니다.
3. **Inpaint Position Freedom.** Inpainting positions are flexible - they don't necessarily need to match the original text locations in the input image.
**인페인트 위치 자유.** 인페인팅 위치는 유연하며 입력 이미지의 원본 텍스트 위치와 반드시 일치할 필요는 없습니다.
4. **Iterative Editing.** Drag outputs from the gallery to the Image Editing Panel (clean the Editing Panel first) for quick refinements.
**반복 편집.** 빠른 세분화를 위해 갤러리에서 이미지 편집 패널로 출력을 드래그합니다(먼저 편집 패널 정리).
5. **Mask Optimization.** Adjust mask size/aspect ratio to match your desired content. The model tends to fill the masks, and harmonizes the generation with background in terms of color and lighting.
**마스크 최적화.** 원하는 콘텐츠에 맞게 마스크 크기/종횡비를 조정하세요. 모델은 마스크를 채우는 경향이 있으며 색상과 조명 측면에서 배경과 세대를 조화시킵니다.
6. **Reference Image Tip.** White-background references improve style consistency - the encoder also considers background context of the given reference image.
**참조 이미지 팁.** 흰색 배경 참조는 스타일 일관성을 향상시킵니다 - 인코더는 주어진 참조 이미지의 배경 컨텍스트도 고려합니다.
7. **Resolution Balance.** Very high-resolution generation sometimes triggers spelling errors. 512/768px are recommended considering the model is trained under the resolution of 512.
**해상도 균형.** 매우 높은 해상도를 생성하면 때때로 철자 오류가 발생합니다. 512/768px는 모델이 512의 해상도로 훈련된다는 점을 고려할 때 권장됩니다.

### 3. Batch Testing (CLI) 3. 배치 테스트(CLI)

We provide two python scripts for two text image customization modes:
두 가지 텍스트 이미지 사용자 지정 모드에 대해 두 개의 Python 스크립트를 제공합니다.

1. Self-reference Customization:
자체 참조 사용자 정의:

```
python infer_calligrapher_self_custom.py
```

1. Cross-reference Customization:
상호 참조 사용자 정의:

```
python infer_calligrapher_cross_custom.py
```

## Additional Results 추가 결과

![](https://github.com/Calligrapher2025/Calligrapher/raw/main/docs/static/images/application.jpg)

**Figure:** Qualitative results of Calligrapher under various settings. We demonstrate text customization results respectively under settings of (a) self-reference, (b) cross-reference, and (c) non-text reference. Reference-based image generation results are also incorporated in (d).
**숫자:** 다양한 설정에서 서예가의 질적 결과. (a) 자체 참조, (b) 상호 참조 및 (c) 비텍스트 참조 설정에서 각각 텍스트 사용자 정의 결과를 보여줍니다. 참조 기반 이미지 생성 결과도 (d)에 통합되어 있습니다.