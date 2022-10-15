import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconCheckGreen = ({ size, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 21 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="10.5" cy="10" r="7.5" stroke="#1E8639" />
		<path d="M7.16683 10L9.66683 12.5L13.8335 7.5" stroke="#1E8639" />
	</svg>
)

IconCheckGreen.defaultProps = {
	...iconDefaultProps,
}

export default IconCheckGreen
