import { sessionQuery } from './auth/session'
import { registerMutation } from './auth/register'
import { testQuery } from './transactions/test'
import { loginMutation } from './auth/login'
import { logoutMutation } from './auth/logout'

export const Api = {
  auth: {
    registerMutation,
    sessionQuery,
    loginMutation,
    logoutMutation,
  },
  transactions: {
    testQuery,
  },
}
