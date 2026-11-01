/**
 * Screenshots of the running site for visual review (not shipped).
 *
 *   npm run preview            # in another terminal
 *   npm run shots:review -- [url] [widths...] [--reduced]
 *
 * Writes .review/<width>-hero.png, .review/<width>-full.png, viewport-by-viewport
 * captures (.review/<width>-step-NN.png, which show pinned sections as users see them)
 * and .review/<width>-case.png with the first case study open.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const args = process.argv.slice(2)
const reduced = args.includes('--reduced')
const rest = args.filter((a) => a !== '--reduced')
const url = rest.find((a) => a.startsWith('http')) ?? 'http://localhost:4173/'
const widths = rest.filter((a) => /^\d+$/.test(a)).map(Number)
const sizes = (widths.length ? widths : [360, 1280]).map((w) => ({
  width: w,
  height: w < 500 ? 780 : w < 1000 ? 1024 : w < 1600 ? 800 : 1080,
}))

const outDir = resolve(import.meta.dirname, '..', '.review')
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch({ channel: 'msedge' })
  for (const size of sizes) {
    const ctx = await browser.newContext({
      viewport: size,
      deviceScaleFactor: 1,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
      hasTouch: size.width < 768,
      isMobile: size.width < 768,
    })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => console.error(`[${size.width}] page error:`, e.message))
    page.on('console', (m) => m.type() === 'error' && console.error(`[${size.width}] console:`, m.text()))
    await page.goto(url, { waitUntil: 'networkidle' })
    await wait(2600)
    const tag = `${size.width}${reduced ? '-reduced' : ''}`
    await page.screenshot({ path: resolve(outDir, `${tag}-hero.png`) })

    // Walk down the page one viewport at a time, like a visitor would.
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    let step = 0
    for (let y = 0; y < height; y += size.height) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await wait(1400)
      await page.screenshot({ path: resolve(outDir, `${tag}-step-${String(step++).padStart(2, '0')}.png`) })
    }
    await wait(900)
    await page.evaluate(() => window.scrollTo(0, 0))
    await wait(600)
    await page.screenshot({ path: resolve(outDir, `${tag}-full.png`), fullPage: true })

    await page.locator('a[href^="/proekti/"]:visible').first().click()
    await wait(1500)
    await page.screenshot({ path: resolve(outDir, `${tag}-case.png`) })
    await ctx.close()
    console.log(`captured ${tag}`)
  }
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
