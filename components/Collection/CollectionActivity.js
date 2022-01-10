import Link from 'next/link'
import CollectionActivityLoader from './CollectionActivityLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useIntl } from 'hooks/useIntl'
import { useState } from 'react'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { prettyTruncate, timeAgo } from 'utils/common'
import Media from 'components/Common/Media'

const HEADERS = [
	{
		id: 'collection_id',
		title: 'Collection',
		className: `flex w-4/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'price',
		title: 'Price',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'from',
		title: 'From',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'to',
		title: 'To',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'time',
		title: 'Time',
		className: `flex flex-col md:flex-row items-center w-2/6 md:w-full md:flex-shrink-0 p-3 md:p-0 lg:p-3 md:h-full`,
	},
	{
		id: 'type',
		title: 'Type',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
]

const CollectionActivity = ({ activities, fetchData, hasMore }) => {
	const [showDetailActivity, setShowDetailActivity] = useState(-1)

	const { localeLn } = useIntl()

	const parseType = (creator, price, from, to, type) => {
		if ((type === 'nft_transfer' && price && from && to) || type === 'resolve_purchase') {
			return 'Sold'
		} else if (type === 'nft_transfer' && from === null) {
			return 'Minted'
		} else if (type === 'nft_transfer' && to === null) {
			return 'Burned'
		} else if (type === 'nft_transfer' || !price || to === creator) {
			return 'Transfer'
		} else if (type === 'nft_set_series_price') {
			return 'Set Price'
		} else if (type === 'notification_add_offer' || type === 'add_offer') {
			return 'Offer'
		} else if (
			type === 'notification_category_accepted' ||
			type === 'notification_category_rejected'
		) {
			return 'Submission'
		} else if (type === 'nft_create_series') {
			return 'Creation'
		} else if (type === 'add_market_data') {
			return 'Market'
		} else {
			return type
		}
	}

	const showDetail = (index) => {
		if (showDetailActivity == index) setShowDetailActivity(-1)
		else setShowDetailActivity(index)
	}

	return (
		<div className="overflow-x-auto bg-black bg-opacity-25 w-full rounded-lg">
			<div className="text-white bg-gray-50 bg-opacity-10 rounded p-3">
				<div className="hidden md:block">
					<div className="grid grid-cols-7 gap-10 text-gray-300 hover:opacity-75 border-gray-800 border-b-2">
						{HEADERS.map((d, index) => {
							return (
								<div
									key={d.id}
									className={`${
										index === 0 && 'col-span-2 justify-start'
									} flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`}
								>
									<span>{localeLn(d.title)}</span>
								</div>
							)
						})}
					</div>
				</div>
				<InfiniteScroll
					dataLength={activities.length}
					next={fetchData}
					hasMore={hasMore}
					loader={<CollectionActivityLoader />}
				>
					{activities.map((activity, index) => {
						return (
							<div key={activity._id} className="py-3">
								<div className="w-full">
									<div
										className="flex flex-row items-center w-full cursor-pointer sm:cursor-default md:grid md:grid-cols-7 md:gap-5 lg:gap-10 md:h-19 md:hover:bg-gray-800"
										onClick={() => showDetail(index)}
									>
										<div className="flex md:col-span-2 items-center md:cursor-pointer">
											<div className="w-1/4 bg-blue-900 rounded-lg z-20">
												{activity?.data?.[0]?.metadata.media && (
													<Link
														href={`/token/${activity.contract_id}::${activity.token_series_id}`}
													>
														<a>
															<Media
																className="rounded-lg overflow-hidden"
																url={activity?.data?.[0]?.metadata.media}
																videoControls={false}
																videoLoop={true}
																videoMuted={true}
																autoPlay={false}
															/>
														</a>
													</Link>
												)}
											</div>
											<div className="pl-4 overflow-hidden cursor-pointer">
												<Link href={`/token/${activity.contract_id}::${activity.token_series_id}`}>
													<a className="font-semibold z-20">
														{prettyTruncate(activity?.data?.[0]?.metadata.title, 25)}
													</a>
												</Link>
												<Link href={`/token/${activity.contract_id}::${activity.token_series_id}`}>
													<p className="w-min md:hidden font-semibold truncate z-20">
														{formatNearAmount(activity.price ? activity.price : '0')} Ⓝ
													</p>
												</Link>
											</div>
										</div>
										<div
											className={`${HEADERS[1].className} hidden md:flex md:text-sm lg:text-base font-bold justify-start`}
										>
											{formatNearAmount(activity.price ? activity.price : '0')} Ⓝ
										</div>
										<div
											className={`${HEADERS[2].className} hidden md:flex md:text-sm lg:text-base justify-start`}
										>
											<Link href={`/${activity.from}`}>
												<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
													{activity.from && prettyTruncate(activity.from, 12, 'address')}
												</p>
											</Link>{' '}
										</div>
										<div
											className={`${HEADERS[3].className} hidden md:flex md:text-sm lg:text-base justify-start`}
										>
											<Link href={`/${activity.to}`}>
												<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer">
													{activity.to && prettyTruncate(activity.to, 12, 'address')}
												</p>
											</Link>
										</div>
										<div
											className={`${HEADERS[4].className} text-xs text-center sm:text-base md:text-sm text-gray-50 opacity-50 font-thin w-full justify-end`}
										>
											{timeAgo.format(
												new Date(activity.issued_at ? activity.issued_at : 1636197684986)
											)}
											<div className="relative top-1 items-end md:hidden">
												<svg
													width="10"
													height="10"
													viewBox="0 0 21 19"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z"
														fill="white"
													/>
												</svg>
											</div>
										</div>
										<div
											className={`${HEADERS[4].className} font-thin hidden md:flex md:text-sm lg:text-base justify-start`}
										>
											{parseType(
												activity.creator_id,
												activity.price,
												activity.from,
												activity.to,
												activity.type
											)}
										</div>
									</div>
								</div>
								{showDetailActivity == index && (
									<div
										key={activity._id}
										className="flex order-5 w-full justify-between items-center my-2 py-2 border-t-2 border-b-2 border-opacity-10 text-xs md:hidden"
									>
										<div className="flex flex-col flex-shrink text-center w-1/2">
											<p className="font-thin text-white text-opacity-50 pb-2">From</p>
											<Link href={`/${activity.from}`}>
												<p className="font-bold cursor-pointer">
													{prettyTruncate(activity.from, 12, 'address')}
												</p>
											</Link>
										</div>
										<div className="flex flex-col flex-shrink text-center w-1/2">
											<p className="font-thin text-white text-opacity-50 pb-2">To</p>
											<Link href={`/${activity.to}`}>
												<p className="font-bold cursor-pointer">
													{prettyTruncate(activity.to, 12, 'address')}
												</p>
											</Link>
										</div>
										<div className="flex flex-col flex-shrink text-center w-1/2">
											<p className="font-thin text-white text-opacity-50 pb-2">Type</p>
											<p className="font-bold">
												{parseType(
													activity.creator_id,
													activity.price,
													activity.from,
													activity.to,
													activity.type
												)}
											</p>
										</div>
									</div>
								)}
							</div>
						)
					})}
				</InfiniteScroll>
			</div>
		</div>
	)
}

export default CollectionActivity
