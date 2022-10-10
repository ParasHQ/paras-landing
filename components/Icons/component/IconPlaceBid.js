import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconPlaceBid = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M4 9.99967V3.83301C4 3.59731 4 3.47945 4.07322 3.40623C4.14645 3.33301 4.2643 3.33301 4.5 3.33301H10.7929C11.3066 3.33301 11.5635 3.33301 11.6274 3.48734C11.6913 3.64167 11.5097 3.8233 11.1464 4.18656L8.94951 6.3835C8.81618 6.51683 8.74951 6.5835 8.74951 6.66634C8.74951 6.74918 8.81618 6.81585 8.94951 6.94918L11.1464 9.14612C11.5097 9.50938 11.6913 9.69102 11.6274 9.84535C11.5635 9.99967 11.3066 9.99967 10.7929 9.99967H4ZM4 9.99967V12.6663"
			stroke={color}
			strokeLinecap="round"
		/>
	</svg>
)

IconPlaceBid.defaultProps = {
	...iconDefaultProps,
}

export default IconPlaceBid
