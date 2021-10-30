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

const LIMIT = 12

export default function SearchPage({ searchQuery }) {
	const { localeLn } = useIntl()
	const store = useStore()
	const router = useRouter()

	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(false)

	const [publication, setPublication] = useState([])
	const [pubPage, setPubPage] = useState(0)
	const [pubIsFetch, setPubIsFetch] = useState(false)
	const [pubHasMore, setPubHasMore] = useState(false)

	const [isRefreshing, setIsRefreshing] = useState(false)
	const [activeTab, setActiveTab] = useState('card')

	const { query } = router

	useEffect(async () => {
		setIsRefreshing(true)
		window.scrollTo(0, 0)

		/** Tokens */
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(0, {
				...query,
				search: encodeURIComponent(query.q),
			}),
		})
		if (res.data.data.results.length === LIMIT) {
			setPage(1)
			setHasMore(true)
		}
		setTokens(res.data.data.results)

		/** Publication */
		const resPub = await axios(`${process.env.V2_API_URL}/publications`, {
			params: {
				search: encodeURIComponent(query.q),
				__view: 'simple',
				__skip: 0,
				__limit: LIMIT,
			},
		})
		if (resPub.data.data.results.length === LIMIT) {
			setPubPage(1)
			setPubHasMore(true)
		}
		setPublication(resPub.data.data.results)

		setIsRefreshing(false)
	}, [query.q, query.sort, query.pmin, query.pmax, query.is_verified])

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
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(page, {
				...query,
				search: encodeURIComponent(query.q),
			}),
		})
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
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
				search: encodeURIComponent(query.q),
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
					{activeTab === 'card' && <FilterMarket />}
				</div>
				<div className="mt-4">
					{activeTab === 'card' &&
						(isRefreshing ? (
							<div className="min-h-full border-2 border-dashed border-gray-800 rounded-md">
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

const tokensParams = (_page = 0, query) => {
	const params = {
		search: query.q,
		exclude_total_burn: true,
		__sort: parseSortQuery(query.sort),
		__skip: _page * LIMIT,
		__limit: LIMIT,
		is_verified: typeof query.is_verified !== 'undefined' ? query.is_verified : true,
		...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
		...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
	}
	return params
}

export async function getServerSideProps({ query }) {
	const searchQuery = query.q

	return { props: { searchQuery } }
}
