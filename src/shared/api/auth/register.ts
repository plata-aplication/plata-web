import {
  createJsonMutation,
  unknownContract,
  declareParams,
  RemoteOperationError,
} from '@farfetched/core'
import { buildUrl } from '../url_builder'
import { z } from 'zod'

export const ValidationErrorSchema = z.discriminatedUnion('validation', [
  z.object({
    validation: z.literal('required'),
  }),
  z.object({
    validation: z.literal('repeat_password'),
  }),
  z.object({
    validation: z.literal('length'),
    kind: z.union([z.literal('min'), z.literal('max')]),
    count: z.number(),
  }),
  z.object({
    validation: z.literal('format'),
  }),
  z.object({
    validation: z.literal('unique'),
  }),
])

export type ValidationError = z.infer<typeof ValidationErrorSchema>

export const ValidationErrorResponseSchema = z.object({
  errors: z.object({
    name: ValidationErrorSchema.optional(),
    password: ValidationErrorSchema.optional(),
    email: ValidationErrorSchema.optional(),
  }),
})

export type ValidationErrorReponse = z.infer<
  typeof ValidationErrorResponseSchema
>

export function isValidationError(
  failure: RemoteOperationError<typeof registerMutation>,
) {
  return (
    failure.errorType === 'HTTP' &&
    ValidationErrorResponseSchema.safeParse(failure.response).success
  )
}

export const registerMutation = createJsonMutation({
  params: declareParams<{
    name: string
    password: string
    email: string
    repeatPassword: string
  }>(),
  request: {
    url: buildUrl('/auth/register'),
    credentials: 'include',
    method: 'POST',
    body({ name, password, email, repeatPassword }) {
      return {
        name,
        password,
        email,
        repeat_password: repeatPassword,
      }
    },
  },
  response: {
    contract: unknownContract,
  },
})
