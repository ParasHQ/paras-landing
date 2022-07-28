import axios from 'axios'
import TokenList from 'components/Token/TokenList'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Profile from 'components/Profile/Profile'
import FilterMarket from 'components/Filter/FilterMarket'
import { parseImgUrl, parseSortTokenQuery, setDataLocalStorage } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import CardListLoader from 'components/Card/CardListLoader'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import FilterDisplay from 'components/Filter/FilterDisplay'
import FilterCollection from 'components/Filter/FilterCollection'
import useStore from 'lib/store'

const LIMIT = 12

const Collection = ({ userProfile, accountId }) => {
	const currentUser = useStore((state) => state.currentUser)
	const router = useRouter()

	const scrollCollection = `${router.query.id}::collection`

	const [tokens, setTokens] = useState([])
	const [collections, setCollections] = useState([])
	const [idNext, setIdNext] = useState(null)
	const [priceNext, setPriceNext] = useState(null)
	const [endedSoonestNext, setEndedSoonestNext] = useState(null)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(false)
	const [display, setDisplay] = useState(
		(typeof window !== 'undefined' && window.localStorage.getItem('display')) || 'large'
	)

	useEffect(() => {
		fetchOwnerTokens(true)
	}, [currentUser, router.query.id])

	const fetchOwnerTokens = async (initialFetch = false) => {
		const _hasMore = initialFetch ? true : hasMore
		const _tokens = initialFetch ? [] : tokens

		if (!_hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const params = tokensParams({
			...router.query,
			...(initialFetch
				? {}
				: {
						_id_next: idNext,
						price_next: priceNext,
						ended_soonest_next: endedSoonestNext,
				  }),
		})
		const res = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: params,
		})
		const newData = await res.data.data

		const newTokens = [..._tokens, ...newData.results]
		setTokens(newTokens)

		if (initialFetch) {
			const collections = await axios(`${process.env.V2_API_URL}/owned-collections`, {
				params: {
					accountId: accountId,
				},
			})
			const newCollections = await collections.data.result
			setCollections(newCollections)
		}

		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = newData.results[newData.results.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('price') && setPriceNext(lastData.price)
			params.__sort.includes('ended_at') &&
				setEndedSoonestNext(lastData.sorted_auction_token?.ended_at)
		}
		setIsFetching(false)
	}

	useEffect(() => {
		updateFilter(router.query)
	}, [
		router.query.sort,
		router.query.pmin,
		router.query.pmax,
		router.query.card_trade_type,
		router.query.is_staked,
		router.query.collections,
	])

	const tokensParams = (query) => {
		const parsedSortQuery = parseSortTokenQuery(query.sort)
		const params = {
			collection_id: query.collections,
			exclude_total_burn: true,
			owner_id: accountId,
			lookup_likes: true,
			liked_by: currentUser,
			__limit: LIMIT,
			__sort: parsedSortQuery,
			...(query.card_trade_type === 'notForSale' && { has_price: false }),
			...(query.card_trade_type === 'onAuction' && { is_auction: true }),
			...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
			...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
			...(query._id_next && { _id_next: query._id_next }),
			...(query.ended_soonest_next && { ended_soonest_next: query.ended_soonest_next }),
			...(query.price_next &&
				parsedSortQuery.includes('price') && { price_next: query.price_next }),
			...(query.is_staked && { is_staked: query.is_staked }),
		}

		return params
	}

	const updateFilter = async (query) => {
		setIsFiltering(true)

		const params = tokensParams(query)
		const res = await axios(`${process.env.V2_API_URL}/token`, {
			params: params,
		})
		setTokens(res.data.data.results)
		if (res.data.data.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = res.data.data.results[res.data.data.results.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('price') && setPriceNext(lastData.price)
			params.__sort.includes('ended_at') &&
				setEndedSoonestNext(lastData.sorted_auction_token?.ended_at)
		}

		setIsFiltering(false)
	}

	const onClickDisplay = (typeDisplay) => {
		setDataLocalStorage('display', typeDisplay, setDisplay)
	}

	const removeAllCollectionsFilter = () => {
		router.push(
			{
				query: {
					...router.query,
					collections: '',
				},
			},
			{},
			{ shallow: true, scroll: false }
		)
	}

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See NFT digital card collectibles and creations from ${accountId}. ${
			userProfile?.bio || ''
		}`,
		image: userProfile?.imgUrl
			? parseImgUrl(userProfile?.imgUrl, null, { useOriginal: true })
			: `https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png`,
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
			<div className="max-w-6xl py-12 px-4 relative m-auto">
				<Profile userProfile={userProfile} activeTab={'collection'} />
				<div className="flex justify-center md:justify-end my-4 md:mb-14 md:-mr-4">
					<FilterCollection onClearAll={removeAllCollectionsFilter} collections={collections} />
					<FilterMarket isShowVerified={false} isCollectibles={true} isShowStaked={true} />
					<FilterDisplay type={display} onClickDisplay={onClickDisplay} />
				</div>
				<div className="-mt-4 md:-mt-6">
					{isFiltering ? (
						<CardListLoader />
					) : (
						<TokenList
							name={scrollCollection}
							tokens={tokens}
							fetchData={fetchOwnerTokens}
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

export default Collection

export async function getServerSideProps({ params }) {
	const profileRes = await axios.get(`${process.env.V2_API_URL}/profiles`, {
		params: {
			accountId: params.id,
		},
	})
	const userProfile = (await profileRes.data.data.results[0]) || null

	return {
		props: { userProfile, accountId: params.id },
	}
}
