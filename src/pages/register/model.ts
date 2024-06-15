import { Api } from '@/shared/api'
import {
  ValidationError,
  ValidationErrorReponse,
  ValidationErrorResponseSchema,
  isValidationError,
} from '@/shared/api/auth/register'
import { mainPageRoute, registerRoute } from '@/shared/router'
import { HttpError } from '@farfetched/core'
import { combine, createEvent, createStore, restore, sample } from 'effector'
import { combineEvents, spread } from 'patronum'
import { Notification } from '@/shared/notification'
import { User } from '@/shared/api/auth/session'
import { redirectIfAuthorized } from '@/shared/lib/redirectIfAuthorized'

const emailChanged = createEvent<string>()
const nameChanged = createEvent<string>()
const passwordChanged = createEvent<string>()
const repeatPasswordChanged = createEvent<string>()
const continueButtonClicked = createEvent()
const validationErrorHappend = createEvent<ValidationErrorReponse>()
const defaultErrorHappend = createEvent()

const $email = restore(emailChanged, '')
const $name = restore(nameChanged, '')
const $password = restore(passwordChanged, '')
const $repeatPassword = restore(repeatPasswordChanged, '')
const $emailValidationError = createStore<ValidationError | null>(null)
const $nameValidationError = createStore<ValidationError | null>(null)
const $passwordValidationError = createStore<ValidationError | null>(null)

redirectIfAuthorized({
  from: registerRoute,
  to: mainPageRoute,
})

/**
 * Happy path of registration
 */

sample({
  clock: continueButtonClicked,
  source: combine({
    email: $email,
    name: $name,
    password: $password,
    repeatPassword: $repeatPassword,
  }),
  target: Api.auth.registerMutation.start,
})

sample({
  clock: Api.auth.registerMutation.finished.success,
  target: [mainPageRoute.open, Api.auth.sessionQuery.refresh],
})

sample({
  clock: combineEvents({
    events: {
      refreshSession: Api.auth.sessionQuery.finished.success,
      registered: Api.auth.registerMutation.finished.success,
    },
  }),
  fn: ({ refreshSession }) => ({
    type: 'success' as const,
    message: `Welcome ${(refreshSession.result.user as User).name}`,
  }),
  target: Notification.show,
})

/**
 * Validation error path
 */

sample({
  clock: Api.auth.registerMutation.finished.failure,
  filter: (failure) => isValidationError(failure.error),
  fn: ({ error }) =>
    ValidationErrorResponseSchema.parse((error as HttpError).response),
  target: validationErrorHappend,
})

sample({
  clock: validationErrorHappend,
  fn(error) {
    return {
      name: error.errors.name ?? null,
      email: error.errors.email ?? null,
      password: error.errors.password ?? null,
    }
  },
  target: spread({
    targets: {
      name: $nameValidationError,
      email: $emailValidationError,
      password: $passwordValidationError,
    },
  }),
})

sample({
  clock: emailChanged,
  fn: () => null,
  target: $emailValidationError,
})

sample({
  clock: nameChanged,
  fn: () => null,
  target: $nameValidationError,
})

sample({
  clock: passwordChanged,
  fn: () => null,
  target: $passwordValidationError,
})

/**
 * Default error path
 */

sample({
  clock: Api.auth.registerMutation.finished.failure,
  filter: (failure) => !isValidationError(failure.error),
  target: defaultErrorHappend,
})

sample({
  clock: defaultErrorHappend,
  fn: () => ({
    type: 'error' as const,
    message: 'Some error happend. Please try again',
  }),
  target: Notification.show,
})

/**
 * Clear after leave page
 */

sample({
  clock: registerRoute.closed,
  target: [
    $email.reinit,
    $emailValidationError.reinit,
    $name.reinit,
    $nameValidationError.reinit,
    $password.reinit,
    $passwordValidationError.reinit,
    $repeatPassword.reinit,
  ],
})

export const model = {
  $loading: Api.auth.registerMutation.$pending,
  emailChanged,
  nameChanged,
  passwordChanged,
  repeatPasswordChanged,
  continueButtonClicked,
  $email,
  $name,
  $password,
  $repeatPassword,
  $passwordValidationError,
  $emailValidationError,
  $nameValidationError,
}
