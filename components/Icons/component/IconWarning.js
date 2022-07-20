import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconWarning = ({ size, color, ...props }) => (
	<svg
		className="w-20 h-20"
		fill="none"
		width={size}
		height={size}
		stroke={color}
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
		/>
	</svg>
)

IconWarning.defaultProps = {
	...iconDefaultProps,
}

export default IconWarning
