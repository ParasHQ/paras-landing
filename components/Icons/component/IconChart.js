import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconChart = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		className="mx-auto"
		fill="none"
		stroke={color}
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
			{...props}
		/>
	</svg>
)

IconChart.defaultProps = {
	...iconDefaultProps,
}

export default IconChart
