import { RouteInstance } from 'atomic-router'
import { Api } from '@/shared/api'
import { combine, sample } from 'effector'

export function redirectIfAuthorized({
  to,
  from,
}: {
  to: RouteInstance<{}>
  from: RouteInstance<{}>
}) {
  sample({
    clock: from.opened,
    filter: combine(
      {
        authorized: Api.auth.sessionQuery.$data.map(
          (session) => session?.user.tag === 'user',
        ),
        authorizationPending: Api.auth.sessionQuery.$pending,
      },
      ({ authorizationPending, authorized }) =>
        authorized && !authorizationPending,
    ),
    target: to.open,
  })

  sample({
    clock: Api.auth.sessionQuery.finished.success,
    filter: combine(
      {
        fromOpened: from.$isOpened,
        authorized: Api.auth.sessionQuery.$data.map(
          (session) => session?.user.tag === 'user',
        ),
      },
      ({ fromOpened, authorized }) => fromOpened && authorized,
    ),
    target: to.open,
  })
}
