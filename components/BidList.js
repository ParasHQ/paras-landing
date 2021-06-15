import { useEffect, useState } from 'react'
import Axios from 'axios'
import LinkToProfile from './LinkToProfile'
import InfiniteScroll from 'react-infinite-scroll-component'
import { prettyBalance, timeAgo } from '../utils/common'
import useSWR from 'swr'
import Link from 'next/link'
import useStore from '../store'
import Modal from './Modal'
import near from '../lib/near'

const BidItem = ({ data, userOwnership, tokenId }) => {
	console.log(userOwnership)
	const store = useStore()
	const [showModal, setShowModal] = useState('')

	const fetcher = async (key) => {
		const resp = await axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const { data: profile } = useSWR(
		`profiles?accountId=${data.accountId}`,
		fetcher
	)

	const acceptBid = async () => {
		const params = {
			ownerId: data.accountId,
			tokenId: tokenId,
			quantity:
				data.bidMarketData.quantity > userOwnership.quantity
					? userOwnership.quantity.toString()
					: data.bidMarketData.quantity.toString(),
		}

		console.log('params', params)

		try {
			await near.contract.acceptBidMarketData(params, '50000000000000')
			console.log('success')
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			{showModal === 'acceptBid' && (
				<Modal close={(_) => setShowModal('')}>
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
						<div>You will get 10 Near</div>
						<div onClick={acceptBid}>Accept</div>
					</div>
				</Modal>
			)}
			<div className="m-auto border-2 border-dashed my-4 p-2 rounded-md">
				<div className="flex justify-between items-center">
					<div className="flex items-center overflow-hidden">
						<Link href={`/${data.accountId}`}>
							<div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden cursor-pointer bg-primary">
								{profile && (
									<img
										className="object-cover"
										src={parseImgUrl(profile.imgUrl)}
									/>
								)}
							</div>
						</Link>
						<div className="px-2">
							<LinkToProfile accountId={data.accountId} len={20} />
						</div>
					</div>
					<p className="mt-1 text-sm">{timeAgo.format(data.createdAt)}</p>
				</div>
				<div className="flex items-center justify-between mt-2">
					<div>
						<span>Bid {prettyBalance(data.bidMarketData.amount, 24, 4)} Ⓝ</span>
						<span> for {data.bidMarketData.quantity} pcs</span>
					</div>
					{userOwnership && store.currentUser !== data.accountId && (
						<button
							className="font-semibold w-24 rounded-md bg-primary text-white"
							onClick={() => setShowModal('acceptBid')}
						>
							Accept
						</button>
					)}
					{store.currentUser === data.accountId && (
						<button className="font-semibold w-24 rounded-md border-primary border-2 text-primary">
							Cancel
						</button>
					)}
				</div>
			</div>
		</>
	)
}

const BidList = ({ tokenId, userOwnership }) => {
	const [bidList, setBidList] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		if (bidList.length === 0 && hasMore) {
			_fetchData()
		}
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await Axios(
			`${process.env.API_URL}/bids?tokenId=${tokenId}&__skip=${
				page * 5
			}&__limit=5&`
		)
		const newData = await res.data.data

		const newBidList = [...bidList, ...newData.results]
		setBidList(newBidList)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div>
			{bidList.length === 0 && !hasMore && (
				<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
					<p className="text-gray-500 py-8 px-8">No bidding yet</p>
				</div>
			)}
			<InfiniteScroll
				dataLength={bidList.length}
				next={_fetchData}
				hasMore={hasMore}
				loader={
					<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
						<p className="my-2 text-center">Loading...</p>
					</div>
				}
				scrollableTarget="BidList"
			>
				{bidList.map((bid) => {
					return (
						<BidItem
							key={bid._id}
							data={bid}
							userOwnership={userOwnership}
							tokenId={tokenId}
						/>
					)
				})}
			</InfiniteScroll>
		</div>
	)
}

export default BidList
