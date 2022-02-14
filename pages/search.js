import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import Head from 'next/head'

import Nav from 'components/Nav'
import CardList from 'components/TokenSeries/CardList'
import Footer from 'components/Footer'
import useStore from 'lib/store'
import FilterMarket from 'components/Filter/FilterMarket'
import { parseSortQuery } from 'utils/common'
import CardListLoader from 'components/Card/CardListLoader'
import { useIntl } from 'hooks/useIntl'
import PublicationListScroll from 'components/Publication/PublicationListScroll'
import CollectionList from 'components/Collection/CollectionList'

const LIMIT = 12

export default function SearchPage({ searchQuery }) {
	const { localeLn } = useIntl()
	const store = useStore()
	const router = useRouter()

	const [tokens, setTokens] = useState([])
	const [idNext, setIdNext] = useState(null)
	const [lowestPriceNext, setLowestPriceNext] = useState(null)
	const [updatedAtNext, setUpdatedAtNext] = useState(null)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(false)

	const [publication, setPublication] = useState([])
	const [pubPage, setPubPage] = useState(0)
	const [pubIsFetch, setPubIsFetch] = useState(false)
	const [pubHasMore, setPubHasMore] = useState(false)

	const [collections, setCollections] = useState([])
	const [collPage, setCollPage] = useState(0)
	const [collIsFetch, setCollIsFetch] = useState(false)
	const [collHasMore, setCollHasMore] = useState(false)

	const [isRefreshing, setIsRefreshing] = useState(false)
	const [activeTab, setActiveTab] = useState('card')

	const { query } = router

	useEffect(async () => {
		setIsRefreshing(true)
		window.scrollTo(0, 0)

		/** Tokens */
		const params = tokensParams(query)
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})
		if (res.data.data.results.length === LIMIT) {
			setHasMore(true)

			const lastData = res.data.data.results[res.data.data.results.length - 1]
			if (params.__sort) {
				setIdNext(lastData._id)
				params.__sort.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
				params.__sort.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
			}
		} else {
			setHasMore(false)
		}
		setTokens(res.data.data.results)

		/** Publication */
		const resPub = await axios(`${process.env.V2_API_URL}/publications`, {
			params: {
				search: query.q,
				__view: 'simple',
				__skip: 0,
				__limit: LIMIT,
			},
		})
		if (resPub.data.data.results.length === LIMIT) {
			setPubPage(1)
			setPubHasMore(true)
		} else {
			setPubHasMore(false)
		}
		setPublication(resPub.data.data.results)

		// Collection
		const resColl = await axios(`${process.env.V2_API_URL}/collections`, {
			params: {
				collection_search: query.q,
				__skip: 0,
				__limit: LIMIT,
				__sort: 'isCreator::-1',
				__showEmpty: false,
			},
		})
		if (resColl.data.data.results.length === LIMIT) {
			setCollPage(1)
			setCollHasMore(true)
		} else {
			setCollHasMore(false)
		}
		setCollections(resColl.data.data.results)

		setIsRefreshing(false)
	}, [
		query.q,
		query.sort,
		query.pmin,
		query.pmax,
		query.min_copies,
		query.max_copies,
		query.is_verified,
	])

	useEffect(() => {
		return () => {
			store.setMarketScrollPersist('Search Result', 0)
		}
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const params = tokensParams({
			...query,
			_id_next: idNext,
			lowest_price_next: lowestPriceNext,
			updated_at_next: updatedAtNext,
		})
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		setTokens(newTokens)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			const lastData = res.data.data.results[res.data.data.results.length - 1]
			setIdNext(lastData._id)
			setHasMore(true)
			params.__sort?.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
			params.__sort?.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
		}
		setIsFetching(false)
	}

	const _fetchPublicationData = async () => {
		if (!pubHasMore || pubIsFetch) {
			return
		}

		setPubIsFetch(true)
		const res = await axios(`${process.env.V2_API_URL}/publications`, {
			params: {
				search: query.q,
				__view: 'simple',
				__skip: pubPage * LIMIT,
				__limit: LIMIT,
			},
		})
		const newData = await res.data.data

		const newPub = [...publication, ...newData.results]
		setPublication(newPub)
		setPubPage(pubPage + 1)
		if (newData.results.length < LIMIT) {
			setPubHasMore(false)
		} else {
			setPubHasMore(true)
		}
		setPubIsFetch(false)
	}

	const _fetchCollectionData = async () => {
		if (!collHasMore || collIsFetch) return

		setCollIsFetch(true)
		const res = await axios(`${process.env.V2_API_URL}/collections`, {
			params: {
				collection_search: encodeURIComponent(query.q),
				__skip: collPage * LIMIT,
				__limit: LIMIT,
				__sort: 'isCreator::-1',
				__showEmpty: false,
			},
		})
		const newData = await res.data.data

		const newColl = [...collections, ...newData.results]
		setCollections(newColl)
		setCollPage(collPage + 1)
		if (newData.results.length < LIMIT) {
			setCollHasMore(false)
		} else {
			setCollHasMore(true)
		}
		setCollIsFetch(false)
	}

	const headMeta = {
		title: localeLn('Search{searchQuery}Paras', {
			searchQuery: searchQuery,
		}),
		description: `Explore and collect ${searchQuery} digital art cards on Paras. All-in-one social digital art card marketplace for creators and collectors.`,
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
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Search Result — Paras" />
				<meta property="og:site_name" content="Search Result — Paras" />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto py-12">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-100">{localeLn('SearchResult')}</h1>
					<h4 className="text-xl font-semibold text-gray-300">
						<span className="opacity-75">{localeLn('for')}</span>{' '}
						<span className="border-b-2 border-gray-100">{searchQuery}</span>
					</h4>
				</div>
				<div className="flex justify-between items-end h-12">
					<div className="flex">
						<div className="mx-4 relative" onClick={() => setActiveTab('card')}>
							<h4 className="text-gray-100 font-bold cursor-pointer text-lg">Cards</h4>
							{activeTab === 'card' && (
								<div className="absolute left-0 -bottom-1">
									<div className="mx-auto w-8 h-1 bg-gray-100 hover:w-full"></div>
								</div>
							)}
						</div>
						<div className="mx-4 relative" onClick={() => setActiveTab('collections')}>
							<h4 className="text-gray-100 font-bold cursor-pointer text-lg">Collections</h4>
							{activeTab === 'collections' && (
								<div className="absolute left-0 -bottom-1">
									<div className="mx-auto w-8 h-1 bg-gray-100"></div>
								</div>
							)}
						</div>
						<div className="mx-4 relative" onClick={() => setActiveTab('publication')}>
							<h4 className="text-gray-100 font-bold cursor-pointer text-lg">Publication</h4>
							{activeTab === 'publication' && (
								<div className="absolute left-0 -bottom-1">
									<div className="mx-auto w-8 h-1 bg-gray-100"></div>
								</div>
							)}
						</div>
					</div>
					<div className="justify-end mt-4 md:mt-0 hidden md:flex">
						{activeTab === 'card' && <FilterMarket />}
					</div>
				</div>
				<div className="flex md:hidden justify-end mt-4 md:mt-0">
					{activeTab === 'card' && <FilterMarket />}
				</div>
				<div className="mt-4">
					{activeTab === 'card' &&
						(isRefreshing ? (
							<div className="min-h-full px-4 md:px-0">
								<CardListLoader />
							</div>
						) : (
							<div className="px-4">
								<CardList
									name="Search Result"
									tokens={tokens}
									fetchData={_fetchData}
									hasMore={hasMore}
								/>
							</div>
						))}
					{activeTab === 'collections' && (
						<div className="px-4 md:px-0">
							<CollectionList
								data={collections}
								fetchData={_fetchCollectionData}
								hasMore={collHasMore}
							/>
						</div>
					)}
					{activeTab === 'publication' && (
						<PublicationListScroll
							data={publication}
							fetchData={_fetchPublicationData}
							hasMore={pubHasMore}
						/>
					)}
				</div>
			</div>
			<Footer />
		</div>
	)
}

const tokensParams = (query) => {
	const parsedSortQuery = parseSortQuery(query?.sort)
	const params = {
		search: query.q,
		exclude_total_burn: true,
		__sort: parsedSortQuery,
		__limit: LIMIT,
		_id_next: query._id_next,
		is_verified: typeof query.is_verified !== 'undefined' ? query.is_verified : true,
		...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
		...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
		...(query.lowest_price_next &&
			parsedSortQuery.includes('lowest_price') && { lowest_price_next: query.lowest_price_next }),
		...(query.updated_at_next &&
			parsedSortQuery.includes('updated_at') && { updated_at_next: query.updated_at_next }),
		...(query.min_copies && { min_copies: query.min_copies }),
		...(query.max_copies && { max_copies: query.max_copies }),
	}
	return params
}

export async function getServerSideProps({ query }) {
	const searchQuery = query.q || ''

	return { props: { searchQuery } }
}
