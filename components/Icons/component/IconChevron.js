import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconChevron = ({ size, color, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M9 5L16 12L9 19"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

IconChevron.defaultProps = {
	...iconDefaultProps,
}

export default IconChevron
