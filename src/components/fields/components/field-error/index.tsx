import './index.scss'

interface Props extends React.ComponentPropsWithoutRef<'p'> {
  errorMessage: string
}

export function Component({ errorMessage, ...props }: Props) {
  return (
    <p className="field-error" {...props}>
      {errorMessage}
    </p>
  )
}

export default Component
