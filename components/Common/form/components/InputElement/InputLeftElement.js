import * as React from 'react'

const InputLeftElement = ({ className = '', style, children, ...rest }) => {
	const inputLeftElementStyle = `${className} flex items-center justify-center absolute top-0 z-10 ml-2 h-full`
	return (
		<div className={inputLeftElementStyle} {...rest} style={style}>
			{children}
		</div>
	)
}

InputLeftElement.displayName = 'InputLeftElement'

export default InputLeftElement
