import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconArrow = ({ size, color, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.41412 7.00001H13.9999V9.00001H5.41412L8.70701 12.2929L7.2928 13.7071L1.58569 8.00001L7.2928 2.29291L8.70701 3.70712L5.41412 7.00001Z"
			fill={color}
		/>
	</svg>
)

IconArrow.defaultProps = {
	...iconDefaultProps,
}

export default IconArrow
