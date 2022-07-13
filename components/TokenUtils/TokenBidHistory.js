import LinkToProfile from 'components/Common/LinkToProfile'
import { useEffect, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import { prettyBalance, prettyTruncate } from 'utils/common'
import Link from 'next/link'
import useToken from 'hooks/useToken'
import { IconDownArrow } from 'components/Icons'

const TokenBidHistory = ({ localToken: initialToken, className }) => {
	const [historyBid, setHistoryBid] = useState([])
	const [isDropDown, setIsDropDown] = useState(false)
	const { localeLn } = useIntl()
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
		let histBid = []
		if (localToken.bidder_list && localToken.bidder_list.length > 0) {
			histBid = [...histBid, localToken.bidder_list]
		}

		if (localToken.extend_list && localToken.extend_list.length > 0) {
			histBid = [...histBid, localToken.extend_list]
		}

		const sortedHistoryBid = histBid.sort((a, b) => a.issued_at - b.issued_at)
		setHistoryBid(sortedHistoryBid[0])
	}, [localToken])

	const startedAtDate = (startedAt) => {
		const sliceNanoSec = String(startedAt).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			const toDate = new Date(parseInt(sliceNanoSec)).toUTCString()
			const splitGMT = toDate.split('GMT')[0]
			return splitGMT
		}
	}

	return (
		<div className={`${className} text-white`}>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => setIsDropDown(!isDropDown)}
				>
					<CurrentBid initial={localToken} key={localToken.token_id} />
					<IconDownArrow size={30} />
				</div>
			</div>
			{isDropDown && (
				<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 h-48 overflow-y-auto">
					{historyBid && historyBid?.length !== 0 ? (
						historyBid
							?.slice(0)
							.reverse()
							.map((x) => (
								<div key={x._id} className="pt-3">
									{x.bidder && (
										<div className="bg-cyan-blue-2 p-3 rounded-md shadow-md my-2">
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
										<div className="bg-cyan-blue-2 p-3 rounded-md shadow-md text-sm my-2">
											<p>
												<span> {localeLn(`Auction Extended by ${x.bidder} 5 minutes`)}</span>
											</p>
											<p className="mt-1 text-xs">{startedAtDate(x.issued_at)} UTC</p>
										</div>
									)}
								</div>
							))
					) : (
						<div>
							<div className="text-white text-center pt-20">{'No bidder at the moment'}</div>
						</div>
					)}
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

	const { localeLn } = useIntl()

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
		<div className="text-white bg-cyan-blue-3 rounded-t-xl py-4">
			<div className="md:flex items-center justify-between">
				{!token.amount || (token?.bidder_list && token?.bidder_list.length === 0) ? (
					<p className="text-white">
						{localeLn('Starting Bid')}{' '}
						{prettyBalance(token.price?.$numberDecimal || token.price, 24, 2)} Ⓝ
					</p>
				) : (
					<p className="flex gap-1 text-white">
						Last Bid by{' '}
						<span className="font-bold">
							<Link
								href={`/${
									token?.bidder_list && token?.bidder_list.length !== 0
										? isCurrentBid('bidder')
										: token.owner_id
								}`}
							>
								<a className="hover:opacity-80">
									<p className="text-white font-semibold truncate">
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
						</span>
					</p>
				)}
				<p className="md:text-right text-xs md:absolute right-14">
					{startedAtDate(
						token?.bidder_list && token?.bidder_list.length !== 0
							? isCurrentBid('time')
							: token.started_at
					)}{' '}
					UTC
				</p>
			</div>
		</div>
	)
}

export default TokenBidHistory
