import Link from 'next/link'
import CollectionActivityLoader from './CollectionActivityLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useIntl } from 'hooks/useIntl'
import { useState } from 'react'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { parseImgUrl, prettyTruncate, timeAgo } from 'utils/common'
import Media from 'components/Common/Media'
import DailyVolume from 'components/LineChart/DailyVolume'
import router from 'next/router'
import { SHOW_TX_HASH_LINK } from 'constants/common'
import { IconShareActivity, IconTriangle } from 'components/Icons'

const DefaultSortIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-arrows-sort"
		width={20}
		height={20}
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="#d3d5db"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M3 9l4 -4l4 4m-4 -4v14" />
		<path d="M21 15l-4 4l-4 -4m4 4v-14" />
	</svg>
)

const AscendingSortIcon = ({ color }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-arrow-narrow-up"
		width={20}
		height={20}
		viewBox="0 0 24 24"
		strokeWidth="3.0"
		stroke={color}
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<line x1={12} y1={5} x2={12} y2={19} />
		<line x1={16} y1={9} x2={12} y2={5} />
		<line x1={8} y1={9} x2={12} y2={5} />
	</svg>
)

const DescendingSortIcon = ({ color }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-arrow-narrow-down"
		width={20}
		height={20}
		viewBox="0 0 24 24"
		strokeWidth="3.0"
		stroke={color}
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<line x1={12} y1={5} x2={12} y2={19} />
		<line x1={16} y1={15} x2={12} y2={19} />
		<line x1={8} y1={15} x2={12} y2={19} />
	</svg>
)

