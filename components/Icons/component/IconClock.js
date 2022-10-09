import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconClock = ({ size, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="12" cy="13" r="7" stroke={stroke} />
		<path d="M5 5L3 7" stroke={stroke} strokeLinecap="round" />
		<path d="M19 5L21 7" stroke={stroke} strokeLinecap="round" />
		<path
			d="M9 11L11.8093 12.8729C11.9172 12.9448 12.0622 12.9223 12.1432 12.821L14 10.5"
			stroke={stroke}
			strokeLinecap="round"
		/>
	</svg>
)

IconClock.defaultProps = {
	...iconDefaultProps,
}

export default IconClock
