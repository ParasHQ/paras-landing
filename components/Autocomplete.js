import { useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

let fetchTimeout

const Autocomplete = ({
	onChange,
	onBlur,
	name,
	value,
	placeholder,
	inputClassName,
	getNewSuggestions,
	inputRef,
	suggestions = [],
}) => {
	const [showSuggestions, setShowSuggestions] = useState(false)

	const _onBlur = () => {
		setShowSuggestions(false)
		onBlur()
	}

	const _onFocus = () => {
		setShowSuggestions(true)
	}

	const _onChange = async (val) => {
		if (!showSuggestions) {
			setShowSuggestions(true)
		}
		if (typeof getNewSuggestions === 'function') {
			clearTimeout(fetchTimeout)

			fetchTimeout = setTimeout(() => {
				getNewSuggestions(val)
			}, 250)
		}
		onChange(val)
	}

	const filteredSuggestions =
		value?.length > 0
			? suggestions.filter((s) => value && s.toLowerCase().includes(value.toLowerCase()))
			: suggestions

	return (
		<div className={`relative`}>
			<div className="flex items-center w-full rounded-md outline-none">
				<div className="w-full relative">
					<input
						className={inputClassName}
						autoComplete="off"
						type="text"
						name={name}
						value={value || ''}
						onChange={(e) => _onChange(e.target.value)}
						onBlur={_onBlur}
						onFocus={_onFocus}
						placeholder={placeholder}
						ref={inputRef}
					/>
				</div>
			</div>
			<div className={`${showSuggestions && filteredSuggestions.length > 0 ? 'block' : 'hidden'}`}>
				<div className="absolute w-full pt-2 z-30">
					<div className="border bg-gray-100 rounded-md overflow-hidden">
						<Scrollbars universal={true} autoHeight autoHeightMin={0} autoHeightMax={200}>
							{filteredSuggestions.map((s, idx) => {
								return (
									<div
										key={idx}
										onMouseDown={(e) => {
											e.preventDefault()
											_onChange(s)
											setShowSuggestions(false)
										}}
										className={`
                    ${s === value && 'bg-gray-400'}
                    p-2 text-gray-900 hover:bg-gray-400 cursor-pointer
                  `}
									>
										{s}
									</div>
								)
							})}
						</Scrollbars>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Autocomplete
