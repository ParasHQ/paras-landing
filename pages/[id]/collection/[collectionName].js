import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from '../../../components/Nav'
import CardList from '../../../components/CardList'
import Head from 'next/head'
import Footer from '../../../components/Footer'
import { useRouter } from 'next/router'
import Link from 'next/link'

const LIMIT = 12

export default function MarketPage({ collectionName }) {
	const router = useRouter()
	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const { filter, id } = router.query

	useEffect(async () => {
		await _fetchData()
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${
				process.env.API_URL
			}/tokens?collection=${collectionName}&creatorId=${id}&excludeTotalBurn=true&__skip=${
				page * LIMIT
			}&__limit=${LIMIT}`
		)
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const _changeFilter = (e) => {
		router.push({
			query: { filter: encodeURI(e.target.value), collectionName, id },
		})
	}

	const headMeta = {
		title: `${decodeURIComponent(collectionName)} — Paras`,
		description: `Explore and collect ${decodeURIComponent(
			collectionName
		)} digital art cards on Paras. All-in-one social digital art card marketplace for creators and collectors.`,
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
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={headMeta.title} />
				<meta property="og:site_name" content={headMeta.title} />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto py-12">
				<h1 className="text-4xl font-bold text-gray-100 mx-4">
					{decodeURIComponent(collectionName)}
				</h1>
				<div className="flex justify-between m-4 mt-0">
					<h4 className="text-xl text-gray-300 self-center">
						<span>
							collection by{' '}
							<span className="font-semibold">
								<Link href={`/${id}`}>
									<a className="font-semibold text-white border-b-2 border-transparent hover:border-white">
										{id}
									</a>
								</Link>
							</span>
						</span>
					</h4>
					<div className="text-right self-end">
						<select
							className="p-2 bg-dark-primary-4 text-gray-100 rounded-md"
							onChange={(e) => _changeFilter(e)}
							value={router.query.filter}
						>
							<option value="showAll">Show All</option>
							<option value="owned">Owned Cards</option>
						</select>
					</div>
				</div>
				<div className="mt-4 px-4">
					<CardList
						name="market"
						tokens={tokens}
						fetchData={_fetchData}
						hasMore={hasMore}
						toggleOwnership={filter === 'owned'}
					/>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	return {
		props: { collectionName: params.collectionName },
	}
}
