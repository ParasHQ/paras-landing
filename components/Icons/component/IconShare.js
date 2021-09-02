import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconShare = ({ size, color, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684 6.632 3.316m-6.632-6 6.632-3.316m0 9.316a3 3 0 1 0 5.368 2.684 3 3 0 0 0-5.368-2.684zm0-9.316a3 3 0 1 0 5.366-2.683 3 3 0 0 0-5.366 2.683z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

IconShare.defaultProps = {
  ...iconDefaultProps,
}

export default IconShare
