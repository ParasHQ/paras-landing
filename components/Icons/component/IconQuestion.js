import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconQuestion = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 10V9.5C7 8.28237 7.42356 7.68233 8.4 6.95C8.92356 6.55733 9 6.44904 9 6C9 5.44772 8.55229 5 8 5C7.44772 5 7 5.44772 7 6H5C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6C11 7.21763 10.5764 7.81767 9.6 8.55C9.07644 8.94267 9 9.05096 9 9.5V10H7ZM9.00066 11.9983C9.00066 12.5506 8.55279 12.9983 8.00033 12.9983C7.44786 12.9983 7 12.5506 7 11.9983C7 11.4461 7.44786 10.9983 8.00033 10.9983C8.55279 10.9983 9.00066 11.4461 9.00066 11.9983Z"
			fill={color}
		/>
	</svg>
)

IconQuestion.defaultProps = {
	...iconDefaultProps,
}

export default IconQuestion
