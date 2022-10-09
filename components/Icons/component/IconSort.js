import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconSort = ({ size, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M4.16675 5.83398H15.8334" stroke={stroke} strokeLinecap="round" />
		<path d="M4.16675 10H12.5001" stroke={stroke} strokeLinecap="round" />
		<path d="M4.16675 14.166H9.16675" stroke={stroke} strokeLinecap="round" />
	</svg>
)

IconSort.defaultProps = {
	...iconDefaultProps,
}

export default IconSort
