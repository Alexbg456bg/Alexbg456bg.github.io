/**
 * Writes the preloader markup (logo with CSS draw animation + skip button) into
 * index.html between the <!-- preloader:start --> / <!-- preloader:end --> markers.
 * The preloader lives in plain HTML so it runs before any JavaScript has loaded.
 * Run after changing the logo: `npm run brand` calls it.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Logo } from '../src/components/brand/Logo'
import { ui } from '../src/content'

const file = resolve(import.meta.dirname, '..', 'index.html')

export async function writePreloaderMarkup() {
  const svg = renderToStaticMarkup(createElement(Logo, { ink: 'white', draw: true, title: null }))
    // Own id prefix, so the masks never collide with the logos React renders later.
    .replace(/ae-(a-gap|e-gap|e-top|e-bottom)-/g, 'pre-$1-')
  const markup = `<!-- preloader:start -->
    <div id="ae-preloader">
      ${svg}
      <button type="button" id="ae-preloader-skip">${ui.preloaderSkip}</button>
    </div>
    <!-- preloader:end -->`
  const html = await readFile(file, 'utf8')
  const next = html.replace(/<!-- preloader:start -->[\s\S]*?<!-- preloader:end -->/, markup)
  if (next === html && !html.includes(svg)) throw new Error('preloader markers not found in index.html')
  await writeFile(file, next)
}

if (process.argv[1]?.endsWith('preloader-markup.ts')) {
  writePreloaderMarkup().then(() => console.log('preloader markup written to index.html'))
}
