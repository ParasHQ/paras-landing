import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconArrowNarrow = ({ size, color, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M17 8L21 12M21 12L17 16M21 12H3"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

IconArrowNarrow.defaultProps = {
	...iconDefaultProps,
}

export default IconArrowNarrow
