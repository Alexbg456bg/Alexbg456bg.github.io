/**
 * Captures desktop + mobile screenshots of every portfolio site and stores
 * optimised WebP files in public/projects/. Sites that fail to load get a
 * clean placeholder instead, and are listed at the end.
 *
 *   npm run screenshots
 */
import { chromium, type Browser } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { portfolio } from '../src/content'

const outDir = resolve(import.meta.dirname, '..', 'public', 'projects')

const VARIANTS = [
  // Desktop: 1440×900 viewport, stored at 1440 and 960 wide.
  { key: 'desktop', viewport: { width: 1440, height: 900 }, scale: 1, mobile: false, widths: [1440, 960] },
  // Mobile: 390×844 at 2x, stored at 600 wide.
  { key: 'mobile', viewport: { width: 390, height: 844 }, scale: 2, mobile: true, widths: [600] },
] as const

async function capture(browser: Browser, url: string, v: (typeof VARIANTS)[number]): Promise<Buffer> {
  const ctx = await browser.newContext({
    viewport: v.viewport,
    deviceScaleFactor: v.scale,
    isMobile: v.mobile,
    hasTouch: v.mobile,
    locale: 'bg-BG',
    reducedMotion: 'reduce',
  })
  try {
    const page = await ctx.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 })
    // Let intro animations and lazy images settle.
    await page.waitForTimeout(3000)
    return await page.screenshot({ type: 'png' })
  } finally {
    await ctx.close()
  }
}

function placeholder(title: string, width: number, height: number): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#0F2647"/>
  <text x="50%" y="50%" fill="#A3B5CA" font-family="sans-serif" font-size="${Math.round(width / 24)}" text-anchor="middle">${title}</text>
</svg>`
  return Buffer.from(svg)
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch({ channel: 'msedge' })
  const failed: string[] = []

  for (const project of portfolio.items) {
    for (const v of VARIANTS) {
      let png: Buffer
      try {
        png = await capture(browser, project.url, v)
      } catch (err) {
        failed.push(`${project.title} (${v.key}): ${(err as Error).message.split('\n')[0]}`)
        png = placeholder(project.title, v.viewport.width * v.scale, v.viewport.height * v.scale)
      }
      for (const w of v.widths) {
        const name = w === v.widths[0] ? `${project.image}-${v.key}.webp` : `${project.image}-${v.key}-${w}.webp`
        const file = resolve(outDir, name)
        const data = await sharp(png).resize({ width: w }).webp({ quality: 78, effort: 6 }).toBuffer()
        await writeFile(file, data)
        console.log(`${name}  ${(data.length / 1024).toFixed(0)} KB`)
      }
    }
  }

  await browser.close()
  if (failed.length) {
    console.warn('\nThese captures failed and were replaced with placeholders:')
    failed.forEach((f) => console.warn(` - ${f}`))
    process.exitCode = 2
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
