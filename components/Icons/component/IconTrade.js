import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconTrade = ({ size, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect x="0.5" y="0.5" width="31" height="31" rx="3.5" fill="#15171A" fillOpacity="0.6" />
		<path d="M17.5 7L23.5 13H8" stroke="#F9F9F9" strokeLinecap="round" />
		<path d="M14 25L8 19C16.0057 19 15.9943 19 24 19" stroke="#F9F9F9" strokeLinecap="round" />
		<rect x="0.5" y="0.5" width="31" height="31" rx="3.5" stroke="#3A4251" />
	</svg>
)

IconTrade.defaultProps = {
	...iconDefaultProps,
}

export default IconTrade
