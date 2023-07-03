import './index.scss'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  error?: string | string[],
  children?: React.ReactNode,
}

export function Component({ error, children, ...props }: Props) {
  const ErrorRenderer = () => {
    if (Array.isArray(error)) {
      return error.map(item => (
        <p className="form-wrapper__error" key={item}>
          {item}
        </p>
      ))
    }

    return (
      <p className="form-wrapper__error">
        {error}
      </p>
    )
  }

  return (
    <div className="form-wrapper" {...props}>
      <div className="form-wrapper__error-list">
        <ErrorRenderer />
      </div>

      {children}
    </div>
  )
}

export default Component
