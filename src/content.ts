// All copy on the site lives here so it can be edited without touching components.
// Rule: only facts the team has confirmed. No prices, testimonials, metrics or invented services.

export type NavItem = { to: string; label: string }

export const nav: NavItem[] = [
  { to: '/proekti', label: 'Проекти' },
  { to: '/uslugi', label: 'Услуги' },
  { to: '/ceni', label: 'Цени' },
  { to: '/za-nas', label: 'За нас' },
  { to: '/kontakt', label: 'Контакт' },
]

export type PageMeta = { path: string; title: string; description: string }

/** Every page of the site, for routing, prerendering, titles and sitemap.xml. */
export const pages: PageMeta[] = [
  {
    path: '/',
    title: 'aecodezonebg — изработка на сайтове за малък и среден бизнес',
    description:
      'Уеб студио aecodezonebg: каталожни и бизнес сайтове, които се отварят добре на телефон. Цени от 400 €, оферта до 24 часа, хостинг и поддръжка.',
  },
  {
    path: '/proekti',
    title: 'Проекти | aecodezonebg',
    description: 'Четири сайта на живо, направени от aecodezonebg — сред тях сайтовете на PestGuard Pro и АДРИНА ООД.',
  },
  {
    path: '/uslugi',
    title: 'Услуги | aecodezonebg',
    description: 'Каталожни и бизнес сайтове, по желание с админ панел, хостинг и месечна поддръжка. Изберете какъв сайт ви трябва.',
  },
  {
    path: '/ceni',
    title: 'Цени | aecodezonebg',
    description: 'Каталожен сайт от 400 €, с админ панел от 500 €, бизнес сайт по запитване. Хостинг, домейн и поддръжка — отделно.',
  },
  {
    path: '/za-nas',
    title: 'За нас | aecodezonebg',
    description: 'Зад aecodezonebg сме Алекс и Емо — малък екип от ТУ-Варна. Говорите директно с нас.',
  },
  {
    path: '/kontakt',
    title: 'Контакт | aecodezonebg',
    description: 'Пишете ни за вашия сайт — до 24 часа ще ви отговорим с въпроси или с оферта.',
  },
]

export const meta = { title: pages[0].title, description: pages[0].description }

export type CodeToken = { t: string; c: 'kw' | 'fn' | 'tag' | 'attr' | 'str' | 'p' | 'txt' }
/** What a finished code line adds to the preview page next to it. */
export type BuildPart = 'page' | 'header' | 'hero' | 'cards' | 'button' | 'done'

export const hero = {
  eyebrow: 'уеб студио',
  titleLines: ['Сайт, който', 'носи запитвания.'],
  subtitle:
    'Отваря се добре на телефон, клиентите ви пишат директно от него, а ние го хостваме и поддържаме след пускането.',
  primaryCta: 'Заяви оферта',
  secondaryCta: 'Виж проектите',
  // Short, confirmed facts shown under the calls to action.
  points: ['Оферта до 24 часа', 'Цени от 400 €', 'Хостинг и поддръжка'],
  scene: {
    file: 'Сайт.tsx',
    url: 'вашият-сайт.bg',
    // Illustrative code: each finished line "builds" a part of the preview page.
    // The preview text below is a mock-up, not a real client.
    code: [
      { build: null, tokens: [{ t: 'export default function ', c: 'kw' }, { t: 'Сайт', c: 'fn' }, { t: '() {', c: 'p' }] },
      { build: 'page', tokens: [{ t: '  return ', c: 'kw' }, { t: '<', c: 'p' }, { t: 'Страница', c: 'tag' }, { t: '>', c: 'p' }] },
      { build: 'header', tokens: [{ t: '    <', c: 'p' }, { t: 'Хедър', c: 'tag' }, { t: ' лого', c: 'attr' }, { t: '=', c: 'p' }, { t: '"ae"', c: 'str' }, { t: ' />', c: 'p' }] },
      { build: 'hero', tokens: [{ t: '    <', c: 'p' }, { t: 'Заглавие', c: 'tag' }, { t: '>', c: 'p' }, { t: 'Вашият бизнес онлайн', c: 'txt' }, { t: '</', c: 'p' }, { t: 'Заглавие', c: 'tag' }, { t: '>', c: 'p' }] },
      { build: 'cards', tokens: [{ t: '    <', c: 'p' }, { t: 'Услуги', c: 'tag' }, { t: ' брой', c: 'attr' }, { t: '={', c: 'p' }, { t: '3', c: 'str' }, { t: '} />', c: 'p' }] },
      { build: 'button', tokens: [{ t: '    <', c: 'p' }, { t: 'Бутон', c: 'tag' }, { t: '>', c: 'p' }, { t: 'Свържете се', c: 'txt' }, { t: '</', c: 'p' }, { t: 'Бутон', c: 'tag' }, { t: '>', c: 'p' }] },
      { build: null, tokens: [{ t: '  </', c: 'p' }, { t: 'Страница', c: 'tag' }, { t: '>', c: 'p' }] },
      { build: 'done', tokens: [{ t: '}', c: 'p' }] },
    ] as { build: BuildPart | null; tokens: CodeToken[] }[],
    preview: {
      title: 'Вашият бизнес онлайн',
      text: 'Подреден сайт, който работи на всяко устройство.',
      cards: ['Услуга', 'Услуга', 'Услуга'],
      button: 'Свържете се',
    },
  },
}

