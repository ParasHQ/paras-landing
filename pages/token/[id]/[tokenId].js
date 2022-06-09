import axios from 'axios'
import Nav from 'components/Nav'
import Head from 'next/head'
import Footer from 'components/Footer'
import Error from '../../404'
import TokenDetail from 'components/Token/TokenDetail'
import { parseImgUrl } from 'utils/common'
import { sentryCaptureException } from 'lib/sentry'
import useToken from 'hooks/useToken'
import { useEffect, useState } from 'react'
import useStore from 'lib/store'

const getCreatorId = (token) => {
	return token.metadata.creator_id || token.contract_id
}

const TokenPage = ({ errorCode, initial }) => {
	const currentUser = useStore((state) => state.currentUser)
	const { token, mutate } = useToken({
		key: `${initial?.contract_id}::${initial?.token_series_id}/${initial?.token_id}`,
		initialData: initial,
		params: {
			lookup_likes: true,
			liked_by: currentUser,
		},
	})
	const [isEndedTime, setIsEndedTime] = useState(false)

	useEffect(() => {
		checkAuctionTime()
	}, [isEndedTime])

	useEffect(() => {
		if (currentUser) {
			asyncMutate()
		}
	}, [currentUser])

	const asyncMutate = async () => {
		await mutate()
	}

	const convertTimeOfAuction = (date) => {
		const sliceNanoSec = String(date).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			return sliceNanoSec
		}
	}

	const checkAuctionTime = () => {
		if (token?.ended_at) {
			const startedDate = new Date().getTime()
			const endedDate = convertTimeOfAuction(token?.ended_at)
			const endAuctionDate = parseInt(endedDate) - parseInt(startedDate)
			setTimeout(() => setIsEndedTime(true), endAuctionDate)
		}
	}

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
				<TokenDetail token={token} isAuctionEnds={isEndedTime} />
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const [contractId] = params.id.split('::')

	try {
		const res = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				contract_id: contractId,
				token_id: params.tokenId,
			},
		})

		const token = res.data.data.results[0] || null

		return { props: { initial: token, errorCode: token ? null : 404 } }
	} catch (err) {
		sentryCaptureException(err)
		const errorCode = 404
		return { props: { errorCode } }
	}
}

export default TokenPage
