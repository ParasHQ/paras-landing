import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import { parseImgUrl } from 'utils/common'
import { IconSearch } from 'components/Icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'

const FilterAddCollection = ({
	collections,
	choosenCollection,
	setChoosenCollection,
	fetchCollectionUser,
	hasMore,
	currentUser,
}) => {
	const router = useRouter()
	const filterModalRef = useRef()
	const { localeLn } = useIntl()

	const [showAutoComplete, setShowAutoComplete] = useState(false)
	const [searchCollection, setSearchCollection] = useState('')

	useEffect(() => {
		const onClickEv = (e) => {
			if (
				filterModalRef.current?.contains &&
				!filterModalRef.current.contains(e.target) &&
				filterModalRef.current.contains(e.target === '')
			) {
				setShowAutoComplete(true)
			} else {
				setShowAutoComplete(false)
			}
		}
		if (showAutoComplete) {
			document.body.addEventListener('click', onClickEv)
		}
		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showAutoComplete])

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

		if (value.length >= 3) {
			const resp = await axios.get(`${process.env.V2_API_URL}/collections`, {
				params: {
					creator_id: currentUser,
					collection_search: value,
				},
			})
			const searchColl = resp.data.data.results
			setSearchCollection(searchColl)
			setShowAutoComplete(false)
		} else {
			setSearchCollection('')
			setShowAutoComplete(true)
		}
	}

	const debounceAutoCompleteCollections = debounce(handleAutoCompleteCollections, 400)

	const onChangeAutoComplete = (event) => {
		debounceAutoCompleteCollections(event)
	}

	const debounceOnChange = debounce(onChangeAutoComplete, 200)

	return (
		<>
			<div className="flex border-gray-900 border-2 rounded-lg bg-gray-800 my-2">
				<IconSearch size={36} />
				<input
					id="search"
					name="q"
					type="search"
					value={router.query.search}
					onChange={(e) => debounceOnChange(e.target)}
					placeholder={localeLn('Search your collections')}
					className="p-1 pl-0 m-auto bg-transparent focus:bg-transparent border-none text-white text-base md:text-sm font-medium"
					style={{ WebkitAppearance: 'none' }}
					autoComplete="off"
				/>
				{showAutoComplete && (
					<div className="absolute mr-4 md:mr-0 z-20 mt-10 bg-gray-900 rounded-md w-80">
						<p className="my-4 px-1 text-sm text-center">Minimum three characters to search.</p>
					</div>
				)}
			</div>
			<div
				className="max-h-96 md:max-h-[22rem] 2xl:max-h-[30rem] overflow-y-scroll md:hide-scrollbar"
				id="collection::user"
			>
				<InfiniteScroll
					dataLength={collections.length}
					next={fetchCollectionUser}
					hasMore={hasMore}
					scrollableTarget="collection::user"
				>
					{collections.length > 0 ? (
						<CollectionItem
							collections={searchCollection ? searchCollection : collections}
							router={router}
							choosenCollection={choosenCollection}
							setChoosenCollection={setChoosenCollection}
						/>
					) : (
						<p className="text-white text-center mt-4">No Collections</p>
					)}
				</InfiniteScroll>
			</div>
		</>
	)
}

export default FilterAddCollection

const CollectionItem = ({ collections, choosenCollection, setChoosenCollection }) => {
	return collections.length > 0 ? (
		<div>
			{collections.map((value, idx) => {
				return (
					<div
						key={value.collection_id}
						onClick={() => setChoosenCollection(value)}
						className={`bg-gray-800 ${idx !== 0 && 'mt-3'} ${
							idx === collections.length - 1 && 'mb-3'
						} flex items-center rounded-md overflow-hidden cursor-pointer border-2 ${
							value.collection_id === choosenCollection.collection_id
								? 'border-white'
								: `border-gray-800`
						}`}
					>
						<div className="w-10 h-10 bg-primary flex-shrink-0">
							{value.media && (
								<img
									src={parseImgUrl(value.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
									})}
									className="w-10 h-10"
								/>
							)}
						</div>
						<div className="ml-3 text-sm truncate">{value.collection}</div>
					</div>
				)
			})}
		</div>
	) : (
		<p className="text-white text-center mt-4">Did not match any collections.</p>
	)
}
