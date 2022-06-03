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
import { parseImgUrl, parseSortQuery, setDataLocalStorage, parseSortTokenQuery } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useIntl } from 'hooks/useIntl'
import CollectionStats from 'components/Collection/CollectionStats'
import CollectionActivity from 'components/Collection/CollectionActivity'
import FilterAttribute from 'components/Filter/FilterAttribute'
import ArtistVerified from 'components/Common/ArtistVerified'
import { generateFromString } from 'generate-avatar'
import DeleteCollectionModal from 'components/Modal/DeleteCollectionModal'
import { sentryCaptureException } from 'lib/sentry'
import { useToast } from 'hooks/useToast'
import LineClampText from 'components/Common/LineClampText'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import ArtistBanned from 'components/Common/ArtistBanned'
import cachios from 'cachios'
import FilterDisplay from 'components/Filter/FilterDisplay'
import WalletHelper from 'lib/WalletHelper'
import ReactTooltip from 'react-tooltip'
import TokenList from 'components/Token/TokenList'
import CollectionSearch from 'components/Collection/CollectionSearch'
import { SHOW_TX_HASH_LINK } from 'constants/common'
import DailyTracker from 'components/LineChart/DailyTracker'
import Link from 'next/link'
import LoadingTracker from 'components/Common/LoadingTracker'

const LIMIT = 12
const LIMIT_ACTIVITY = 20

