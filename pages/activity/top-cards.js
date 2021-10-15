import { useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

import Nav from 'components/Nav'
import Footer from 'components/Footer'
import CardStats from 'components/Stats/CardStats'
import { useEffect } from 'react'
import { useIntl } from 'hooks/useIntl'
const LIMIT = 5

const TopCardsPage = () => {
	const [cardsData, setCardsData] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const { localeLn } = useIntl()
	useEffect(() => {
		_fetchData()
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/activities/topCards?__skip=${page * LIMIT}&__limit=${LIMIT}`
		)

		const newCardsData = [...cardsData, ...res.data.data.results]
		setCardsData(newCardsData)
		setPage(page + 1)

		if (res.data.data.results < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: 'Top Cards — Paras',
		description: 'See top cards at paras',
		image: 'https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png',
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-50"
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
				<div className="mx-4 flex items-baseline">
					<h1 className="text-4xl font-bold text-gray-100">{localeLn('CardStatistics')}</h1>
				</div>
				<div className="my-8">
					<CardStats cardsData={cardsData} fetchData={_fetchData} hasMore={hasMore} />
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default TopCardsPage
