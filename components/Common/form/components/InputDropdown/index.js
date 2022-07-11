import React, { useEffect, useState } from 'react'

const InputDropdown = ({ data, defaultValue = '', selectItem = () => null }) => {
	const [modal, setModal] = useState(false)
	const [select, setSelect] = useState(() => data.find((item) => item.id === defaultValue).label)

	useEffect(() => {
		const onClickEv = () => {
			setModal(false)
		}
		if (modal) document.body.addEventListener('click', onClickEv)

		return () => document.body.removeEventListener('click', onClickEv)
	}, [modal])

	return (
		<div className="relative">
			<div
				className="input-select input-text flex items-center justify-between relative w-52 px-3 py-2 rounded-lg bg-white bg-opacity-5 outline-none text-white text-opacity-90 text-body text-base cursor-pointer "
				onClick={() => setModal(true)}
			>
				<p className="truncate text-white">{select}</p>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="white"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</div>
			{modal && (
				<div className="right-0 w-52 py-2 mt-2 bg-[#302D36] shadow-lg rounded-lg absolute z-20 overflow-hidden">
					<div className="overflow-y-auto max-h-60">
						<ul className="text-white w-full">
							{data.map((item, index) => {
								return (
									<li
										key={index}
										className={`${
											item.label === select ? 'text-white bg-gray-900 bg-opacity-30' : ''
										} px-3 py-2 cursor-pointer hover:bg-opacity-5 hover:bg-white flex items-center justify-between`}
										onClick={() => {
											setSelect(item.label)
											selectItem(item.id)
										}}
									>
										<p>{item.label}</p>
										{item.ping && (
											<div className="text-xs flex items-center justify-between">
												<div
													className={`w-1.5 h-1.5 rounded-full ${
														item.ping > 0 ? 'bg-green-400' : 'bg-red-500'
													} mr-1.5`}
												/>
												<div className="text-white text-xs">
													{item.ping > 0 ? `${item.ping}ms` : item.ping}
												</div>
											</div>
										)}
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}

export default InputDropdown
