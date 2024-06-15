import { createJsonMutation, unknownContract } from '@farfetched/core'
import { buildUrl } from '../url_builder'

export const logoutMutation = createJsonMutation({
  request: {
    url: buildUrl('/auth/logout'),
    method: 'POST',
    credentials: 'include',
  },
  response: {
    contract: unknownContract,
  },
})
