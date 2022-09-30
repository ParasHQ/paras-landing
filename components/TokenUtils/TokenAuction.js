import { useEffect, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import { prettyBalance } from 'utils/common'
import useToken from 'hooks/useToken'
import JSBI from 'jsbi'
import useStore from 'lib/store'
import Button from 'components/Common/Button'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import CancelAuctionModal from 'components/Modal/CancelAuctionModal'
import { mutate } from 'swr'
import LoginModal from 'components/Modal/LoginModal'
import TokenAuctionBidModal from 'components/Modal/TokenAuctionBidModal'
import CancelBidModal from 'components/Modal/CancelBidModal'
import AcceptBidAuctionModal from 'components/Modal/AcceptBidAuctionModal'
import { IconInfo } from 'components/Icons'
import { useToast } from 'hooks/useToast'

const TokenAuction = ({ localToken: initialToken, className }) => {
	const [days, setDays] = useState('-')
	const [hours, setHours] = useState('-')
	const [mins, setMins] = useState('-')
	const [secs, setSecs] = useState('-')
	const [isEndedTime, setIsEndedTime] = useState(false)
	const [showModal, setShowModal] = useState('')
	const toast = useToast()

	const { token: localToken } = useToken({
		key: `${initialToken.contract_id}::${initialToken.token_series_id}/${initialToken.token_id}`,
		initialData: initialToken,
		args: {
			revalidateOnMount: true,
			revalidateOnFocus: true,
			revalidateIfStale: true,
			revalidateOnReconnect: true,
			refreshInterval: 15000,
		},
	})

	useEffect(() => {
		const endedDate = convertTimeOfAuction(localToken.ended_at)

		const timer = setInterval(() => {
			const startedDate = new Date().getTime()

			if (!isEndedTime) {
				let distance = parseInt(endedDate) - parseInt(startedDate)

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
				}
			}
		}, 1000)

		return () => clearInterval(timer)
	}, [localToken])

	const convertTimeOfAuction = (date) => {
		const sliceNanoSec = String(date).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			return sliceNanoSec
		}
	}

	const onDismissModal = () => {
		setShowModal(null)
	}

	const _showInfoUpdatingAuction = () => {
		toast.show({
			text: (
				<div className="text-sm text-white text-justify">
					<p>
						This auction data is being updated, please refresh the page periodically each minute.
					</p>
				</div>
			),
			type: 'updatingAuction',
			duration: null,
		})
	}

	return (
		<div className={`text-white ${className}`}>
			<div className="text-white bg-cyan-blue-3 rounded-t-xl mt-3 pb-2">
				<div className="flex justify-between items-center pr-2 pl-6">
					<p className="text-xl pt-3">Auction ends in:</p>
				</div>
				<div className="text-center">
					{!isEndedTime ? (
						<>
							<p className="text-xl font-bold">
								{days} &nbsp;&nbsp;:&nbsp;&nbsp; {hours} &nbsp;&nbsp;:&nbsp;&nbsp; {mins}{' '}
								&nbsp;&nbsp;:&nbsp;&nbsp; {secs}
							</p>
							<p className="text-md">
								Days&nbsp;&nbsp;&nbsp; Hours&nbsp;&nbsp;&nbsp; Mins&nbsp;&nbsp;&nbsp; Secs
							</p>{' '}
						</>
					) : (
						<div
							className="flex justify-center items-center gap-1 pl-1"
							onClick={_showInfoUpdatingAuction}
						>
							<p className="text-base">Auction is over.</p>
							<IconInfo size={16} className="cursor-pointer hover:opacity-80 -mt-1" />
						</div>
					)}
				</div>
			</div>
			<div className="text-white bg-cyan-blue-1 rounded-b-xl px-4 pt-4">
				{localToken.is_auction && (
					<CurrentBid
						initial={localToken}
						endedAuction={isEndedTime}
						setShowModal={(e) => setShowModal(e)}
					/>
				)}
			</div>
			<TokenAuctionBidModal
				show={showModal === 'placeauction'}
				data={localToken}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<CancelAuctionModal
				show={showModal === 'removeauction'}
				data={localToken}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<AcceptBidAuctionModal
				show={showModal === 'acceptbidauction'}
				data={localToken}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<CancelBidModal
				show={showModal === 'cancelbid'}
				data={localToken}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

const CurrentBid = ({ initial = {}, endedAuction, setShowModal }) => {
	const { token } = useToken({
		key: `${initial.contract_id}::${initial.token_series_id}/${initial.token_id}`,
		initialData: initial,
	})
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()
	const store = useStore()

	const checkNextPriceBid = (type) => {
		if (token?.bidder_list && token?.bidder_list?.length !== 0) {
			const currentBid = JSBI.BigInt(
				token?.bidder_list && token?.bidder_list?.length !== 0
					? isCurrentBid('amount')
					: token?.price
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
				return token.price ? formatNearAmount(token.price) : '0'
			} else if (type === 'usd') {
				const price = token?.price || token?.lowest_price || '0'
				return price.toString()
			}
		}
	}

	const isCurrentBid = (type) => {
		let data = []
		token?.bidder_list?.map((item) => {
			if (type === 'bidder') data.push(item.bidder)
			else if (type === 'time') data.push(item.issued_at)
			else if (type === 'amount') data.push(item.amount)
		})
		const currentBid = data.reverse()

		return currentBid[0]
	}

	const checkUserBid = () => {
		let userBid = []
		token?.bidder_list?.map((item) => {
			if (item.bidder === currentUser) {
				userBid.push(item.bidder)
			}
		})

		return userBid[0]
	}

	const onClickCancelAuction = () => {
		setShowModal('removeauction')
	}

	const onClickAuction = () => {
		mutate(`${token.contract_id}::${token.token_series_id}/${token.token_id}`)
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeauction')
	}

	const onClickAcceptBidAuction = () => {
		setShowModal('acceptbidauction')
	}

	const onCancelBid = () => {
		setShowModal('cancelbid')
	}

	return (
		<div className="p-3">
			<div className="flex items-center justify-between -mt-2 pb-2">
				<div>
					{!token?.amount || (token?.bidder_list && token?.bidder_list.length === 0) ? (
						<div>
							<p className="text-lg">{localeLn('Starting Bid')}</p>
							<div className="flex items-center gap-1">
								<p className="text-white text-3xl font-bold">
									{prettyBalance(token?.price?.$numberDecimal || token?.price, 24, 2)} Ⓝ
								</p>
								<span className="text-[13px] font-normal text-gray-400 pt-2">
									(${prettyBalance(JSBI.BigInt(token?.price * store.nearUsdPrice), 24, 4)})
								</span>
							</div>
						</div>
					) : (
						<div>
							<p className="text-lg">{localeLn('Current Bid')}</p>
							<div className="flex items-center gap-1">
								<p className="text-white text-3xl font-bold">
									{prettyBalance(
										token?.bidder_list && token?.bidder_list?.length !== 0
											? isCurrentBid('amount')
											: token?.price,
										24,
										2
									)}{' '}
									Ⓝ
								</p>
								<span className="text-[13px] font-normal text-gray-400 pt-2">
									(${prettyBalance(JSBI.BigInt(token?.price * store.nearUsdPrice), 24, 4)})
								</span>
							</div>
						</div>
					)}
					<div>
						<div className="flex justify-between items-center gap-1">
							<p className="font-thin text-white text-sm">
								{token?.bidder_list && token?.bidder_list.length !== 0 ? 'Next Bid' : 'First Bid'}
							</p>
							<div className="flex items-center gap-1">
								<div className="truncate text-white text-sm font-bold">{`${prettyBalance(
									checkNextPriceBid('near'),
									0,
									4
								)} Ⓝ`}</div>
								{token?.price !== '0' && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate">
										($
										{prettyBalance(
											JSBI.BigInt(checkNextPriceBid('usd')) * store.nearUsdPrice,
											24,
											2
										)}
										)
									</div>
								)}
								{token?.price === '0' && token?.is_auction && !endedAuction && (
									<div className="text-[9px] text-gray-400 truncate mt-1">
										~ $
										{prettyBalance(
											JSBI.BigInt(token?.amount ? token?.amount : token?.price) *
												store.nearUsdPrice,
											24,
											2
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>
					{!endedAuction && (
						<div className="flex">
							{token.owner_id !== currentUser && isCurrentBid('bidder') !== currentUser && (
								<Button size="md" onClick={onClickAuction} className="px-6 mr-2">
									{`Place Bid`}
								</Button>
							)}
							{token.owner_id !== currentUser && checkUserBid() && (
								<Button size="md" onClick={onCancelBid} isFullWidth variant="error">
									{`Cancel Bid`}
								</Button>
							)}
							{token?.owner_id === currentUser &&
							token?.bidder_list &&
							token?.is_auction &&
							!endedAuction ? (
								<div className="flex">
									{token?.bidder_list.length !== 0 && (
										<Button size="md" className="px-4 mr-2" onClick={onClickAcceptBidAuction}>
											Accept Bid
										</Button>
									)}
									<Button size="md" className="px-2" variant="error" onClick={onClickCancelAuction}>
										Remove Auction
									</Button>
								</div>
							) : (
								token?.owner_id === currentUser && (
									<Button size="md" className="px-2" variant="error" onClick={onClickCancelAuction}>
										Remove Auction
									</Button>
								)
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default TokenAuction