// Technologies we actually use. Shown once, in the footer.
export const tech = ['React', 'TypeScript', 'Tailwind CSS', 'Vite']

/** Endless strip under the hero: only services and promises we actually offer. */
export const strip = [
  'Каталожни сайтове',
  'Бизнес сайтове',
  'Админ панел',
  'Мобилна версия',
  'Хостинг',
  'Месечна поддръжка',
  'Оферта до 24 часа',
]

export const preview = { label: 'Разгледай' }

/** Floating call button in the corner. */
export const contactFab = {
  open: 'Свържете се с нас',
  close: 'Затвори',
  call: 'Обадете ни се',
  form: 'Форма за запитване',
}

/** Home page: confirmed facts only (see the pricing, FAQ and portfolio below). */
export const facts = {
  label: 'Накратко за нас',
  items: [
    { value: 4, label: 'сайта на живо, които можете да отворите' },
    { value: 24, suffix: ' ч', label: 'до конкретна оферта' },
    { value: 400, prefix: 'от', suffix: ' €', label: 'за каталожен сайт' },
    { value: 100, suffix: '%', label: 'адаптивни — телефон, таблет, компютър' },
  ] as { value: number; prefix?: string; suffix?: string; label: string }[],
  clientsLabel: 'Правили сме сайтове за',
  clients: ['PestGuard Pro ЕООД', 'АДРИНА ООД'],
}

/** Home page: the four services, leading to /uslugi. Copy matches the configurator. */
export const servicesOverview = {
  eyebrow: 'Услуги',
  title: 'Какво правим',
  cta: 'Изберете вашия сайт',
  more: 'Научете повече',
  items: [
    { icon: 'catalog', title: 'Каталожен сайт', text: 'Продукти или услуги в категории, със страница за всеки артикул.' },
    { icon: 'business', title: 'Бизнес сайт', text: 'Какво предлагате, кои сте и как да се свържат с вас.' },
    { icon: 'cms', title: 'Админ панел', text: 'Сменяте текстове и снимки сами, без да пишете код.' },
    { icon: 'hosting', title: 'Хостинг и поддръжка', text: 'Пускаме сайта онлайн и оставаме насреща всеки месец.' },
  ] satisfies { icon: ServiceIcon; title: string; text: string }[],
}

/** Home page: the four projects as a teaser that leads to /proekti. */
export const teaser = {
  eyebrow: 'Проекти',
  title: 'Сайтове на живо',
  cta: 'Всички проекти',
}

/** Home page: the three prices at a glance, leading to /ceni. */
export const pricingTeaser = {
  eyebrow: 'Цени',
  title: 'Ясни цени от началото',
  cta: 'Всички цени',
  note: 'Хостинг, домейн и поддръжка — отделно.',
}

export const cta = {
  title: 'Имате идея за сайт?',
  text: 'Разкажете ни накратко — до 24 часа ще ви отговорим с въпроси или с оферта.',
  button: 'Заяви оферта',
}

export type ServiceIcon = 'catalog' | 'business' | 'cms' | 'hosting'

export type Project = {
  slug: string
  title: string
  category: string
  summary: string
  url: string
  host: string
  // Screenshot / video base name in /public/projects (generated by `npm run screenshots`).
  image: string
  alt: string
  /** Company name for client work; null for the studio's own projects. */
  client: string | null
  task: string
  done: string
}

