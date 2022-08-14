import ParasRequest from 'lib/ParasRequest'
import Head from 'next/head'
import Error from 'pages/404'
import Nav from 'components/Nav'
import TokenSeriesDetail from 'components/TokenSeries/TokenSeriesDetail'
import Footer from 'components/Footer'
import { parseImgUrl } from 'utils/common'
import useTokenSeries from 'hooks/useTokenSeries'
import useStore from 'lib/store'
import { useEffect, useState } from 'react'
import TokenSeriesDetailNew from 'components/TokenSeries/TokenSeriesDetailNew'
import { EXPERIMENT_ID, GA_TRACKING_ID } from 'lib/gtag'

const getCreatorId = (token) => {
	return token.metadata.creator_id || token.creator_id || token.contract_id
}

const TokenSeriesPage = ({ errorCode, initial }) => {
	const currentUser = useStore((state) => state.currentUser)
	const [currentVariant, setVariant] = useState(0)
	const { token, mutate } = useTokenSeries({
		key: `${initial?.contract_id}::${initial?.token_series_id}`,
		initialData: initial,
		params: {
			lookup_likes: true,
			liked_by: currentUser,
		},
	})

	const asyncMutate = async () => {
		await mutate()
	}
	useEffect(() => {
		const variant = localStorage.getItem('variant') || 0
		setVariant(variant)
		if (window && window.gtag) {
			window.gtag('event', 'experiment_impression', {
				experiment_id: EXPERIMENT_ID,
				variant_id: EXPERIMENT_ID + '.' + variant,
				send_to: GA_TRACKING_ID,
			})
		}
	})
	useEffect(() => {
		if (currentUser) {
			asyncMutate()
		}
	}, [currentUser])

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
					content={`${token.metadata.title} from collection ${
						token.metadata.collection
					} by ${getCreatorId(token)}. ${token.metadata.description}`}
				/>

				<meta name="twitter:title" content={`${token.metadata.title} — Paras`} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta
					name="twitter:description"
					content={`${token.metadata.title} from collection ${
						token.metadata.collection
					} by ${getCreatorId(token)}. ${token.metadata.description}`}
				/>
				<meta
					name="twitter:image"
					content={`${parseImgUrl(token.metadata.media, null, {
						isMediaCdn: token.isMediaCdn,
					})}`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${token.metadata.title} - Paras`} />
				<meta property="og:site_name" content={`${token.metadata.title} — Paras`} />
				<meta
					property="og:description"
					content={`${token.metadata.title} from collection ${
						token.metadata.collection
					} by ${getCreatorId(token)}. ${token.metadata.description}`}
				/>
				<meta
					property="og:image"
					content={`${parseImgUrl(token.metadata.media, null, {
						isMediaCdn: token.isMediaCdn,
					})}`}
				/>
			</Head>
			<Nav />
			<div className="relative max-w-6xl m-auto pt-16 px-4">
				{/* {currentVariant == 0 ? (
					<TokenSeriesDetail token={token} />
				) : ( */}
				<TokenSeriesDetailNew token={token} />
				{/* )} */}
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const [contractId, tokenSeriesId] = params.id.split('::')

	const res = await ParasRequest.get(`${process.env.V2_API_URL}/token-series`, {
		params: {
			contract_id: contractId,
			token_series_id: tokenSeriesId,
			lookup_token: true,
		},
	})

	const token = res.data.data.results[0] || null

	if (token?.token) {
		return {
			redirect: {
				destination: `/token/${contractId}::${tokenSeriesId}/${token.token.token_id}`,
				permanent: false,
			},
		}
	}

	const errorCode = token ? false : 404

	return { props: { errorCode, initial: token } }
}

export default TokenSeriesPage
