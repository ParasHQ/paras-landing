import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconV = ({ size, color, ...props }) => (
	<svg
		viewBox="0 0 11 7"
		fill={color}
		width={size}
		height={size}
		xlmns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.00146 6.41431L9.70857 1.7072C10.0991 1.31668 10.0991 0.683511 9.70857 0.292986C9.31805 -0.097538 8.68488 -0.097538 8.29436 0.292986L5.00146 3.58588L1.70857 0.292986C1.31805 -0.097538 0.684882 -0.097538 0.294358 0.292986C-0.0961662 0.68351 -0.0961662 1.31668 0.294358 1.7072L5.00146 6.41431Z"
			fill="white"
		/>
	</svg>
)

IconV.defaultProps = {
	...iconDefaultProps,
}

export default IconV
