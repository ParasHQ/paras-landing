import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Media from 'components/Common/Media'
import { useIntl } from 'hooks/useIntl'
import IconPriceTag from 'components/Icons/component/IconPriceTag'
import { IconArrowSmall } from 'components/Icons'
import { prettyTruncate, parseImgUrl, prettyBalance, nanoSecToMiliSec, timeAgo } from 'utils/common'
import useStore from 'lib/store'
import JSBI from 'jsbi'
import Button from 'components/Common/Button'
import { parseNearAmount, formatNearAmount } from 'near-api-js/lib/utils/format'
import IconClock from 'components/Icons/component/IconClock'
import IconBid from 'components/Icons/component/IconBid'

const TokenPriceInfo = ({
	localToken,
	onShowBuyModal,
	onShowBidModal,
	onShowOfferModal,
	onShowMintModal,
	onShowUpdatePriceModal,
	onShowAuctionModal,
	onShowTransferModal,
	onShowUpdateListingModal,
	onShowRemoveAuction,
}) => {
	const { localeLn } = useIntl()
	const router = useRouter()
	const store = useStore()
	const currentUser = store.currentUser

	const [isEndedTime, setIsEndedTime] = useState(false)
	const [isEndedAuction, setIsEndedAuction] = useState(false)
	const [days, setDays] = useState('-')
	const [hours, setHours] = useState('-')
	const [mins, setMins] = useState('-')
	const [secs, setSecs] = useState('-')
	const [historyBid, setHistoryBid] = useState([])
	const [showBidderList, setShowBidderList] = useState(false)

	useEffect(() => {
		if (!localToken.is_auction) {
			delete router.query.tab
			router.push(router)
		}
	}, [localToken])

	useEffect(() => {
		let histBid = []
		if (localToken.bidder_list && localToken.bidder_list.length > 0) {
			histBid = [...histBid, ...localToken.bidder_list]
		}

		if (localToken.extend_list && localToken.extend_list.length > 0) {
			histBid = [...histBid, ...localToken.extend_list]
		}

		const sortedHistoryBid = histBid.sort((a, b) => a.issued_at - b.issued_at)
		setHistoryBid(sortedHistoryBid)
	}, [localToken])

	useEffect(() => {
		const endedDate = nanoSecToMiliSec(localToken.ended_at)

		const timer = setInterval(() => {
			const currentDate = new Date().getTime()

			if (!isEndedTime) {
				let distance = parseInt(endedDate) - parseInt(currentDate)

				let days = Math.floor(distance / (1000 * 60 * 60 * 24))
				let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
				let seconds = Math.floor((distance % (1000 * 60)) / 1000)

				setDays(days)
				setHours(hours)
				setMins(minutes)
				setSecs(seconds)

				if (distance < 0) {
					clearInterval(timer)
					setIsEndedTime(true)
					setIsEndedAuction(true)
				}
			}
		})
	}, [localToken])

	const isCreator = () => {
		if (!currentUser) {
			return false
		}

		return (
			currentUser === localToken.metadata.creator_id ||
			(!localToken.metadata.creator_id && currentUser === localToken.contract_id)
		)
	}

	const nanoSecToDate = (timestamp) => {
		const sliceNanoSec = String(timestamp).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			const toDate = new Date(parseInt(sliceNanoSec)).toUTCString()
			const splitGMT = toDate.split('GMT')[0]
			return splitGMT
		}
	}

	const checkNextPriceBid = (type) => {
		if (localToken?.bidder_list && localToken?.bidder_list?.length !== 0) {
			const currentBid = JSBI.BigInt(
				localToken?.bidder_list && localToken?.bidder_list?.length !== 0
					? isCurrentBid('amount')
					: localToken?.price
			)
			const multiplebid = JSBI.multiply(JSBI.divide(currentBid, JSBI.BigInt(100)), JSBI.BigInt(5))
			const nextBid = JSBI.add(currentBid, multiplebid).toString()
			const nextBidToNear = (nextBid / 10 ** 24).toFixed(2)
			const nextBidToUSD = parseNearAmount(nextBidToNear.toString())
			if (type === 'near') {
				return nextBidToNear
			} else if (type === 'usd') {
				return nextBidToUSD.toString()
			}
		} else {
			if (type === 'near') {
				return localToken.price ? formatNearAmount(localToken.price) : '0'
			} else if (type === 'usd') {
				const price = localToken?.price || localToken?.lowest_price || '0'
				return price.toString()
			}
		}
	}

	const isCurrentBid = (type) => {
		let list = []
		localToken?.bidder_list?.map((item) => {
			if (type === 'bidder') list.push(item.bidder)
			else if (type === 'time') list.push(item.issued_at)
			else if (type === 'amount') list.push(item.amount)
		})

		return list[list.length - 1]
	}

	const checkUserBid = () => {
		let userBid = []
		localToken?.bidder_list?.map((item) => {
			if (item.bidder === currentUser) {
				userBid.push(item.bidder)
			}
		})

		return userBid[0]
	}

	const hasBid = () => {
		localToken?.bidder_list?.map((bid) => {
			if (bid.bidder === currentUser) {
				return true
			}

			return false
		})
	}

	const highestBid = () => {
		const bidderList = localToken?.bidder_list

		if (bidderList && bidderList.length > 0) {
			const highestBidder = bidderList[bidderList.length - 1].bidder

			if (highestBidder === currentUser) return true
		}

		return false
	}

	return (
		<div
			className={`bg-neutral-04 rounded-lg mt-6 ${
				localToken.bidder_list && localToken.bidder_list?.length > 0 && 'pb-2'
			}`}
		>
			<div className="min-h-56 bg-neutral-03 border border-neutral-05 rounded-lg my-4 p-5">
				{localToken?.is_auction && (
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg w-full flex flex-row justify-between items-center p-2 mb-4">
						<div className="inline-flex items-center">
							<IconClock size={22} stroke={'#F9F9F9'} className="mr-2" />
							<p className="text-xs text-neutral-10 mr-2">Time Left</p>
							<div className="grid grid-cols-4 gap-x-1">
								<p className="bg-neutral-02 rounded-sm text-neutral-10 text-xs font-bold p-2">
									{days} d
								</p>
								<p className="bg-neutral-02 rounded-sm text-neutral-10 text-xs font-bold p-2">
									{hours} h
								</p>
								<p className="bg-neutral-02 rounded-sm text-neutral-10 text-xs font-bold p-2">
									{mins} m
								</p>
								<p className="bg-neutral-02 rounded-sm text-neutral-10 text-xs font-bold p-2">
									{secs} s
								</p>
							</div>
						</div>
						<div>
							<p className="text-right text-xs text-neutral-10">
								Ends in {nanoSecToDate(localToken.ended_at)} UTC
							</p>
						</div>
					</div>
				)}

				{/* Logic to show Price */}
				{!localToken.price && !localToken.is_auction && (
					<div className="block mb-10">
						<div className="inline-flex">
							<IconPriceTag size={20} stroke={'#F9F9F9'} />
							<p className="text-white font-light ml-2">{localeLn('CurrentPrice')}</p>
						</div>
						<div className="line-through text-red-600 my-3">
							<p className="text-4xl font-bold text-gray-100">{localeLn('SALE')}</p>
						</div>
					</div>
				)}
				{localToken.price && !localToken.is_auction && (
					<div className="block mb-10">
						<div className="inline-flex">
							<IconPriceTag size={20} stroke={'#F9F9F9'} />
							<p className="text-white font-light ml-2">{localeLn('StartingBid')}</p>
						</div>

						<div className="flex flex-row items-center my-3">
							<p className="font-bold text-2xl text-neutral-10 truncate">{`${formatNearAmount(
								localToken.price
							)} Ⓝ`}</p>
							{localToken?.price !== '0' && store.nearUsdPrice !== 0 && (
								<div className="text-[10px] text-gray-400 truncate ml-2">
									(~$
									{prettyBalance(JSBI.BigInt(checkNextPriceBid('usd')) * store.nearUsdPrice, 24, 2)}
									)
								</div>
							)}
							{localToken?.price === '0' && localToken?.is_auction && !isEndedAuction && (
								<div className="text-[9px] text-gray-400 truncate mt-1 ml-2">
									~ $
									{prettyBalance(
										JSBI.BigInt(localToken?.amount ? localToken?.amount : localToken?.price) *
											store.nearUsdPrice,
										24,
										2
									)}
								</div>
							)}
						</div>
					</div>
				)}
				{localToken?.is_auction && (
					<>
						<div className="flex flex-row justify-between items-center mb-4">
							{!localToken?.amount || (localToken?.bidder_list && localToken?.bidder_list === 0) ? (
								<div className="block">
									<div className="inline-flex">
										<IconBid size={20} stroke={'#F9F9F9'} />
										<p className="text-white font-light ml-2">{localeLn('CurrentBid')}</p>
									</div>

									<div className="flex flex-row items-center">
										<p className="font-bold text-2xl text-neutral-10 truncate">{`${prettyBalance(
											localToken?.price?.$numberDecimal || localToken?.price,
											24,
											4
										)} Ⓝ`}</p>
										{localToken?.price && localToken?.price !== '0' && store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(localToken?.price, 24, 2)})
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="block">
									<div className="inline-flex">
										<IconBid size={20} stroke={'#F9F9F9'} />
										<p className="text-white font-light ml-2">{localeLn('CurrentBid')}</p>
									</div>

									<div className="flex flex-row items-center">
										<p className="font-bold text-2xl text-neutral-10 truncate">{`${prettyBalance(
											localToken?.amount?.$numberDecimal,
											24,
											4
										)} Ⓝ`}</p>
										{localToken?.amount && store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(
													JSBI.BigInt(localToken?.amount?.$numberDecimal) * store.nearUsdPrice,
													24,
													2
												)}
												)
											</div>
										)}
									</div>
								</div>
							)}
							<div className="block">
								<div className="inline-flex">
									<p className="text-white font-light">{localeLn('Next Bid')}</p>
									<IconArrowSmall size={26} className="pb-1" />
								</div>

								<div className="flex flex-row items-center">
									<p className="font-bold text-2xl text-neutral-10 truncate">{`${prettyBalance(
										checkNextPriceBid('near', localToken),
										0,
										4
									)} Ⓝ`}</p>
									{localToken?.price !== '0' && store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~$
											{prettyBalance(
												JSBI.BigInt(checkNextPriceBid('usd')) * store.nearUsdPrice,
												24,
												2
											)}
											)
										</div>
									)}
								</div>
							</div>
						</div>
					</>
				)}

				{/* Logic to show Button */}
				{localToken.owner_id &&
					localToken.owner_id !== currentUser &&
					!localToken.price &&
					!localToken.is_auction && (
						<Button variant="ghost" className={'w-full'} onClick={onShowOfferModal}>
							Make Offer
						</Button>
					)}
				{localToken.owner_id &&
					localToken.owner_id !== currentUser &&
					localToken.price &&
					!localToken.is_auction && (
						<div className="md:grid grid-cols-2 gap-x-6">
							<Button variant={'second'} onClick={onShowOfferModal}>
								Make Offer
							</Button>
							<Button variant={'primary'} onClick={onShowBuyModal}>
								Buy Now
							</Button>
						</div>
					)}
				{localToken.owner_id !== currentUser && localToken.is_auction && !hasBid() && (
					<Button variant={'primary'} onClick={onShowBidModal} className="w-full">
						Place Bid
					</Button>
				)}
				{localToken.owner_id !== currentUser && localToken.is_auction && hasBid() && (
					<div className="md:grid grid-cols-2 gap-x-6">
						<Button variant={'second'}>Cancel Bid</Button>
						<Button variant={'primary'} onClick={onShowBidModal}>
							Place Bid
						</Button>
					</div>
				)}
				{localToken.owner_id === currentUser && !localToken.price && !localToken.is_auction && (
					<div className="md:grid grid-cols-2 gap-x-6 gap-y-4">
						<Button variant={'primary'} className={'col-span-2'} onClick={onShowAuctionModal}>
							Create Auction
						</Button>
						<Button variant="ghost" onClick={onShowTransferModal}>
							Transfer NFT to
						</Button>
						<Button variant={'second'} onClick={onShowUpdateListingModal}>
							Update Listing
						</Button>
					</div>
				)}
				{localToken.owner_id === currentUser && localToken.owner_id && (
					<>
						<button className="w-full bg-transparent text-[#FF8E8E]" onClick={onShowRemoveAuction}>
							Remove Auction
						</button>
						<div className="border-b border-[#FF8E8E] mx-56 -mt-2"></div>
					</>
				)}
				{!localToken.owner_id && isCreator() && (
					<div className="md:grid grid-cols-2 gap-x-6">
						<Button variant={'second'} onClick={onShowUpdatePriceModal}>
							Update Price
						</Button>
						<Button variant={'primary'} onClick={onShowMintModal}>
							Mint
						</Button>
					</div>
				)}
			</div>

			{localToken.bidder_list && localToken.bidder_list?.length > 0 && (
				<div>
					<div className="flex flex-row justify-between items-center bg-neutral-03 rounded-lg px-2 py-1 mx-4 mb-2">
						<p className="text-xs text-neutral-10">Current bid is owned by</p>
						<div className="inline-flex items-center max-w-56">
							<div className="flex flex-col justify-between items-stretch mr-2">
								<p className="text-xs font-thin text-neutral-10 text-right">
									{timeAgo.format(
										new Date(localToken.bidder_list[localToken.bidder_list.length - 1].issued_at)
									)}
								</p>
								<Link href={`/${localToken.bidder_list[localToken.bidder_list.length - 1].bidder}`}>
									<a className="text-sm font-bold truncate text-neutral-10">
										{prettyTruncate(
											localToken.bidder_list[localToken.bidder_list.length - 1].bidder,
											20,
											'address'
										)}
									</a>
								</Link>
							</div>
							<Media
								className="w-8 rounded-lg"
								url={parseImgUrl(localToken?.metadata.media, null, {
									width: `30`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
									isMediaCdn: localToken?.isMediaCdn,
								})}
								videoControls={false}
								videoLoop={true}
								videoMuted={true}
								autoPlay={false}
								playVideoButton={false}
							/>
						</div>
					</div>

					<div
						className={`
              ${
								showBidderList
									? 'flex flex-row justify-between items-center bg-neutral-01 border border-neutral-05 rounded-lg p-2 mx-4 mb-2'
									: 'flex flex-row justify-between items-center bg-neutral-05 rounded-lg p-2 mx-4 mb-2'
							} cursor-pointer`}
						onClick={() => setShowBidderList(!showBidderList)}
					>
						<p className="text-neutral-10 font-semibold text-sm">Bid History</p>
						<IconArrowSmall size={20} stroke={'#F9F9F9'} className="rotate-90" />
					</div>
					{showBidderList && (
						<div className="flex flex-col justify-between items-center bg-neutral-01 rounded-lg p-2 mx-4 mb-2">
							{historyBid.map((bid) => (
								<div
									key={bid}
									className="flex flex-row w-full justify-between items-center bg-neutral-01 border border-neutral-05 rounded-lg px-2 py-1 mx-4 mb-2"
								>
									<div className="inline-flex items-center max-w-56">
										<Media
											className="w-8 rounded-lg"
											url={parseImgUrl(localToken?.metadata.media, null, {
												width: `30`,
												useOriginal: process.env.APP_ENV === 'production' ? false : true,
												isMediaCdn: localToken?.isMediaCdn,
											})}
											videoControls={false}
											videoLoop={true}
											videoMuted={true}
											autoPlay={false}
											playVideoButton={false}
										/>
										<div className="flex flex-col justify-between items-stretch mr-2">
											<p className="text-xs font-thin text-neutral-10 text-right">
												{timeAgo.format(
													new Date(
														localToken.bidder_list[localToken.bidder_list.length - 1].issued_at
													)
												)}
											</p>
											<Link
												href={`/collection/${
													localToken.metadata?.collection_id || localToken.contract_id
												}`}
											>
												<a className="text-sm underline font-bold truncate text-neutral-10">
													{prettyTruncate(
														localToken.metadata?.collection || localToken.contract_id,
														20
													)}
												</a>
											</Link>
										</div>
									</div>
									<p className="text-neutral-10 text-sm">
										Bid on {prettyBalance(bid.amount, 24, 2)} Ⓝ
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default TokenPriceInfo
