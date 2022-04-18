import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import Button from 'components/Common/Button'

const FilterCollection = ({ collections, onClearAll }) => {
	const [collectionFilter, setCollectionFilter] = useState([])
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
		router.query.attributes && setCollectionFilter(JSON.parse(router.query.attributes))
	}, [router.query.attributes])

	const onClickApply = () => {
		router.push(
			{
				query: {
					...router.query,
					attributes: JSON.stringify(collectionFilter),
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
					className="w-6 h-6 text-white mr-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
				<h1 className="text-white font-semibold text-xl select-none hidden md:inline-block">
					{localeLn('Collections')}
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
							<h1 className="text-white font-semibold text-xl mb-2">{localeLn('Collections')}</h1>
							<div>
								{Object.keys(collections).map((collection, index) => (
									<CollectionItem
										key={index}
										collectionFilter={collectionFilter}
										setCollectionFilter={setCollectionFilter}
										collection={collection}
										collections={collections}
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

export default FilterCollection

const CollectionItem = ({ collectionFilter, setCollectionFilter, collection, collections }) => {
	const [isOpen, setIsOpen] = useState(false)

	const addCollection = (addedCollection) => {
		if (checkIfObjectExist(addedCollection)) {
			const newCollection = collectionFilter.filter(
				(attr) => JSON.stringify(attr) !== JSON.stringify(addedCollection)
			)
			setCollectionFilter(newCollection)
		} else {
			setCollectionFilter([...collectionFilter, addedCollection])
		}
	}

	const checkIfObjectExist = (obj) => {
		return collectionFilter.some((coll) => JSON.stringify(coll) === JSON.stringify(obj))
	}

	return (
		<div>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex flex-row justify-between items-center w-full text-white p-2"
			>
				<p className="font-medium text-lg">{collection}</p>
				<div className="flex flex-col items-center justify-center text-center">
					<p className="text-opacity-15 text-white text-xs">
						{Object.keys(collections[collection]).length}
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
					{Object.keys(collections[collection]).map((value, index) => {
						return (
							<div
								className="group rounded-md pl-3 pr-3 hover:bg-gray-600 hover:bg-opacity-10"
								key={index}
							>
								<label className="inline-flex items-center w-full cursor-pointer">
									<input
										className="text-white w-4 h-4 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded cursor-pointer"
										type="checkbox"
										onChange={() => addCollection({ [collection]: value })}
										checked={checkIfObjectExist({ [collection]: value })}
									/>
									<p className="font-thin text-white text-sm py-1 md:py-2">{value}</p>
									<p className="font-thin text-right flex-grow text-gray-500 text-sm py-1 md:py-2">
										{collections[collection][value].count} (
										{collections[collection][value].rarity?.rarity > 1
											? Math.round(collections[collection][value].rarity)
											: collections[collection][value].rarity.toFixed(2)}
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
