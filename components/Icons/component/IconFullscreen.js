import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconFullscreen = ({ size, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M9 4H7C5.58579 4 4.87868 4 4.43934 4.43934C4 4.87868 4 5.58579 4 7V9"
			stroke={stroke}
			strokeLinecap="round"
		/>
		<path
			d="M9 20H7C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V15"
			stroke={stroke}
			strokeLinecap="round"
		/>
		<path
			d="M15 4H17C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V9"
			stroke={stroke}
			strokeLinecap="round"
		/>
		<path
			d="M15 20H17C18.4142 20 19.1213 20 19.5607 19.5607C20 19.1213 20 18.4142 20 17V15"
			stroke={stroke}
			strokeLinecap="round"
		/>
	</svg>
)

IconFullscreen.defaultProps = {
	...iconDefaultProps,
}

export default IconFullscreen
