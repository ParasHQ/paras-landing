import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconMessageCircle = ({ size, color, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="m8.051 17.828.654.35a6.96 6.96 0 0 0 3.292.822H12a7 7 0 1 0-7-7v.003a6.96 6.96 0 0 0 .822 3.292l.35.654-.538 2.417 2.417-.538zM3 21l1.058-4.762A9 9 0 0 1 12 3a9 9 0 0 1 9 9 9 9 0 0 1-13.238 7.942L3 21z"
			fill={color}
		/>
	</svg>
)

IconMessageCircle.defaultProps = {
	...iconDefaultProps,
}

export default IconMessageCircle
