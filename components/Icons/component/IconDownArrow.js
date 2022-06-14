import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconDownArrow = ({ size, color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-chevron-down"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke={color}
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<polyline points="6 9 12 15 18 9" />
	</svg>
)

IconDownArrow.defaultProps = {
	...iconDefaultProps,
}

export default IconDownArrow
