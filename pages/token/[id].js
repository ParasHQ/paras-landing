import axios from 'axios'
import Nav from '../../components/Nav'
import Head from 'next/head'
import CardDetail from '../../components/CardDetail'
import Footer from '../../components/Footer'
import Error from '../404'

const TokenDetail = ({ errorCode, token }) => {
	if (errorCode) {
		return <Error />
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>{`${token.metadata.name} — Paras`}</title>
				<meta
					name="description"
					content={`${token.metadata.name} from collection ${token.metadata.collection} by ${token.creatorId}. ${token.metadata.description}`}
				/>

				<meta name="twitter:title" content={`${token.metadata.name} — Paras`} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta
					name="twitter:description"
					content={`${token.metadata.name} from collection ${token.metadata.collection} by ${token.creatorId}. ${token.metadata.description}`}
				/>
				<meta
					name="twitter:image"
					content={`${process.env.API_URL}/socialCard/${token.tokenId}`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${token.metadata.name} - Paras`} />
				<meta
					property="og:site_name"
					content={`${token.metadata.name} — Paras`}
				/>
				<meta
					property="og:description"
					content={`${token.metadata.name} from collection ${token.metadata.collection} by ${token.creatorId}. ${token.metadata.description}`}
				/>
				<meta
					property="og:image"
					content={`${process.env.API_URL}/socialCard/${token.tokenId}`}
				/>
			</Head>
			<Nav />
			<div className="max-w-6xl w-full m-auto pt-4 px-4">
				<CardDetail token={token} />
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const res = await axios(`${process.env.API_URL}/tokens?tokenId=${params.id}`)
	const token = (await res.data.data.results[0]) || null

	const errorCode = token ? false : 404

	return { props: { errorCode, token } }
}

export default TokenDetail
