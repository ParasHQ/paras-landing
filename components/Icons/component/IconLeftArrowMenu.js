import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconLeftArrowMenu = ({ color, ...props }) => (
	<svg
		className="w-10 h-10 text-white cursor-pointer"
		fill={color}
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
			clipRule="evenodd"
		/>
	</svg>
)

IconLeftArrowMenu.defaultProps = {
	...iconDefaultProps,
}

export default IconLeftArrowMenu
