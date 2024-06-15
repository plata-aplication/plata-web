import { createJsonQuery, unknownContract } from '@farfetched/core'
import { buildUrl } from '../url_builder'

export const testQuery = createJsonQuery({
  request: {
    method: 'GET',
    credentials: 'include',
    url: buildUrl('/transactions/test'),
  },
  response: {
    contract: unknownContract,
  },
})
