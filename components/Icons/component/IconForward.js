import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconForward = ({ size, color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-chevron-right"
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
		<polyline points="9 6 15 12 9 18" />
	</svg>
)

IconForward.defaultProps = {
	...iconDefaultProps,
}

export default IconForward
