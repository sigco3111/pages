#!/usr/bin/env node
/**
 * 목적: dist 정적 산출물을 로컬에서 `/pages` 경로로 서빙하는 개발용 서버.
 * - GitHub Pages 배포 환경(`/pages/` 하위 경로)과 동일한 라우팅을 재현한다.
 * - 루트(`/`) 접근 시 `/pages/`로 리다이렉트한다.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.PORT || 4321);

const app = express();
app.use(compression());

// 루트로 오면 /pages/로 리다이렉트
app.get('/', (_req, res) => res.redirect('/pages/'));

// /pages 경로에 dist 정적 파일 마운트
app.use('/pages', express.static(DIST_DIR, { fallthrough: true, index: ['index.html'] }));

// /pages 경로 하위에서 파일이 없으면 index.html 반환(간단한 SPA/상세 라우팅 대응)
app.use('/pages', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serving dist at http://localhost:${PORT}/pages/`);
});


