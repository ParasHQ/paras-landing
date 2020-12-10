import axios from 'axios'
import Head from 'next/head'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import ActivityDetail, { descriptionMaker } from '../../components/ActivityDetail'

const ActivityDetailPage = ({ errorCode, activity, token }) => {
	if (errorCode) {
		return <Error />
	}

	const headMeta = {
		title: 'Activity — Paras',
		description: descriptionMaker(activity, token),
		image: `${process.env.API_URL}/socialCard/${token.tokenId}`,
	}

	return (
		<div>
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
				<div className="max-w-6xl relative m-auto py-12">
					<div className="px-4 max-w-2xl mx-auto">
						<ActivityDetail activity={activity} token={token} />
					</div>
				</div>
				<Footer />
			</div>
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const activityResp = await axios(
		`${process.env.API_URL}/activities?_id=${params.id}`
	)
	const activity = (await activityResp.data.data.results[0]) || null
	const tokenResp = await axios(
		`${process.env.API_URL}/tokens?tokenId=${activity.tokenId}`
	)
	const token = (await tokenResp.data.data.results[0]) || null

	const errorCode = activity && token ? false : 404

	return { props: { errorCode, activity, token } }
}

export default ActivityDetailPage
