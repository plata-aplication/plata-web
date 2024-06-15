import {
  RemoteOperationError,
  createJsonMutation,
  declareParams,
  unknownContract,
} from '@farfetched/core'
import { buildUrl } from '../url_builder'
import { z } from 'zod'

export const UnauthorizedErrorResponseSchema = z.object({
  errors: z.object({
    unauthorized: z.string(),
  }),
})

export function isUnauthorizedError(
  failure: RemoteOperationError<typeof loginMutation>,
) {
  return (
    failure.errorType === 'HTTP' &&
    failure.status === 403 &&
    UnauthorizedErrorResponseSchema.safeParse(failure.response).success
  )
}

export const loginMutation = createJsonMutation({
  params: declareParams<{ email: string; password: string }>(),
  request: {
    url: buildUrl('/auth/login'),
    method: 'POST',
    body: ({ email, password }) => ({ email, password }),
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
})
