import React from 'react'
import PropTypes from 'prop-types'

const Avatar = ({ alt, entityName, bg, size, src, className, style, onClick }) => {
	const avatarBaseStyle =
		'rounded-full overflow-hidden select-none inline-flex items-center justify-center relative text-gray-900'

	let avatarSizeStyle
	switch (size) {
		case 'xxl':
			avatarSizeStyle = 'w-24 h-24 text-4xl'
			break
		case 'xl':
			avatarSizeStyle = 'w-16 h-16 text-3xl'
			break
		case 'lg':
			avatarSizeStyle = 'w-12 h-12 text-2xl'
			break

		case 'md':
			avatarSizeStyle = 'w-8 h-8 text-base'
			break

		case 'sm':
			avatarSizeStyle = 'w-6 h-6 text-sm'
			break

		case 'xs':
			avatarSizeStyle = 'w-4 h-4 text-xs'
			break
		default:
			break
	}
	let avatarStyle = `${className} ${avatarBaseStyle} ${avatarSizeStyle} ${bg || 'bg-primary'}`

	const getInitials = (name) => {
		return name.charAt(0).toUpperCase()
	}

	const renderChild = () => {
		if (src) {
			return <img className="w-full h-full absolute top-0 left-0" src={src} alt={alt} />
		}

		if (entityName) {
			const entityStyle = 'font-medium text-white'
			return <h2 className={entityStyle}>{getInitials(entityName)}</h2>
		}

		return null
	}

	return (
		<div className={avatarStyle} style={style} onClick={onClick}>
			{renderChild()}
		</div>
	)
}

Avatar.defaultProps = {
	alt: '',
	entityName: 'Paras',
	bg: 'bg-primary',
	size: '',
	src: '',
	className: '',
}

Avatar.propTypes = {
	alt: PropTypes.string,
	bg: PropTypes.string,
	entityName: PropTypes.string,
	src: PropTypes.string,
	size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
	onClick: PropTypes.func,
}

export default Avatar
