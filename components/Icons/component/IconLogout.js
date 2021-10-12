import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconLogout = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M4.667 4h10.666v6.533h1.334V4a1.333 1.333 0 0 0-1.334-1.333H4.668A1.333 1.333 0 0 0 3.334 4v16a1.333 1.333 0 0 0 1.333 1.333h10.666A1.333 1.333 0 0 0 16.668 20h-12V4z"
			fill={color}
		/>
		<path
			d="M18.773 11.52a.667.667 0 0 0-.94.94l2.254 2.207H10.42a.667.667 0 0 0 0 1.333h9.667l-2.254 2.307a.668.668 0 0 0 .46 1.172.666.666 0 0 0 .48-.232l3.894-3.867-3.894-3.86z"
			fill={color}
		/>
	</svg>
)

IconLogout.defaultProps = {
	...iconDefaultProps,
}

export default IconLogout