export const portfolio = {
  eyebrow: 'Проекти',
  title: 'Избрани проекти',
  intro: 'Четири сайта на живо. Отворете който и да е от тях.',
  clientLabel: 'Клиент',
  kindLabel: 'Вид',
  ownProject: 'Собствен проект',
  taskLabel: 'Задача',
  doneLabel: 'Какво направихме',
  openSite: 'Отвори сайта',
  viewCase: 'Разгледай проекта',
  close: 'Затвори',
  next: 'Следващ проект',
  live: 'Жив сайт',
  desktopLabel: 'Десктоп',
  mobileLabel: 'Мобилен',
  devicesTitle: 'На всяко устройство',
  devicesText:
    'Сайтът се подрежда за телефон, таблет и компютър. Проверяваме го на различни размери, преди да го пуснем.',
  items: [
    {
      slug: 'balgaria',
      title: 'България',
      category: 'Туристически портал',
      summary:
        'Портал за дестинации в България, подредени по области — природа, история, манастири, пещери и планини.',
      url: 'https://izgubisebg.vercel.app/',
      host: 'izgubisebg.vercel.app',
      image: 'balgaria',
      alt: 'Началната страница на туристическия портал „България“',
      client: null,
      task: 'Портал за места в България, подредени по области.',
      done: 'Адаптивен сайт с области, категории и страница за всяко място, пуснат на живо.',
    },
    {
      slug: 'pestguard-pro',
      title: 'PestGuard Pro',
      category: 'ДДД услуги',
      summary: 'Сайт на PestGuard Pro ЕООД — ДДД услуги във Велинград, Сърница, Доспат и Гоце Делчев.',
      url: 'https://pestguardpro1.com/',
      host: 'pestguardpro1.com',
      image: 'pestguard-pro',
      alt: 'Началната страница на сайта на PestGuard Pro',
      client: 'PestGuard Pro ЕООД',
      task: 'Сайт за ДДД услугите на фирмата и районите, в които работи.',
      done: 'Адаптивен бизнес сайт, пуснат на живо на собствен домейн.',
    },
    {
      slug: 'adrina',
      title: 'АДРИНА ООД',
      category: 'ДДД услуги за бизнеса',
      summary: 'Сайт на АДРИНА ООД — ДДД услуги за бизнес клиенти в София, от 2003 г.',
      url: 'https://adrinapest.com/',
      host: 'adrinapest.com',
      image: 'adrina',
      alt: 'Началната страница на сайта на АДРИНА ООД',
      client: 'АДРИНА ООД',
      task: 'Сайт за ДДД услуги, насочен към бизнес клиенти в София.',
      done: 'Адаптивен бизнес сайт, пуснат на живо на собствен домейн.',
    },
    {
      slug: 'korporacia-x',
      title: 'Корпорация X',
      category: 'Настолна игра',
      summary: 'Сайт на „Корпорация X“ — настолна игра за власт, доверие и измама.',
      url: 'https://korporaciq-x.vercel.app/',
      host: 'korporaciq-x.vercel.app',
      image: 'korporacia-x',
      alt: 'Началната страница на сайта на играта „Корпорация X“',
      client: null,
      task: 'Сайт, който представя настолната игра „Корпорация X“.',
      done: 'Адаптивен сайт, пуснат на живо.',
    },
  ] satisfies Project[],
}

export type ConfigOption = { id: string; title: string; text: string; icon: ServiceIcon; includes: string[] }
export type ConfigStep = { id: string; question: string; options: ConfigOption[] }

/** "Какъв сайт ви трябва?" — only the confirmed services, no prices. */
export const configurator = {
  eyebrow: 'Услуги',
  title: 'Какъв сайт ви трябва?',
  intro: 'Изберете с няколко клика. Ще видите какво включва сайтът и ще ни изпратите заявката.',
  base: ['Добре изглежда на телефон, таблет и компютър'],
  includesTitle: 'Вашият сайт включва',
  stepLabel: 'Стъпка',
  back: 'Назад',
  restart: 'Започни отначало',
  summaryTitle: 'Готово',
  summaryText: 'Изпратете заявката и ще ви отговорим с въпроси или с оферта.',
  submit: 'Изпрати заявката',
  messageIntro: 'Здравейте! Интересува ме сайт със следното:',
  steps: [
    {
      id: 'type',
      question: 'Какъв тип сайт?',
      options: [
        {
          id: 'catalog',
          title: 'Каталожен сайт',
          text: 'Продукти или услуги, подредени в категории, с отделна страница за всеки артикул.',
          icon: 'catalog',
          includes: ['Категории и страница за всеки артикул'],
        },
        {
          id: 'business',
          title: 'Бизнес сайт',
          text: 'Какво предлагате, кои сте и как да се свържат с вас.',
          icon: 'business',
          includes: ['Страници за услугите, за вас и за контакт'],
        },
      ],
    },
    {
      id: 'cms',
      question: 'Искате ли сами да променяте съдържанието?',
      options: [
        {
          id: 'cms-yes',
          title: 'Да, с админ панел',
          text: 'Панел (CMS), през който сами сменяте текстове и снимки, без код.',
          icon: 'cms',
          includes: ['Админ панел (CMS) за текстове и снимки'],
        },
        {
          id: 'cms-no',
          title: 'Не, засега не',
          text: 'Промените по съдържанието ги правим ние.',
          icon: 'business',
          includes: [],
        },
      ],
    },
    {
      id: 'care',
      question: 'Хостинг и поддръжка?',
      options: [
        {
          id: 'care-yes',
          title: 'Да, погрижете се',
          text: 'Пускаме сайта онлайн и го поддържаме всеки месец.',
          icon: 'hosting',
          includes: ['Хостинг', 'Месечна поддръжка'],
        },
        {
          id: 'care-no',
          title: 'Само изработка',
          text: 'Получавате готовия сайт и го хоствате сами.',
          icon: 'catalog',
          includes: [],
        },
      ],
    },
  ] satisfies ConfigStep[],
}

