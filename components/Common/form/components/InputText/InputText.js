import React, { forwardRef } from 'react'

const InputText = forwardRef(
	({ className = '', isError = false, placeHolder = false, ...rest }, ref) => {
		const inputBaseStyle = `${className} input-text flex items-center relative w-full rounded-lg`
		const inputBgStyle = `${
			placeHolder ? 'bg-transparent focus:bg-transparent' : 'bg-white bg-opacity-10 focus:bg-white'
		} focus:bg-opacity-20 focus:border-transparent`
		const inputBorderStyle = 'outline-none'
		const inputTextStyle = 'text-white text-opacity-90 text-body text-base '

		const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
			isError ? 'input-text--error' : ''
		}`

		return placeHolder ? (
			<div className={`flex bg-white bg-opacity-10 rounded-lg w-1/4`}>
				<input ref={ref} className={inputStyle} {...rest} />
				<div className="inline-block text-white text-base my-auto px-1.5">{placeHolder}</div>
			</div>
		) : (
			<input ref={ref} className={inputStyle} {...rest} />
		)
	}
)

InputText.displayName = 'InputText'

export default InputText
