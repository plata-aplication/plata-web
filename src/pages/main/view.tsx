import { useUnit } from 'effector-react'
import { Api } from '@/shared/api'
import { Button } from '@/shared/ui/button'
import { model as m } from './model'

export function MainPage() {
  const data = useUnit(Api.auth.sessionQuery.$data)
  const model = useUnit(m)
  return (
    <div>
      <Button onClick={model.logoutButtonClicked}>Logout</Button>
      Main
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}
