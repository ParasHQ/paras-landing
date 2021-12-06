import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'

const FilterAttribute = ({ attributes }) => {
	const [attributeFilter, setAttributeFilter] = useState([])
	const router = useRouter()
	const filterModalRef = useRef()
	const { localeLn } = useIntl()

	const [showFilterModal, setShowFilterModal] = useState(false)

	useEffect(() => {
		const onClickEv = (e) => {
			if (filterModalRef.current?.contains && !filterModalRef.current.contains(e.target)) {
				setShowFilterModal(false)
			}
		}
		if (showFilterModal) {
			document.body.addEventListener('click', onClickEv)
		}
		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showFilterModal])

	useEffect(() => {
		router.query.attributes && setAttributeFilter(JSON.parse(router.query.attributes))
	}, [router.query.attributes])

	const onClickApply = () => {
		router.push({
			query: {
				...router.query,
				attributes: JSON.stringify(attributeFilter),
			},
		})

		setShowFilterModal(false)
	}

	return (
		<div ref={filterModalRef} className="inline-block">
			<div
				className="mx-4 inline-flex cursor-pointer px-4 py-2 bg-dark-primary-2 button-wrapper rounded-md"
				onClick={() => setShowFilterModal(!showFilterModal)}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="white"
					fill="white"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-1"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<line x1="9" y1="6" x2="20" y2="6"></line>
					<line x1="9" y1="12" x2="20" y2="12"></line>
					<line x1="9" y1="18" x2="20" y2="18"></line>
					<line x1="5" y1="6" x2="5" y2="6.01"></line>
					<line x1="5" y1="12" x2="5" y2="12.01"></line>
					<line x1="5" y1="18" x2="5" y2="18.01"></line>
				</svg>
				<h1 className="text-white font-semibold text-xl select-none hidden md:inline-block">
					{localeLn('Attributes')}
				</h1>
			</div>
			{showFilterModal && (
				<div
					className="absolute max-w-xs md:max-w-full mr-4 sm:mr-4 z-20 mt-2 px-4 right-0 bg-dark-primary-2 rounded-md"
					style={{
						width: `22rem`,
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
										router={router}
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
				<div className="max-w-sm mx-auto p-2 mb-3 border-2 border-gray-800 rounded-md">
					{Object.keys(attributes[attribute]).map((value, index) => {
						return (
							<div
								className="group rounded-md pl-3 pr-3 hover:bg-gray-600 hover:bg-opacity-10"
								key={index}
							>
								<label className="inline-flex items-center w-full cursor-pointer">
									<input
										className="text-white w-4 h-4 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded cursor-pointer"
										type="checkbox"
										onChange={() => {
											addAttribute({ [attribute]: value })
										}}
										checked={checkIfObjectExist({ [attribute]: value })}
									/>
									<p className="font-thin text-white text-sm py-1 md:py-2">{value}</p>
									<p className="font-thin text-right flex-grow text-gray-500 text-sm py-1 md:py-2">
										{attributes[attribute][value]}
									</p>
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
