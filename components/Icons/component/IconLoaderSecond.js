import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconLoaderSecond = ({ size, ...props }) => (
	<svg
		id="loading-spinner"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 48 48"
		className="loaderIcon animate-spin text-white"
		{...props}
	>
		<defs>
			<linearGradient id="spinner-gradient-a" x1="49.892%" x2="55.03%" y1="58.241%" y2="89.889%">
				<stop offset="0%" stopColor="#979797" />
				<stop offset="22.44%" stopOpacity=".59" stopColor="#979797" />
				<stop offset="100%" stopOpacity="0" stopColor="#C4C4C4" />
			</linearGradient>
		</defs>
		<g fill="none" transform="translate(-8 -8)">
			<path d="M32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 C56,45.254834 45.254834,56 32,56 Z M32,52 C43.045695,52 52,43.045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 Z" />
			<path
				fill="url(#spinner-gradient-a)"
				d="M56,32 C56,33.1045695 55.1045695,34 54,34 C52.8954305,34 52,33.1045695 52,32 C52,20.954305 43.045695,12 32,12 C20.954305,12 12,20.954305 12,32 C12,43.045695 20.954305,52 32,52 C33.1045695,52 34,52.8954305 34,54 C34,55.1045695 33.1045695,56 32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 Z"
				transform="rotate(45 32 32)"
			/>
		</g>
	</svg>
)

IconLoaderSecond.defaultProps = {
	...iconDefaultProps,
}

export default IconLoaderSecond
