import { Api } from '@/shared/api'
import { loginRoute, mainPageRoute } from '@/shared/router'
import { createEvent, sample } from 'effector'

sample({
  clock: mainPageRoute.opened,
  target: Api.transactions.testQuery.start,
})

const logoutButtonClicked = createEvent()

sample({
  clock: logoutButtonClicked,
  target: Api.auth.logoutMutation.start,
})

sample({
  clock: Api.auth.logoutMutation.finished.success,
  target: [Api.auth.sessionQuery.refresh, loginRoute.open],
})

export const model = {
  logoutButtonClicked,
}
