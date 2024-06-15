import { scopeBind } from 'effector'
import { RouterProvider, ViewRoutes } from './router'
import { ScopeProvider, scope } from './scope'
import { appStarted } from '@/shared/events'
import { Notification } from '@/shared/notification'
import { includeDevSupport } from './dev'

export function App() {
  return (
    <ScopeProvider>
      <RouterProvider>
        <ViewRoutes />
        <Notification.View />
      </RouterProvider>
    </ScopeProvider>
  )
}

export function startApp(cb: () => void) {
  scopeBind(appStarted, { scope })()

  if (import.meta.env.DEV) {
    includeDevSupport(scope)
  }

  cb()
}
