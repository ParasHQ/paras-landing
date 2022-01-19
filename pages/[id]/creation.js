import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CardList from 'components/TokenSeries/CardList'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Profile from 'components/Profile/Profile'
import FilterMarket from 'components/Filter/FilterMarket'
import { parseSortQuery } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import CardListLoader from 'components/Card/CardListLoader'

const LIMIT = 12

const creation = ({ userProfile, accountId }) => {
	const router = useRouter()

	const scrollCreation = `${router.query.id}::creation`

	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(true)

	useEffect(async () => {
		await fetchCreatorTokens()
	}, [router.query.id])

	const fetchCreatorTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(page, router.query),
		})
		const newData = await res.data.data

		const newTokens = [...(tokens || []), ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	useEffect(() => {
		updateFilter(router.query)
	}, [router.query.sort, router.query.pmin, router.query.pmax, router.query.is_notforsale])

	const tokensParams = (_page = 0, query) => {
		const params = {
			exclude_total_burn: true,
			creator_id: accountId,
			__skip: _page * LIMIT,
			__limit: LIMIT,
			__sort: parseSortQuery(query.sort),
			...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
			...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
		}

		return params
	}

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
				<Profile userProfile={userProfile} activeTab={'creation'} />
				<div className="flex justify-end mt-4 md:mb-14 md:-mr-4">
					<FilterMarket isShowVerified={false} />
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
						/>
					)}
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default creation

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
