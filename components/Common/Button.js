import React from 'react'
import PropTypes from 'prop-types'

const Button = ({
  isDisabled,
  isFullWidth,
  size,
  variant,
  children,
  className,
  style,
  onClick,
}) => {
  const buttonBaseStyle =
    'inline-block text-center relative whitespace-nowrap rounded-full font-medium text-body'
  const buttonTransition = 'transition duration-150 ease-in-out'

  let buttonVariantStyle
  switch (variant) {
    case 'primary':
      buttonVariantStyle = `bg-primary text-gray-900 ${
        !isDisabled && 'hover:bg-opacity-70'
      }`
      break
    case 'secondary':
      buttonVariantStyle = `bg-blueGray-800 text-gray-200 ${
        !isDisabled && 'hover:bg-opacity-70'
      }`
      break
    case 'ghost':
      buttonVariantStyle = `bg-transparent border border-electricLime-600 text-electricLime-600 ${
        !isDisabled && 'hover:bg-electricLime-600 hover:bg-opacity-10'
      }`
      break
    default:
      break
  }

  let buttonSizeStyle
  switch (size) {
    case 'lg':
      buttonSizeStyle = 'py-3 px-20 text-base'
      break
    case 'md':
      buttonSizeStyle = 'py-3 px-8 text-sm'
      break
    case 'sm':
      buttonSizeStyle = 'py-2 px-4 text-xs'
      break
    default:
      break
  }

  let buttonStyle = `${className} ${buttonBaseStyle} ${buttonTransition} ${buttonVariantStyle} ${buttonSizeStyle}`

  if (isDisabled) {
    const buttonDisabledStyle = 'cursor-default opacity-60 saturate-50'
    buttonStyle = `${buttonStyle} ${buttonDisabledStyle}`
  }

  if (isFullWidth) {
    const buttonFullWidth = 'w-full block'
    buttonStyle = `${buttonStyle} ${buttonFullWidth}`
  }

  return (
    <button
      disabled={isDisabled}
      className={buttonStyle}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

Button.defaultProps = {
  isDisabled: false,
  isFullWidth: false,
  size: 'lg',
  variant: 'primary',
  className: '',
}

Button.propTypes = {
  isDisabled: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  onClick: PropTypes.func,
}

export default Button
