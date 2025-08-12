/**
 * 목적: Astro 기본 설정 파일. 정적 사이트 출력과 기본 경로를 지정한다.
 */
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // 프로젝트 사이트(https://{user}.github.io/{repo}/) 배포를 위해 base 경로를 지정한다.
  // 레포명이 pages 인 경우: '/pages/'
  base: '/pages/'
});


