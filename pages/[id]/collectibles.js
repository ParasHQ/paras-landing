import axios from 'axios'
import TokenList from 'components/Token/TokenList'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Profile from 'components/Profile/Profile'
import FilterMarket from 'components/Filter/FilterMarket'
import { parseSortTokenQuery } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import FilterDisplay from 'components/Filter/FilterDisplay'

const LIMIT = 12

const Collection = ({ userProfile, accountId }) => {
	const router = useRouter()

	const scrollCollection = `${router.query.id}::collection`

	const [tokens, setTokens] = useState([])
	const [idNext, setIdNext] = useState(null)
	const [priceNext, setPriceNext] = useState(null)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [display, setDisplay] = useState('large')

	useEffect(async () => {
		await fetchOwnerTokens(true)
	}, [router.query.id])

	const fetchOwnerTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const params = tokensParams({
			...router.query,
			_id_next: idNext,
			price_next: priceNext,
		})
		const res = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: params,
		})
		const newData = await res.data.data

		const newTokens = [...(tokens || []), ...newData.results]
		setTokens(newTokens)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)

			const lastData = newData.results[newData.results.length - 1]
			setIdNext(lastData._id)
			params.__sort.includes('price') && setPriceNext(lastData.price)
		}
		setIsFetching(false)
	}

	useEffect(() => {
		updateFilter(router.query)
	}, [router.query.sort, router.query.pmin, router.query.pmax, router.query.is_notforsale])

	const tokensParams = (query) => {
		const parsedSortQuery = parseSortTokenQuery(query.sort)
		const params = {
			exclude_total_burn: true,
			owner_id: accountId,
			__limit: LIMIT,
			__sort: parsedSortQuery,
			...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
			...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
			...(query._id_next && { _id_next: query._id_next }),
			...(query.price_next &&
				parsedSortQuery.includes('price') && { price_next: query.price_next }),
		}

		return params
	}

	const updateFilter = async (query) => {
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
		}
	}

	const onClickDisplay = (typeDisplay) => {
		setDisplay(typeDisplay)
	}

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See digital card collectibles and creations from ${accountId}. ${
			userProfile?.bio || ''
		}`,
		image: userProfile?.imgUrl
			? `${process.env.V2_API_URL}/socialCard/avatar/${userProfile.imgUrl.split('://')[1]}`
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
				<div className="flex justify-end mt-4 md:mb-14 md:-mr-4">
					<FilterMarket isShowVerified={false} isCollectibles={true} />
					<FilterDisplay type={display} onClickDisplay={onClickDisplay} />
				</div>
				<div className="-mt-4 md:-mt-6">
					<TokenList
						name={scrollCollection}
						tokens={tokens}
						fetchData={fetchOwnerTokens}
						hasMore={hasMore}
						displayType={display}
					/>
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
