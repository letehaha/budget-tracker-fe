import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ERROR_CODES } from 'shared-types';
import { useAppDispatch } from '@/stores/redux/store'
import { login } from '@/stores/redux/auth'
import './styles.css'

export default function Login() {
  const dispatchRedux = useAppDispatch()
  const routerNavigate = useNavigate()

  const [formData, updateFormData] = useState({
    username: '',
    password: '',
  })

  const [isFormLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const onChangeInput = (e) => {
    const { name, value } = e.target

    updateFormData({ ...formData, [name]: value })
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      const { password, username } = formData;

      setFormLoading(true);

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
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChangeInput}
        />
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={onChangeInput}
        />

        <button
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
