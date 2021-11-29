import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

import Nav from 'components/Nav'
import Footer from 'components/Footer'
import { useIntl } from 'hooks/useIntl'
import CollectionTransactionList from 'components/Activity/CollectionTransactionDetail'

const LIMIT = 30

const TopBuyersPage = () => {
	const [usersData, setUsersData] = useState([])
	const { localeLn } = useIntl()

	const _fetchData = async () => {
		const res = await axios(`${process.env.V2_API_URL}/activities/top-users?__limit=${LIMIT}`)

		const newUserData = [...usersData, ...res.data.data.collections]
		setUsersData(newUserData)
	}

	useEffect(() => {
		_fetchData()
	}, [])

	const headMeta = {
		title: 'Top Collections — Paras',
		description: 'See top collections at Paras',
		image: 'https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png',
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
				<div className="mx-4 text-center">
					<h1 className="text-4xl font-bold text-gray-100">{localeLn('TopCollections')}</h1>
					<p className="ml-2 text-gray-400 text-lg">{localeLn('In7Days')}</p>
				</div>
				<div className="mt-8 mx-4">
					<CollectionTransactionList data={usersData} />
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default TopBuyersPage
