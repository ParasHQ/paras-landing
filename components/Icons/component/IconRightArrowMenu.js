import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconRightArrowMenu = ({ color, ...props }) => (
	<svg
		className="w-10 h-10 text-white cursor-pointer"
		fill={color}
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
			clipRule="evenodd"
		/>
	</svg>
)

IconRightArrowMenu.defaultProps = {
	...iconDefaultProps,
}

export default IconRightArrowMenu
