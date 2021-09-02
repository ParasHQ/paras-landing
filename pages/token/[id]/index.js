import axios from 'axios'
import Head from 'next/head'
import Error from 'pages/404'
import Nav from 'components/Nav'
import CardDetail from 'components/CardDetail'
import Footer from 'components/Footer'

const TokenDetail = ({ errorCode, token }) => {
	if (errorCode) {
		return <Error />
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
				<title>{`${token.metadata.title} — Paras`}</title>
				<meta
					name="description"
					content={`${token.metadata.title} from collection ${token.metadata.collection} by ${token.creator_id}. ${token.metadata.description}`}
				/>

				<meta
					name="twitter:title"
					content={`${token.metadata.title} — Paras`}
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta
					name="twitter:description"
					content={`${token.metadata.title} from collection ${token.metadata.collection} by ${token.creator_id}. ${token.metadata.description}`}
				/>
				<meta
					name="twitter:image"
					content={`${process.env.API_URL}/socialCard/${token.tokenId}`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${token.metadata.title} - Paras`} />
				<meta
					property="og:site_name"
					content={`${token.metadata.title} — Paras`}
				/>
				<meta
					property="og:description"
					content={`${token.metadata.title} from collection ${token.metadata.collection} by ${token.creator_id}. ${token.metadata.description}`}
				/>
				<meta
					property="og:image"
					content={`${process.env.API_URL}/socialCard/${token.tokenId}`}
				/>
			</Head>
			<Nav />
			<div className="relative w-full m-auto pt-4 px-4">
				<CardDetail token={token} />
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const [contractId, tokenSeriesId] = params.id.split('::')

	const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
		params: {
			contract_id: contractId,
			token_series_id: tokenSeriesId,
		},
	})

	console.log(res)

	const token = res.data.data.results[0]

	const errorCode = token ? false : 404

	return { props: { errorCode, token } }
}

export default TokenDetail
