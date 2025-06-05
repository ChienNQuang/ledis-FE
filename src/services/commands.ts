import type { RespValue } from '@/types/resp'
import axiosClient from './axiosClient'

export function SendCommand(command: string, args: string[] = []) {
  return axiosClient.post<RespValue>('/commands', {
    command,
    arguments: args,
  })
}
