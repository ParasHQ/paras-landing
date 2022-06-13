import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconChevronUp = ({ color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={4}
		stroke={color}
		{...props}
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
	</svg>
)

IconChevronUp.defaultProps = {
	...iconDefaultProps,
}

export default IconChevronUp
