import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const input = path.resolve('public/pwa/source-icon.png')
const outDir = path.resolve('public/icons')

await fs.mkdir(outDir, { recursive: true })

async function buildStandard(size, filename) {
  await sharp(input)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(outDir, filename))
}

async function buildMaskable(size, filename) {
  const safeSize = Math.round(size * 0.72)

  const iconBuffer = await sharp(input)
    .resize(safeSize, safeSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: '#ffffff',
    },
  })
    .composite([
      {
        input: iconBuffer,
        gravity: 'center',
      },
    ])
    .png()
    .toFile(path.join(outDir, filename))
}

await buildStandard(16, 'favicon-16x16.png')
await buildStandard(32, 'favicon-32x32.png')
await buildStandard(48, 'favicon-48x48.png')
await buildStandard(180, 'apple-touch-icon.png')
await buildStandard(192, 'pwa-192x192.png')
await buildStandard(512, 'pwa-512x512.png')

await buildMaskable(192, 'maskable-192x192.png')
await buildMaskable(512, 'maskable-512x512.png')

console.log('PWA icons generated in public/icons')
