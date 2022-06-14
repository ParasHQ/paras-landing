import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconSearch = ({ size, color, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10.6667 15.1667C10.6667 12.6814 12.6814 10.6667 15.1667 10.6667C17.6519 10.6667 19.6667 12.6814 19.6667 15.1667C19.6667 17.6519 17.6519 19.6667 15.1667 19.6667C12.6814 19.6667 10.6667 17.6519 10.6667 15.1667ZM15.1667 8C11.2086 8 8 11.2086 8 15.1667C8 19.1247 11.2086 22.3333 15.1667 22.3333C16.6639 22.3333 18.0538 21.8742 19.2035 21.0891L21.7239 23.6095C22.2446 24.1302 23.0888 24.1302 23.6095 23.6095C24.1302 23.0888 24.1302 22.2446 23.6095 21.7239L21.0891 19.2035C21.8742 18.0538 22.3333 16.6639 22.3333 15.1667C22.3333 11.2086 19.1247 8 15.1667 8Z"
			fill={color}
		/>
	</svg>
)

IconSearch.defaultProps = {
	...iconDefaultProps,
}

export default IconSearch
