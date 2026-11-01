/**
 * Generates favicons, the Open Graph image and public copies of the logo
 * from assets/logo.svg, and refreshes the preloader markup in index.html. Rendering goes through the locally installed Edge
 * (Playwright channel "msedge"), so the OG text uses the real Manrope font.
 *
 *   npm run brand
 */
import { chromium } from 'playwright'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { writePreloaderMarkup } from './preloader-markup'

const root = resolve(import.meta.dirname, '..')
const out = (p: string) => resolve(root, 'public', p)

const NAVY = '#0B1F3A'
const NAVY_950 = '#07152A'

async function main() {
  const light = await readFile(resolve(root, 'assets/logo.svg'), 'utf8')
  const dark = light.replaceAll('#0B1F3A', '#FFFFFF')
  const inner = (svg: string) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')

  await mkdir(out(''), { recursive: true })
  await writeFile(out('logo.svg'), light)
  await writeFile(out('logo-dark.svg'), dark)

  // Square favicon: the full mark on a navy tile.
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 1240">
  <rect width="1240" height="1240" rx="260" fill="${NAVY}"/>
  <g transform="translate(110 332) scale(0.823)">${inner(dark)}</g>
</svg>
`
  await writeFile(out('favicon.svg'), favicon)
  await sharp(Buffer.from(favicon)).resize(32, 32).png().toFile(out('favicon-32.png'))
  await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile(out('apple-touch-icon.png'))

  const browser = await chromium.launch({ channel: 'msedge' })
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  const fontUrl = (b64: string) => `data:font/woff2;base64,${b64}`
  const manropeCyr = (await readFile(out('fonts/manrope-cyrillic-wght-normal.woff2'))).toString('base64')
  const manropeLat = (await readFile(out('fonts/manrope-latin-wght-normal.woff2'))).toString('base64')
  await page.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:M;src:url(${fontUrl(manropeCyr)}) format('woff2');font-weight:200 800;unicode-range:U+0400-045F}
    @font-face{font-family:M;src:url(${fontUrl(manropeLat)}) format('woff2');font-weight:200 800;unicode-range:U+0000-00FF,U+2000-206F}
    *{margin:0;box-sizing:border-box}
    body{width:1200px;height:630px;background:${NAVY_950};font-family:M,sans-serif;color:#EAF1F8;position:relative;overflow:hidden}
    .grid{position:absolute;inset:0;background-image:radial-gradient(rgba(163,181,202,.22) 1.4px,transparent 1.8px);background-size:30px 30px;
      -webkit-mask-image:radial-gradient(ellipse at 70% 50%,#000 10%,transparent 70%)}
    .glow{position:absolute;right:-180px;top:-160px;width:820px;height:820px;border-radius:50%;background:radial-gradient(circle,rgba(0,194,255,.16),transparent 62%)}
    .wrap{position:absolute;inset:0;padding:84px 88px;display:flex;flex-direction:column;justify-content:space-between}
    .logo{width:300px}
    h1{font-size:76px;line-height:1;letter-spacing:-.035em;font-weight:700}
    h1 span{color:#00C2FF;display:block}
    .url{font-size:24px;color:#A3B5CA;font-weight:500;letter-spacing:.01em}
  </style></head><body><div class="grid"></div><div class="glow"></div>
  <div class="wrap"><div class="logo">${dark}</div>
  <div><h1>Правим сайтове,<span>които работят.</span></h1></div>
  <div class="url">aecodezonebg · уеб сайтове на React</div></div></body></html>`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out('og-image.png') })
  await browser.close()
  await writePreloaderMarkup()
  console.log('brand assets written to public/, preloader markup to index.html')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
