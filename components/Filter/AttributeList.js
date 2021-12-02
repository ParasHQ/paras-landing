import { useState } from 'react'

const AttributeList = ({ attributes }) => {
	const [attributeFilter, setAttributeFilter] = useState([])

	const addAttribute = () => {
		// const newAttributes = [...attributeFilter, attribute]
	}

	const showDetail = () => {}

	return (
		<div className="mt-4">
			{Object.keys(attributes).map((attribute, index) => {
				return (
					<div key={index}>
						<button
							// onClick={() => showDetail(index)}
							className="grid grid-cols-2 justify-start items-center w-full text-white rounded-md px-3 py-3 mr-2 border-2 border-gray-800"
						>
							<p className="justify-self-start">{attribute}</p>
							<svg
								width="10"
								height="10"
								viewBox="0 0 21 19"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="justify-self-end"
							>
								<path
									d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z"
									fill="white"
								/>
							</svg>
						</button>
						<div className="max-w-sm mx-auto p-2 pl-5 mb-3 border-2 border-gray-800 rounded-md">
							{Object.keys(attributes[attribute]).map((value, index) => {
								return (
									<div key={index}>
										<label className="inline-flex items-center">
											<input
												className="text-white w-4 h-4 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded"
												type="checkbox"
												onChange={() => {
													addAttribute({ [attribute]: value })
												}}
											/>
											<p className="text-white text-sm">{value}</p>
										</label>
										<br />
									</div>
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default AttributeList
