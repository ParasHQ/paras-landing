import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'

const FilterAttribute = ({ attributes }) => {
	const [attributeFilter, setAttributeFilter] = useState([])
	const router = useRouter()
	const filterModalRef = useRef()
	const { localeLn } = useIntl()

	const [showFilterModal, setShowFilterModal] = useState(false)

	const onClickApply = () => {
		router.push({
			query: {
				...router.query,
				attributes: JSON.stringify(attributeFilter),
			},
		})
	}

	return (
		<div ref={filterModalRef} className="inline-block">
			<div
				className="mx-4 inline-flex cursor-pointer px-4 py-2 bg-dark-primary-2 button-wrapper rounded-md"
				onClick={() => setShowFilterModal(!showFilterModal)}
			>
				<svg viewBox="0 0 24 24" width="24" height="24" fill="white" className="inline-block mr-1">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M5.14 9H4a1 1 0 110-2h1.14a4 4 0 017.72 0H20a1 1 0 110 2h-7.14a4 4 0 01-7.72 0zm4.971-2.663A2 2 0 107.89 9.663a2 2 0 002.222-3.326zM18.86 15H20a1 1 0 110 2h-1.14a4 4 0 01-7.72 0H4a1 1 0 010-2h7.14a4 4 0 017.72 0zm-4.971 2.663a2 2 0 102.222-3.325 2 2 0 00-2.222 3.325z"
					></path>
				</svg>
				<h1 className="text-white font-semibold text-xl select-none hidden md:inline-block">
					{localeLn('Attributes')}
				</h1>
			</div>
			{showFilterModal && (
				<div
					className="absolute max-w-xs md:max-w-full mr-4 sm:mr-0 z-20 mt-2 px-4 right-0 bg-dark-primary-2 rounded-md"
					style={{
						width: `24rem`,
					}}
				>
					<Scrollbars
						autoHeight
						autoHeightMax={`30rem`}
						renderView={(props) => <div {...props} id="scrollableDiv" />}
					>
						<div className=" p-4">
							<h1 className="text-white font-semibold text-xl">{localeLn('Attributes')}</h1>
							<div>
								{Object.keys(attributes).map((attribute, index) => (
									<AttributeItem
										key={index}
										attributeFilter={attributeFilter}
										setAttributeFilter={setAttributeFilter}
										attribute={attribute}
										attributes={attributes}
									/>
								))}
							</div>
						</div>
					</Scrollbars>
					<div className="py-4">
						<button
							onClick={onClickApply}
							className="w-full outline-none rounded-md bg-transparent text-sm font-semibold py-2 bg-primary text-gray-100"
						>
							{localeLn('Apply')}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default FilterAttribute

const AttributeItem = ({ attributeFilter, setAttributeFilter, attribute, attributes }) => {
	const [isOpen, setIsOpen] = useState(false)

	const addAttribute = (addedAttribute) => {
		if (checkIfObjectExist(addedAttribute)) {
			const newAttribute = attributeFilter.filter(
				(attr) => JSON.stringify(attr) !== JSON.stringify(addedAttribute)
			)
			setAttributeFilter(newAttribute)
		} else {
			setAttributeFilter([...attributeFilter, addedAttribute])
		}
	}

	const checkIfObjectExist = (obj) => {
		return attributeFilter.some((attr) => JSON.stringify(attr) === JSON.stringify(obj))
	}

	return (
		<div>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex flex-row justify-end items-center w-full text-white rounded-md px-3 py-3 mr-2 border-2 border-gray-800"
			>
				<p className="flex-grow justify-self-start">{attribute}</p>
				<svg
					width="10"
					height="10"
					viewBox="0 0 21 19"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="flex-shrink"
				>
					<path d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z" fill="white" />
				</svg>
			</button>
			{isOpen && (
				<div className="max-w-sm mx-auto p-2 pl-5 mb-3 border-2 border-gray-800 rounded-md">
					{Object.keys(attributes[attribute]).map((value, index) => {
						return (
							<div key={index}>
								<label className="inline-flex items-center">
									<input
										className="text-white w-4 h-4 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded cursor-pointer"
										type="checkbox"
										onChange={() => {
											addAttribute({ [attribute]: value })
										}}
										checked={checkIfObjectExist({ [attribute]: value })}
									/>
									<p className="font-thin text-white text-sm py-1 md:py-2">{value}</p>
								</label>
								<br />
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
