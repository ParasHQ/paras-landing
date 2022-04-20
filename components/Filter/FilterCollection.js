import Scrollbars from 'react-custom-scrollbars'
import router, { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import Media from 'components/Common/Media'
import { parseImgUrl } from 'utils/common'

const FilterCollection = ({ collections, onClearAll }) => {
	const router = useRouter()
	const filterModalRef = useRef()
	const { localeLn } = useIntl()

	const [showFilterModal, setShowFilterModal] = useState(false)
	const [searchCollection, setSearchCollection] = useState('')

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
		router.query.collections
	}, [router.query.collections])

	const debounce = (func, timeout) => {
		let timer

		return function (...args) {
			const context = this
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				timer = null
				func.apply(context, args)
			}, timeout)
		}
	}

	const handleAutoCompleteCollections = async (event) => {
		const { value } = event

		if (value.length >= 1) {
			let dataCollections = []
			collections.map((coll) => dataCollections.push(coll))
			let searchCollection = dataCollections.filter((coll) =>
				coll.collection.toLowerCase().includes(value.toLowerCase())
			)
			setSearchCollection(searchCollection)
		} else {
			setSearchCollection('')
		}
	}

	const debounceAutoCompleteCollections = debounce(handleAutoCompleteCollections, 400)

	const onChangeAutoComplete = (event) => {
		debounceAutoCompleteCollections(event)
	}

	const debounceOnChange = debounce(onChangeAutoComplete, 200)

	return (
		<div ref={filterModalRef} className="inline-block md:relative">
			<div
				className="md:mx-4 inline-flex cursor-pointer px-4 py-2 bg-dark-primary-2 button-wrapper rounded-md"
				onClick={() => setShowFilterModal(!showFilterModal)}
			>
				<svg
					className="w-6 h-6 text-white md:mr-1"
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
					<div className=" p-4">
						<form action="/search" method="get" onSubmit={'_handleSubmit'} autoComplete="off">
							<div className="flex border-dark-primary-1 border-2 rounded-lg bg-dark-primary-1 mb-2">
								<svg
									width="36"
									height="36"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M10.6667 15.1667C10.6667 12.6814 12.6814 10.6667 15.1667 10.6667C17.6519 10.6667 19.6667 12.6814 19.6667 15.1667C19.6667 17.6519 17.6519 19.6667 15.1667 19.6667C12.6814 19.6667 10.6667 17.6519 10.6667 15.1667ZM15.1667 8C11.2086 8 8 11.2086 8 15.1667C8 19.1247 11.2086 22.3333 15.1667 22.3333C16.6639 22.3333 18.0538 21.8742 19.2035 21.0891L21.7239 23.6095C22.2446 24.1302 23.0888 24.1302 23.6095 23.6095C24.1302 23.0888 24.1302 22.2446 23.6095 21.7239L21.0891 19.2035C21.8742 18.0538 22.3333 16.6639 22.3333 15.1667C22.3333 11.2086 19.1247 8 15.1667 8Z"
										fill="white"
									></path>
								</svg>
								<input
									id="search"
									name="q"
									type="search"
									value={router.query.search}
									onChange={(e) => debounceOnChange(e.target)}
									placeholder={localeLn('Search in collections')}
									className="p-1 pl-0 m-auto bg-transparent focus:bg-transparent border-none text-white text-base md:text-sm font-medium"
									style={{ WebkitAppearance: 'none' }}
								/>
							</div>
						</form>
						<Scrollbars
							autoHeight
							autoHeightMax={`15rem`}
							renderView={(props) => <div {...props} id="scrollableDiv" />}
						>
							<div>
								{collections.length > 0 ? (
									<CollectionItem
										collections={searchCollection ? searchCollection : collections}
										router={router}
										setShowFilterModal={() => setShowFilterModal(false)}
										setSearchCollection={() => setSearchCollection('')}
									/>
								) : (
									<p className="text-white text-center mt-4">No Collections</p>
								)}
							</div>
						</Scrollbars>
					</div>
					{router.query.collections && router.query.collections?.length >= 1 && (
						<div
							className=" text-gray-400 hover:text-opacity-70 transition duration-150 ease-in-out  cursor-pointer my-1 flex items-center justify-center px-4 pb-2 pt-2 text-xs"
							onClick={() => {
								onClearAll()
								setShowFilterModal(false)
							}}
						>
							Clear
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default FilterCollection

const CollectionItem = ({ collections, setShowFilterModal, setSearchCollection }) => {
	const onClickApplyCollection = (collectionId) => {
		router.push(
			{
				query: {
					...router.query,
					collections: collectionId,
				},
			},
			{ shallow: true, scroll: false }
		)

		setShowFilterModal(false)
		setSearchCollection('')
	}

	return (
		<div>
			{collections.map((value, index) => {
				return (
					<button
						key={index}
						onClick={() => onClickApplyCollection(value.collection_id)}
						className="flex flex-row justify-between items-center w-full text-white p-2 hover:bg-dark-primary-1 rounded-md"
					>
						<label className="inline-flex justify-between items-center w-full cursor-pointer">
							<div className="flex items-center gap-1 truncate">
								<div
									className={`w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-primary shadow-inner`}
								>
									<Media
										url={parseImgUrl(value.media ? value.media : '', null, {
											width: '200',
											useOriginal: process.env.APP_ENV !== 'production',
										})}
										videoControls={false}
										videoMuted={true}
										videoLoop={true}
									/>
								</div>
								<p className="text-white font-medium text-md truncate ml-1">{value.collection}</p>
							</div>
							{value.collection_id === router.query.collections && (
								<div>
									<svg
										className="w-6 h-6 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
							)}
						</label>
					</button>
				)
			})}
		</div>
	)
}
