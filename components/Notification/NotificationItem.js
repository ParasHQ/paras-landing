import axios from 'axios'
import Link from 'next/link'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import { parseImgUrl, prettyTruncate } from 'utils/common'
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
		const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
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

		const resp = await axios.get(query.url, {
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

	if (!token) {
		return null
	}

	if (notif.type === 'nft_transfer' && notif.from === null) {
		return (
			<div>
				<Link href={url}>
					<a>
						<div
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-300">
								burned <span className="font-medium text-gray-100">{token.metadata?.title}</span>
							</div>
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
								className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
								className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
								className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-200">
								received {formatNearAmount(notif.royalty)} Ⓝ royalty from{' '}
								<span className="font-medium text-gray-100">{token.metadata?.title}</span> secondary
								sale
							</div>
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">{prettyTruncate(notif.from, 14, 'address')}</span>{' '}
								offer <span className="font-medium text-gray-100">{token.metadata?.title}</span>
								{' for '}
								{formatNearAmount(notif.msg.params.price)} Ⓝ
							</div>
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								Token <span className="font-medium">{token.metadata?.title}</span> submission has
								been accepted
								{' to '} <span className="font-semibold">{notif.msg.category_name}</span> category
							</div>
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								Token <span className="font-semibold">{token.metadata?.title}</span> submission has
								been rejected from <span className="font-semibold">{notif.msg.category_name}</span>{' '}
								category.
							</div>
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={token.metadata?.media} />
							<div className="pl-2 text-gray-100">
								<span className="font-semibold">{prettyTruncate(notif.from, 14, 'address')}</span>{' '}
								outbid <span className="font-semibold text-gray-100">{token.metadata?.title}</span>{' '}
								for {formatNearAmount(notif.msg.params.amount)} Ⓝ
							</div>
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
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
							className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
							onClick={() => notificationModal(false)}
						>
							<NotificationImage media={notif.msg.image} />
							<div className="pl-2 text-gray-300">
								<span className="font-medium text-gray-100">{notif.msg.title}</span> has been
								delisted
							</div>
						</div>
					</a>
				</Link>
			</div>
		)
	}
	return null
}

export default NotificationItem
