/**
 * Build step: checks which portfolio sites respond right now and writes
 * src/generated/live.json. The "Жив сайт" dot is only shown for sites marked true.
 * No network (or a timeout) simply means false.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { portfolio } from '../src/content'

const out = resolve(import.meta.dirname, '..', 'src', 'generated', 'live.json')

async function isLive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(8000) })
    return res.ok
  } catch {
    return false
  }
}

async function main() {
  const entries = await Promise.all(portfolio.items.map(async (p) => [p.slug, await isLive(p.url)] as const))
  const live = Object.fromEntries(entries)
  await mkdir(resolve(out, '..'), { recursive: true })
  await writeFile(out, JSON.stringify(live, null, 2) + '\n')
  console.log('live check:', live)
}

main()
