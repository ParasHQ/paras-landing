import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconNear = ({ ...props }) => (
	<svg
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="25" cy="25" r="25" fill="white" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M16.1053 17.7695V31.4934L22.9474 26.25L23.6316 26.8654L17.894 35.1541C15.7622 37.16 12 35.8028 12 33.0278V16.0832C12 13.2131 15.9825 11.9058 18.0379 14.1012L33.8947 31.038V17.8772L27.7368 22.5575L27.0526 21.9421L31.9327 14.2049C33.9696 11.9688 38 13.2643 38 16.1551V32.7243C38 35.5944 34.0175 36.9017 31.9621 34.7063L16.1053 17.7695Z"
			fill="black"
		/>
	</svg>
)

IconNear.defaultProps = {
	...iconDefaultProps,
}

export default IconNear
