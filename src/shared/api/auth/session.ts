import { createJsonQuery } from '@farfetched/core'
import { zodContract } from '@farfetched/zod'
import * as z from 'zod'
import { buildUrl } from '../url_builder'

const UserSchema = z.object({
  tag: z.literal('user'),
  id: z.number(),
  name: z.string(),
  email: z.string(),
})

const AnonymousSchema = z.object({
  tag: z.literal('anonymous'),
})

const SessionSchema = z.object({
  user: z.union([UserSchema, AnonymousSchema]),
})

export type User = z.infer<typeof UserSchema>
export type Anonymous = z.infer<typeof AnonymousSchema>
export type Session = z.infer<typeof SessionSchema>

export const sessionQuery = createJsonQuery({
  request: {
    url: buildUrl('/auth/me'),
    method: 'GET',
    credentials: 'include',
  },
  response: {
    contract: zodContract(SessionSchema),
  },
})
