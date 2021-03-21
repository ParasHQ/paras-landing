import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import CardList from '../components/CardList'
import Head from 'next/head'
import Footer from '../components/Footer'
import useStore from '../store'
import FeaturedPostList from '../components/FeaturedPost'
import FilterMarket from '../components/FilterMarket'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { parseSortQuery } from '../utils/common'

const LIMIT = 6

export default function MarketPage({ data, featured }) {
	const store = useStore()
	const router = useRouter()

	const [tokens, setTokens] = useState(data.results)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(true)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		return () => {
			store.setMarketScrollPersist('market', 0)
		}
	}, [])

	useEffect(() => {
		updateFilter(router.query)
	}, [router.query.sort, router.query.pmin, router.query.pmax])

	const updateFilter = async (query) => {
		setIsFiltering(true)
		const res = await axios(`${process.env.API_URL}/tokens`, {
			params: tokensParams(0, query),
		})
		setPage(1)
		setTokens(res.data.data.results)
		setHasMore(true)
		setIsFiltering(false)
	}

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(`${process.env.API_URL}/tokens`, {
			params: tokensParams(page, router.query),
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

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Market — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Market — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Market — Paras" />
				<meta property="og:site_name" content="Market — Paras" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto py-12">
				<FeaturedPostList post={featured} />
				<div className="flex justify-end mb-4">
					<h1 className="absolute inset-x-0 text-4xl font-bold text-gray-100 text-center">
						Market
					</h1>
					<div className="z-10">
						<FilterMarket />
					</div>
				</div>
				<div className="mt-4 px-4">
					{isFiltering ? (
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
							name="market"
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
	const marketRes = await axios(`${process.env.API_URL}/tokens`, {
		params: tokensParams(0, query),
	})
	const featuredRes = await axios(`${process.env.API_URL}/features`)

	return {
		props: {
			data: marketRes.data.data,
			featured: featuredRes.data.data.results,
		},
	}
}
