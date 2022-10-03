import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconShareSecond = ({ size, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="7.5" cy="11.5" r="2" stroke={stroke} />
		<circle cx="17.5" cy="4.5" r="2" stroke={stroke} />
		<circle cx="17.5" cy="18.5" r="2" stroke={stroke} />
		<line x1="15.3201" y1="5.38411" x2="9.32009" y2="10.3841" stroke={stroke} />
		<line x1="15.7094" y1="17.4069" x2="8.70938" y2="12.4069" stroke={stroke} />
	</svg>
)

IconShareSecond.defaultProps = {
	...iconDefaultProps,
}

export default IconShareSecond
