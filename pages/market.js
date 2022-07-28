import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Nav from 'components/Nav'
import CardList from 'components/TokenSeries/CardList'
import Head from 'next/head'
import Footer from 'components/Footer'
import useStore from 'lib/store'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { parseSortQuery, setDataLocalStorage } from 'utils/common'
import CardListLoader from 'components/Card/CardListLoader'
import CategoryList from 'components/CategoryList'
import { useIntl } from 'hooks/useIntl'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import FilterMarket from 'components/Filter/FilterMarket'
import FilterDisplay from 'components/Filter/FilterDisplay'

const LIMIT = 12

const MarketPage = ({ serverQuery }) => {
	const store = useStore()
	const router = useRouter()

	const [tokens, setTokens] = useState([])
	const [idNext, setIdNext] = useState(null)
	const [lowestPriceNext, setLowestPriceNext] = useState(null)
	const [updatedAtNext, setUpdatedAtNext] = useState(null)
	const [endedSoonestNext, setEndedSoonestNext] = useState(null)
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(true)
	const [display, setDisplay] = useState(
		(typeof window !== 'undefined' && window.localStorage.getItem('display')) || 'large'
	)
	const [hasMore, setHasMore] = useState(true)
	const { localeLn } = useIntl()

	useEffect(() => {
		getCategory()
		return () => {
			store.setMarketScrollPersist('market', 0)
		}
	}, [])
	const currentUser = useStore((store) => store.currentUser)

	useEffect(() => {
		if (currentUser) {
			_fetchData(true)
		}
	}, [currentUser])

	useEffect(() => {
		updateFilter(router.query)
	}, [
		router.query.sort,
		router.query.pmin,
		router.query.pmax,
		router.query.card_trade_type,
		router.query.min_copies,
		router.query.max_copies,
		router.query.is_verified,
		router.query.card_trade_type,
	])

	const updateFilter = async (query) => {
		setIsFiltering(true)
		const params = tokensParams({
			...(query || serverQuery),
			liked_by: currentUser,
		})
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
			params.__sort.includes('ended_at') &&
				setEndedSoonestNext(lastData.sorted_auction_token?.ended_at)
		}
		setIsFiltering(false)
	}

	const getCategory = async () => {
		const res = await axios(`${process.env.V2_API_URL}/categories`)
		store.setCardCategory(res.data.data.results)
	}

	const _fetchData = async (initialFetch = false) => {
		const _hasMore = initialFetch ? true : hasMore
		const _isFetching = initialFetch ? false : isFetching

		if (!_hasMore || _isFetching) {
			return
		}
		setIsFetching(true)
		const params = tokensParams({
			...(router.query || serverQuery),
			...(initialFetch
				? { liked_by: currentUser }
				: {
						_id_next: idNext,
						lowest_price_next: lowestPriceNext,
						updated_at_next: updatedAtNext,
						liked_by: currentUser,
						ended_soonest_next: endedSoonestNext,
				  }),
		})
		const res = await axios(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})
		const newData = await res.data.data
		const newTokens = initialFetch ? [...newData.results] : [...tokens, ...newData.results]
		setTokens(newTokens)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = newData.results[newData.results.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
			params.__sort.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
			params.__sort.includes('ended_at') &&
				setEndedSoonestNext(lastData.sorted_auction_token?.ended_at)
		}
		setIsFetching(false)
	}

	const onClickDisplay = (typeDisplay) => {
		setDataLocalStorage('display', typeDisplay, setDisplay)
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
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>

				<meta name="twitter:title" content="Market — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
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
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
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
					<h1 className="col-start-1 md:col-start-2 col-span-2 md:col-span-1 pl-5 md:pl-0 text-4xl font-bold text-gray-100 text-left md:text-center">
						{localeLn('Market')}
					</h1>
					<div className="flex items-center justify-end">
						<div className="grid justify-items-end">
							<FilterMarket />
						</div>
						<div className="flex mr-4 md:mx-4">
							<FilterDisplay type={display} onClickDisplay={onClickDisplay} />
						</div>
					</div>
				</div>
				<CategoryList listCategory={store.cardCategory} />
				<div className="mt-4 px-4">
					{isFiltering ? (
						<div className="min-h-full">
							<CardListLoader length={display === 'large' ? 12 : 18} displayType={display} />
						</div>
					) : (
						<CardList
							name="market"
							tokens={tokens}
							fetchData={_fetchData}
							hasMore={hasMore}
							displayType={display}
							showLike={true}
						/>
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
		lookup_token: true,
		lookup_likes: true,
		liked_by: query.liked_by,
		...(query.card_trade_type === 'notForSale' && { has_price: false }),
		...(query.card_trade_type === 'onAuction' && { is_auction: true }),
		...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
		...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
		...(query.card_trade_type === 'notForSale' && { has_price: false }),
		...(query._id_next && { _id_next: query._id_next }),
		...(query.ended_soonest_next && { ended_soonest_next: query.ended_soonest_next }),
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
	return {
		props: { serverQuery: query },
	}
}

export default MarketPage
