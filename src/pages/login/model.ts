import { Api } from '@/shared/api'
import { User } from '@/shared/api/auth/session'
import { loginRoute, mainPageRoute } from '@/shared/router'
import { Notification } from '@/shared/notification'
import { combine, createEvent, createStore, restore, sample } from 'effector'
import { combineEvents } from 'patronum'
import {
  UnauthorizedErrorResponseSchema,
  isUnauthorizedError,
} from '@/shared/api/auth/login'
import { HttpError } from '@farfetched/core'
import { redirectIfAuthorized } from '@/shared/lib/redirectIfAuthorized'

const emailChanged = createEvent<string>()
const passwordChanged = createEvent<string>()
const continueButtonClicked = createEvent()

const unauthorizedErrorHappend = createEvent()
const defaultErrorHappend = createEvent()

const $email = restore(emailChanged, '')
const $password = restore(passwordChanged, '')
const $unauthorizedError = createStore(false)

redirectIfAuthorized({
  from: loginRoute,
  to: mainPageRoute,
})

/**
 * Happy path
 */

sample({
  clock: continueButtonClicked,
  source: combine({
    email: $email,
    password: $password,
  }),
  target: Api.auth.loginMutation.start,
})

sample({
  clock: Api.auth.loginMutation.finished.success,
  target: [mainPageRoute.open, Api.auth.sessionQuery.refresh],
})

sample({
  clock: combineEvents({
    events: {
      refreshSession: Api.auth.sessionQuery.finished.success,
      login: Api.auth.loginMutation.finished.success,
    },
  }),
  fn: ({ refreshSession }) => ({
    type: 'success' as const,
    message: `Welcome ${(refreshSession.result.user as User).name}`,
  }),
  target: Notification.show,
})

/**
 * Unauthorized error path
 */

sample({
  clock: Api.auth.loginMutation.finished.failure,
  filter: (failure) => isUnauthorizedError(failure.error),
  fn: ({ error }) =>
    UnauthorizedErrorResponseSchema.parse((error as HttpError).response),
  target: unauthorizedErrorHappend,
})

sample({
  clock: unauthorizedErrorHappend,
  fn: () => true,
  target: $unauthorizedError,
})

sample({
  clock: [emailChanged, passwordChanged],
  fn: () => false,
  target: $unauthorizedError,
})

/**
 * Default error path
 */

sample({
  clock: Api.auth.loginMutation.finished.failure,
  filter: (failure) => !isUnauthorizedError(failure.error),
  target: defaultErrorHappend,
})

sample({
  clock: defaultErrorHappend,
  fn: () => ({
    type: 'error' as const,
    message: 'Something went wrong. Please try again',
  }),
  target: Notification.show,
})

/**
 * Clear after page leave
 */

sample({
  clock: loginRoute.closed,
  target: [$password.reinit, $email.reinit, $unauthorizedError.reinit],
})

export const model = {
  emailChanged,
  passwordChanged,
  continueButtonClicked,
  $email,
  $password,
  $unauthorizedError,
}
