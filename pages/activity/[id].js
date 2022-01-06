import axios from 'axios'
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import ActivityDetail, { descriptionMaker } from 'components/Activity/ActivityDetail'
import Error from '../404'
import { parseImgUrl } from 'utils/common'

const ActivityDetailPage = ({ errorCode, activity, token }) => {
	if (errorCode) {
		return <Error />
	}

	const headMeta = {
		title: 'Activity — Paras',
		description: descriptionMaker(activity, token),
		image: `${parseImgUrl(token.metadata.media, null, { isMediaCdn: token.isMediaCdn })}`,
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
			<div className="max-w-6xl relative m-auto py-12">
				<div className="px-4 max-w-2xl mx-auto">
					<ActivityDetail activity={activity} token={token} />
				</div>
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const activityResp = await axios.get(`${process.env.V2_API_URL}/activities`, {
		params: {
			_id: params.id,
		},
	})

	const activity = (await activityResp.data.data.results[0]) || null

	const query = activity.token_id
		? {
				url: `${process.env.V2_API_URL}/token`,
				params: {
					contract_id: activity.contract_id,
					token_id: activity.token_id,
				},
		  }
		: {
				url: `${process.env.V2_API_URL}/token-series`,
				params: {
					contract_id: activity.contract_id,
					token_series_id: activity.token_series_id,
				},
		  }

	const tokenResp = await axios(query.url, {
		params: query.params,
	})

	const token = (await tokenResp.data.data.results[0]) || null

	const errorCode = activity && token ? false : 404

	return { props: { errorCode, activity, token } }
}

export default ActivityDetailPage
