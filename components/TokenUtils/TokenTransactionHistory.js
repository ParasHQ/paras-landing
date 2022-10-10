import axios from 'axios'
import { IconArrowSmall, IconLoader } from 'components/Icons'
import IconCheckbox from 'components/Icons/component/IconCheckbox'
import IconEmptyTransactionHistory from 'components/Icons/component/IconEmptyTransactionHistory'
import IconForbidden from 'components/Icons/component/IconForbidden'
import IconListing from 'components/Icons/component/IconListing'
import IconLoaderSecond from 'components/Icons/component/IconLoaderSecond'
import IconPlaceBid from 'components/Icons/component/IconPlaceBid'
import IconPriceTag from 'components/Icons/component/IconPriceTag'
import { sentryCaptureException } from 'lib/sentry'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { prettyBalance, prettyTruncate, timeAgo } from 'utils/common'

const FETCH_LIMIT_ACTIVITIES = 100
const HEADERS = [
	{
		id: 'type',
		title: 'Transaction Type',
		className: `flex w-4/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'id',
		title: 'Transaction ID',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'price',
		title: 'Price',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'buyer',
		title: 'Buyer',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'seller',
		title: 'Seller',
		className: `flex flex-col md:flex-row items-center w-2/6 md:w-full md:flex-shrink-0 p-3 md:p-0 lg:p-3 md:h-full`,
	},
	{
		id: 'date',
		title: 'Date',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
]

const FilterEnum = {
	ALL: 'All',
	SALE: 'Sale',
	LISTING: 'Listing',
	PLACE_OFFER: 'Place Offer',
	CANCEL_BID: 'Cancel Bid',
	REMOVE_LISTING: 'Remove Listing',
}

const TokenTransactionHistory = ({ localToken }) => {
	const [activities, setActivities] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const [showFilterModal, setShowFilterModal] = useState(false)
	const [filter, setFilter] = useState(['Sale'])
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		fetchActivities()
	}, [])

	const fetchActivities = async () => {
		if (!hasMore || isFetching) return

		setIsFetching(true)

		try {
			const res = await axios.get(`${process.env.V2_API_URL}/activities`, {
				params: {
					contract_id: localToken.contract_id,
					token_series_id: localToken.token_series_id,
					token_id: localToken.token_id,
					__limit: FETCH_LIMIT_ACTIVITIES,
					__sort: '_id::-1',
				},
			})

			const newRes = await res.data.data.results
			const concatActivities = [...activities, ...newRes]
			setActivities(concatActivities)

			if (newRes.length < FETCH_LIMIT_ACTIVITIES) {
				setHasMore(false)
			} else {
				setHasMore(true)
			}
		} catch (err) {
			sentryCaptureException(err)
		}

		setIsFetching(false)
	}

	const sortFetchActivities = () => {}

	const parseActivityIcon = (activity) => {
		if (activity.type === 'add_market_data' && activity.price) {
			return <IconListing size={20} />
		} else if (activity.type === 'resolve_purchase' && activity.price) {
			return <IconPriceTag size={20} stroke={'#F9F9F9'} />
		} else if (activity.type === 'add_bid' && activity.price) {
			return <IconPlaceBid size={20} />
		} else if (activity.type === 'cancel_bid') {
			return <IconForbidden size={20} />
		} else if (activity.type === 'delete_market_data') {
			return <IconForbidden size={20} />
		} else if (activity.type === 'nft_transfer') {
			return <IconListing size={20} />
		}
	}

	const parseActivityType = (activity) => {
		if (activity.type === 'add_market_data' && activity.price) {
			return <p className="text-xs text-neutral-10 bg-[#434400] rounded-sm p-1">Update Listing</p>
		} else if (activity.type === 'resolve_purchase' && activity.price) {
			return <p className="text-xs text-neutral-10 bg-[#004407] rounded-sm p-1">Sale</p>
		} else if (activity.type === 'add_bid' && activity.price) {
			return <p className="text-xs text-neutral-10 bg-[#002344] rounded-sm p-1">Place Bid</p>
		} else if (activity.type === 'cancel_bid') {
			return <p className="text-xs text-neutral-10 bg-[#400000] rounded-sm p-1">Cancel Bid</p>
		} else if (activity.type === 'delete_market_data') {
			return <p className="text-xs text-neutral-10 bg-[#400000] rounded-sm p-1">Remove Listing</p>
		} else if (activity.type === 'nft_transfer') {
			return <p className="text-xs text-neutral-10 bg-[#002344] rounded-sm p-1">Transfer</p>
		}
	}

	return (
		<div className="relative max-w-6xl m-auto pt-10 pb-14">
			<div className="flex flex-row justify-between items-center mb-5">
				<div>
					<p className="font-bold text-xl text-white mb-3">Transaction History</p>
					<p className="font-thin text-sm text-white">
						Watch your NFT transaction activity and filter it by the type
					</p>
				</div>
				<div className="relative">
					<button
						className="flex flex-row justify-between items-center bg-neutral-05 rounded-lg p-2"
						onClick={() => setShowFilterModal(!showFilterModal)}
					>
						<p className="text-white text-sm mr-36">Filter</p>
						<IconArrowSmall color={'#F9F9F9'} className="rotate-90" />
					</button>
					{showFilterModal && (
						<div className="absolute top-12 right-0 grid grid-cols-1 w-56 bg-neutral-01 border border-neutral-05 rounded-lg p-2 z-10 shadow-sm shadow-neutral-05">
							{Object.keys(FilterEnum).map((x) => (
								<button
									key={x}
									className="inline-flex gap-x-2 hover:bg-neutral-03 hover:border hover:border-neutral-05 hover:rounded-lg p-2"
									onClick={() => {
										if (filter.indexOf(FilterEnum[x]) !== -1) {
											// const newFilter = filter.splice(filter.indexOf(FilterEnum[x]), 1)
											// setFilter(newFilter)
										} else {
											// setFilter([...filter, FilterEnum[x]])
										}
									}}
								>
									<IconCheckbox size={20} />
									<p className="text-neutral-10 text-sm">{FilterEnum[x]}</p>
								</button>
							))}
						</div>
					)}
				</div>
			</div>
			<div>
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg pt-4 pb-10 px-4">
					{activities.length <= 0 ? (
						<IconEmptyTransactionHistory size={150} className="mx-auto" />
					) : (
						<div>
							<div className="grid grid-cols-7 gap-x-1 border border-neutral-05 rounded-lg p-4">
								<p className="text-neutral-10 text-sm col-span-2">Transaction Type</p>
								<p className="text-neutral-10 text-sm">Transaction ID</p>
								<p className="text-neutral-10 text-sm">Price</p>
								<p className="text-neutral-10 text-sm">From</p>
								<p className="text-neutral-10 text-sm">To</p>
								<p className="text-neutral-10 text-sm">Date</p>
							</div>
							<div className="h-96 overflow-auto">
								<InfiniteScroll
									dataLength={activities.length}
									next={fetchActivities}
									hasMore={hasMore}
									loader={<IconLoaderSecond size={30} className="mx-auto" />}
								>
									{activities.map((activity, index) => {
										return (
											<div key={index} className="max-h-64">
												{index % 2 === 0 ? (
													<div className="grid grid-cols-7 gap-x-1 p-4 bg-neutral-01 border-b border-b-neutral-05">
														<div className="flex flex-row items-center gap-x-1 col-span-2">
															{parseActivityIcon(activity)}
															<p className="text-neutral-10 text-sm">
																{parseActivityType(activity)}
															</p>
														</div>
														<p className="text-neutral-10 text-sm">
															{prettyTruncate(activity.transaction_hash, 10)}
														</p>
														<p className="text-neutral-10 text-sm">
															{activity.price
																? `${formatNearAmount(
																		activity.price?.$numberDecimal || activity.price
																  )} Ⓝ`
																: '---'}
														</p>
														<p className="text-neutral-10 text-sm">{activity.from}</p>
														<p className="text-neutral-10 text-sm">{activity.to}</p>
														<p className="text-neutral-10 text-sm">
															{timeAgo.format(activity.issued_at)}
														</p>
													</div>
												) : (
													<div className="grid grid-cols-7 gap-x-1 p-4 bg-neutral-03 border-b border-b-neutral-05">
														<div className="flex flex-row items-center gap-x-1 col-span-2">
															{parseActivityIcon(activity)}
															<p className="text-neutral-10 text-sm">
																{parseActivityType(activity)}
															</p>
														</div>
														<p className="text-neutral-10 text-sm">
															{prettyTruncate(activity.transaction_hash, 10)}
														</p>
														<p className="text-neutral-10 text-sm">
															{activity.price
																? `${formatNearAmount(
																		activity.price?.$numberDecimal || activity.price
																  )} Ⓝ`
																: '---'}
														</p>
														<p className="text-neutral-10 text-sm">{activity.from}</p>
														<p className="text-neutral-10 text-sm">{activity.to}</p>
														<p className="text-neutral-10 text-sm">
															{timeAgo.format(activity.issued_at)}
														</p>
													</div>
												)}
											</div>
										)
									})}
								</InfiniteScroll>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default TokenTransactionHistory
