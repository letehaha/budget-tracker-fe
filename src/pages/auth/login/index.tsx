import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ERROR_CODES } from 'shared-types'
import { useAppDispatch } from '@/stores/redux/store'
import { login } from '@/stores/redux/auth'
import FormWrapper from '@/components/fields/components/form-wrapper'
import InputField from '@/components/fields/input-field'
import UiButton from '@/components/common/button'
import './styles.scss'

export function Component() {
  const dispatchRedux = useAppDispatch()
  const routerNavigate = useNavigate()

  const [formData, updateFormData] = useState({
    username: '',
    password: '',
  })

  const [isFormLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const onChangeInput = (field: keyof typeof formData, value: string | number) => {
    updateFormData({ ...formData, [field]: value })
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      const { password, username } = formData;

      setFormLoading(true)

      await dispatchRedux(login({ username, password }))

      routerNavigate('/dashboard')
    } catch (e) {
      const errorCodes = {
        [ERROR_CODES.notFound]: 'Incorrect email or password.',
        [ERROR_CODES.invalidCredentials]: 'Password is invalid.',
      };

      setFormError(errorCodes[e.code] || 'Unexpected error.')
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="login">
      <form
        className="login__wrapper"
        onSubmit={submit}
      >
        <h1 className="login__title">
          Log in to account
        </h1>
        <FormWrapper
          error={formError}
          className="login__fields"
        >
          <InputField
            value={formData.username}
            name="username"
            label="Your username"
            placeholder="ie. johnsnow"
            className="login__field"
            disabled={isFormLoading}
            onChange={event => onChangeInput('username', event.target.value)}
          />
          <InputField
            value={formData.password}
            name="password"
            label="Your password"
            className="login__field"
            type="password"
            disabled={isFormLoading}
            onChange={event => onChangeInput('password', event.target.value)}
          />
        </FormWrapper>
        <UiButton
          type="submit"
          className="login__submit"
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Loading...' : 'Log in'}
        </UiButton>
        <div className="login__signup">
          Don’t have an account?

          <Link
            to="sign-up"
            className="login__signup-link"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Component
