import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'

import Footer from '../components/Footer'
import Error from './404'
import Nav from '../components/Nav'

const ProfileDetail = ({ userProfile, accountId }) => {
	const router = useRouter()

	useEffect(() => {
		if (userProfile) {
			router.replace(`${accountId}/collection`)
		}
	}, [router.query.id])

	if (!userProfile) {
		return <Error />
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
			<div className="h-screen" />
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const profileRes = await axios(
		`${process.env.API_URL}/profiles?accountId=${params.id}`
	)

	const userProfile = (await profileRes.data.data.results[0]) || null
	const accountId = (await profileRes.data.data.results[0]?.accountId) || null

	return {
		props: { userProfile, accountId },
	}
}

export default ProfileDetail
