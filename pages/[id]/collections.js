import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from 'components/Nav'
import Head from 'next/head'
import Footer from 'components/Footer'
import { useRouter } from 'next/router'
import Profile from 'components/Profile/Profile'
import CollectionList from 'components/Collection/CollectionList'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import { parseImgUrl } from 'utils/common'

const LIMIT = 12

const Collections = ({ userProfile, accountId }) => {
	const router = useRouter()

	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [collections, setCollections] = useState([])
	const [page, setPage] = useState(0)

	useEffect(() => {
		_fetchData()
	}, [router.query.id])

	const _fetchData = async () => {
		if (!hasMore || isFetching) return

		setIsFetching(true)
		const res = await axios.get(`${process.env.V2_API_URL}/collections`, {
			params: {
				creator_id: router.query.id,
				__skip: page * LIMIT,
				__limit: LIMIT,
				__sort: 'volume::-1',
			},
		})
		const data = await res.data.data.results
		const newData = [...collections, ...data]
		setCollections(newData)
		setPage(page + 1)
		if (data.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See NFT digital card collections from ${accountId}. ${userProfile?.bio || ''}`,
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
				<Profile userProfile={userProfile} activeTab={'collections'} />
				<div className="mt-4">
					<CollectionList data={collections} fetchData={_fetchData} hasMore={hasMore} />
				</div>
				<ButtonScrollTop />
			</div>
			<Footer />
		</div>
	)
}

export default Collections

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
