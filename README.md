# aecodezonebg — сайт на студиото

Vite + React 18 + TypeScript, Tailwind CSS, Framer Motion, GSAP ScrollTrigger (само за портфолиото) и Lenis.

## Пускане

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # проверка на типовете + production build в dist/
npm run preview      # сервира dist/ на http://localhost:4173
```

## Скриптове

| Команда | Какво прави |
| --- | --- |
| `npm run screenshots` | Снима живите сайтове от портфолиото (десктоп + мобилен) с локалния Edge и записва WebP в `public/projects/`. |
| `npm run videos` | Записва кратко видео на скрол на всеки сайт (WebM, VP9, ~1 MB) в `public/projects/` и `src/generated/videos.json`. Нужен е ffmpeg на Playwright: `npx playwright install ffmpeg`. |
| `npm run check-live` | Проверява кои сайтове от портфолиото отговарят (пуска се автоматично при `build`); резултатът определя индикатора „Жив сайт“. |
| `npm run brand` | Генерира favicon (SVG/PNG), `og-image.png` и копия на логото в `public/` от `assets/logo.svg`. |
| `npm run shots:review -- 360 1280` | Screenshots на работещия preview за преглед (в `.review/`, не се commit-ват). Добавете `--reduced` за статичната версия. |
| `npm run lighthouse` | Lighthouse (мобилен и десктоп) срещу preview сървъра; отчетите са в `.lighthouse/`. |

Скриптовете ползват инсталирания Microsoft Edge (Playwright channel `msedge`), така че не се теглят отделни браузъри.

## Къде какво се редактира

- **Текстове:** `src/content.ts` — всички текстове, услуги, стъпки и проекти.
- **Контакти, домейн, форма:** `src/config.ts` и `.env` (`VITE_FORMSPREE_ID`, виж `.env.example`).
- **Цветове и типография:** `tailwind.config.ts`.
- **Лого:** `src/components/brand/Logo.tsx` (React) и `assets/logo.svg` (източник за `npm run brand`).

## Структура

```
src/
  App.tsx                 страница + case study модал по маршрут /proekti/:slug
  content.ts, config.ts   текстове и настройки
  components/brand/       Logo, Bracket, Preloader
  components/ui/          MagneticButton, RevealText, TiltCard, CursorGrid, ParallaxBracket, ProjectShot, ...
  sections/               Header, Hero, ProjectsStrip, Portfolio, Services (конфигуратор), Process, Contact, Footer, CaseStudy, NotFound
  generated/              videos.json, live.json (генерират се от скриптовете)
  lib/                    media-query hooks, motion токени, Lenis provider
scripts/                  screenshots, brand assets, review shots, lighthouse
```

## Анимации и достъпност

- Анимират се само `transform` и `opacity`.
- `prefers-reduced-motion`: без preloader, без Lenis, без pinned скрол и видеа; съдържанието е статично.
  Внимание: ако в Windows е изключено „Show animations in Windows“, браузърът съобщава reduced motion и сайтът показва статичната версия.
- Курсорните ефекти (магнитни бутони, tilt, светеща решетка) работят само при `(hover: hover) and (pointer: fine)`.
