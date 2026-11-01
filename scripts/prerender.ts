/**
 * Turns every route into static HTML after `vite build`, so the first paint does not
 * wait for JavaScript. React then hydrates the markup (src/main.tsx).
 *
 * Runs as the last step of `npm run build`.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { meta, portfolio } from '../src/content'
import { siteConfig } from '../src/config'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const ssrEntry = resolve(root, 'dist-ssr', 'entry-server.js')

type Page = { url: string; title: string; description: string }

const pages: Page[] = [
  { url: '/', title: meta.title, description: meta.description },
  ...portfolio.items.map((p) => ({
    url: `/proekti/${p.slug}`,
    title: `${p.title} — ${portfolio.title} | aecodezonebg`,
    description: p.summary,
  })),
  { url: '/404', title: '404 — aecodezonebg', description: meta.description },
]

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

async function main() {
  const { render } = (await import(pathToFileURL(ssrEntry).href)) as { render: (url: string) => string }
  const template = await readFile(resolve(dist, 'index.html'), 'utf8')

  for (const page of pages) {
    const canonical = new URL(page.url, siteConfig.url).href
    let html = template
      .replace('<div id="root">', `<div id="root" data-route="${page.url}">`)
      .replace('<!--app-html-->', render(page.url))
    {
      html = html
        .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
        .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escape(page.title)}$2`)
        .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
    }
    if (page.url === '/404') html = html.replace('</head>', '<meta name="robots" content="noindex" /></head>')
    // GitHub Pages and Vercel serve 404.html for unknown paths.
    const file =
      page.url === '/'
        ? resolve(dist, 'index.html')
        : page.url === '/404'
          ? resolve(dist, '404.html')
          : resolve(dist, `.${page.url}`, 'index.html')
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
    console.log(`prerendered ${page.url}`)
  }

  await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
