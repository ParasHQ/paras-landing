import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconVerified = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 18 17"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M17.8095 8.5L15.8343 6.24143L16.1095 3.25429L13.1871 2.59048L11.6571 0L8.90476 1.1819L6.15238 0L4.62238 2.58238L1.7 3.2381L1.97524 6.23333L0 8.5L1.97524 10.7586L1.7 13.7538L4.62238 14.4176L6.15238 17L8.90476 15.81L11.6571 16.9919L13.1871 14.4095L16.1095 13.7457L15.8343 10.7586L17.8095 8.5Z"
			fill="white"
		/>
		<path
			d="M7.3956 12.1429L5.66675 6.494H7.62684L8.74022 10.9039H9.06951L10.1855 5.66675H12.1429L10.4141 12.1429H7.3956Z"
			fill={color}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10.1191 5.26196H14.4169L13.6074 6.88101H10.1191V5.26196Z"
			fill={color}
		/>
	</svg>
)

IconVerified.defaultProps = {
	...iconDefaultProps,
}

export default IconVerified
