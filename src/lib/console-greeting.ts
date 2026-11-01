// A small hello for developers who open the console.
const ART = String.raw`
    /      __ _   ___      \
   /      / _' | / _ \      \
  <      | (_| ||  __/       >
   \      \__,_| \___|      /
    \                      /
`

export function consoleGreeting() {
  console.log(
    `%c${ART}%c\naecodezonebg — уеб сайтове на React\nЗдравей, колега! Щом четеш това, значи разглеждаш кода ни.\nХаресва ли ти? Пиши ни от секция „Контакт“.`,
    'color:#00C2FF;font-family:JetBrains Mono,monospace;font-size:12px;line-height:1.2',
    'color:#A3B5CA;font-size:12px',
  )
}
