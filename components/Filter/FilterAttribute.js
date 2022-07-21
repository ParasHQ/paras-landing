import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import Button from 'components/Common/Button'
import { prettyTruncate } from 'utils/common'

const FilterAttribute = ({ attributes, onClearAll }) => {
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
		router.push(
			{
				query: {
					...router.query,
					attributes: JSON.stringify(attributeFilter),
				},
			},
			{},
			{ shallow: true, scroll: false }
		)

		setShowFilterModal(false)
	}

	return (
		<div ref={filterModalRef} className="inline-block md:relative">
			<div
				className="md:mx-4 inline-flex cursor-pointer px-4 py-2 bg-dark-primary-2 button-wrapper rounded-md"
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
				<div className="absolute mr-4 z-20 mt-2 right-0 bg-dark-primary-2 rounded-md w-80">
					<Scrollbars
						autoHeight
						autoHeightMax={`30rem`}
						renderView={(props) => <div {...props} id="scrollableDiv" />}
					>
						<div className=" p-4">
							<h1 className="text-white font-semibold text-xl mb-2">{localeLn('Attributes')}</h1>
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
					<div className="p-4">
						<Button onClick={onClickApply} isFullWidth size="sm">
							{localeLn('Apply')}
						</Button>
					</div>
					{router.query.attributes && JSON.parse(router.query.attributes)?.length >= 1 && (
						<div
							className=" text-gray-400 hover:text-opacity-70 transition duration-150 ease-in-out  cursor-pointer my-1 flex items-center justify-center px-4 pb-2 text-xs"
							onClick={() => {
								onClearAll()
								setShowFilterModal(false)
							}}
						>
							Clear All
						</div>
					)}
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
				className="flex flex-row justify-between items-center w-full text-white p-2"
			>
				<p className="font-medium text-lg text-left">{prettyTruncate(attribute, 38)}</p>
				<div className="flex flex-col items-center justify-center text-center">
					<p className="text-opacity-15 text-white text-xs">
						{Object.keys(attributes[attribute]).length}
					</p>
					<svg
						width="10"
						height="10"
						viewBox="0 0 21 19"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z" fill="white" />
					</svg>
				</div>
			</button>
			{isOpen && (
				<div className="max-w-sm mx-auto p-2 mb-3 rounded-md bg-blue-400 bg-opacity-5">
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
										onChange={() => addAttribute({ [attribute]: value })}
										checked={checkIfObjectExist({ [attribute]: value })}
									/>
									<p className="font-thin text-white text-sm py-1 md:py-2">
										{prettyTruncate(value, 30)}
									</p>
									<p className="font-thin text-right flex-grow text-gray-500 text-sm py-1 md:py-2">
										{attributes[attribute][value].count} (
										{attributes[attribute][value].rarity?.rarity > 1
											? Math.round(attributes[attribute][value].rarity)
											: attributes[attribute][value].rarity.toFixed(2)}
										%)
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
