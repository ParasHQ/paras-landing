import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import CardList from '../components/CardList'
import Head from 'next/head'
import Footer from '../components/Footer'
import useStore from '../store'
import Modal from '../components/Modal'
import { useRouter } from 'next/router'

const LIMIT = 6

export default function MarketPage({ data }) {
	const store = useStore()
	const router = useRouter()
	const [tokens, setTokens] = useState(data.results)
	const [showEventModal, setShowEventModal] = useState(true)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

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
			`${process.env.API_URL}/tokens?__skip=${page * LIMIT}&__limit=${LIMIT}`
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

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Market — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Market — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Market — Paras" />
				<meta property="og:site_name" content="Market — Paras" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto py-12">
				<h1 className="text-4xl font-bold text-gray-100 text-center">Market</h1>
				{showEventModal && (
					<Modal
						close={() => setShowEventModal(false)}
						closeOnBgClick
						closeOnEscape
					>
						<div className="max-w-2xl m-auto w-11/12 ">
							<div onClick={() => setShowEventModal(false)}>
								<svg
									height="18"
									viewBox="0 0 365.696 365.696"
									width="18"
									className="absolute m-4"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0" />
								</svg>
							</div>
							<div className="bg-dark-primary-1 md:flex md:space-x-4 rounded-md overflow-hidden">
								<div className="flex-1 bg-white h-56 md:h-auto"></div>
								<div className="flex-1 p-4">
									<h1 className="text-white mb-2 text-2xl font-bold">
										Lunar New Year Event
									</h1>
									<p className="my-2 mb-4 max-w-xl text-white">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
										condimentum sollicitudin gravida. Vestibulum sed enim sem.
										In id lectus maximus, facilisis lorem at, consequat dui.
										Vivamus eget tincidunt felis, id dictum urna.
									</p>
									<div className="space-x-2">
										<button
											className="outline-none h-10 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-0 text-gray-100 bg-primary border-primary"
											onClick={() => router.push('market/saf')}
										>
											View Market
										</button>
										<button
											className="outline-none h-10 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-0 text-primary bg-white"
											onClick={() => {}}
										>
											See More
										</button>
									</div>
								</div>
							</div>
						</div>
					</Modal>
				)}
				<div className="mt-4 px-4">
					<CardList
						name="market"
						tokens={tokens}
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
	const res = await axios(`${process.env.API_URL}/tokens?__limit=${LIMIT}`)
	const data = await res.data.data

	return { props: { data } }
}
