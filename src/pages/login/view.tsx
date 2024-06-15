import { registerRoute } from '@/shared/router'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

import Icon from './assets/icon.svg'
import { Link } from '@/shared/ui/link'
import { model as m } from './model'
import { useUnit } from 'effector-react'

export function LoginPage() {
  const model = useUnit(m)
  return (
    <div className="pt-[113px] px-8">
      <h1 className="text-5xl font-bold">
        Sign in <Icon className="inline" /> <br /> to manage <br />
        <span className="text-green-200">your finance</span>
      </h1>
      <form
        className="pt-12 flex flex-col gap-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          model.continueButtonClicked()
        }}
      >
        <div className="flex flex-col gap-4">
          <Input
            value={model.$email}
            onChange={(e) => model.emailChanged(e.target.value)}
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={
              model.$unauthorizedError
                ? 'Incorrect password or email. Please try again'
                : undefined
            }
          />
          <Input
            value={model.$password}
            onChange={(e) => model.passwordChanged(e.target.value)}
            type="password"
            label="Password"
            placeholder="Enter your password"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Continue
        </Button>
      </form>
      <div className="pt-12 flex flex-col gap-2">
        <p className="text-gray-500">
          New user? <Link to={registerRoute}>Get started</Link>
        </p>
      </div>
    </div>
  )
}
