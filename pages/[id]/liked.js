import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CardList from 'components/TokenSeries/CardList'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Profile from 'components/Profile/Profile'
import FilterMarket from 'components/Filter/FilterMarket'
import { parseImgUrl, parseSortQuery, setDataLocalStorage } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import CardListLoader from 'components/Card/CardListLoader'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import FilterDisplay from 'components/Filter/FilterDisplay'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'

const LIMIT = 12

const Liked = ({ userProfile, accountId }) => {
	const router = useRouter()

	const scrollCreation = `${router.query.id}::creation`

	const currentUser = useStore((state) => state.currentUser)
	const [tokens, setTokens] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [idNext, setIdNext] = useState(null)
	const [lowestPriceNext, setLowestPriceNext] = useState(null)
	const [updatedAtNext, setUpdatedAtNext] = useState(null)
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(false)
	const [display, setDisplay] = useState(
		(typeof window !== 'undefined' && window.localStorage.getItem('display')) || 'large'
	)

	useEffect(() => {
		if (!currentUser || currentUser !== router.query.id) {
			router.replace({
				pathname: '/[id]/collectibles',
				query: { id: router.query.id },
			})
		}
	}, [currentUser])

	useEffect(async () => {
		if (router.isReady) {
			await fetchCreatorTokens()
		}
	}, [router.query.id])

	const fetchCreatorTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)

		const params = tokensParams({
			...router.query,
			_id_next: idNext,
			lowest_price_next: lowestPriceNext,
			updated_at_next: updatedAtNext,
		})

		const res = await axios.get(`${process.env.V2_API_URL}/liked-token`, {
			params: params,
			headers: {
				authorization: await WalletHelper.authToken(),
			},
		})
		const newData = await res.data.data.results

		const newTokens = [...(tokens || []), ...newData]
		setTokens(newTokens)
		if (newData.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = newData[newData.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
			params.__sort.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
		}
		setIsFetching(false)
	}

	useEffect(() => {
		if (router.isReady) {
			updateFilter(router.query)
		}
	}, [
		router.query.sort,
		router.query.pmin,
		router.query.pmax,
		router.query.min_copies,
		router.query.max_copies,
		router.query.card_trade_type,
	])

	const tokensParams = (query) => {
		const parsedSortQuery = parseSortQuery(query.sort, true)
		const params = {
			account_id: currentUser,
			__limit: LIMIT,
			__sort: parsedSortQuery,
			lookup_token: true,
			...(query.card_trade_type === 'notForSale' && { has_price: false }),
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

		return params
	}

	const updateFilter = async (query) => {
		setIsFiltering(true)
		const params = tokensParams(query)
		const res = await axios.get(`${process.env.V2_API_URL}/liked-token`, {
			params: params,
			headers: {
				authorization: await WalletHelper.authToken(),
			},
		})

		const newData = res.data.data.results

		setTokens(newData)
		if (newData.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = newData[newData.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('updated_at') && setUpdatedAtNext(lastData.updated_at)
			params.__sort.includes('lowest_price') && setLowestPriceNext(lastData.lowest_price)
		}

		setIsFiltering(false)
	}

	const onClickDisplay = (typeDisplay) => {
		setDataLocalStorage('display', typeDisplay, setDisplay)
	}

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See NFT digital card collectibles liked by ${accountId}. ${
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
				<Profile userProfile={userProfile} activeTab={'liked'} />
				<div className="flex justify-end my-4 md:mb-14 md:-mr-4">
					<FilterMarket isShowVerified={false} isLikedTab={true} />
					<FilterDisplay type={display} onClickDisplay={onClickDisplay} />
				</div>
				<div className="-mt-4 md:-mt-6">
					{isFiltering ? (
						<CardListLoader />
					) : (
						<CardList
							name={scrollCreation}
							tokens={tokens}
							fetchData={fetchCreatorTokens}
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

export default Liked

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
