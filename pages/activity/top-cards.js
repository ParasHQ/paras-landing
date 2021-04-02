import { useState } from 'react'
import axios from 'axios'
import router from 'next/router'
import Head from 'next/head'
import InfiniteScroll from 'react-infinite-scroll-component'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import UserTransactionList from '../../components/Activity/UserTransactionDetail'
import Card from '../../components/Card'
import { parseImgUrl, prettyBalance } from '../../utils/common'

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
			}__limit=${LIMIT}`
		)

		console.log('response', res.data.data.results)
		const newCardsData = [...cardsData, ...res.data.data.results]
		setCardsData(newCardsData)
		setPage(page + 1)

		if (page === 5) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	console.log('cardsdata', cardsData)

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
					<h1 className="text-4xl font-bold text-gray-100">Top Cards</h1>
				</div>
				<InfiniteScroll
					dataLength={cardsData.length}
					next={_fetchData}
					hasMore={hasMore}
				>
					{cardsData.map((card) => {
						const localToken = card.token
						const firstPrice = parseFloat(
							prettyBalance(card.firstSale.amount, 24, 6)
						)
						const lastPrice = parseFloat(
							prettyBalance(card.lastSale.amount, 24, 6)
						)
						const change = ((lastPrice - firstPrice) / firstPrice) * 100

						return (
							<div className="flex">
								<div className="w-64">
									<div className="w-full">
										<Card
											imgUrl={parseImgUrl(localToken?.metadata?.image)}
											imgBlur={localToken?.metadata?.blurhash}
											token={{
												name: localToken?.metadata?.name,
												collection: localToken?.metadata?.collection,
												description: localToken?.metadata?.description,
												creatorId: localToken?.creatorId,
												supply: localToken?.supply,
												tokenId: localToken?.tokenId,
												createdAt: localToken?.createdAt,
											}}
											initialRotate={{
												x: 0,
												y: 0,
											}}
											borderRadius={'5px'}
										/>
									</div>
								</div>
								<div className="text-white">
									<p>{localToken.metadata.name}</p>
									<p>{localToken.metadata.collection}</p>
									<p>{localToken.creatorId}</p>
									<p>{localToken.supply}</p>
									<p>average {prettyBalance(card.average, 24, 6)} Ⓝ</p>
									<p>total {prettyBalance(card.volume, 24, 6)} Ⓝ</p>
									<p>total transaction {card.txLength}</p>
									<p>first price {firstPrice} Ⓝ</p>
									<p>last price {lastPrice} Ⓝ</p>
									<p>change {change.toPrecision(2)}%</p>
								</div>
							</div>
						)
					})}
				</InfiniteScroll>
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
