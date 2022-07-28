import Axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Bid from 'components/Bid/Bid'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import useStore from 'lib/store'

import { useIntl } from 'hooks/useIntl'
const MyBids = () => {
	const { localeLn } = useIntl()
	const store = useStore()
	const [page, setPage] = useState(0)
	const [type, setType] = useState('myBids')
	const [bidsData, setBidsData] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		if (store.currentUser) {
			_fetchData(true)
		}
	}, [type])

	useEffect(() => {
		if (bidsData.length === 0 && hasMore && store.currentUser) {
			_fetchData(true)
		}
	}, [store.currentUser])

	const _fetchData = async (initial = false) => {
		const _hasMore = initial ? true : hasMore
		const _page = initial ? 0 : page
		const _bidsData = initial ? [] : bidsData

		if (!_hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await Axios(
			`${process.env.V2_API_URL}/offers?${
				type === 'receivedBids'
					? `receiver_id=${store.currentUser}`
					: `buyer_id=${store.currentUser}`
			}&__limit=10&__skip=${_page * 10}`
		)
		const newData = await res.data.data

		const newBidsData = [..._bidsData, ...newData.results]
		setBidsData(newBidsData)
		setPage(_page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const switchType = (_type) => {
		setType(_type)
		setBidsData([])
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
				<title>{localeLn('MyOffersParas')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>

				<meta
					name="twitter:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta
					property="og:site_name"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta
					property="og:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-4xl relative m-auto py-12 px-4">
				<div className="md:flex md:space-x-6 mb-4">
					<div
						onClick={() => switchType('myBids')}
						className={`cursor-pointer text-4xl text-gray-100 ${
							type === 'myBids' ? 'font-bold' : 'opacity-75'
						}`}
					>
						{localeLn('MyOffers')}
					</div>
					<div
						onClick={() => switchType('receivedBids')}
						className={`cursor-pointer text-4xl text-gray-100 ${
							type === 'receivedBids' ? 'font-bold' : 'opacity-75'
						}`}
					>
						{localeLn('ReceivedOffers')}
					</div>
				</div>
				<InfiniteScroll
					dataLength={bidsData.length}
					next={_fetchData}
					hasMore={hasMore}
					loader={
						<div className="border-2 border-dashed my-4 p-2 rounded-md text-center border-gray-800">
							<p className="my-2 text-center text-gray-200">{localeLn('LoadingLoading')}</p>
						</div>
					}
				>
					{bidsData.map((bid) => (
						<div key={bid._id}>
							<Bid data={bid} type={type} freshFetch={() => _fetchData(true)} />
						</div>
					))}
					{bidsData.length === 0 && !hasMore && (
						<div className="border-2 border-dashed p-2 rounded-md text-center border-gray-800 my-4">
							<p className="my-20 text-center text-gray-200">{localeLn('NoActiveOffer')}</p>
						</div>
					)}
					{bidsData.length === 0 && hasMore && (
						<div className="border-2 border-dashed p-2 rounded-md text-center border-gray-800 my-4">
							<p className="my-20 text-center text-gray-200">{localeLn('LoadingLoading')}</p>
						</div>
					)}
				</InfiniteScroll>
			</div>
			<Footer />
		</div>
	)
}

export default MyBids
