import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconCheckboxChecked = ({ size, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<g filter="url(#filter0_d_10150_22456)">
			<rect
				x="5.5"
				y="5.5"
				width="13"
				height="13"
				rx="1.5"
				stroke="#F9F9F9"
				shapeRendering="crispEdges"
			/>
		</g>
		<path
			d="M8 11L11.2331 13.4248C11.6618 13.7463 12.2677 13.6728 12.607 13.2581L21 3"
			stroke="#F9F9F9"
			strokeLinecap="round"
		/>
		<defs>
			<filter
				id="filter0_d_10150_22456"
				x="2"
				y="2"
				width="22"
				height="22"
				filterUnits="userSpaceOnUse"
				colorInterpolationFilters="sRGB"
			>
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset dx="1" dy="1" />
				<feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10150_22456" />
				<feBlend
					mode="normal"
					in="SourceGraphic"
					in2="effect1_dropShadow_10150_22456"
					result="shape"
				/>
			</filter>
		</defs>
	</svg>
)

IconCheckboxChecked.defaultProps = {
	...iconDefaultProps,
}

export default IconCheckboxChecked
