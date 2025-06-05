export enum RespValueType {
  SimpleString,
  Error,
  Integer,
  BulkString,
  Array,
  Null,
  Boolean,
  Map,
}

export type RespValue =
  | RespSimpleString
  | RespError
  | RespInteger
  | RespBulkString
  | RespArray
  | RespNull
  | RespBoolean
  | RespMap

type RespSimpleString = {
  type: RespValueType.SimpleString
  value: string
}

type RespError = {
  type: RespValueType.Error
  value: string
}

type RespInteger = {
  type: RespValueType.Integer
  value: number
}

type RespBulkString = {
  type: RespValueType.BulkString
  value: string | null
}

type RespArray = {
  type: RespValueType.Array
  value: Array<RespValue>
}

type RespNull = {
  type: RespValueType.Null
  value: null
}

type RespBoolean = {
  type: RespValueType.Boolean
  value: boolean
}

type RespMap = {
  type: RespValueType.Map
  value: Record<string, RespValue>
}
