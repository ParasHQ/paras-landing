import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconRight = ({ size, color, ...props }) => (
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
			d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
			clipRule="evenodd"
		/>
	</svg>
)

IconRight.defaultProps = {
	...iconDefaultProps,
}

export default IconRight
