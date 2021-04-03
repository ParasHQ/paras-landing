import { useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import CardStats from '../../components/Stats/CardStats'

const LIMIT = 5

const TopCardsPage = ({ topCards }) => {
	const [cardsData, setCardsData] = useState(topCards)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/activities/topCards?__skip=${
				page * LIMIT
			}&__limit=${LIMIT}`
		)

		const newCardsData = [...cardsData, ...res.data.data.results]
		setCardsData(newCardsData)
		setPage(page + 1)

		if (res.data.data.results < 5) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: 'Top Cards — Paras',
		description: 'See top cards at paras',
		image:
			'https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png',
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
			<div className="max-w-6xl relative m-auto py-12">
				<div className="mx-4 flex items-baseline">
					<h1 className="text-4xl font-bold text-gray-100">Card Statistics</h1>
				</div>
				<div className="my-8">
					<CardStats
						cardsData={cardsData}
						fetchData={_fetchData}
						hasMore={hasMore}
					/>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps() {
	const res = await axios(
		`${process.env.API_URL}/activities/topCards?__limit=${LIMIT}`
	)
	const topCards = res.data.data.results

	return { props: { topCards } }
}

export default TopCardsPage
