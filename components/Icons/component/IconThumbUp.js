import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconThumbUp = ({ size, color, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M2 10.5a1.5 1.5 0 0 1 3 0v6a1.5 1.5 0 0 1-3 0v-6zm4-.167v5.43a2 2 0 0 0 1.106 1.79l.05.025A4 4 0 0 0 8.943 18h5.416a2 2 0 0 0 1.962-1.608l1.2-6A2 2 0 0 0 15.56 8H12V4a2 2 0 0 0-2-2 1 1 0 0 0-1 1v.667a4 4 0 0 1-.8 2.4L6.8 7.933a4 4 0 0 0-.8 2.4z"
			fill={color}
		/>
	</svg>
)

IconThumbUp.defaultProps = {
	...iconDefaultProps,
}

export default IconThumbUp
