import { RespValueType, type RespValue } from '@/types/resp'

export function convertToRespStringLines(value: RespValue): string[] {
  switch (value.type) {
    case RespValueType.SimpleString: // SimpleString
      return [value.value]
    case RespValueType.Error: // Error
      return [`(error) ${value.value}`]
    case RespValueType.Integer: // Integer
      return [`(integer) ${value.value}`]
    case RespValueType.BulkString: // BulkString
      if (value.value === null) {
        return ['(nil)']
      }

      return [`"${value.value}"`]
    case RespValueType.Array: // Array
      const lines = []
      for (let i = 1; i <= value.value.length; i++) {
        const index = `${i})`
        const itemLines = convertToRespStringLines(value.value[i - 1])
        for (let j = 0; j < itemLines.length; j++) {
          const line = itemLines[j]
          if (j === 0) {
            lines.push(`${index} ${line}`)
          } else {
            // Subsequent lines are indented with the same amount of spaces as the index
            lines.push(' '.repeat(index.length) + line)
          }
        }
      }
      return lines
    case RespValueType.Null: // Null
      return ['(nil)']
    case RespValueType.Boolean: // Boolean
      return value.value ? ['(integer) 1'] : ['(integer) 0']
    default:
      throw new Error('Unknown RESP type')
  }
}
