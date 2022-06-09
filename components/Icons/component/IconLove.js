import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconLove = ({ size, color, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 22 22"
		fill={color}
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M6 1C3.239 1 1 3.216 1 5.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 001.024 0C20.125 13.395 21 8.157 21 5.95 21 3.216 18.761 1 16 1s-5 3-5 3-2.239-3-5-3z"
			className="shadow-lg drop-shadow-lg"
			stroke={stroke}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

IconLove.defaultProps = {
	...iconDefaultProps,
}

export default IconLove
