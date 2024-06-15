import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

import { model as m } from './model'
import { useUnit } from 'effector-react'
import { ValidationError } from '@/shared/api/auth/register'
import Icon from './assets/icon.svg'
import { Link } from '@/shared/ui/link'
import { loginRoute } from '@/shared/router'

export function getErrorMessage(error: ValidationError | null) {
  if (error === null) {
    return ''
  }
  switch (error.validation) {
    case 'length':
      return `${error.kind === 'min' ? 'Minimum' : 'Maximum'} of ${error.count} charecters`
    case 'required':
      return "Can't be blank"
    case 'format':
      return 'Provide correct email'
    case 'unique':
      return 'Already used'
    case 'repeat_password':
      return 'Password and repeat password are not the same'
    default:
      return 'Something went wrong'
  }
}

export function RegisterPage() {
  const model = useUnit(m)
  return (
    <div className="py-20 px-8">
      <h1 className="text-5xl font-bold">
        Sign up <Icon className="inline-block" />
        <br />
        to manage <br />
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
            onChange={(e) => model.nameChanged(e.target.value)}
            value={model.$name}
            type="text"
            label="Name"
            placeholder="Enter your name"
            error={getErrorMessage(model.$nameValidationError)}
          />
          <Input
            onChange={(e) => model.emailChanged(e.target.value)}
            value={model.$email}
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={getErrorMessage(model.$emailValidationError)}
          />
          <Input
            onChange={(e) => model.passwordChanged(e.target.value)}
            value={model.$password}
            type="password"
            label="Password"
            placeholder="Enter your password"
            error={getErrorMessage(model.$passwordValidationError)}
          />
          <Input
            onChange={(e) => model.repeatPasswordChanged(e.target.value)}
            value={model.$repeatPassword}
            type="password"
            label="Repeat password"
            placeholder="Repeat password"
          />
        </div>
        <Button
          loading={model.$loading}
          type="submit"
          size="lg"
          className="w-full"
        >
          Continue
        </Button>
      </form>
      <div className="pt-10">
        <p className="text-gray-500">
          Already a user? <Link to={loginRoute}>Login</Link>
        </p>
      </div>
    </div>
  )
}
