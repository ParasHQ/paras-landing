import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconTriangle = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 21 19"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z" fill={color} />
	</svg>
)

IconTriangle.defaultProps = {
	...iconDefaultProps,
}

export default IconTriangle
