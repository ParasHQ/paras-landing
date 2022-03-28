import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconLeft = ({ size, color, ...props }) => (
	<svg
		fill={color}
		viewBox="0 0 20 20"
		width={size}
		height={size}
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
			clipRule="evenodd"
		/>
	</svg>
)

IconLeft.defaultProps = {
	...iconDefaultProps,
}

export default IconLeft