const CollectionPage = ({ collectionId, collection, serverQuery }) => {
	const currentUser = useStore((store) => store.currentUser)
	const router = useRouter()
	const { localeLn } = useIntl()

	const [attributes, setAttributes] = useState([])
	const [tokens, setTokens] = useState([])
	const [tokensOwned, setTokensOwned] = useState([])
	const [idNext, setIdNext] = useState(null)
	const [idNextOwned, setIdNextOwned] = useState(null)
	const [lowestPriceNext, setLowestPriceNext] = useState(null)
	const [lowestPriceNextOwned, setLowestPriceNextOwned] = useState(null)
	const [updatedAtNext, setUpdatedAtNext] = useState(null)
	const [activityPage, setActivityPage] = useState(0)
	const [stats, setStats] = useState({})
	const [activities, setActivities] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const [isFetchingOwned, setIsFetchingOwned] = useState(false)
	const [isFiltering, setIsFiltering] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [hasMoreActivities, setHasMoreActivities] = useState(true)
	const [hasMoreOwned, setHasMoreOwned] = useState(true)
	const [deleteModal, setDeleteModal] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const [dailyVolume, setDailyVolume] = useState([])
	const [dataNearTracker, setDataNearTracker] = useState([])
	const [dataTopOwnersTracker, setDataTopOwnersTracker] = useState([])
	const [isLoadingTracker, setIsLoadingTracker] = useState(false)
	const [isErrorTracker, setIsErrorTracker] = useState()
	const [display, setDisplay] = useState(
		(typeof window !== 'undefined' && window.localStorage.getItem('display')) || 'large'
	)
	const [scoreNext, setScoreNext] = useState('')
	const [mediaQueryMd, setMediaQueryMd] = useState(
		typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)')
	)
	const isItemActiveTab = router.query.tab === 'items' || router.query.tab === undefined

	const toast = useToast()

	const _fetchCollectionStats = async (initialFetch) => {
		if (initialFetch) {
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
			setAttributes(newAttributes)
			setStats(newStat)
		}
	}

	const fetchDataOwned = async (initialFetch) => {
		const _hasMore = initialFetch ? true : hasMoreOwned

		if (!_hasMore || isFetchingOwned || currentUser == null) {
			return
		}
		setIsFetchingOwned(true)
		const params = tokensParams({
			...(router.query || serverQuery),
			...(initialFetch
				? { owner_id: currentUser }
				: {
						_id_next: idNextOwned,
						price_next: lowestPriceNextOwned,
						owner_id: currentUser,
				  }),
		})

		const res = await axios(`${process.env.V2_API_URL}/token`, {
			params: params,
		})

		const newData = await res.data.data
		const newTokens = initialFetch ? [...newData.results] : [...tokensOwned, ...newData.results]
		setTokensOwned(newTokens)

		_fetchCollectionStats(initialFetch)

		if (newData.results.length < LIMIT) {
			setHasMoreOwned(false)
		} else {
			setHasMoreOwned(true)

			const lastData = newData.results[newData.results.length - 1]
			setIdNextOwned(lastData._id)
			params.__sort.includes('price') && setLowestPriceNextOwned(lastData.price)
			params.__sort.includes('metadata.score') && setScoreNext(lastData.metadata.score)
		}
		setIsFetchingOwned(false)
	}

	const fetchData = async (initialFetch = false) => {
		const _hasMore = initialFetch ? true : hasMore

		if (!_hasMore || isFetching) {
			return
		}
		setIsFetching(true)
		const params = tokensParams({
			...(router.query || serverQuery),
			...(initialFetch
				? {}
				: {
						_id_next: idNext,
						lowest_price_next: lowestPriceNext,
						updated_at_next: updatedAtNext,
						score_next: scoreNext,
				  }),
		})

		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})

		const newData = await res.data.data
		const newTokens = initialFetch ? [...newData.results] : [...tokens, ...newData.results]
		setTokens(newTokens)

		_fetchCollectionStats(initialFetch)

		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = newData.results[newData.results.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
			params.__sort.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
			params.__sort.includes('metadata.score') && setScoreNext(lastData.metadata.score)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: collection.collection,
		description: collection.description,
		image: parseImgUrl(collection.media, null, { useOriginal: true }),
		cover: parseImgUrl(collection.cover, null, { useOriginal: true }),
	}

	useEffect(() => {
		fetchData(true)
	}, [router.query.collection_id])

	useEffect(() => {
		updateFilter(router.query)
	}, [
		router.query.sort,
		router.query.pmin,
		router.query.pmax,
		router.query.card_trade_type,
		router.query.min_copies,
		router.query.max_copies,
		router.query.attributes,
		router.query.is_staked,
		router.query.q,
	])

	useEffect(() => {
		if (router.query.tab === 'activity') {
			fetchCollectionActivity(true)
			fetchCollectionDailyVolume()
		} else if (router.query.tab === 'owned' && currentUser !== null) {
			fetchDataOwned(true)
		} else if (router.query.tab === 'tracker') {
			fetchCollectionTracker()
		} else if (isItemActiveTab) {
			fetchData(true)
		}
	}, [router.query.tab, router.query.headerActivities, router.query.sortActivities, currentUser])

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

		let parsedSortQuery
		isItemActiveTab
			? (parsedSortQuery = query ? parseSortQuery(query.sort, true) : null)
			: (parsedSortQuery = query ? parseSortTokenQuery(query.sort) : null)

		params = {
			...params,
			collection_id: collectionId,
			exclude_total_burn: true,
			__limit: LIMIT,
			__sort: parsedSortQuery || '',
			...(isItemActiveTab && { lookup_token: true }),
			...(query.card_trade_type === 'notForSale' && { has_price: false }),
			...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
			...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
			...(query._id_next && { _id_next: query._id_next }),
			...(query.lowest_price_next &&
				parsedSortQuery.includes('lowest_price') && { lowest_price_next: query.lowest_price_next }),
			...(query.updated_at_next &&
				parsedSortQuery.includes('updated_at') && { updated_at_next: query.updated_at_next }),
			...(query.score_next &&
				parsedSortQuery.includes('metadata.score') && { score_next: query.score_next }),
			...(query.min_copies && { min_copies: query.min_copies }),
			...(query.max_copies && { max_copies: query.max_copies }),
			...(query.price_next &&
				parsedSortQuery.includes('price') && { price_next: query.price_next }),
			...(query.is_staked && { is_staked: query.is_staked }),
			...(router.query.tab === 'owned' && { owner_id: currentUser }),
			...(query.q && { search: query.q }),
		}
		if (query.pmin === undefined && query.card_trade_type === 'forSale') {
			delete params.min_price
		}

		return params
	}

	const activitiesParams = (_page = 0) => {
		const headerActivities = router.query.headerActivities
		const sortActivities = router.query.sortActivities
		const params =
			!sortActivities || sortActivities === ''
				? {
						collection_id: collectionId,
						filter: 'sale',
						__skip: _page * LIMIT_ACTIVITY,
						__limit: LIMIT_ACTIVITY,
				  }
				: {
						collection_id: collectionId,
						filter: 'sale',
						__skip: _page * LIMIT_ACTIVITY,
						__limit: LIMIT_ACTIVITY,
						__sort: `${headerActivities}${sortActivities === `asc` ? `::1` : `::-1`}`,
				  }

		return params
	}

	const updateFilter = async (query) => {
		let params, res
		setIsFiltering(true)
		if (isItemActiveTab) {
			params = tokensParams(query || serverQuery)
			res = await axios(`${process.env.V2_API_URL}/token-series`, {
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
				params.__sort.includes('metadata.score') && setScoreNext(lastData.metadata.score)
			}
		} else if (query.tab === 'owned' && currentUser !== null) {
			params = tokensParams({
				...(query || serverQuery),
				owner_id: currentUser,
			})
			res = await axios(`${process.env.V2_API_URL}/token`, {
				params: params,
			})
			setTokensOwned(res.data.data.results)
			if (res.data.data.results.length < LIMIT) {
				setHasMoreOwned(false)
			} else {
				setHasMoreOwned(true)

				const lastData = res.data.data.results[res.data.data.results.length - 1]
				setIdNextOwned(lastData._id)
				params.__sort.includes('price') && setLowestPriceNextOwned(lastData.lowest_price)
			}
		}
		setIsFiltering(false)
	}

	const fetchCollectionActivity = async (initialFetch = false) => {
		const _activityPage = initialFetch ? 0 : activityPage
		const _hasMoreActivities = initialFetch ? true : hasMoreActivities
		const activitiesData = initialFetch ? [] : activities

		if (!_hasMoreActivities) {
			return
		}

		const res = await axios.get(`${process.env.V2_API_URL}/collection-activities`, {
			params: activitiesParams(_activityPage),
		})

		const resActivities = (await res.data.data) || []

		const newActivities = [...activitiesData, ...resActivities]
		setActivities(newActivities)
		setActivityPage(_activityPage + 1)
		if (resActivities < LIMIT_ACTIVITY) {
			setHasMoreActivities(false)
		} else {
			setHasMoreActivities(true)
		}
	}

	const fetchCollectionDailyVolume = async () => {
		const res = await cachios.get(`${process.env.V2_API_URL}/collection-daily`, {
			params: {
				collection_id: collectionId,
			},
			ttl: 120,
		})

		const newDailyVolume = await res.data.data.volume_daily
		setDailyVolume(newDailyVolume)
	}

	const fetchCollectionTracker = async () => {
		setIsLoadingTracker(true)

		try {
			// NearTracker API
			const resNearTracker = await cachios.get(
				`https://api.degenwhale.club/paras-data/${collectionId}`
			)
			const resTopOwners = await cachios.get(
				`https://api.degenwhale.club/paras-data/top-holders/${collectionId}`
			)
			const newDataTracker = await resNearTracker.data
			const newDataTopOwners = await resTopOwners.data.top_holders
			setDataNearTracker(newDataTracker)
			setDataTopOwnersTracker(newDataTopOwners)
		} catch (error) {
			setIsErrorTracker(error)
		}

		setIsLoadingTracker(false)
	}

	const changeTab = (tab) => {
		tab === 'items' && (delete router.query.headerActivities, delete router.query.sortActivities)
		router.push(
			{
				query: {
					...router.query,
					tab: tab,
				},
			},
			{},
			{ shallow: true, scroll: false }
		)
	}

	const removeAttributeFilter = (index) => {
		const url = JSON.parse(router.query.attributes)
		url.splice(index, 1)
		router.push(
			{
				query: {
					...router.query,
					attributes: JSON.stringify(url),
				},
			},
			{},
			{ shallow: true, scroll: false }
		)
	}

	const removeAllAttributesFilter = () => {
		router.push(
			{
				query: {
					...router.query,
					attributes: `[]`,
				},
			},
			{},
			{ shallow: true, scroll: false }
		)
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
				Authorization: await WalletHelper.authToken(),
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

	const onClickDisplay = (typeDisplay) => {
		setDataLocalStorage('display', typeDisplay, setDisplay)
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
					{collection.cover === null && (
						<div className="absolute top-0 left-0 w-full h-36 md:h-72 bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-200 -z-10" />
					)}
					<div
						className="absolute top-0 left-0 w-full h-36 md:h-72 bg-center bg-cover bg-dark-primary-2"
						style={{
							backgroundImage: `url(${parseImgUrl(
								collection.cover ? collection.cover : collection.image
							)})`,
						}}
					/>
					<div className="absolute top-32 md:top-72 right-0 md:right-5 h-10 w-10">
						{SHOW_TX_HASH_LINK && tokens[0]?.contract_id && (
							<>
								<ReactTooltip place="left" type="dark" />
								<a
									data-tip="View Contract"
									href={`https://${
										process.env.APP_ENV === 'production' ? `` : `testnet.`
									}nearblocks.io/address/${tokens[0]?.contract_id}`}
									target={`_blank`}
									className="ml-1 mb-4"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="icon icon-tabler icon-tabler-external-link"
										width={mediaQueryMd.matches ? 30 : 25}
										height={mediaQueryMd.matches ? 30 : 25}
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="#fff"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
										<line x1={10} y1={14} x2={20} y2={4} />
										<polyline points="15 4 20 4 20 9" />
									</svg>
								</a>
							</>
						)}
					</div>
					<div
						className={`w-32 h-32 overflow-hidden ${
							headMeta.image === null ? 'bg-primary' : 'bg-dark-primary-2'
						} z-0 shadow-inner rounded-full mt-8 md:mt-44`}
					>
						<img
							src={parseImgUrl(
								collection?.media ||
									`data:image/svg+xml;utf8,${generateFromString(collection.collection_id)}`,
								{
									width: `300`,
								}
							)}
							className="w-full object-cover rounded-full border-4 border-black"
						/>
					</div>
				</div>
				<h1 className="text-4xl font-bold text-gray-100 text-center break-words">
					{collection?.collection}
				</h1>
				<div className="m-4 mt-0 text-center relative">
					<h4 className="text-xl md:flex justify-center text-gray-300 self-center break-words">
						<span>collection by</span>
						<span className="flex flex-row ml-1 justify-center">
							<ArtistVerified
								token={tokens?.[0] || { metadata: { creator_id: collection.creator_id } }}
							/>
						</span>
					</h4>
					<LineClampText
						className="text-gray-200 mt-4 max-w-lg m-auto whitespace-pre-line break-words"
						text={collection?.description}
					/>
					<div className="flex items-center justify-center space-x-2 w-6/12 mx-auto mt-4">
						{collection.socialMedia?.website && (
							<a
								href={
									!/^https?:\/\//i.test(collection?.socialMedia?.website)
										? 'http://' + collection?.socialMedia?.website
										: collection?.socialMedia?.website
								}
								className="mt-2 mb-4 flex justify-between border border-gray-700 p-3 md:p-4 rounded-md hover:border-gray-300 transition-all"
								target="_blank"
								rel="noreferrer"
							>
								<svg width="25" height="25" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
									<path
										fill="#cbd5e0"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
									/>
								</svg>
							</a>
						)}
						{collection.socialMedia?.twitter && (
							<a
								href={'https://twitter.com/' + collection?.socialMedia?.twitter}
								className="mt-2 mb-4 flex justify-between border border-gray-700 p-3 md:p-4 rounded-md hover:border-gray-300 transition-all"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									height="25"
									width="25"
									viewBox="0 0 273.5 222.3"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill="#cbd5e0"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
									></path>
								</svg>
							</a>
						)}
						{collection.socialMedia?.discord && (
							<a
								href={'https://discord.gg/' + collection?.socialMedia?.discord}
								className="mt-2 mb-4 flex justify-between border border-gray-700 p-3 md:p-4 rounded-md hover:border-gray-300 transition-all"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-brand-discord"
									width={25}
									height={25}
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#cbd5e0"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<circle cx={9} cy={12} r={1} />
									<circle cx={15} cy={12} r={1} />
									<path d="M7.5 7.5c3.5 -1 5.5 -1 9 0" />
									<path d="M7 16.5c3.5 1 6.5 1 10 0" />
									<path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5" />
									<path d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5" />
								</svg>
							</a>
						)}
					</div>
					<ArtistBanned
						creatorId={collection.creator_id}
						className="max-w-2xl mx-auto relative -mb-4"
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
							{!isFetching && tokens.length < 1 && window.location.search < 1 && (
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
				<div className="mb-4 md:mb-10 sm:my-2 flex flex-wrap items-center justify-center px-4">
					<CollectionStats stats={stats} />
				</div>
				<div className="flex items-center justify-center relative mb-6">
					<div className="flex justify-center mt-4 relative z-10">
						<div className="flex mx-4">
							<div className="px-4 relative" onClick={() => changeTab('items')}>
								<h4 className="text-gray-100 font-bold cursor-pointer">{localeLn('Items')}</h4>
								{isItemActiveTab && (
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
							{currentUser && (
								<div className="px-4 relative" onClick={() => changeTab('owned')}>
									<h4 className="text-gray-100 font-bold cursor-pointer">{localeLn('Owned')}</h4>
									{router.query.tab === 'owned' && (
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
							)}
							<div className="flex px-4 relative" onClick={() => changeTab('tracker')}>
								<h4 className="text-gray-100 font-bold cursor-pointer">{localeLn('Tracker')}</h4>
								{router.query.tab === 'tracker' && (
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
				</div>
				{(router.query.tab !== 'activity' || router.query.tab === undefined) &&
					router.query.tab !== 'tracker' && (
						<div
							className={`hidden sm:flex items-center mx-4 ${
								isItemActiveTab ? `justify-between` : `justify-end`
							}`}
						>
							{isItemActiveTab && (
								<div className="flex justify-center items-center relative z-10">
									<CollectionSearch collectionId={collectionId} />
								</div>
							)}
							<div className="flex">
								{Object.keys(attributes).length > 0 && (
									<FilterAttribute onClearAll={removeAllAttributesFilter} attributes={attributes} />
								)}
								{router.query.tab == 'owned' ? (
									<FilterMarket
										isShowVerified={false}
										defaultMinPrice={true}
										isCollection={true}
										isCollectibles={true}
										isShowStaked={true}
									/>
								) : (
									<FilterMarket isShowVerified={false} defaultMinPrice={true} isCollection={true} />
								)}
								<div className="hidden md:flex mt-0">
									<FilterDisplay type={display} onClickDisplay={onClickDisplay} />
								</div>
							</div>
						</div>
					)}
				<div className="flex lg:hidden mt-8 mx-4 justify-center sm:justify-end">
					{(router.query.tab !== 'activity' || router.query.tab === undefined) &&
						router.query.tab !== 'tracker' && (
							<div>
								{isItemActiveTab && (
									<div className="flex sm:hidden justify-center items-center relative z-10 mb-4">
										<CollectionSearch collectionId={collectionId} />
									</div>
								)}
								<div className="flex justify-around">
									<div className="flex sm:hidden">
										{Object.keys(attributes).length > 0 && (
											<FilterAttribute
												onClearAll={removeAllAttributesFilter}
												attributes={attributes}
											/>
										)}
										{router.query.tab == 'owned' ? (
											<FilterMarket
												isShowVerified={false}
												defaultMinPrice={true}
												isCollection={true}
												isCollectibles={true}
												isShowStaked={true}
											/>
										) : (
											<FilterMarket
												isShowVerified={false}
												defaultMinPrice={true}
												isCollection={true}
											/>
										)}
										<FilterDisplay type={display} onClickDisplay={onClickDisplay} />
									</div>
								</div>
							</div>
						)}
				</div>
				<div className="relative flex flex-row flex-wrap left-0 mx-5 mt-4">
					{router.query.attributes &&
						router.query.tab !== 'activity' &&
						router.query.tab !== 'tracker' &&
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
						<CardListLoader length={display === 'large' ? 12 : 18} displayType={display} />
					) : router.query.tab == 'activity' ? (
						<CollectionActivity
							activities={activities}
							dailyVolume={dailyVolume}
							fetchData={fetchCollectionActivity}
							hasMore={hasMoreActivities}
							collectionId={collectionId}
							querySort={router.query}
						/>
					) : router.query.tab == 'owned' ? (
						<TokenList
							name={collectionId}
							tokens={tokensOwned}
							fetchData={fetchDataOwned}
							hasMore={hasMoreOwned}
							displayType={display}
							showRarityScore={true}
						/>
					) : router.query.tab == 'tracker' ? (
						<>
							{isLoadingTracker ? (
								<LoadingTracker />
							) : isErrorTracker ? (
								<div className="text-center text-white my-20">
									<p className="text-lg">data not yet available from NearTracker</p>
									<p className="text-xs mt-4 hover:underline hover:underline-offset-2">
										<a href="https://tally.so/r/woqaOm" target="_blank" rel="noreferrer">
											Get listed on NearTracker!
										</a>
									</p>
								</div>
							) : (
								<div className="md:grid grid-cols-2">
									<div>
										<p className="text-white text-xl font-bold ml-2 mb-2 text-opacity-70">
											Floor Price
										</p>
										<DailyTracker data={dataNearTracker} title="Floor Price" value="floor_price" />
									</div>
									<div>
										<p className="text-white text-xl font-bold ml-2 mb-2 text-opacity-70">Owners</p>
										<DailyTracker data={dataNearTracker} title="Owners" value="owner_count" />
									</div>
									<div>
										<p className="text-white text-xl font-bold ml-2 mb-2 text-opacity-70">
											Token Listed
										</p>
										<DailyTracker
											data={dataNearTracker}
											title="Token Listed"
											value="listed_token_count"
										/>
									</div>
									<div>
										<p className="text-white text-xl font-bold ml-2 mb-2 text-opacity-70">
											Top Owners
										</p>
										<div className="overflow-y-auto no-scrollbar h-72">
											<div className="table w-11/12 text-white border-collapse ml-7">
												<div className="table-header-group border-b py-4">
													<div className="table-row font-bold">
														<div className="table-cell text-left px-3"></div>
														<div className="table-cell text-left">Wallet Address</div>
														<div className="table-cell text-center"># of tokens</div>
													</div>
												</div>
												<div className="table-row-group">
													{dataTopOwnersTracker.map((item, idx) => {
														return (
															<div
																key={idx}
																className="table-row hover:bg-[#231D58] hover:bg-opacity-40 border-b border-white border-opacity-15 p-10"
															>
																<div className="table-cell">{idx + 1}</div>
																<div className="table-cell py-2.5 md:py-3">
																	<Link href={`/${item?.wallet_id}`}>
																		<span className="hover:border-b-2 hover:cursor-pointer">
																			{item?.wallet_id?.length > 24
																				? item?.wallet_id?.substring(0, 22) + '...'
																				: item?.wallet_id}
																		</span>
																	</Link>
																</div>
																<div className="table-cell text-center">{item?.token_count}</div>
															</div>
														)
													})}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
							<a href={`https://neartracker.io/`} target="_blank" rel="noreferrer">
								<img
									src="/near-tracker.png"
									width={50}
									className="mx-auto cursor-pointer mt-6 mb-6"
								/>
							</a>
							<p className="text-center text-white">
								Powered by{' '}
								<Link href={`/collection/thebullishbulls.near`}>
									<span className="text-[#726DEF] hover:underline hover:underline-offset-2 cursor-pointer">
										Bullish Bulls
									</span>
								</Link>
							</p>
						</>
					) : (
						<CardList
							name="market"
							tokens={tokens}
							fetchData={fetchData}
							hasMore={hasMore}
							profileCollection={collection.media}
							type="collection"
							displayType={display}
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
	if (params.collection_id === 'x.paras.near') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

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
