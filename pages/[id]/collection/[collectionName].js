import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from '../../../components/Nav'
import CardList from '../../../components/CardList'
import Head from 'next/head'
import Footer from '../../../components/Footer'
import useStore from '../../../store'
import { useRouter } from 'next/router'
import Link from 'next/link'

const LIMIT = 6

export default function MarketPage({ data }) {
	const store = useStore()
	const router = useRouter()
	const [tokens, setTokens] = useState(data.results)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const { collectionName, filter, id } = router.query

	useEffect(() => {
		return () => {
			store.setMarketScrollPersist('market', 0)
		}
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${
				process.env.API_URL
			}/tokens?collection=${collectionName}&__creatorId=${id}&__excludeTotalBurn=true&__skip=${
				page * LIMIT
			}&__limit=${LIMIT}`
		)
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length === 0) {
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
		title: `${collectionName} — Paras`,
		description: `Explore and collect ${collectionName} digital art cards on Paras. All-in-one social digital art card marketplace for creators and collectors.`,
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
					{collectionName}
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
	const res = await axios(
		`${process.env.API_URL}/tokens?collection=${params.collectionName}&__creatorId=${params.id}&__excludeTotalBurn=true&__limit=${LIMIT}`
	)
	const data = await res.data.data

	return { props: { data } }
}
