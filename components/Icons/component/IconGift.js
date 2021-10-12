import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconGift = ({ size, color, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M12 8v13m0-13V6a2 2 0 1 1 2 2h-2zm0 0V5.5A2.5 2.5 0 1 0 9.5 8H12zm-7 4h14M5 12a2 2 0 1 1 0-4h14a2 2 0 0 1 0 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

IconGift.defaultProps = {
	...iconDefaultProps,
}

export default IconGift
