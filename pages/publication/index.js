import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PublicationList from '../../components/PublicationList'

const LIMIT = 6

const Publication = ({ pubList }) => {
	const [pubData, setPubData] = useState(pubList)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/publications?__skip=${
				page * LIMIT
			}&__limit=${LIMIT}`
		)
		const newData = await res.data.data

		const newPubData = [...pubData, ...newData.results]
		setPubData(newPubData)
		setPage(page + 1)

		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div className="min-h-screen relative bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('./bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>Publication — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
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
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:site_name"
					content="Paras — Digital Art Cards Market"
				/>
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
				<h1 className="text-4xl font-bold text-gray-100 text-center">
					Publication
				</h1>
				<div className="mt-4">
					<p className="text-center text-xl text-gray-300">
						Enhancing The Visuals through Stories
					</p>
				</div>
				<div className="mt-8">
					<InfiniteScroll
						dataLength={pubData.length}
						next={_fetchData}
						hasMore={hasMore}
					>
						<div className="flex flex-wrap">
							{pubData.map((pub, idx) => (
								<div key={idx} className="w-full md:w-1/2 p-4">
									<PublicationList key={pub._id} data={pub} />
								</div>
							))}
						</div>
					</InfiniteScroll>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Publication

export async function getServerSideProps() {
	const res = await axios(
		`${process.env.API_URL}/publications?__limit=${LIMIT}`
	)
	const pubList = await res.data.data.results

	return { props: { pubList } }
}
