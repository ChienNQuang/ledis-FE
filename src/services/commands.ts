import type { RespValue } from '@/types/resp'
import axiosClient from './axiosClient'

export function SendCommand(command: string, args: string[] = []) {
  return axiosClient.post<RespValue>('/commands', {
    command,
    arguments: args,
  })
}

export function SaveSnapshot() {
  return axiosClient.get('/commands/save', {
    responseType: 'blob',
  })
}

export function RestoreSnapshot(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return axiosClient.post('/commands/restore', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
