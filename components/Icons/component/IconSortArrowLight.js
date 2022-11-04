import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconSortArrowLight = ({ size, color, className, ...props }) => (
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
			d="M8 2L7.64645 1.64645L8 1.29289L8.35355 1.64645L8 2ZM8.5 17C8.5 17.2761 8.27614 17.5 8 17.5C7.72386 17.5 7.5 17.2761 7.5 17L8.5 17ZM3.64645 5.64645L7.64645 1.64645L8.35355 2.35355L4.35355 6.35355L3.64645 5.64645ZM8.35355 1.64645L12.3536 5.64645L11.6464 6.35355L7.64645 2.35355L8.35355 1.64645ZM8.5 2L8.5 17L7.5 17L7.5 2L8.5 2Z"
			fill={color}
		/>
		<path
			d="M16 22L15.6464 22.3536L16 22.7071L16.3536 22.3536L16 22ZM16.5 7C16.5 6.72386 16.2761 6.5 16 6.5C15.7239 6.5 15.5 6.72386 15.5 7L16.5 7ZM11.6464 18.3536L15.6464 22.3536L16.3536 21.6464L12.3536 17.6464L11.6464 18.3536ZM16.3536 22.3536L20.3536 18.3536L19.6464 17.6464L15.6464 21.6464L16.3536 22.3536ZM16.5 22L16.5 7L15.5 7L15.5 22L16.5 22Z"
			fill={color}
		/>
	</svg>
)

IconSortArrowLight.defaultProps = {
	...iconDefaultProps,
}

export default IconSortArrowLight
