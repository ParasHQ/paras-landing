import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconRefresh = ({ size, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M10 19L9.64645 18.6464L9.29289 19L9.64645 19.3536L10 19ZM13.6464 14.6464L9.64645 18.6464L10.3536 19.3536L14.3536 15.3536L13.6464 14.6464ZM9.64645 19.3536L13.6464 23.3536L14.3536 22.6464L10.3536 18.6464L9.64645 19.3536Z"
			fill="#F9F9F9"
		/>
		<path
			d="M5.93782 15.5C5.14475 14.1264 4.84171 12.5241 5.07833 10.9557C5.31495 9.38734 6.07722 7.94581 7.24024 6.86729C8.40327 5.78877 9.8981 5.13721 11.4798 5.01935C13.0616 4.90149 14.6365 5.32432 15.9465 6.21856C17.2565 7.1128 18.224 8.42544 18.6905 9.94144C19.1569 11.4574 19.0947 13.0869 18.5139 14.5629C17.9332 16.0389 16.8684 17.2739 15.494 18.0656C14.1196 18.8573 12.517 19.1588 10.9489 18.9206"
			stroke={stroke}
			strokeLinecap="round"
		/>
	</svg>
)

IconRefresh.defaultProps = {
	...iconDefaultProps,
}

export default IconRefresh
