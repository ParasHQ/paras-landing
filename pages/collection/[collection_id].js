import axios from 'axios'
import CardList from 'components/TokenSeries/CardList'
import CardListLoader from 'components/Card/CardListLoader'
import Button from 'components/Common/Button'
import FilterMarket from 'components/Filter/FilterMarket'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { parseImgUrl, parseSortQuery } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useIntl } from 'hooks/useIntl'
import CollectionStats from 'components/Collection/CollectionStats'
import CollectionActivity from 'components/Collection/CollectionActivity'
import FilterAttribute from 'components/Filter/FilterAttribute'
import ReactLinkify from 'react-linkify'

const LIMIT = 8
const LIMIT_ACTIVITY = 20

const CollectionPage = ({ collectionId, collection, serverQuery }) => {
	const currentUser = useStore((store) => store.currentUser)
	const router = useRouter()
	const { localeLn } = useIntl()

	const [attributes, setAttributes] = useState([])
	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [activityPage, setActivityPage] = useState(0)
	const [stats, setStats] = useState({})
	const [activities, setActivities] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [hasMoreActivities, setHasMoreActivities] = useState(true)

	const fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}
		setIsFetching(true)
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(page, router.query || serverQuery),
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
		setPage(page + 1)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
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
	}, [router.query.sort, router.query.pmin, router.query.pmax, router.query.attributes])

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

	const tokensParams = (_page = 0, query) => {
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

		params = {
			...params,
			collection_id: collectionId,
			exclude_total_burn: true,
			__skip: _page * LIMIT,
			__limit: LIMIT,
			__sort: query ? parseSortQuery(query.sort) : null,
			...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
			...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
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
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(0, query || serverQuery),
		})
		setPage(1)
		setTokens(res.data.data.results)
		if (res.data.data.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
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
			<div className="max-w-6xl relative m-auto py-12">
				<div className="flex items-center m-auto justify-center mb-4">
					<div className="w-32 h-32 overflow-hidden bg-primary shadow-inner">
						<img
							src={parseImgUrl(collection?.media, null, {
								width: `300`,
							})}
							className="w-full object-cover"
						/>
					</div>
				</div>
				<h1 className="text-4xl font-bold text-gray-100 mx-4 text-center">
					{collection?.collection}
				</h1>
				<div className="m-4 mt-0 text-center relative">
					<h4 className="text-xl text-gray-300 self-center">
						<span>
							collection by{' '}
							<span className="font-semibold">
								<Link href={`/${collection?.creator_id}/creation`}>
									<a className="font-semibold text-white border-b-2 border-transparent hover:border-white">
										{collection?.creator_id}
									</a>
								</Link>
							</span>
						</span>
					</h4>
					<ReactLinkify
						componentDecorator={(decoratedHref, decoratedText, key) => (
							<a target="blank" href={decoratedHref} key={key}>
								{decoratedText}
							</a>
						)}
					>
						<p className="text-gray-200 mt-4 max-w-lg m-auto whitespace-pre-line break-words">
							{collection?.description?.replace(/\n\s*\n\s*\n/g, '\n\n')}
						</p>
					</ReactLinkify>
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
							{Object.keys(attributes).length > 0 && <FilterAttribute attributes={attributes} />}
							<FilterMarket isShowVerified={false} />
						</div>
					)}
					{(router.query.tab === 'items' || router.query.tab === undefined) && (
						<div className="hidden sm:flex md:ml-8 z-10 items-center justify-end right-0 absolute w-full">
							<div className="flex justify-center mt-4">
								<div className="flex">
									{Object.keys(attributes).length > 0 && (
										<FilterAttribute attributes={attributes} />
									)}
									<FilterMarket isShowVerified={false} />
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
										className="flex-grow rounded-md px-2 py-2 mr-2 my-1 border-2 border-gray-800 bg-blue-400 bg-opacity-10 text-sm cursor-pointer group hover:border-gray-700"
									>
										<span className=" text-gray-200">{Object.values(type)[0]}</span>{' '}
										<span className="font-extralight text-gray-600 text-lg ml-1 group-hover:text-gray-500">
											X
										</span>
									</button>
								</div>
							)
						})}
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
						<CardList name="market" tokens={tokens} fetchData={fetchData} hasMore={hasMore} />
					)}
				</div>
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

	return {
		props: {
			collectionId: params.collection_id,
			collection: resp.data.data.results[0],
			serverQuery: params,
		},
	}
}
