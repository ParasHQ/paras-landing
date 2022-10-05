import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconPriceTag = ({ size, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M2.80679 15.5353C2.14013 14.8686 1.80679 14.5353 1.80679 14.1211C1.80679 13.7069 2.14013 13.3735 2.80679 12.7069L10.5352 4.97846C10.9057 4.60796 11.091 4.42271 11.331 4.35005C11.571 4.27738 11.8279 4.32876 12.3417 4.43152L17.0557 5.37432C17.6894 5.50107 18.0063 5.56445 18.2204 5.77854C18.4345 5.99264 18.4979 6.30951 18.6246 6.94325L19.5674 11.6573C19.6702 12.1711 19.7216 12.428 19.6489 12.668C19.5762 12.908 19.391 13.0932 19.0205 13.4637L11.2921 21.1922C10.6254 21.8588 10.2921 22.1922 9.87786 22.1922C9.46365 22.1922 9.13031 21.8588 8.46365 21.1922L2.80679 15.5353Z"
			stroke={stroke}
		/>
		<circle
			cx="14.1212"
			cy="9.87891"
			r="1"
			transform="rotate(-45 14.1212 9.87891)"
			fill={stroke}
			stroke={stroke}
		/>
	</svg>
)

IconPriceTag.defaultProps = {
	...iconDefaultProps,
}

export default IconPriceTag
