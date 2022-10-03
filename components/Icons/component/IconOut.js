import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconOut = ({ size, stroke, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 25 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M21.5 3V2.5H22V3H21.5ZM11.8536 13.3536C11.6583 13.5488 11.3417 13.5488 11.1464 13.3536C10.9512 13.1583 10.9512 12.8417 11.1464 12.6464L11.8536 13.3536ZM21 11V3H22V11H21ZM21.5 3.5H13.5V2.5H21.5V3.5ZM21.8536 3.35355L11.8536 13.3536L11.1464 12.6464L21.1464 2.64645L21.8536 3.35355Z"
			fill={stroke}
		/>
		<path
			d="M20.5 15V15C20.5 16.8692 20.5 17.8038 20.0981 18.5C19.8348 18.9561 19.4561 19.3348 19 19.5981C18.3038 20 17.3692 20 15.5 20H10.5C7.67157 20 6.25736 20 5.37868 19.1213C4.5 18.2426 4.5 16.8284 4.5 14V9C4.5 7.13077 4.5 6.19615 4.90192 5.5C5.16523 5.04394 5.54394 4.66523 6 4.40192C6.69615 4 7.63077 4 9.5 4V4"
			stroke={stroke}
			strokeLinecap="round"
		/>
	</svg>
)

IconOut.defaultProps = {
	...iconDefaultProps,
}

export default IconOut
