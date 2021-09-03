import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import CardList from '../components/CardList'
import Head from 'next/head'
import Footer from '../components/Footer'
import useStore from '../lib/store'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { parseSortQuery } from '../utils/common'
import CardListLoader from '../components/CardListLoader'
import CategoryList from '../components/CategoryList'

const LIMIT = 12

export default function MarketPage() {
	const store = useStore()
	const router = useRouter()

	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(true)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		getCategory()
		return () => {
			store.setMarketScrollPersist('market', 0)
		}
	}, [])

	useEffect(() => {
		updateFilter(router.query)
	}, [router.query.sort, router.query.pmin, router.query.pmax])

	const updateFilter = async (query) => {
		setIsFiltering(true)
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(0, query),
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

	const getCategory = async () => {
		const res = await axios(`${process.env.API_URL}/categories`)
		store.setCardCategory(res.data.data.results)
	}

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}
		setIsFetching(true)
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(page, router.query),
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

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-50"
				style={{
					zIndex: 0,
					backgroundImage: `url('./bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
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
				<div className="flex justify-center mb-4">
					<h1 className="text-4xl font-bold text-gray-100 text-center">
						Market
					</h1>
				</div>
				<CategoryList listCategory={store.cardCategory} />
				<div className="mt-4 px-4">
					{isFiltering ? (
						<div className="min-h-full border-2 border-dashed border-gray-800 rounded-md">
							<CardListLoader />
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
		exclude_total_burn: true,
		__sort: parseSortQuery(query.sort),
		__skip: _page * LIMIT,
		__limit: LIMIT,
		...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
		...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
	}
	return params
}
