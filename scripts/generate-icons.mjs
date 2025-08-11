#!/usr/bin/env node
/**
 * 목적: public/favicon.svg를 기반으로 PNG 및 ICO 파비콘 세트를 생성한다.
 * - 생성 대상: favicon-32x32.png, favicon-192x192.png, apple-touch-icon.png(180x180), favicon.ico(16/32/48 멀티 해상도)
 * - 모든 예외는 상위로 전파(프로세스 실패)하여 CI에서 감지되도록 한다.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SRC_SVG = path.join(PUBLIC_DIR, 'favicon.svg');

async function ensureSvg() {
  try {
    await fs.access(SRC_SVG);
  } catch {
    throw new Error(`소스 아이콘이 없습니다: ${SRC_SVG}`);
  }
}

async function generatePng(size, outName) {
  const buf = await sharp(SRC_SVG).resize(size, size, { fit: 'contain' }).png({ compressionLevel: 9 }).toBuffer();
  await fs.writeFile(path.join(PUBLIC_DIR, outName), buf);
}

async function generateIco() {
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map((s) => sharp(SRC_SVG).resize(s, s, { fit: 'contain' }).png().toBuffer())
  );
  // sharp는 직접 ico 출력이 없어 png-to-ico 등의 의존이 필요하지만, 추가 의존을 피하기 위해 32x32 단일 ico를 생성한다.
  // 멀티 아이콘이 필요하면 png-to-ico 의존을 추가하거나 GitHub Actions에서만 생성하도록 확장한다.
  const single = images[1]; // 32x32
  // 간단한 단일 아이콘: many browsers accept PNG renamed as .ico, but more robust approach is to depend on png-to-ico.
  // 여기서는 안전하게 png-to-ico를 사용한다.
}

async function generateIcoWithLib() {
  const toIco = (await import('png-to-ico')).default;
  const pngs = await Promise.all([
    sharp(SRC_SVG).resize(16, 16).png().toBuffer(),
    sharp(SRC_SVG).resize(32, 32).png().toBuffer(),
    sharp(SRC_SVG).resize(48, 48).png().toBuffer()
  ]);
  const ico = await toIco(pngs);
  await fs.writeFile(path.join(PUBLIC_DIR, 'favicon.ico'), ico);
}

async function main() {
  await ensureSvg();
  await generatePng(32, 'favicon-32x32.png');
  await generatePng(192, 'favicon-192x192.png');
  await generatePng(180, 'apple-touch-icon.png');
  await generateIcoWithLib();
  console.log('Icons generated: favicon-32x32.png, favicon-192x192.png, apple-touch-icon.png, favicon.ico');
}

main().catch((e) => {
  console.error('아이콘 생성 실패:', e?.message || e);
  process.exit(1);
});


