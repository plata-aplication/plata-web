import { Config } from '../config'

export function buildUrl(postfix: string) {
  if (postfix.startsWith('/')) {
    postfix = postfix.slice(1)
  }

  return Config.api.$baseUrl.map((url) => `${url}${postfix}`)
}
