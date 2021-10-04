import React, { forwardRef } from 'react'

const InputText = forwardRef(({ className = '', isError = false, ...rest }, ref) => {
	const inputBaseStyle = `${className} input-text flex items-center relative w-full px-3 py-2 rounded-lg`
	const inputBgStyle =
		'bg-white bg-opacity-10 focus:bg-white focus:bg-opacity-20 focus:border-transparent'
	const inputBorderStyle = 'outline-none '
	const inputTextStyle = 'text-white text-opacity-90 text-body text-base '

	const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
		isError ? 'input-text--error' : ''
	}`

	return <textarea ref={ref} className={inputStyle} {...rest} />
})

InputText.displayName = 'InputText'

export default InputText
