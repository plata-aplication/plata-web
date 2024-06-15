import { fork } from 'effector'
import { getConfigMapping } from './config'
import { PropsWithChildren } from 'react'
import { Provider } from 'effector-react'

export const scope = fork({
  values: [...getConfigMapping()],
})

export function ScopeProvider({ children }: PropsWithChildren) {
  return <Provider value={scope}>{children}</Provider>
}
