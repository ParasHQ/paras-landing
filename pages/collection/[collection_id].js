import axios from 'axios'
import CardList from 'components/TokenSeries/CardList'
import CardListLoader from 'components/Card/CardListLoader'
import Button from 'components/Common/Button'
import FilterMarket from 'components/Filter/FilterMarket'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { parseImgUrl, parseSortQuery } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useIntl } from 'hooks/useIntl'
import CollectionStats from 'components/Collection/CollectionStats'
import CollectionActivity from 'components/Collection/CollectionActivity'
import FilterAttribute from 'components/Filter/FilterAttribute'
import ArtistVerified from 'components/Common/ArtistVerified'
import { generateFromString } from 'generate-avatar'
import DeleteCollectionModal from 'components/Modal/DeleteCollectionModal'
import near from 'lib/near'
import { sentryCaptureException } from 'lib/sentry'
import { useToast } from 'hooks/useToast'
import LineClampText from 'components/Common/LineClampText'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'

const LIMIT = 8
const LIMIT_ACTIVITY = 20

const CollectionPage = ({ collectionId, collection, serverQuery }) => {
	const currentUser = useStore((store) => store.currentUser)
	const router = useRouter()
	const { localeLn } = useIntl()

	const [attributes, setAttributes] = useState([])
	const [tokens, setTokens] = useState([])
	const [idNext, setIdNext] = useState(null)
	const [lowestPriceNext, setLowestPriceNext] = useState(null)
	const [updatedAtNext, setUpdatedAtNext] = useState(null)
	const [activityPage, setActivityPage] = useState(0)
	const [stats, setStats] = useState({})
	const [activities, setActivities] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [hasMoreActivities, setHasMoreActivities] = useState(true)
	const [deleteModal, setDeleteModal] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const toast = useToast()

	const fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}
		setIsFetching(true)
		const params = tokensParams({
			...(router.query || serverQuery),
			_id_next: idNext,
			lowest_price_next: lowestPriceNext,
			updated_at_next: updatedAtNext,
		})

		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})

		const stat = await axios(`${process.env.V2_API_URL}/collection-stats`, {
			params: {
				collection_id: collectionId,
			},
		})

		const attributes = await axios(`${process.env.V2_API_URL}/collection-attributes`, {
			params: {
				collection_id: collectionId,
			},
		})

		const newAttributes = await attributes.data.data.results
		const newStat = await stat.data.data.results
		const newData = await res.data.data
		const newTokens = [...tokens, ...newData.results]
		setAttributes(newAttributes)
		setStats(newStat)
		setTokens(newTokens)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = newData.results[newData.results.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
			params.__sort.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: collection.collection,
		description: collection.description,
		image: parseImgUrl(collection.media, null, { useOriginal: true }),
	}

	useEffect(() => {
		fetchData()
	}, [])

	useEffect(() => {
		updateFilter(router.query)
	}, [
		router.query.sort,
		router.query.pmin,
		router.query.pmax,
		router.query.min_copies,
		router.query.max_copies,
		router.query.attributes,
	])

	useEffect(() => {
		if (router.query.tab === 'activity') {
			fetchCollectionActivity()
		}
	}, [router.query.tab])

	const editCollection = () => {
		router.push(`/collection/edit/${collectionId}`)
	}

	const addCard = () => {
		router.push('/new')
	}

	const tokensParams = (query) => {
		let params = {}
		if (query.attributes) {
			const attributesQuery = JSON.parse(query.attributes)
			attributesQuery.map((item) => {
				const typeAttribute = Object.keys(item)[0]
				const type = `attributes[${Object.keys(item)[0]}]`
				const value = item[typeAttribute]

				if (params[type]) {
					params[type] += `||${value}`
				} else {
					params[type] = value
				}
			})
		}

		const parsedSortQuery = query ? parseSortQuery(query.sort, true) : null
		params = {
			...params,
			collection_id: collectionId,
			exclude_total_burn: true,
			__limit: LIMIT,
			__sort: parsedSortQuery,
			...(query.pmin ? { min_price: parseNearAmount(query.pmin) } : { min_price: 0 }),
			...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
			...(query._id_next && { _id_next: query._id_next }),
			...(query.lowest_price_next &&
				parsedSortQuery.includes('lowest_price') && { lowest_price_next: query.lowest_price_next }),
			...(query.updated_at_next &&
				parsedSortQuery.includes('updated_at') && { updated_at_next: query.updated_at_next }),
			...(query.min_copies && { min_copies: query.min_copies }),
			...(query.max_copies && { max_copies: query.max_copies }),
		}
		if (query.pmin === undefined && query.is_notforsale === 'false') {
			delete params.min_price
		}

		return params
	}

	const activitiesParams = (_page = 0) => {
		const params = {
			collection_id: collectionId,
			filter: 'sale',
			__skip: _page * LIMIT_ACTIVITY,
			__limit: LIMIT_ACTIVITY,
		}

		return params
	}

	const updateFilter = async (query) => {
		setIsFiltering(true)
		const params = tokensParams(query || serverQuery)
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})

		setTokens(res.data.data.results)
		if (res.data.data.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = res.data.data.results[res.data.data.results.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
			params.__sort.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
		}

		setIsFiltering(false)
	}

	const fetchCollectionActivity = async () => {
		if (!hasMoreActivities) {
			return
		}

		const res = await axios.get(`${process.env.V2_API_URL}/collection-activities`, {
			params: activitiesParams(activityPage),
		})

		const newActivities = [...activities, ...res.data.data]
		setActivities(newActivities)
		setActivityPage(activityPage + 1)
		if (res.data.data.length < LIMIT_ACTIVITY) {
			setHasMoreActivities(false)
		} else {
			setHasMoreActivities(true)
		}
	}

	const changeTab = (tab) => {
		router.push({
			query: {
				...router.query,
				tab: tab,
			},
		})
	}

	const removeAttributeFilter = (index) => {
		const url = JSON.parse(router.query.attributes)
		url.splice(index, 1)
		router.push({
			query: {
				...router.query,
				attributes: JSON.stringify(url),
			},
		})
	}

	const removeAllAttributesFilter = () => {
		router.push({
			query: {
				...router.query,
				attributes: `[]`,
			},
		})
	}

	const onShowDeleteModal = () => {
		setDeleteModal((prev) => !prev)
	}

	const onDelete = async () => {
		const formData = new FormData()
		formData.append('creator_id', currentUser)
		formData.append('collection_id', collectionId)
		const options = {
			method: 'DELETE',
			url: `${process.env.V2_API_URL}/collections`,
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: await near.authToken(),
			},
			data: formData,
		}
		setDeleteLoading(true)
		try {
			const resp = await axios.request(options)
			if (resp) {
				setDeleteModal(false)
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{localeLn(`DeleteSuccess`)}</div>
					),
					type: 'success',
					duration: 1000,
				})
				setTimeout(() => {
					router.push(`/${currentUser}/collections`)
				}, 1000)
			}
			setDeleteLoading(false)
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || `${localeLn(`DeleteFailed`)}`
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 1000,
			})
			setDeleteLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{headMeta.title}</title>
				<meta name="description" content={headMeta.description} />

				<meta name="twitter:title" content={headMeta.title} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta name="twitter:description" content={headMeta.description} />
				<meta name="twitter:image" content={headMeta.image} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={headMeta.title} />
				<meta property="og:site_name" content={headMeta.title} />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta property="og:image" content={headMeta.image} />
			</Head>
			<Nav />
			<DeleteCollectionModal
				show={deleteModal}
				onClose={onShowDeleteModal}
				onSubmit={onDelete}
				loading={deleteLoading}
			/>
			<div className="max-w-6xl relative m-auto py-12">
				<div className="flex items-center m-auto justify-center mb-4">
					<div className="w-32 h-32 overflow-hidden bg-primary shadow-inner">
						<img
							src={parseImgUrl(
								collection?.media ||
									`data:image/svg+xml;utf8,${generateFromString(collection.collection_id)}`,
								{
									width: `300`,
								}
							)}
							className="w-full object-cover"
						/>
					</div>
				</div>
				<h1 className="text-4xl font-bold text-gray-100 mx-4 text-center break-words">
					{collection?.collection}
				</h1>
				<div className="m-4 mt-0 text-center relative">
					<h4 className="text-xl flex justify-center text-gray-300 self-center break-words">
						<span>collection by</span>
						<span className="flex flex-row ml-1">
							<ArtistVerified
								token={tokens?.[0] || { metadata: { creator_id: collection.creator_id } }}
							/>
						</span>
					</h4>
					<LineClampText
						className="text-gray-200 mt-4 max-w-lg m-auto whitespace-pre-line break-words"
						text={collection?.description}
					/>
					{currentUser === collection.creator_id && (
						<div className="flex flex-row space-x-2 max-w-xs m-auto mt-4">
							<Button onClick={addCard} size="md" className="w-40 m-auto">
								Add Card
							</Button>
							<Button
								onClick={editCollection}
								variant="secondary"
								size="md"
								className="w-40 m-auto"
							>
								Edit
							</Button>
							{!isFetching && tokens.length < 1 && (
								<div className="cursor-pointer flex items-center" onClick={onShowDeleteModal}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="icon icon-tabler icon-tabler-trash"
										width={30}
										height={30}
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="#ff2825"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<line x1={4} y1={7} x2={20} y2={7} />
										<line x1={10} y1={11} x2={10} y2={17} />
										<line x1={14} y1={11} x2={14} y2={17} />
										<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
										<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
									</svg>
								</div>
							)}
						</div>
					)}
				</div>
				<div className="mb-10 sm:my-2 flex items-center justify-center">
					<CollectionStats stats={stats} />
				</div>
				<div className="z-10 flex items-center justify-center relative">
					<div className="flex justify-center mt-4 relative z-20">
						<div className="flex mx-4">
							<div className="px-4 relative" onClick={() => changeTab('items')}>
								<h4 className="text-gray-100 font-bold cursor-pointer">{localeLn('Items')}</h4>
								{(router.query.tab === 'items' || router.query.tab === undefined) && (
									<div
										className="absolute left-0 right-0"
										style={{
											bottom: `-.25rem`,
										}}
									>
										<div className="mx-auto w-8 h-1 bg-gray-100"></div>
									</div>
								)}
							</div>
							<div className="px-4 relative" onClick={() => changeTab('activity')}>
								<h4 className="text-gray-100 font-bold cursor-pointer">{localeLn('Activity')}</h4>
								{router.query.tab === 'activity' && (
									<div
										className="absolute left-0 right-0"
										style={{
											bottom: `-.25rem`,
										}}
									>
										<div className="mx-auto w-8 h-1 bg-gray-100"></div>
									</div>
								)}
							</div>
						</div>
					</div>
					{(router.query.tab === 'items' || router.query.tab === undefined) && (
						<div className="flex sm:hidden">
							{Object.keys(attributes).length > 0 && (
								<FilterAttribute onClearAll={removeAllAttributesFilter} attributes={attributes} />
							)}
							<FilterMarket isShowVerified={false} defaultMinPrice={true} />
						</div>
					)}
					{(router.query.tab === 'items' || router.query.tab === undefined) && (
						<div className="hidden sm:flex md:ml-8 z-10 items-center justify-end right-0 absolute w-full">
							<div className="flex justify-center mt-4">
								<div className="flex">
									{Object.keys(attributes).length > 0 && (
										<FilterAttribute
											onClearAll={removeAllAttributesFilter}
											attributes={attributes}
										/>
									)}
									<FilterMarket isShowVerified={false} defaultMinPrice={true} />
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="relative flex flex-row flex-wrap left-0 ml-5 mt-5 ">
					{router.query.attributes &&
						router.query.tab !== 'activity' &&
						JSON.parse(router.query.attributes).map((type, index) => {
							return (
								<div key={index}>
									<button
										onClick={() => removeAttributeFilter(index)}
										className="flex-grow rounded-md px-4 py-1 mr-2 my-1 border-2 border-gray-800 bg-blue-400 bg-opacity-10 text-sm cursor-pointer group hover:border-gray-700"
									>
										<span className=" text-gray-500 font-bold">{Object.keys(type)[0] + ' : '}</span>{' '}
										<span className=" text-gray-200">{Object.values(type)[0]}</span>{' '}
										<span className="font-extralight text-gray-600 text-lg ml-1 group-hover:text-gray-500">
											x
										</span>
									</button>
								</div>
							)
						})}
					{router.query.attributes && JSON.parse(router.query.attributes)?.length > 1 && (
						<div
							className=" text-gray-400 hover:text-opacity-70 cursor-pointer my-1 flex items-center"
							onClick={removeAllAttributesFilter}
						>
							Clear All
						</div>
					)}
				</div>
				<div className="mt-4 px-4">
					{isFiltering ? (
						<CardListLoader />
					) : router.query.tab == 'activity' ? (
						<CollectionActivity
							activities={activities}
							fetchData={fetchCollectionActivity}
							hasMore={hasMoreActivities}
						/>
					) : (
						<CardList
							name="market"
							tokens={tokens}
							fetchData={fetchData}
							hasMore={hasMore}
							profileCollection={collection.media}
							type="collection"
						/>
					)}
				</div>
				<ButtonScrollTop />
			</div>
			<Footer />
		</div>
	)
}

export default CollectionPage

export async function getServerSideProps({ params }) {
	const resp = await axios.get(`${process.env.V2_API_URL}/collections`, {
		params: {
			collection_id: params.collection_id,
		},
	})

	if (!resp.data.data.results[0]) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			collectionId: params.collection_id,
			collection: resp.data.data.results[0],
			serverQuery: params,
		},
	}
}
