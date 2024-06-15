import { Config } from '@/shared/config'
import { StorePair } from 'effector'

export function readEnv(name: string) {
  return import.meta.env[name]
}

export function getConfigMapping(): StorePair<any>[] {
  return [[Config.api.$baseUrl, readEnv('VITE_BASE_API_URL')]]
}
