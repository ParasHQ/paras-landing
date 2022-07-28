import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import { parseImgUrl } from 'utils/common'

const ProfileDetail = ({ userProfile, accountId }) => {
	const router = useRouter()

	useEffect(() => {
		router.replace(`${accountId}/collectibles`)
	}, [router.query.id])

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
			<div className="h-screen" />
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const profileRes = await axios(`${process.env.V2_API_URL}/profiles?accountId=${params.id}`)

	const userProfile = (await profileRes.data.data.results[0]) || null
	const accountId = params.id

	return {
		props: { userProfile, accountId },
	}
}

export default ProfileDetail
