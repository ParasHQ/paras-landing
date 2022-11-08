import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconCard4Card = ({ size, color, className, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		{...props}
	>
		<path
			d="M2.77429 5.88938C2.67392 5.5148 2.89621 5.12977 3.2708 5.02939L11.687 2.77429C12.0616 2.67392 12.4466 2.89621 12.547 3.2708L16.3055 17.2978C16.4059 17.6724 16.1836 18.0574 15.809 18.1578L7.39279 20.4129C7.0182 20.5132 6.63317 20.2909 6.5328 19.9163L2.77429 5.88938Z"
			stroke={color}
			strokeWidth="1.5"
		/>
		<path
			d="M19.3325 20.2523L19.3324 20.2523L19.3314 20.2616C19.282 20.7277 18.8774 21.0421 18.4509 20.9952L9.19959 19.9792C9.14602 19.9733 9.09465 19.9622 9.04571 19.9465C9.04268 19.943 9.0396 19.9394 9.03648 19.9357C9.03623 19.9354 9.03598 19.9351 9.03573 19.9348L14.9007 18.1753C15.6716 17.9441 16.1226 17.1456 15.9227 16.366L12.6108 3.44988L20.4484 4.02899C20.8707 4.08152 21.1963 4.47556 21.1493 4.93798L19.3325 20.2523Z"
			fill="#212936"
			stroke={color}
			strokeWidth="1.5"
		/>
		<path
			d="M9.58655 8.0648L10.3315 12.7845L9.51377 12.9631L8.22366 8.36238L9.58655 8.0648ZM10.3567 14.8195C10.1545 14.8636 9.96763 14.8307 9.79623 14.7208C9.62483 14.6108 9.51705 14.4547 9.47289 14.2525C9.42937 14.0532 9.4626 13.8678 9.57256 13.6964C9.68253 13.525 9.83863 13.4172 10.0409 13.3731C10.2402 13.3296 10.4255 13.3628 10.5969 13.4727C10.7683 13.5827 10.8758 13.7373 10.9193 13.9366C10.9635 14.1389 10.9306 14.3257 10.8206 14.4971C10.7106 14.6685 10.556 14.776 10.3567 14.8195Z"
			fill={color}
		/>
	</svg>
)

IconCard4Card.defaultProps = {
	...iconDefaultProps,
}

export default IconCard4Card
