import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconPlay = ({ size, color, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-player-play"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke={color}
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M7 4v16l13 -8z" />
	</svg>
)

IconPlay.defaultProps = {
	...iconDefaultProps,
}

export default IconPlay