export const process = {
  eyebrow: 'Процес',
  title: 'Как работим',
  steps: [
    { title: 'Запитване', text: 'Пишете ни какво ви трябва. Няколко изречения стигат.' },
    { title: 'Оферта', text: 'До 24 часа получавате конкретна оферта.' },
    { title: 'Дизайн и изработка', text: 'Проектираме дизайна и изграждаме сайта.' },
    { title: 'Пускане', text: 'Качваме сайта и проверяваме, че всичко работи.' },
    { title: 'Поддръжка', text: 'Оставаме насреща с месечна поддръжка.' },
  ],
}

/** Prices confirmed by the team, in EUR, "from". Do not add others. */
export const pricing = {
  eyebrow: 'Цени',
  title: 'Цени',
  intro: 'Цените са ориентировъчни, „от“. Точната сума зависи от обхвата.',
  from: 'от',
  currency: '€',
  onRequest: 'По запитване',
  offer: 'Оферта в рамките на 24 часа',
  cta: 'Заяви оферта',
  catalog: {
    title: 'Каталожен сайт',
    text: 'Продукти или услуги в категории, със страница за всеки артикул.',
    toggleLabel: 'Вариант на каталожния сайт',
    variants: [
      {
        id: 'base',
        label: 'Без админ панел',
        price: 400,
        includes: ['Текстове и снимки', 'До ~15–20 артикула', 'Работи на телефон, таблет и компютър'],
      },
      {
        id: 'cms',
        label: 'С админ панел',
        price: 500,
        includes: [
          'Админ панел — сменяте текстове и снимки сами',
          'Текстове и снимки',
          'До ~15–20 артикула',
          'Работи на телефон, таблет и компютър',
        ],
      },
    ],
  },
  business: {
    title: 'Бизнес сайт',
    text: 'Какво предлагате, кои сте и как да се свържат с вас.',
    includes: ['Страници за услугите, за вас и за контакт', 'Работи на телефон, таблет и компютър', 'Обхват и цена по ваше запитване'],
  },
  extrasTitle: 'Отделно',
  extras: [
    { label: 'Хостинг', value: 'от ~3–5 €/мес.', note: 'безплатно за статичен сайт' },
    { label: 'Домейн .bg', value: '~30 €/год.' },
    { label: 'Поддръжка — статичен сайт', value: '15–25 €/мес.' },
    { label: 'Поддръжка — с админ панел', value: '15–20 €/мес.' },
    { label: 'Спешни срокове', value: '+20–50%' },
  ] as { label: string; value: string; note?: string }[],
  // TODO(team): confirm this wording before publishing.
  smallChange: {
    title: 'Какво е дребна промяна',
    text: 'Смяна на текст, снимка, телефон или работно време влиза в месечната поддръжка. Нови страници, секции и функции се оценяват отделно.',
  },
}

/** About the team. Only confirmed facts — no bio, years of experience or client counts. */
export const about = {
  eyebrow: 'За нас',
  title: 'Хората зад сайта',
  intro: 'Ние сме Алекс и Емо — малък екип, студенти в ТУ-Варна.',
  points: [
    { icon: 'business', title: 'Директна връзка', text: 'Говорите с нас, от първото запитване до пускането.' },
    { icon: 'catalog', title: 'Оферта до 24 часа', text: 'Отговаряме бързо и с конкретна оферта.' },
    { icon: 'hosting', title: 'Хостинг и поддръжка', text: 'След пускането оставаме насреща всеки месец.' },
  ] satisfies { icon: ServiceIcon; title: string; text: string }[],
  people: [
    { name: 'Алекс', photo: '/team/aleks.webp', alt: 'Портретна снимка на Алекс' },
    { name: 'Емо', photo: '/team/emo.webp', alt: 'Портретна снимка на Емо' },
  ],
}

