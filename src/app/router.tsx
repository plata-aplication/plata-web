import {
  createRoutesView,
  RouterProvider as RouterProviderI,
} from 'atomic-router-react'
import { sample } from 'effector'
import { createHistoryRouter } from 'atomic-router'
import { createBrowserHistory } from 'history'

import { loginRoute, mainPageRoute, registerRoute } from '@/shared/router'
import { RegisterPage } from '@/pages/register'
import { LoginPage } from '@/pages/login'
import { appStarted } from '@/shared/events'
import { PropsWithChildren } from 'react'
import { MainPage } from '@/pages/main'
import { Api } from '@/shared/api'

export const ViewRoutes = createRoutesView({
  routes: [
    {
      route: mainPageRoute,
      view: MainPage,
    },
    {
      route: registerRoute,
      view: RegisterPage,
    },
    {
      route: loginRoute,
      view: LoginPage,
    },
  ],
})

const router = createHistoryRouter({
  routes: [
    { route: registerRoute, path: '/register' },
    { route: loginRoute, path: '/login' },
    { route: mainPageRoute, path: '/me' },
  ],
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})

sample({
  clock: appStarted,
  target: Api.auth.sessionQuery.start,
})

export function RouterProvider({ children }: PropsWithChildren) {
  return <RouterProviderI router={router}>{children}</RouterProviderI>
}
