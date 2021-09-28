import * as React from 'react'
import { InputText } from '../InputText'
import { InputSelect } from '../InputSelect'

import { InputLeftElement } from '../InputElement'

const InputGroup = ({ className = '', children, ...rest }) => {
	const validChildrenArray = React.Children.toArray(children).filter(React.isValidElement)

	const inputGroupStyle = `${className} relative flex flex-wrap items-stretch w-full`

	let classNameInput

	return (
		<div className={inputGroupStyle} {...rest}>
			{validChildrenArray.map((child) => {
				if (child.type === InputLeftElement) {
					classNameInput = 'pl-9'
				}

				if (child.type === InputText || child.type === InputSelect) {
					return React.cloneElement(child, {
						className: classNameInput,
					})
				}
				return React.cloneElement(child)
			})}
		</div>
	)
}

InputGroup.displayName = 'InputGroup'

export default InputGroup