/** Answers built only from confirmed facts. No prices or deadlines. */
export const faq = {
  eyebrow: 'Въпроси',
  title: 'Често задавани въпроси',
  intro: 'Не намирате отговор? Пишете ни — отговаряме лично.',
  items: [
    {
      q: 'Какви сайтове правите?',
      a: 'Каталожни сайтове — продукти или услуги в категории, със страница за всеки артикул — и бизнес сайтове, които представят какво предлагате, кои сте и как да се свържат с вас.',
    },
    {
      q: 'Ще мога ли сам да променям съдържанието?',
      a: 'Да, ако изберете админ панел (CMS). През него сменяте текстове и снимки без код. Ако не ви трябва, промените по съдържанието ги правим ние.',
    },
    {
      q: 'Погрижвате ли се за хостинга?',
      a: 'По желание. Можем да качим сайта на хостинг и да го поддържаме всеки месец, или да ви предадем готовия сайт, за да го хоствате сами.',
    },
    {
      q: 'Как изглежда сайтът на телефон?',
      a: 'Всеки сайт е адаптивен — подрежда се за телефон, таблет и компютър. Проверяваме го на различни размери, преди да го пуснем.',
    },
    {
      q: 'Колко струва един сайт?',
      a: 'Каталожен сайт е от 400 €, с админ панел — от 500 €. Бизнес сайтът е по запитване. Хостингът, домейнът и поддръжката са отделно — вижте секция „Цени“.',
    },
    {
      q: 'Колко бързо получавам оферта?',
      a: 'До 24 часа след запитването ви изпращаме конкретна оферта.',
    },
  ],
}

export const contact = {
  eyebrow: 'Контакт',
  title: 'Да направим вашия сайт',
  intro: 'Разкажете ни накратко за проекта. До 24 часа ще ви отговорим с въпроси или с оферта.',
  replyBy: 'Отговарят ви лично Алекс и Емо',
  emailLabel: 'Имейл',
  phoneLabel: 'Телефони',
  form: {
    name: 'Име',
    email: 'Имейл',
    message: 'Съобщение',
    submit: 'Изпрати запитването',
    sending: 'Изпращане…',
    success: 'Благодарим! Получихме съобщението ви и ще отговорим до 24 часа.',
    privacy: 'Използваме името и имейла ви само, за да отговорим на запитването. Формата се изпраща през Formspree.',
    error: 'Нещо се обърка при изпращането. Опитайте отново след малко.',
    notConfigured: 'Формата още не е свързана. Моля, опитайте по-късно.',
    mailSubject: 'Запитване за сайт',
    mailOpened: 'Отворихме имейл програмата ви с готово съобщение — остава само да натиснете „Изпрати“. Ако не се отвори, пишете ни директно на aecodezonebg@gmail.com.',
    again: 'Изпрати ново съобщение',
    prefilled: 'Попълнихме съобщението с избора ви. Можете да го допълните.',
    errors: {
      nameRequired: 'Моля, въведете име.',
      emailRequired: 'Моля, въведете имейл.',
      emailInvalid: 'Този имейл не изглежда валиден.',
      messageRequired: 'Моля, напишете съобщение.',
      messageShort: 'Съобщението е твърде кратко — поне 10 символа.',
    },
  },
}

export const footer = {
  tagline: 'Уеб студио за каталожни и бизнес сайтове — с админ панел, хостинг и поддръжка.',
  navTitle: 'Навигация',
  servicesTitle: 'Услуги',
  services: ['Каталожни сайтове', 'Бизнес сайтове', 'Админ панел (CMS)', 'Хостинг и поддръжка'],
  contactTitle: 'Контакт',
  contactCta: 'Изпратете запитване',
  aboutLine: 'Алекс и Емо, ТУ-Варна',
  wordmark: 'aecodezonebg',
  techLabel: 'С какво работим',
  toTop: 'Към началото',
}

export const notFound = {
  title: 'Тази страница я няма',
  text: 'Може адресът да е сгрешен или страницата да е преместена.',
  home: 'Към началото',
}

export const ui = {
  skipToContent: 'Към съдържанието',
  menu: 'Меню',
  closeMenu: 'Затвори менюто',
  mainNav: 'Основна навигация',
  footerNav: 'Навигация в долната част',
  sectionNav: 'Секции на страницата',
  home: 'aecodezonebg — към началото',
  preloaderSkip: 'Пропусни',
  newTab: '(отваря се в нов раздел)',
}
