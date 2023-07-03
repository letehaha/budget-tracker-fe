import './index.scss'

interface Props extends React.ComponentPropsWithoutRef<'label'> {
  label?: string,
  labelRight?: React.ReactNode,
  children?: React.ReactNode,
}

export function Component({ label, labelRight, children, ...props }: Props) {
  return (
    <label className="field-label" {...props}>
      {label && (
        <div className="field-label__label">
          <span>{label}</span>

          {labelRight}
        </div>
      )}
      <div className="field-label__field-wrapper">
        {children}
      </div>
    </label>
  )
}

export default Component
