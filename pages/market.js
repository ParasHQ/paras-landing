import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Nav from 'components/Nav'
import CardList from 'components/TokenSeries/CardList'
import Head from 'next/head'
import Footer from 'components/Footer'
import useStore from 'lib/store'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { parseSortQuery } from 'utils/common'
import CardListLoader from 'components/Card/CardListLoader'
import CategoryList from 'components/CategoryList'
import { useIntl } from 'hooks/useIntl'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import FilterMarket from 'components/Filter/FilterMarket'

const LIMIT = 12

function MarketPage({ serverQuery }) {
	const store = useStore()
	const router = useRouter()

	const [tokens, setTokens] = useState([])
	const [idNext, setIdNext] = useState(null)
	const [lowestPriceNext, setLowestPriceNext] = useState(null)
	const [updatedAtNext, setUpdatedAtNext] = useState(null)
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(true)
	const [hasMore, setHasMore] = useState(true)
	const { localeLn } = useIntl()
	useEffect(() => {
		getCategory()
		return () => {
			store.setMarketScrollPersist('market', 0)
		}
	}, [])

	useEffect(() => {
		updateFilter(router.query)
	}, [router.query.sort, router.query.pmin, router.query.pmax, router.query.is_verified])

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

	const getCategory = async () => {
		const res = await axios(`${process.env.V2_API_URL}/categories`)
		store.setCardCategory(res.data.data.results)
	}

	const _fetchData = async () => {
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
		const newData = await res.data.data
		const newTokens = [...tokens, ...newData.results]
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
				<title>{localeLn('MarketParas')}</title>
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
				<div className="grid grid-cols-3 mb-4">
					<h1 className="col-start-2 col-span-1 text-4xl font-bold text-gray-100 text-center">
						{localeLn('Market')}
					</h1>
					<div className="grid justify-items-end">
						<FilterMarket />
					</div>
				</div>
				<CategoryList listCategory={store.cardCategory} />
				<div className="mt-4 px-4">
					{isFiltering ? (
						<div className="min-h-full">
							<CardListLoader />
						</div>
					) : (
						<CardList name="market" tokens={tokens} fetchData={_fetchData} hasMore={hasMore} />
					)}
				</div>
				<ButtonScrollTop />
			</div>
			<Footer />
		</div>
	)
}

const tokensParams = (query) => {
	const parsedSortQuery = parseSortQuery(query.sort)
	const params = {
		exclude_total_burn: true,
		__sort: parsedSortQuery,
		__limit: LIMIT,
		is_verified: typeof query.is_verified !== 'undefined' ? query.is_verified : true,
		...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
		...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
		...(query._id_next && { _id_next: query._id_next }),
		...(query.lowest_price_next &&
			parsedSortQuery.includes('lowest_price') && { lowest_price_next: query.lowest_price_next }),
		...(query.updated_at_next &&
			parsedSortQuery.includes('updated_at') && { updated_at_next: query.updated_at_next }),
	}
	return params
}

export async function getServerSideProps({ query }) {
	return {
		props: { serverQuery: query },
	}
}

export default MarketPage
