import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconInfoSecond = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="12" cy="12" r="9" stroke={color} />
		<path
			d="M12 8.1C12.3314 8.1 12.6 7.83137 12.6 7.5C12.6 7.16863 12.3314 6.9 12 6.9C11.6686 6.9 11.4 7.16863 11.4 7.5C11.4 7.83137 11.6686 8.1 12 8.1Z"
			fill={color}
			stroke={color}
			strokeWidth="0.2"
		/>
		<path d="M12 17V10" stroke={color} />
	</svg>
)

IconInfoSecond.defaultProps = {
	...iconDefaultProps,
}

export default IconInfoSecond
