import './index.scss'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  size?: 'large' | 'default',
  theme?: 'primary' | 'danger',
  outline?: boolean,
  children: React.ReactNode,
}

export function Component({ size = 'default', theme = 'primary', disabled, outline, children, ...props }: Props) {
  return (
    <button
      {...props}
      className={`
        button
        button--${size}
        button--${theme}
        ${disabled ? 'button--disabled' : ''}
        ${outline ? 'button--outline' : ''}
        ${props.className}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Component
