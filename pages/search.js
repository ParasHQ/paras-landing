import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import Head from 'next/head'

import Nav from '../components/Nav'
import CardList from '../components/CardList'
import Footer from '../components/Footer'
import useStore from '../store'
import FilterMarket from '../components/FilterMarket'
import { parseSortQuery } from '../utils/common'

const LIMIT = 12

export default function SearchPage({ data, searchQuery }) {
	const store = useStore()
	const router = useRouter()
	const [tokens, setTokens] = useState(data.results)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const { query } = router

	useEffect(async () => {
		setIsRefreshing(true)
		const res = await axios(`${process.env.API_URL}/tokens`, {
			params: tokensParams(0, {
				...query,
				search: encodeURIComponent(query.q),
			}),
		})
		window.scrollTo(0, 0)
		setPage(1)
		setTokens(res.data.data.results)
		setHasMore(true)
		setIsRefreshing(false)
	}, [query.q, query.sort, query.pmin, query.pmax])

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
		const res = await axios(`${process.env.API_URL}/tokens`, {
			params: tokensParams(page, {
				...query,
				search: encodeURIComponent(query.q),
			}),
		})
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: `Search ${searchQuery} — Paras`,
		description: `Explore and collect ${searchQuery} digital art cards on Paras. All-in-one social digital art card marketplace for creators and collectors.`,
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
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
					<h1 className="text-3xl font-bold text-gray-100">Search Result</h1>
					<h4 className="text-xl font-semibold text-gray-300">
						<span className="opacity-75">for</span>{' '}
						<span className="border-b-2 border-gray-100">{searchQuery}</span>
					</h4>
				</div>
				<div className="flex justify-end">
					<FilterMarket />
				</div>
				<div className="mt-4 px-4">
					{isRefreshing ? (
						<div className="min-h-full border-2 border-dashed border-gray-800 rounded-md">
							<div className="w-full">
								<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
									<div className="w-40 m-auto">
										<img src="/cardstack.png" className="opacity-75" />
									</div>
									<p className="mt-4">Loading Cards</p>
								</div>
							</div>
						</div>
					) : (
						<CardList
							name="Search Result"
							tokens={tokens}
							fetchData={_fetchData}
							hasMore={hasMore}
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
		excludeTotalBurn: true,
		__sort: parseSortQuery(query.sort),
		__skip: _page * LIMIT,
		__limit: LIMIT,
		...(query.pmin && { minPrice: parseNearAmount(query.pmin) }),
		...(query.pmax && { maxPrice: parseNearAmount(query.pmax) }),
	}
	return params
}

export async function getServerSideProps({ query }) {
	const searchQuery = query.q

	const res = await axios(`${process.env.API_URL}/tokens`, {
		params: tokensParams(0, { q: encodeURIComponent(searchQuery) }),
	})
	const data = await res.data.data

	return { props: { data, searchQuery } }
}
