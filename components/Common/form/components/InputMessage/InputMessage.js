import * as React from 'react'

const InputMessage = ({ className, style, children, variant = 'general', ...rest }) => {
	const messageStyles = (variant = 'general') => {
		switch (variant) {
			case 'general': {
				return 'text-white opacity-70'
			}
			case 'error': {
				return 'text-red-500'
			}
			default: {
				return null
			}
		}
	}

	const inputMessageStyle = `${className} mt-1`

	return (
		<div className={inputMessageStyle} style={style} {...rest}>
			<p className={`text-xs ${messageStyles(variant)}`}>{children}</p>
		</div>
	)
}

InputMessage.displayName = 'InputMessage'

export default InputMessage
