import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconCopied = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9.70711 14.2929L19 5L20.4142 6.41421L9.70711 17.1213L4 11.4142L5.41421 10L9.70711 14.2929Z"
			fill={color}
		/>
	</svg>
)

IconCopied.defaultProps = {
	...iconDefaultProps,
}

export default IconCopied
