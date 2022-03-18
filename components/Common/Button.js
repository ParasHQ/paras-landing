import React from 'react'
import PropTypes from 'prop-types'

const Button = ({
	isDisabled,
	isFullWidth,
	size,
	variant,
	children,
	className,
	style,
	isLoading,
	onClick,
}) => {
	const buttonBaseStyle =
		'inline-block text-center relative whitespace-nowrap rounded-md font-medium text-body'
	const buttonTransition = 'transition duration-150 ease-in-out'

	let buttonVariantStyle
	switch (variant) {
		case 'primary':
			buttonVariantStyle = `bg-primary text-gray-100 ${!isDisabled && 'hover:bg-opacity-70'}`
			break
		case 'secondary':
			buttonVariantStyle = `bg-gray-800 text-gray-200 ${!isDisabled && 'hover:bg-opacity-70'}`
			break
		case 'error':
			buttonVariantStyle = `bg-red-500 text-gray-100 ${!isDisabled && 'hover:bg-opacity-70'}`
			break
		case 'ghost':
			buttonVariantStyle = `bg-transparent border border-white text-white ${
				!isDisabled && 'hover:bg-white hover:bg-opacity-10'
			}`
			break
		case 'white':
			buttonVariantStyle = `bg-gray-300 text-black ${
				!isDisabled && 'hover:bg-white hover:bg-opacity-60'
			}`
			break
		default:
			break
	}

	let buttonSizeStyle
	switch (size) {
		case 'lg':
			buttonSizeStyle = 'py-3 px-20 text-base'
			break
		case 'md':
			buttonSizeStyle = 'py-3 px-4 text-sm'
			break
		case 'sm':
			buttonSizeStyle = 'py-2 px-4 text-xs'
			break
		default:
			break
	}

	let buttonStyle = `${className} ${buttonBaseStyle} ${buttonTransition} ${buttonVariantStyle} ${buttonSizeStyle}`

	if (isDisabled || isLoading) {
		const buttonDisabledStyle = 'cursor-default opacity-60 saturate-50'
		buttonStyle = `${buttonStyle} ${buttonDisabledStyle}`
	}

	if (isFullWidth) {
		const buttonFullWidth = 'w-full block'
		buttonStyle = `${buttonStyle} ${buttonFullWidth}`
	}

	return (
		<button
			disabled={isDisabled || isLoading}
			className={buttonStyle}
			style={style}
			onClick={onClick}
		>
			{isLoading ? <LoaderIcon /> : children}
		</button>
	)
}

Button.defaultProps = {
	isDisabled: false,
	isFullWidth: false,
	size: 'lg',
	variant: 'primary',
	className: '',
}

Button.propTypes = {
	isDisabled: PropTypes.bool,
	isFullWidth: PropTypes.bool,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'error']),
	onClick: PropTypes.func,
}

export default Button

const LoaderIcon = () => (
	<div className="flex items-center justify-center">
		<svg
			className="animate-spin m h-5 w-5 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			></circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	</div>
)
