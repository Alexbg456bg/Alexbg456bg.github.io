/**
 * Runs Lighthouse (mobile and desktop) against the preview server using the locally
 * installed Edge, started headless with a debugging port for Lighthouse to attach to.
 * (Lighthouse's own launcher cannot start Edge on this machine.)
 *
 *   npm run preview      # in another terminal
 *   npm run lighthouse -- [url]
 *
 * Reports: .lighthouse/<form-factor>.report.html / .json
 */
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const url = process.argv[2] ?? 'http://localhost:4173/'
const port = 9334
const EDGE = process.env.EDGE_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const outDir = resolve(import.meta.dirname, '..', '.lighthouse')
mkdirSync(outDir, { recursive: true })

type Report = {
  categories: Record<string, { score: number }>
  audits: Record<string, { displayValue?: string }>
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'ae-lh-'))
  const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', 'about:blank'], {
    stdio: 'ignore',
  })
  await waitForPort()
  try {
    for (const form of ['mobile', 'desktop'] as const) {
      const out = resolve(outDir, form)
      execFileSync(
        process.platform === 'win32' ? 'npx.cmd' : 'npx',
        [
          '-y',
          'lighthouse@12',
          url,
          `--port=${port}`,
          '--quiet',
          '--output=json',
          '--output=html',
          `--output-path=${out}`,
          '--only-categories=performance,accessibility,best-practices,seo',
          ...(form === 'desktop' ? ['--preset=desktop'] : []),
        ],
        { stdio: 'inherit', shell: process.platform === 'win32' },
      )
      const r = JSON.parse(readFileSync(`${out}.report.json`, 'utf8')) as Report
      console.log(`\n${form}`)
      for (const [k, v] of Object.entries(r.categories)) console.log(`  ${k}: ${Math.round(v.score * 100)}`)
      for (const a of ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'])
        console.log(`  ${a}: ${r.audits[a].displayValue}`)
    }
  } finally {
    edge.kill()
  }
}

async function waitForPort() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (res.ok) return
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('Edge did not open its debugging port')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
