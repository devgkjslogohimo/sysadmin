import fs from 'node:fs/promises'
import path from 'node:path'

const sourceDir = path.resolve('dist')
const targetDir = path.resolve('.output/public')

await fs.mkdir(targetDir, { recursive: true })

const files = await fs.readdir(sourceDir)

const serviceWorkerFiles = files.filter(
  (file) => file === 'sw.js' || file.startsWith('workbox-'),
)

if (serviceWorkerFiles.length === 0) {
  throw new Error('Service worker PWA tidak ditemukan di folder dist.')
}

for (const file of serviceWorkerFiles) {
  await fs.copyFile(path.join(sourceDir, file), path.join(targetDir, file))

  console.log(`PWA: ${file} -> .output/public/${file}`)
}
