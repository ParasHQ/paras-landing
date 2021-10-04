import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconArrowSmall = ({ size, color, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M9.75664 8.8C9.61221 8.60743 9.54209 8.36922 9.55916 8.12911C9.57622 7.889 9.67932 7.6631 9.84953 7.49289C10.0197 7.32268 10.2456 7.21958 10.4858 7.20251C10.7259 7.18545 10.9641 7.25557 11.1566 7.4L15.1566 11.4C15.3399 11.5869 15.4425 11.8382 15.4425 12.1C15.4425 12.3618 15.3399 12.6131 15.1566 12.8L11.1566 16.8C10.9641 16.9444 10.7259 17.0145 10.4858 16.9975C10.2456 16.9804 10.0197 16.8773 9.84953 16.7071C9.67932 16.5369 9.57622 16.311 9.55916 16.0709C9.54209 15.8308 9.61221 15.5926 9.75664 15.4L13.0466 12.1L9.74664 8.8H9.75664Z"
			fill={color}
		/>
	</svg>
)

IconArrowSmall.defaultProps = {
	...iconDefaultProps,
}

export default IconArrowSmall
