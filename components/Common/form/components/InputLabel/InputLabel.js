import * as React from 'react'

const InputLabel = ({ className, style, children, ...rest }) => {
	const labelStyle = `inline-block mb-1 font-medium text-sm text-white opacity-90 text-body ${className}`
	return (
		<label className={labelStyle} style={style} {...rest}>
			{children}
		</label>
	)
}

InputLabel.displayName = 'InputLabel'

export default InputLabel
