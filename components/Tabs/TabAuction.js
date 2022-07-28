import cachios from 'cachios'
import LinkToProfile from 'components/Common/LinkToProfile'
import { useEffect, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { parseImgUrl, prettyBalance, prettyTruncate } from 'utils/common'
import Avatar from 'components/Common/Avatar'
import Link from 'next/link'
import useToken from 'hooks/useToken'
import { useRouter } from 'next/router'

const TabAuction = ({ localToken: initialToken, setAuctionEnds = () => {} }) => {
	const [historyBid, setHistoryBid] = useState([])
	const [days, setDays] = useState('-')
	const [hours, setHours] = useState('-')
	const [mins, setMins] = useState('-')
	const [secs, setSecs] = useState('-')
	const [isEndedTime, setIsEndedTime] = useState(false)
	const { localeLn } = useIntl()
	const router = useRouter()

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
		countDownTimeAuction(localToken.ended_at)
	}, [isEndedTime])

	const convertTimeOfAuction = (date) => {
		const sliceNanoSec = String(date).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			return sliceNanoSec
		}
	}

	const countDownTimeAuction = (endedAt) => {
		const endedDate = convertTimeOfAuction(endedAt)

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
					setAuctionEnds(true)
				}
			}
		})
	}

	const startedAtDate = (startedAt) => {
		const sliceNanoSec = String(startedAt).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			const toDate = new Date(parseInt(sliceNanoSec)).toUTCString()
			const splitGMT = toDate.split('GMT')[0]
			return splitGMT
		}
	}

	return (
		<div className="text-white">
			<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
				<p className="text-xs">Auction ends in:</p>
				<div className="text-center">
					{!isEndedTime ? (
						<>
							<p className="text-base font-bold">
								{days} &nbsp;&nbsp;:&nbsp;&nbsp; {hours} &nbsp;&nbsp;:&nbsp;&nbsp; {mins}{' '}
								&nbsp;&nbsp;:&nbsp;&nbsp; {secs}
							</p>
							<p className="text-xs">
								Days&nbsp;&nbsp;&nbsp;&nbsp; Hours&nbsp;&nbsp;&nbsp;&nbsp;
								Mins&nbsp;&nbsp;&nbsp;&nbsp; Secs
							</p>{' '}
						</>
					) : (
						<p className="text-base">Auction is over.</p>
					)}
				</div>
			</div>
			<CurrentBid initial={localToken} key={localToken.token_id} />
			<div className="flex justify-center items-center relative">
				<p className="text-center mt-2">History Bids</p>
				<p className="text-center text-xs mt-2 absolute right-0">
					Total bid : {localToken?.bidder_list?.length || 0}
				</p>
			</div>
			{historyBid && historyBid?.length !== 0 ? (
				historyBid
					?.slice(0)
					.reverse()
					.map((x) => (
						<div key={x._id}>
							{x.bidder && (
								<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
									<p>
										<LinkToProfile accountId={x.bidder} />
										<span>
											{' '}
											{localeLn('On Bid')} {prettyBalance(x.amount, 24, 2)} Ⓝ
										</span>
									</p>
									<p className="mt-1 text-xs">{startedAtDate(x.issued_at)} UTC</p>
								</div>
							)}

							{x.ended_at && (
								<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md text-sm">
									<p>
										<span> {localeLn(`Auction Extended by 5 minutes`)}</span>
									</p>
									<p className="mt-1 text-xs">{startedAtDate(x.issued_at)} UTC</p>
								</div>
							)}
						</div>
					))
			) : (
				<div className="bg-gray-800 p-3 rounded-md shadow-md">
					<div className="text-white text-center">{'No bidder at the moment'}</div>
				</div>
			)}
		</div>
	)
}

const CurrentBid = ({ initial = {} }) => {
	const { token } = useToken({
		key: `${initial.contract_id}::${initial.token_series_id}/${initial.token_id}`,
		initialData: initial,
	})

	const [profile, setProfile] = useState({})
	const { localeLn } = useIntl()

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
		}
	}, [token.owner_id])

	const fetchOwnerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: token?.bidder_list ? isCurrentBid('bidder') : token.owner_id,
				},
				ttl: 60,
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const startedAtDate = (startedAt) => {
		const sliceNanoSec = String(startedAt).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			const toDate = new Date(parseInt(sliceNanoSec)).toUTCString()
			const splitGMT = toDate.split('GMT')[0]
			return splitGMT
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

	return (
		<div className="bg-gray-800 mt-2 p-3 rounded-md shadow-md">
			<p className="text-right text-[9px]">
				{startedAtDate(
					token?.bidder_list && token?.bidder_list.length !== 0
						? isCurrentBid('time')
						: token.started_at
				)}{' '}
				UTC
			</p>
			<div className="flex items-center justify-between -mt-2">
				<div className="flex items-center">
					<Link
						href={`/${
							token?.bidder_list && token?.bidder_list.length !== 0
								? isCurrentBid('bidder')
								: token.owner_id
						}`}
					>
						<a className="hover:opacity-80">
							<Avatar size="lg" src={parseImgUrl(profile.imgUrl)} className="align-bottom" />
						</a>
					</Link>
					<div>
						<div className="ml-2">
							<Link
								href={`/${
									token?.bidder_list && token?.bidder_list.length !== 0
										? isCurrentBid('bidder')
										: token.owner_id
								}`}
							>
								<a className="hover:opacity-80">
									<p className="text-white font-semibold truncate text-sm">
										{prettyTruncate(
											token?.bidder_list && token?.bidder_list.length !== 0
												? isCurrentBid('bidder')
												: token.owner_id,
											16,
											'address'
										)}
									</p>
								</a>
							</Link>
						</div>
						{!token.amount || (token?.bidder_list && token?.bidder_list.length === 0) ? (
							<p className="ml-2 text-white">
								{localeLn('Starting Bid')}{' '}
								{prettyBalance(token.price?.$numberDecimal || token.price, 24, 2)} Ⓝ
							</p>
						) : (
							<p className="ml-2 text-white text-sm">
								{localeLn('On Bid')}{' '}
								{prettyBalance(
									token?.bidder_list && token?.bidder_list?.length !== 0
										? isCurrentBid('amount')
										: token?.price,
									24,
									2
								)}{' '}
								Ⓝ
							</p>
						)}
					</div>
				</div>
				<div className="mt-3 overflow-hidden">
					<div className="text-primary bg-gray-300 rounded-md py-1 px-2 text-xs font-bold whitespace-nowrap">
						Current Bid
					</div>
				</div>
			</div>
		</div>
	)
}

export default TabAuction
