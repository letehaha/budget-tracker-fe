import { KEYBOARD_CODES } from 'shared-types'
import { useMemo } from 'react'
import FieldLabel from '@/components/fields/components/field-label'
import FieldError from '@/components/fields/components/field-error'
import './index.scss'

interface Props extends React.ComponentPropsWithoutRef<'input'> {
  errorMessage?: string,
  label?: string,
  labelRight?: string,
  subLabel?: React.ReactNode,
  onlyPositive?: boolean,
}

export function Component({ errorMessage, label, subLabel, labelRight, disabled, onlyPositive, className, ...props }: Props) {
  const inputProps = {
    ...props,
    onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!props.onKeyUp) return

      if (props.type === 'number') {
        if (event.keyCode === KEYBOARD_CODES.keyE) {
          event.preventDefault()
          return
        }
      }
      if (onlyPositive) {
        if (
          [
            KEYBOARD_CODES.minus,
            KEYBOARD_CODES.equal,
            KEYBOARD_CODES.plus,
          ].includes(event.keyCode)
        ) {
          event.preventDefault()
          return
        }
      }

      props.onKeyUp(event)
    },
  }

  const minValue = useMemo(() => {
    if (onlyPositive && !props.min) {
      return 0
    }
    if (Number(props.min) < 0) {
      return 0
    }

    return props.min ? Number(props.min) : null
  }, [props.min, onlyPositive])

  return (
    <div
      className={`
        input-field
        ${errorMessage ? 'input-field--error' : ''}
        ${disabled ? 'input-field--disabled' : ''}
        ${className}
      `}
    >
      <FieldLabel label={label} labelRight={labelRight}>
        <input
          v-bind="computedAttrs"
          {...inputProps}
          min={minValue}
          className="input-field__input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </FieldLabel>

      {subLabel}

      {errorMessage && (
        <FieldError errorMessage={errorMessage} />
      )}
    </div>
  )
}

export default Component
