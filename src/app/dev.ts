import { Api } from '@/shared/api'
import { Config } from '@/shared/config'
import { Scope, scopeBind } from 'effector'

export function includeDevSupport(scope: Scope) {
  // @ts-ignore
  window.plata = {
    Api: bindScopeForAll(Api, scope),
    Config: bindScopeForAll(Config, scope),
  }
}

export function bindScopeForAll(
  obj: Record<string, unknown>,
  scope: Scope,
  res = {} as Record<string, unknown>,
) {
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (typeof value === 'function') {
      res[key] = scopeBind(value, { scope })
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !('kind' in value)
    ) {
      res[key] = bindScopeForAll(value as Record<string, unknown>, scope)
    } else {
      res[key] = value
    }
  }

  return res
}