const HEADERS = [
	{
		id: 'title',
		title: 'Title',
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

const HeadersSmall = [
	{
		id: 'price',
		title: 'Price',
	},
	{
		id: 'from',
		title: 'From',
	},
	{
		id: 'to',
		title: 'To',
	},
]

const CollectionActivity = ({
	activities,
	fetchData,
	hasMore,
	dailyVolume,
	collectionId,
	querySort,
}) => {
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
		<div>
			<p className="text-white text-xl font-bold ml-2 mb-2 text-opacity-70">Volume</p>
			<DailyVolume data={dailyVolume} />
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
										<span className={`${querySort.headerActivities === d.id && `font-bold`}`}>
											{localeLn(d.title)}
										</span>
										{d.id === 'price' || d.id === 'from' || d.id === 'to' ? (
											<>
												{querySort.headerActivities === d.id ? (
													<>
														{querySort.sortActivities === '' && (
															<div
																key={d.id}
																className="cursor-pointer"
																onClick={() => {
																	router.push(
																		{
																			query: {
																				headerActivities: d.id,
																				sortActivities: 'asc',
																				tab: `activity`,
																			},
																		},
																		`/collection/${collectionId}?tab=activity`,
																		{ shallow: true, scroll: false }
																	)
																}}
															>
																<DefaultSortIcon />
															</div>
														)}
														{querySort.sortActivities === 'asc' && (
															<div
																key={d.id}
																className="cursor-pointer"
																onClick={() => {
																	router.push(
																		{
																			query: {
																				headerActivities: d.id,
																				sortActivities: 'desc',
																				tab: `activity`,
																			},
																		},
																		`/collection/${collectionId}?tab=activity`,
																		{ shallow: true, scroll: false }
																	)
																}}
															>
																<AscendingSortIcon
																	color={
																		querySort.headerActivities === d.id ? `#b4bac2` : `#d3d5db`
																	}
																/>
															</div>
														)}
														{querySort.sortActivities === 'desc' && (
															<div
																key={d.id}
																className="cursor-pointer"
																onClick={() => {
																	router.push(
																		{
																			query: {
																				headerActivities: d.id,
																				sortActivities: '',
																				tab: `activity`,
																			},
																		},
																		`/collection/${collectionId}?tab=activity`,
																		{ shallow: true, scroll: false }
																	)
																}}
															>
																<DescendingSortIcon
																	color={
																		querySort.headerActivities === d.id ? `#b4bac2` : `#d3d5db`
																	}
																/>
															</div>
														)}
													</>
												) : (
													<div
														key={d.id}
														className="cursor-pointer"
														onClick={() => {
															router.push(
																{
																	query: {
																		headerActivities: d.id,
																		sortActivities: 'asc',
																		tab: `activity`,
																	},
																},
																`/collection/${collectionId}?tab=activity`,
																{ shallow: true, scroll: false }
															)
														}}
													>
														<DefaultSortIcon />
													</div>
												)}
											</>
										) : null}
									</div>
								)
							})}
						</div>
					</div>
					<div className="block md:hidden">
						<div className="grid grid-cols-3">
							{HeadersSmall.map((head, idx) => {
								return (
									<div key={`${head.id}-${idx}`} className=" flex items-center justify-center mb-5">
										<p className="font-thin border-b-2 border-transparent hover:border-gray-100 cursor-pointer mr-2">
											{head.title}
										</p>
										{querySort.headerActivities === head.id ? (
											<>
												{querySort.sortActivities === '' && (
													<div
														key={head.id}
														className="cursor-pointer"
														onClick={() => {
															router.push(
																{
																	query: {
																		headerActivities: head.id,
																		sortActivities: 'asc',
																		tab: `activity`,
																	},
																},
																`/collection/${collectionId}?tab=activity`,
																{ shallow: true, scroll: false }
															)
														}}
													>
														<DefaultSortIcon />
													</div>
												)}
												{querySort.sortActivities === 'asc' && (
													<div
														key={head.id}
														className="cursor-pointer"
														onClick={() => {
															router.push(
																{
																	query: {
																		headerActivities: head.id,
																		sortActivities: 'desc',
																		tab: `activity`,
																	},
																},
																`/collection/${collectionId}?tab=activity`,
																{ shallow: true, scroll: false }
															)
														}}
													>
														<AscendingSortIcon
															color={querySort.headerActivities === head.id ? `#b4bac2` : `#d3d5db`}
														/>
													</div>
												)}
												{querySort.sortActivities === 'desc' && (
													<div
														key={head.id}
														className="cursor-pointer"
														onClick={() => {
															router.push(
																{
																	query: {
																		headerActivities: head.id,
																		sortActivities: '',
																		tab: `activity`,
																	},
																},
																`/collection/${collectionId}?tab=activity`,
																{ shallow: true, scroll: false }
															)
														}}
													>
														<DescendingSortIcon
															color={querySort.headerActivities === head.id ? `#b4bac2` : `#d3d5db`}
														/>
													</div>
												)}
											</>
										) : (
											<div
												key={head.id}
												className="cursor-pointer"
												onClick={() => {
													router.push(
														{
															query: {
																headerActivities: head.id,
																sortActivities: 'asc',
																tab: `activity`,
															},
														},
														`/collection/${collectionId}?tab=activity`,
														{ shallow: true, scroll: false }
													)
												}}
											>
												<DefaultSortIcon />
											</div>
										)}
									</div>
								)
							})}
						</div>
					</div>
					{activities.length === 0 && !hasMore && (
						<div className="w-full">
							<div className="m-auto text-2xl text-gray-600 font-semibold py-5 text-center">
								<div className="w-40 m-auto">
									<img src="/cardstack.png" className="opacity-75" />
								</div>
								<p className="mt-4">{localeLn('NoActivities')}</p>
							</div>
						</div>
					)}
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
																	url={parseImgUrl(activity?.data?.[0]?.metadata.media, null, {
																		width: `300`,
																		useOriginal:
																			process.env.APP_ENV === 'production' ? false : true,
																		isMediaCdn: activity?.data?.[0]?.isMediaCdn,
																	})}
																	videoControls={false}
																	videoLoop={true}
																	videoMuted={true}
																	autoPlay={false}
																	playVideoButton={false}
																/>
															</a>
														</Link>
													)}
												</div>
												<div className="pl-4 overflow-hidden cursor-pointer">
													<Link
														href={`/token/${activity.contract_id}::${activity.token_series_id}`}
													>
														<a className="font-semibold z-20">
															{prettyTruncate(activity?.data?.[0]?.metadata.title, 25)}
														</a>
													</Link>
													<Link
														href={`/token/${activity.contract_id}::${activity.token_series_id}`}
													>
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
													<IconTriangle size={10} />
												</div>
											</div>
											{SHOW_TX_HASH_LINK && (
												<div
													className="flex md:hidden ml-3 mb-1"
													onClick={(e) => e.stopPropagation()}
												>
													<a
														href={`https://${
															process.env.APP_ENV === 'production' ? `` : `testnet.`
														}nearblocks.io/txns/${activity.transaction_hash}${
															activity.msg?.receipt_id && `#${activity.msg?.receipt_id}`
														}`}
														target={`_blank`}
													>
														<IconShareActivity size={20} />
													</a>
												</div>
											)}
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
												{SHOW_TX_HASH_LINK && (
													<div className="hidden md:flex ml-3 mb-1">
														<a
															href={`https://${
																process.env.APP_ENV === 'production' ? `` : `testnet.`
															}nearblocks.io/txns/${activity.transaction_hash}${
																activity.msg?.receipt_id && `#${activity.msg?.receipt_id}`
															}`}
															target={`_blank`}
														>
															<IconShareActivity size={20} />
														</a>
													</div>
												)}
											</div>
										</div>
									</div>
									{showDetailActivity == index && (
										<div
											key={activity._id}
											className="flex order-5 w-full justify-between items-center my-2 py-2 border-t-2 border-b-2 border-opacity-10 border-white text-xs md:hidden"
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
		</div>
	)
}

export default CollectionActivity
