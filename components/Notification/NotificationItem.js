import ParasRequest from 'lib/ParasRequest'
import Link from 'next/link'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import {
	capitalize,
	parseImgUrl,
	prettyTruncate,
	formatDateToReadable,
	shortTimeAgo,
} from 'utils/common'
import Media from 'components/Common/Media'

const NotificationImage = ({ media }) => {
	return (
		<div className="w-16 flex-shrink-0 rounded-md overflow-hidden bg-primary shadow-inner">
			<Media
				url={parseImgUrl(media, null, {
					width: '200',
					useOriginal: process.env.APP_ENV !== 'production',
				})}
				videoControls={false}
				videoMuted={true}
				videoLoop={true}
			/>
		</div>
	)
}

const NotificationTime = ({ time }) => {
	return (
		<p className="absolute top-1 right-1 flex-1 text-[0.675rem] pl-1 text-right leading-4 text-opacity-60 text-white whitespace-nowrap">
			{shortTimeAgo(time)}
		</p>
	)
}

const NotificationItem = ({ notif, currentUser, notificationModal }) => {
	const [token, setToken] = useState({})
	const [tradedToken, setTradedToken] = useState({})

	useEffect(() => {
		fetchToken()
		if (notif.type?.includes('trade')) {
			fetchTradedToken()
		}
	}, [])

	const fetchTradedToken = async () => {
		const params = {
			token_id: notif.msg.params.buyer_token_id,
			contract_id: notif.msg.params.buyer_nft_contract_id,
		}
		const resp = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
			params: params,
		})
		if (resp.data.data.results.length > 0) {
			setTradedToken(resp.data.data.results[0])
		}
	}

	const fetchToken = async () => {
		const query = notif.token_id
			? {
					url: `${process.env.V2_API_URL}/token`,
					params: {
						token_id: notif.token_id,
						contract_id: notif.contract_id,
					},
			  }
			: {
					url: `${process.env.V2_API_URL}/token-series`,
					params: {
						token_series_id: notif.token_series_id,
						contract_id: notif.contract_id,
					},
			  }

		const resp = await ParasRequest.get(query.url, {
			params: query.params,
		})

		if (resp.data.data.results.length > 0) {
			setToken(resp.data.data.results[0])
		}
	}

	const url = `/token/${notif.contract_id}::${
		notif.type === 'notification_add_trade' || notif.type === 'accept_trade'
			? notif.token_id?.split(':')[0]
			: notif.token_series_id
	}${notif.token_id ? `/${notif.token_id}` : ''}`

	if (notif.type === 'notification_level_up') {
		return (
			<div className="notification-item">
				<div className="text-gray-300 select-none">
					<p className="font-bold text-base">{`Congrats! You're now a ${capitalize(
						notif.msg.current_level
					)} Member!`}</p>
					<p>
						<span>
							You can register for a raffle on {formatDateToReadable(notif.msg?.raffle?.started_at)}{' '}
							to {formatDateToReadable(notif.msg?.raffle?.ended_at)}. Read more here 👉{' '}
						</span>
						<span>
							<Link href="/loyalty">
								<a className="font-bold">Loyalty</a>
							</Link>
						</span>
					</p>
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	if (notif.type === 'notification_raffle_program_launch') {
		return (
			<div className="w-full notification-item">
				<div className="text-gray-300 select-none w-full">
					<p className="font-bold text-base">Join Paras Loyalty Now!</p>
					<p className="text-sm">
						<span>{`Get into our exclusive raffle & grab the rewards! `}</span>
						<span>{`More details here 👉 `}</span>
						<span>
							<Link href="/loyalty">
								<a className="font-bold">loyalty</a>
							</Link>
						</span>
					</p>
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	if (notif.type === 'notification_raffle_new_cycle') {
		return (
			<div className="w-full notification-item">
				<div className="text-gray-300 select-none w-full">
					<p className="font-bold text-base">Exclusive Rewards Are Waiting For You!</p>
					<p className="text-sm">
						<span>{`Find out this month's Paras Loyalty rewards `}</span>
						<span>
							<Link href="/loyalty">
								<a className="font-bold">here</a>
							</Link>
						</span>
						.
					</p>
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	if (notif.type === 'notification_level_down') {
		return (
			<div className="notification-item">
				<div className="text-gray-300 select-none">
					<p className="font-bold text-base">
						<span>Sorry, your member has dropped to {capitalize(notif.msg.current_level)}.</span>
					</p>
					<p>
						<span> Start </span>
						<span>
							<a
								className="font-bold"
								href={
									process.env.APP_ENV === 'testnet'
										? 'https://staking-dev.paras.id/'
										: 'https://stake.paras.id'
								}
							>
								lock staking{' '}
							</a>
						</span>
						<span>again to keep them at {capitalize(notif.msg.previous_level)}!</span>
					</p>
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	if (notif.type === 'notification_level_going_expire') {
		return (
			<div className="notification-item">
				<div className="text-gray-300 select-none">
					<p className="text-base font-bold">
						<span>Your membership is about to expire!</span>
					</p>
					<p>
						<span>Start</span>
						<span>
							<a
								className="font-bold"
								href={
									process.env.APP_ENV === 'testnet'
										? 'https://staking-dev.paras.id/'
										: 'https://stake.paras.id'
								}
							>
								{` lock staking `}
							</a>
						</span>
						<span>again to keep them at </span>
						<span className="font-bold">{capitalize(notif.msg.current_level)}!</span>
					</p>
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	if (notif.type === 'notification_raffle_type_drop') {
		return (
			<div className="notification-item">
				<div className="text-gray-300 select-none">
					<p className="text-base font-bold">
						{notif.msg.current_raffle_type === 'bronze'
							? 'Your level has dropped to Bronze!'
							: 'Your Membership Level Has Dropped!'}
					</p>
					{notif.msg.is_raffle_active ? (
						<p>
							{notif.msg.current_raffle_type === 'bronze' ? (
								<>
									<span>Start</span>
									<span>
										<a
											className="font-bold"
											href={
												process.env.APP_ENV === 'testnet'
													? 'https://staking-dev.paras.id/'
													: 'https://stake.paras.id'
											}
										>
											{` lock staking `}
										</a>
									</span>
									<span>again to stay enrolled in raffle!</span>
								</>
							) : (
								<>
									<span> You will be automatically signed up for </span>
									<span className="font-bold">{capitalize(notif.msg.current_raffle_type)}</span>
									<span> raffle</span>
								</>
							)}
						</p>
					) : (
						<p>
							<span>
								You are currently a {capitalize(notif.msg.current_raffle_type)} member. Start
							</span>
							<span>
								<a
									className="font-bold"
									href={
										process.env.APP_ENV === 'testnet'
											? 'https://staking-dev.paras.id/'
											: 'https://stake.paras.id'
									}
								>
									{` lock staking `}
								</a>
							</span>
							<span>again to keep them at </span>
							<span className="font-bold">{capitalize(notif.msg.previous_raffle_type)}!</span>
						</p>
					)}
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	if (notif.type === 'notification_raffle_registered') {
		return (
			<div className="w-full notification-item">
				<div className="text-gray-300 select-none w-full">
					<p className="font-bold text-base">Confirmation of Raffle Entry</p>
					<p className="text-sm">{`You’ve been registered for the raffle. Thank you & good luck! ✨`}</p>
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	// Commented since there are changes in the PRD
	//
	// if (notif.type === 'notification_raffle_begin') {
	// 	return (
	// 		<div className="w-full notification-item">
	// 			<div className="text-gray-300 select-none w-full">
	// 				<p className="font-bold">The raffle is just about to begin!</p>
	// 				<p>
	// 					<span>{`Don't miss it, check `}</span>
	// 					<span>
	// 						<Link href="/loyalty">
	// 							<a className="font-bold">loyalty</a>
	// 						</Link>
	// 					</span>
	// 					<span> about the mechanism</span>
	// 				</p>
	// 			</div>
	// 			<NotificationTime time={notif.issued_at} />
	// 		</div>
	// 	)
	// }

	// if (notif.type === 'notification_raffle_end_soon') {
	// 	return (
	// 		<div className="w-full notification-item">
	// 			<div className="text-gray-300 select-none w-full">
	// 				<p className="font-bold">The raffle ends soon!</p>
	// 				<p>
	// 					<span>{`Don't miss it, check `}</span>
	// 					<span>
	// 						<Link href="/loyalty">
	// 							<a className="font-bold">loyalty</a>
	// 						</Link>
	// 					</span>
	// 					<span> about the mechanism</span>
	// 				</p>
	// 			</div>
	// 			<NotificationTime time={notif.issued_at} />
	// 		</div>
	// 	)
	// }

	if (notif.type === 'notification_raffle_over') {
		return (
			<div className="w-full notification-item">
				<div className="text-gray-300 select-none w-full">
					<p className="font-bold text-base">Paras Loyalty Raffle Winner List</p>
					<p>
						<span>{`The raffle is over! Check the ${notif.msg.raffle.title}'s winners `}</span>
						<a className="font-bold cursor-pointer" href={notif.msg.winners_publication_url}>
							here
						</a>{' '}
						🏆
					</p>
				</div>
				<NotificationTime time={notif.issued_at} />
			</div>
		)
	}

	if (!token) {
		return null
	}

	if (notif.type === 'notification_raffle_won_wl_spot') {
		return (
			<div>
				<div className="notification-item" onClick={() => notificationModal(false)}>
					<div className="text-gray-300">
						<p className="text-base font-bold">
							Congratulations {prettyTruncate(notif.to, 14, 'address')},
						</p>
						<p>
							<span>You have won 1 </span>
							<span>
								{notif.msg.collection_name} WL Spot from Paras Loyalty! Read more about the rewards{' '}
								<a className="font-bold cursor-pointer" href={notif.msg.reward_publication_url}>
									here
								</a>{' '}
							</span>
						</p>
					</div>
					<NotificationTime time={notif.issued_at} />
				</div>
			</div>
		)
	}

	if (notif.type === 'notification_raffle_won_nft') {
		return (
			<div>
				<div className="notification-item" onClick={() => notificationModal(false)}>
					<div className="text-gray-300">
						<p className="text-base font-bold">
							Congratulations {prettyTruncate(notif.to, 14, 'address')},
						</p>
						<p>
							<span>You have won a </span>
							<span>
								{notif.msg.card_name} from Paras Loyalty! We will send it to your account in 1x24
								hours.
							</span>
						</p>
					</div>
					<NotificationTime time={notif.issued_at} />
				</div>
			</div>
		)
	}

	if (notif.type === 'nft_transfer' && notif.from === null) {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-300">
								{`Creator minted ${token.metadata?.title} to ${prettyTruncate(
									notif.to,
									14,
									'address'
								)}`}
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'nft_transfer' && notif.to === null) {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-300">
								burned <span className="font-medium text-gray-100">{token.metadata?.title}</span>
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'nft_transfer') {
		if (notif.price && notif.from === currentUser) {
			return (
				<div>
					<Link href={url}>
						<a>
							<div
								className="cursor-pointer notification-item"
								onClick={() => notificationModal(false)}
							>
								<NotificationImage media={token.metadata?.media} />
								<div className="pl-2 text-gray-300">
									sold <span className="font-medium text-gray-100">{token.metadata?.title}</span>
									{' to '}
									<span className="font-semibold">
										{prettyTruncate(notif.to, 14, 'address')}
									</span>{' '}
									for {formatNearAmount(notif.msg.params.price)} Ⓝ
								</div>
								<NotificationTime time={notif.issued_at} />
							</div>
						</a>
					</Link>
				</div>
			)
		}

		if (notif.price) {
			return (
				<div>
					<Link href={url}>
						<a>
							<div
								className="cursor-pointer notification-item"
								onClick={() => notificationModal(false)}
							>
								<NotificationImage media={token.metadata?.media} />
								<div className="pl-2 text-gray-300">
									bought <span className="font-medium text-gray-100">{token.metadata?.title}</span>{' '}
									from{' '}
									<span className="font-semibold text-gray-100">
										{prettyTruncate(notif.from, 14, 'address')}
									</span>{' '}
									for {formatNearAmount(notif.msg.params.price)} Ⓝ
								</div>
								<NotificationTime time={notif.issued_at} />
							</div>
						</a>
					</Link>
				</div>
			)
		}

		if (notif.to === currentUser) {
			return (
				<div>
					<Link href={url}>
						<a>
							<div
								className="cursor-pointer notification-item"
								onClick={() => notificationModal(false)}
							>
								<NotificationImage media={token.metadata?.media} />
								<div className="pl-2 text-gray-300">
									received{' '}
									<span className="font-medium text-gray-100">{token.metadata?.title} </span>
									from{' '}
									<span className="font-semibold text-gray-100">
										{prettyTruncate(notif.from, 14, 'address')}
									</span>
								</div>
								<NotificationTime time={notif.issued_at} />
							</div>
						</a>
					</Link>
				</div>
			)
		}
	}

	if (notif.type === 'resolve_purchase') {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							{notif.to === currentUser ? (
								<div className="pl-2 text-gray-200">
									bought <span className="font-medium text-gray-100">{token.metadata?.title}</span>
									{' from '}
									<span className="font-semibold">
										{prettyTruncate(notif.from, 14, 'address')}
									</span>{' '}
									for {formatNearAmount(notif.msg.params.price)} Ⓝ
								</div>
							) : (
								<div className="pl-2 text-gray-200">
									sold <span className="font-medium text-gray-100">{token.metadata?.title}</span>
									{' to '}
									<span className="font-semibold">
										{prettyTruncate(notif.to, 14, 'address')}
									</span>{' '}
									for {formatNearAmount(notif.msg.params.price)} Ⓝ
								</div>
							)}
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_royalty') {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-200">
								received {formatNearAmount(notif.royalty)} Ⓝ royalty from{' '}
								<span className="font-medium text-gray-100">{token.metadata?.title}</span> secondary
								sale
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_add_offer') {
		return (
			<div>
				<Link href={`${url}?tab=offers`}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">{prettyTruncate(notif.from, 14, 'address')}</span>{' '}
								offer <span className="font-medium text-gray-100">{token.metadata?.title}</span>
								{' for '}
								{formatNearAmount(notif.msg.params.price)} Ⓝ
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_add_bid') {
		return (
			<div>
				<Link href={`${url}?tab=auction`}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">{prettyTruncate(notif.from, 14, 'address')}</span>{' '}
								bid <span className="font-medium text-gray-100">{token.metadata?.title}</span>
								{' for '}
								{formatNearAmount(
									notif.msg.params.amount ? notif.msg.params.amount : notif.msg.params.price
								)}{' '}
								Ⓝ
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'cancel_bid') {
		return (
			<div>
				<Link href={`${url}?tab=auction`}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">{prettyTruncate(notif.from, 14, 'address')}</span>{' '}
								bid <span className="font-medium text-gray-100">{token.metadata?.title}</span>
								{' for '}
								{formatNearAmount(
									notif.msg.params.amount ? notif.msg.params.amount : notif.msg.params.price
								)}{' '}
								Ⓝ
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_category_accepted') {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								Token <span className="font-medium">{token.metadata?.title}</span> submission has
								been accepted
								{' to '} <span className="font-semibold">{notif.msg.category_name}</span> category
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_category_rejected') {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								Token <span className="font-semibold">{token.metadata?.title}</span> submission has
								been rejected from <span className="font-semibold">{notif.msg.category_name}</span>{' '}
								category.
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_add_trade') {
		return (
			<div>
				<Link href={`${url}?tab=offers`}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={tradedToken.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">{prettyTruncate(notif.from, 14, 'address')}</span>{' '}
								offered trade{' '}
								<span className="font-semibold text-gray-100">{tradedToken.metadata?.title}</span>{' '}
								with your
								{` `}
								<span className="font-semibold text-gray-100">{token.metadata?.title}</span>
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'accept_trade') {
		return (
			<div>
				<Link href={`${url}?tab=offers`}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={tradedToken.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">
									{prettyTruncate(notif.msg.params.sender_id, 14, 'address')}
								</span>{' '}
								accepted trade{' '}
								<span className="font-semibold text-gray-100">{tradedToken.metadata?.title}</span>
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_out_bid') {
		return (
			<div>
				<Link href={`${url}?tab=auction`}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">{prettyTruncate(notif.from, 14, 'address')}</span>{' '}
								outbid <span className="font-semibold text-gray-100">{token.metadata?.title}</span>{' '}
								for {formatNearAmount(notif.msg.params.amount)} Ⓝ
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}
	if (notif.type === 'notification_nft_sold_for_offer') {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-300">
								<span className="font-medium text-gray-100">{token.metadata?.title}</span>
								{' that you offered was sold to '}
								<span className="font-semibold">
									{prettyTruncate(token.owner_id, 14, 'address')}
								</span>
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}

	if (notif.type === 'notification_nft_delist') {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer notification-item"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={notif.msg.image} />
							<div className="pl-2 text-gray-300">
								<span className="font-medium text-gray-100">{notif.msg.title}</span> has been
								delisted
							</div>
							<NotificationTime time={notif.issued_at} />
						</div>
					</a>
				</Link>
			</div>
		)
	}
	return null
}

export default NotificationItem
