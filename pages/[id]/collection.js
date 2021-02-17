import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CardList from '../../components/CardList'
import Footer from '../../components/Footer'
import Nav from '../../components/Nav'
import Profile from '../../components/Profile'
import useStore from '../../store'
import Error from '../404'

const collection = ({ ownerTokens, userProfile, accountId }) => {
	const store = useStore()
	const router = useRouter()

	const scrollCollection = `${router.query.id}::collection`
	const tokens = store.marketDataPersist[scrollCollection]

	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		store.setMarketDataPersist(scrollCollection, ownerTokens)

		return () => {
			store.setMarketScrollPersist(scrollCollection, 0)
			store.setMarketDataPersist(scrollCollection, [])
		}
	}, [router.query.id])

	if (!userProfile) {
		return <Error />
	}

	const fetchOwnerTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/tokens?excludeTotalBurn=true&ownerId=${router.query.id}&__skip=${
				page * 5
			}&__limit=5`
		)
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		store.setMarketDataPersist(scrollCollection, newTokens)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See digital card collectibles and creations from ${accountId}. ${
			userProfile.bio || ''
		}`,
		image: userProfile.imgUrl
			? `${process.env.API_URL}/socialCard/avatar/${
					userProfile.imgUrl.split('://')[1]
			  }`
			: `https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png`,
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
				{tokens && (
					<div className="mt-8">
						<CardList
							name={scrollCollection}
							tokens={tokens}
							fetchData={fetchOwnerTokens}
							hasMore={hasMore}
						/>
					</div>
				)}
			</div>
			<Footer />
		</div>
	)
}

export default collection

export async function getServerSideProps({ params }) {
	const ownerRes = await axios(
		`${process.env.API_URL}/tokens?excludeTotalBurn=true&ownerId=${params.id}&__limit=5`
	)
	const profileRes = await axios(
		`${process.env.API_URL}/profiles?accountId=${params.id}`
	)

	const ownerTokens = await ownerRes.data.data.results
	const userProfile = (await profileRes.data.data.results[0]) || null

	return {
		props: { ownerTokens, userProfile, accountId: params.id },
	}
}
