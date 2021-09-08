import axios from 'axios'
import TokenList from 'components/TokenList'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import Nav from '../../components/Nav'
import Profile from '../../components/Profile'

const LIMIT = 12

const collection = ({ userProfile, accountId }) => {
	const router = useRouter()

	const scrollCollection = `${router.query.id}::collection`

	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	useEffect(async () => {
		await fetchOwnerTokens(true)
	}, [router.query.id])

	const fetchOwnerTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				owner_id: router.query.id,
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
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

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See digital card collectibles and creations from ${accountId}. ${
			userProfile?.bio || ''
		}`,
		image: userProfile?.imgUrl
			? `${process.env.V2_API_URL}/socialCard/avatar/${
					userProfile.imgUrl.split('://')[1]
			  }`
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
				<div className="mt-8">
					<TokenList
						name={scrollCollection}
						tokens={tokens}
						fetchData={fetchOwnerTokens}
						hasMore={hasMore}
					/>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default collection

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
