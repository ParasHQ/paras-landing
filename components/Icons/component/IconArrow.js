import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconArrow = ({ size, color, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14 5L21 12M21 12L14 19M21 12H3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

IconArrow.defaultProps = {
  ...iconDefaultProps,
}

export default IconArrow
