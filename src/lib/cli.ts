export function parseCliArgs(input: string) {
  const args: string[] = []
  let current = ''
  let inQuotes = false
  let quoteChar = null
  let escapeNext = false

  function pushCurrent() {
    if (current !== '') {
      args.push(current)
      current = ''
    }
  }

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]

    if (escapeNext) {
      if (ch === 'x') {
        // hex escape \xHH
        if (i + 2 >= input.length) {
          throw new Error('Invalid argument(s): incomplete hex escape')
        }
        const hex = input.substr(i + 1, 2)
        if (!/^[0-9a-fA-F]{2}$/.test(hex)) {
          throw new Error('Invalid argument(s): invalid hex digits in escape')
        }
        current += String.fromCharCode(parseInt(hex, 16))
        i += 2
      } else {
        // simple escapes
        const map: Record<string, string> = {
          n: '\n',
          r: '\r',
          t: '\t',
          '\\': '\\',
          '"': '"',
          "'": "'",
          ' ': ' ',
        }
        current += map[ch] ?? ch
      }
      escapeNext = false
    } else if (ch === '\\') {
      escapeNext = true
    } else if (inQuotes) {
      if (ch === quoteChar) {
        inQuotes = false
        quoteChar = null
        pushCurrent()
      } else {
        current += ch
      }
    } else {
      if (ch === '"' || ch === "'") {
        inQuotes = true
        quoteChar = ch
      } else if (/\s/.test(ch)) {
        pushCurrent()
      } else {
        current += ch
      }
    }
  }

  if (inQuotes) {
    throw new Error('Invalid argument(s): unmatched quote')
  }

  if (escapeNext) {
    throw new Error('Invalid argument(s): incomplete escape sequence')
  }

  // push last arg if any
  pushCurrent()

  return args
}
