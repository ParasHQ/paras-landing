import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconForbidden = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="8" cy="8" r="6" stroke={color} />
		<path d="M12 12L4 4" stroke={color} />
	</svg>
)

IconForbidden.defaultProps = {
	...iconDefaultProps,
}

export default IconForbidden
