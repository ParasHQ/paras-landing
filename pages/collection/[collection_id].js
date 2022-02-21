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
import ArtistBanned from 'components/Common/ArtistBanned'

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
			lookup_token: true,
			...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
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

		const resActivities = (await res.data.data) || []

		const newActivities = [...activities, ...resActivities]
		setActivities(newActivities)
		setActivityPage(activityPage + 1)
		if (resActivities < LIMIT_ACTIVITY) {
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
					<div className="flex items-center justify-center space-x-2">
						{collection?.website && (
							<a
								href={
									!/^https?:\/\//i.test(collection?.website)
										? 'http://' + collection?.website
										: collection?.website
								}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
									<path
										fill="#cbd5e0"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
									/>
								</svg>
							</a>
						)}
						{collection?.instagramId && (
							<a
								href={'https://instagram.com/' + collection?.instagramId}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									viewBox="0 0 511 511.9"
									height="16"
									width="16"
									fill="#cbd5e0"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0" />
									<path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0" />
									<path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0" />
								</svg>
							</a>
						)}
						{collection?.twitterId && (
							<a
								href={'https://twitter.com/' + collection?.twitterId}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									height="18"
									width="18"
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
						{collection?.weiboUrl && (
							<a
								href={
									!/^https?:\/\//i.test(collection?.weiboUrl)
										? 'http://' + collection?.weiboUrl
										: collection?.weiboUrl
								}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.93164 10.6056C7.60156 10.2599 6.09961 10.922 5.52148 12.0939C4.93359 13.2892 5.50195 14.6153 6.8457 15.0489C8.23633 15.4982 9.87695 14.8107 10.4473 13.5196C11.0078 12.2579 10.3066 10.961 8.93164 10.6056V10.6056ZM7.91602 13.6564C7.64648 14.088 7.06641 14.2755 6.63086 14.0782C6.20117 13.8829 6.07422 13.381 6.3457 12.961C6.61328 12.5431 7.17187 12.3556 7.60352 12.5372C8.04102 12.7228 8.18164 13.2208 7.91602 13.6564V13.6564ZM8.80469 12.5138C8.70703 12.6818 8.49023 12.7618 8.32227 12.6915C8.15625 12.6232 8.10352 12.4357 8.19727 12.2716C8.29492 12.1075 8.50195 12.0294 8.66797 12.0939C8.83789 12.1564 8.89844 12.3458 8.80469 12.5138V12.5138ZM15.3379 8.66222C15.6309 8.75597 15.9434 8.59581 16.0391 8.3048C16.2695 7.58995 16.125 6.77355 15.5859 6.17589C15.33 5.89231 15.004 5.6811 14.6406 5.5635C14.2771 5.4459 13.8891 5.42606 13.5156 5.50597C13.4442 5.52116 13.3764 5.5503 13.3162 5.59172C13.256 5.63314 13.2046 5.68602 13.1648 5.74734C13.1251 5.80865 13.0979 5.87721 13.0847 5.94907C13.0715 6.02093 13.0726 6.09469 13.0879 6.16613C13.1032 6.23749 13.1324 6.30514 13.1738 6.3652C13.2153 6.42525 13.2682 6.47652 13.3296 6.51608C13.3909 6.55564 13.4594 6.5827 13.5312 6.59571C13.6031 6.60872 13.6767 6.60743 13.748 6.59191C14.1074 6.51574 14.4961 6.62706 14.7617 6.91808C14.8871 7.05667 14.9736 7.22599 15.0124 7.40884C15.0512 7.59169 15.0408 7.78154 14.9824 7.9591C14.9594 8.02859 14.9503 8.10196 14.9558 8.17497C14.9612 8.24799 14.981 8.31921 15.014 8.38455C15.047 8.44989 15.0926 8.50806 15.1482 8.55571C15.2038 8.60336 15.2683 8.63956 15.3379 8.66222V8.66222ZM17.2871 4.63878C16.1797 3.41027 14.5449 2.94152 13.0352 3.26183C12.952 3.2794 12.8732 3.31323 12.8033 3.36139C12.7333 3.40954 12.6735 3.47105 12.6274 3.5424C12.5813 3.61374 12.5497 3.6935 12.5346 3.77708C12.5194 3.86066 12.5209 3.94642 12.5391 4.02941C12.5567 4.11252 12.5906 4.19133 12.6388 4.26134C12.6869 4.33136 12.7484 4.3912 12.8197 4.43745C12.891 4.4837 12.9706 4.51545 13.0542 4.5309C13.1378 4.54634 13.2235 4.54517 13.3066 4.52745C14.3809 4.29894 15.541 4.63292 16.3301 5.50597C17.1172 6.37902 17.3301 7.57042 16.9941 8.61339C16.8848 8.95324 17.0703 9.31652 17.4102 9.42785C17.75 9.53722 18.1133 9.35167 18.2227 9.01378V9.01183C18.6934 7.53917 18.3965 5.86535 17.2871 4.63878V4.63878ZM14.2383 9.7462C14 9.67589 13.8379 9.62706 13.9629 9.31456C14.2324 8.63683 14.2598 8.05089 13.9688 7.63488C13.4219 6.85167 11.9219 6.89464 10.2031 7.61339C10.2031 7.61339 9.66406 7.84972 9.80078 7.42199C10.0645 6.57238 10.0254 5.86144 9.61328 5.44933C8.68164 4.51574 6.20312 5.48449 4.07617 7.60949C2.48633 9.20128 1.5625 10.8888 1.5625 12.3478C1.5625 15.1388 5.14062 16.836 8.64258 16.836C13.2324 16.836 16.2852 14.17 16.2852 12.0509C16.2852 10.7716 15.207 10.047 14.2383 9.7462ZM8.65234 15.836C5.85938 16.1114 3.44727 14.8497 3.26562 13.0138C3.08398 11.1798 5.20312 9.46886 7.99609 9.19347C10.7891 8.91613 13.2012 10.1798 13.3828 12.0138C13.5625 13.8478 11.4453 15.5587 8.65234 15.836Z"
										fill="white"
									/>
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
				<div className="mb-10 sm:my-2 flex flex-wrap items-center justify-center px-4">
					<CollectionStats stats={stats} />
				</div>
				<div className="z-20 flex items-center justify-center relative">
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
