/**
 * Records a short, muted scroll-through video of every portfolio site with the local Edge,
 * cuts off the page-load frames and re-encodes it as a small VP9 WebM with the ffmpeg
 * that ships with Playwright (`npx playwright install ffmpeg`). Writes src/generated/videos.json.
 * Sites that cannot be recorded are listed at the end; the site falls back to the
 * screenshot with a CSS scroll effect for those.
 *
 *   npm run videos
 */
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { portfolio } from '../src/content'

const root = resolve(import.meta.dirname, '..')
const outDir = resolve(root, 'public', 'projects')
const tmpDir = resolve(root, '.video-tmp')
const size = { width: 1280, height: 800 }
const SCROLL_MS = 7000

type Entry = { video: string } | null

async function findFfmpeg(): Promise<string> {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH ?? join(homedir(), 'AppData', 'Local', 'ms-playwright')
  const dir = (await readdir(base)).find((d) => d.startsWith('ffmpeg'))
  if (!dir) throw new Error('Playwright ffmpeg not found — run `npx playwright install ffmpeg`')
  return join(base, dir, process.platform === 'win32' ? 'ffmpeg-win64.exe' : 'ffmpeg-linux')
}

async function main() {
  await mkdir(outDir, { recursive: true })
  await mkdir(resolve(root, 'src', 'generated'), { recursive: true })
  const ffmpeg = await findFfmpeg()
  const browser = await chromium.launch({ channel: 'msedge' })
  const manifest: Record<string, Entry> = {}
  const failed: string[] = []

  for (const p of portfolio.items) {
    const ctx = await browser.newContext({
      viewport: size,
      locale: 'bg-BG',
      recordVideo: { dir: tmpDir, size },
    })
    const t0 = Date.now()
    try {
      const page = await ctx.newPage()
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 45_000 })
      await page.waitForTimeout(1500)
      const start = (Date.now() - t0) / 1000
      // Smooth, eased scroll down about two and a half screens.
      // Passed as a string: tsx would otherwise inject helpers that do not exist in the page.
      await page.evaluate(`new Promise((done) => {
        const ms = ${SCROLL_MS}, distance = ${size.height * 2.5}
        const from = window.scrollY, t = performance.now()
        const step = (now) => {
          const k = Math.min(1, (now - t) / ms)
          const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
          window.scrollTo(0, from + distance * ease)
          if (k < 1) requestAnimationFrame(step)
          else done()
        }
        requestAnimationFrame(step)
      })`)
      await page.waitForTimeout(600)
      const video = page.video()
      await ctx.close()
      const file = `${p.image}-scroll.webm`
      const raw = await video!.path()
      execFileSync(ffmpeg, [
        '-hide_banner', '-loglevel', 'error', '-y',
        '-ss', String(Math.max(0, start - 0.2)), '-i', raw,
        '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-deadline', 'good', '-cpu-used', '4', '-row-mt', '1', '-an',
        resolve(outDir, file),
      ])
      const kb = (await stat(resolve(outDir, file))).size / 1024
      manifest[p.slug] = { video: `/projects/${file}` }
      console.log(`${file}  ${kb.toFixed(0)} KB`)
    } catch (err) {
      await ctx.close().catch(() => undefined)
      manifest[p.slug] = null
      failed.push(`${p.title}: ${(err as Error).message.split('\n')[0]}`)
    }
  }

  await browser.close()
  await rm(tmpDir, { recursive: true, force: true })
  await writeFile(resolve(root, 'src', 'generated', 'videos.json'), JSON.stringify(manifest, null, 2) + '\n')
  if (failed.length) {
    console.warn('\nCould not record (screenshot fallback is used):')
    failed.forEach((f) => console.warn(` - ${f}`))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
