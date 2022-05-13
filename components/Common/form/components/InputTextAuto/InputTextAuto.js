import React, { forwardRef } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useState } from 'react'

const InputTextAuto = forwardRef(
	({ className = '', isError = false, suggestionList = [], ...rest }, ref) => {
		const inputBaseStyle = `${className} input-text flex items-center relative w-full px-3 py-2 rounded-lg`
		const inputBgStyle =
			'bg-white bg-opacity-10 focus:bg-white focus:bg-opacity-20 focus:border-transparent'
		const inputBorderStyle = 'outline-none'
		const inputTextStyle = 'text-white text-opacity-90 text-body text-base '

		const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
			isError ? 'input-text--error' : ''
		}`

		const [value, setValue] = useState(rest.devaultValue)
		const [showSuggestion, setShowSuggestion] = useState(false)

		const filteredSuggestion =
			value?.length > 0
				? suggestionList.filter((s) => value && s.toLowerCase().includes(value.toLowerCase()))
				: suggestionList

		const _onChange = async (val) => {
			setShowSuggestion(true)
			setValue(val)
		}

		return (
			<div className="relative w-full">
				<input
					ref={ref}
					className={inputStyle}
					onBlur={() => setShowSuggestion(false)}
					onChange={(e) => _onChange(e.target.value)}
					value={value}
					autoComplete="off"
					{...rest}
				/>
				<div
					className={`w-full z-30 ${
						showSuggestion && filteredSuggestion.length > 0 ? 'block' : 'hidden'
					}`}
				>
					<div className="absolute z-30 inline-block text-sm font-thin w-full bg-gray-600 rounded-md overflow-hidden mt-1 shadow-xl">
						<Scrollbars autoHeight autoHeightMin={0} autoHeightMax={120}>
							{filteredSuggestion.map((s, index) => {
								return (
									<div
										key={index}
										onMouseDown={(e) => {
											e.preventDefault()
											setValue(s)
											setShowSuggestion(false)
										}}
										className="cursor-pointer hover:bg-gray-500"
									>
										<p className="p-2 text-opacity-70 text-xs">{s}</p>
									</div>
								)
							})}
						</Scrollbars>
					</div>
				</div>
			</div>
		)
	}
)

InputTextAuto.displayName = 'InputTextAuto'

export default InputTextAuto
